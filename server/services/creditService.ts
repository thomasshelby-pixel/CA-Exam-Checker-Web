import { db } from '../db/database';
import { User, CreditLedgerEntry } from '../../src/types';

export interface EligibilityResult {
  canEvaluate: boolean;
  reason: string;
  source: 'PERMANENT_FREE' | 'INSTITUTE_SPONSORED' | 'INDIVIDUAL_FREE' | 'INDIVIDUAL_CREDIT' | 'NONE';
  remainingCredits: number;
  freeRemaining: number;
}

export function checkEvaluationEligibility(userId: string): EligibilityResult {
  const user = db.getUserById(userId);
  if (!user) {
    return {
      canEvaluate: false,
      reason: 'User account not found.',
      source: 'NONE',
      remainingCredits: 0,
      freeRemaining: 0,
    };
  }

  // 1. Permanent Free Access Check (Mandated emails: adityakumart484@gmail.com, Manug8158@gmail.com, etc.)
  if (db.isEmailPermanentFree(user.email) || user.isPermanentFree) {
    return {
      canEvaluate: true,
      reason: 'Permanent Free VIP Access enabled for this account.',
      source: 'PERMANENT_FREE',
      remainingCredits: 999999,
      freeRemaining: 999999,
    };
  }

  // 2. Active Institute Sponsorship Check
  if (user.instituteId) {
    const institute = db.getInstituteById(user.instituteId);
    if (institute && institute.status === 'ACTIVE') {
      const now = new Date();
      const expiresAt = new Date(institute.subscriptionExpiresAt);
      if (expiresAt > now) {
        if (institute.sponsoredCreditsPool > institute.sponsoredCreditsUsed) {
          return {
            canEvaluate: true,
            reason: `Sponsored by ${institute.name}.`,
            source: 'INSTITUTE_SPONSORED',
            remainingCredits: institute.sponsoredCreditsPool - institute.sponsoredCreditsUsed,
            freeRemaining: 0,
          };
        }
      } else {
        // Expired institute subscription -> automatically fall back to individual student rules
        console.log(`Institute ${institute.name} subscription expired on ${institute.subscriptionExpiresAt}. Falling back to individual account rules.`);
      }
    }
  }

  // 3. Normal Individual Student: First 2 Answer Sheets Free
  const settings = db.getSystemSettings();
  const freeLimit = user.freeEvaluationsLimit ?? settings.freeEvaluationsForStudents;
  const freeUsed = user.freeEvaluationsUsed ?? 0;
  const freeRemaining = Math.max(freeLimit - freeUsed, 0);

  if (freeRemaining > 0) {
    return {
      canEvaluate: true,
      reason: `Complimentary trial evaluation (${freeRemaining} of ${freeLimit} free evaluations remaining).`,
      source: 'INDIVIDUAL_FREE',
      remainingCredits: user.purchasedCredits || 0,
      freeRemaining,
    };
  }

  // 4. Purchased Credits
  const purchasedCredits = user.purchasedCredits || 0;
  if (purchasedCredits > 0) {
    return {
      canEvaluate: true,
      reason: `Using purchased evaluation credit (${purchasedCredits} available).`,
      source: 'INDIVIDUAL_CREDIT',
      remainingCredits: purchasedCredits,
      freeRemaining: 0,
    };
  }

  // 5. No remaining evaluations
  return {
    canEvaluate: false,
    reason: 'You have used your 2 free evaluations. Please purchase evaluation credits to continue.',
    source: 'NONE',
    remainingCredits: 0,
    freeRemaining: 0,
  };
}

export function deductEvaluationCredit(
  userId: string,
  evaluationId: string
): { success: boolean; source: 'PERMANENT_FREE' | 'INSTITUTE_SPONSORED' | 'INDIVIDUAL_FREE' | 'INDIVIDUAL_CREDIT'; message: string } {
  const user = db.getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const eligibility = checkEvaluationEligibility(userId);
  if (!eligibility.canEvaluate) {
    throw new Error(eligibility.reason);
  }

  if (eligibility.source === 'PERMANENT_FREE') {
    // Record ledger entry with 0 deduction for audit
    const entry: CreditLedgerEntry = {
      id: `crd-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      type: 'CREDIT_CONSUMED',
      amount: 0,
      source: 'EVALUATION',
      evaluationId,
      balanceAfter: 999999,
      description: 'Permanent Free VIP evaluation processed without balance deduction.',
      timestamp: new Date().toISOString(),
    };
    db.addCreditLedgerEntry(entry);
    return { success: true, source: 'PERMANENT_FREE', message: 'Permanent Free evaluation granted.' };
  }

  if (eligibility.source === 'INSTITUTE_SPONSORED') {
    const institute = db.getInstituteById(user.instituteId!);
    if (institute) {
      institute.sponsoredCreditsUsed += 1;
      db.saveInstitute(institute);

      const entry: CreditLedgerEntry = {
        id: `crd-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        userId,
        type: 'INSTITUTE_BENEFIT',
        amount: 1,
        source: 'INSTITUTE_BENEFIT',
        evaluationId,
        balanceAfter: user.purchasedCredits,
        description: `Evaluation sponsored by ${institute.name} (Pool remaining: ${institute.sponsoredCreditsPool - institute.sponsoredCreditsUsed}).`,
        timestamp: new Date().toISOString(),
      };
      db.addCreditLedgerEntry(entry);
      return { success: true, source: 'INSTITUTE_SPONSORED', message: `Sponsored by ${institute.name}.` };
    }
  }

  if (eligibility.source === 'INDIVIDUAL_FREE') {
    const updatedUsed = (user.freeEvaluationsUsed || 0) + 1;
    db.updateUser(userId, { freeEvaluationsUsed: updatedUsed });

    const entry: CreditLedgerEntry = {
      id: `crd-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      type: 'CREDIT_CONSUMED',
      amount: 1,
      source: 'FREE_TRIAL',
      evaluationId,
      balanceAfter: user.purchasedCredits,
      description: `Complimentary free evaluation consumed (${updatedUsed} of ${user.freeEvaluationsLimit} used).`,
      timestamp: new Date().toISOString(),
    };
    db.addCreditLedgerEntry(entry);
    return { success: true, source: 'INDIVIDUAL_FREE', message: 'Free evaluation used.' };
  }

  // INDIVIDUAL_CREDIT
  if (user.purchasedCredits > 0) {
    const newBalance = user.purchasedCredits - 1;
    db.updateUser(userId, { purchasedCredits: newBalance });

    const entry: CreditLedgerEntry = {
      id: `crd-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      type: 'CREDIT_CONSUMED',
      amount: 1,
      source: 'EVALUATION',
      evaluationId,
      balanceAfter: newBalance,
      description: `Evaluation credit consumed. Remaining balance: ${newBalance}.`,
      timestamp: new Date().toISOString(),
    };
    db.addCreditLedgerEntry(entry);
    return { success: true, source: 'INDIVIDUAL_CREDIT', message: 'Purchased credit consumed.' };
  }

  throw new Error('No credit or free evaluation available.');
}

export function restoreEvaluationCredit(
  userId: string,
  evaluationId: string,
  source: 'PERMANENT_FREE' | 'INSTITUTE_SPONSORED' | 'INDIVIDUAL_FREE' | 'INDIVIDUAL_CREDIT',
  reason: string
): void {
  const user = db.getUserById(userId);
  if (!user) return;

  if (source === 'PERMANENT_FREE') return;

  if (source === 'INSTITUTE_SPONSORED' && user.instituteId) {
    const institute = db.getInstituteById(user.instituteId);
    if (institute && institute.sponsoredCreditsUsed > 0) {
      institute.sponsoredCreditsUsed -= 1;
      db.saveInstitute(institute);
    }
  } else if (source === 'INDIVIDUAL_FREE') {
    if (user.freeEvaluationsUsed > 0) {
      db.updateUser(userId, { freeEvaluationsUsed: user.freeEvaluationsUsed - 1 });
    }
  } else if (source === 'INDIVIDUAL_CREDIT') {
    const newBalance = user.purchasedCredits + 1;
    db.updateUser(userId, { purchasedCredits: newBalance });
  }

  const entry: CreditLedgerEntry = {
    id: `crd-restore-${Date.now()}`,
    userId,
    type: 'CREDIT_REFUNDED',
    amount: 1,
    source: 'FAILED_EVALUATION_RESTORE',
    evaluationId,
    balanceAfter: user.purchasedCredits,
    description: `Credit restored: ${reason}`,
    timestamp: new Date().toISOString(),
  };
  db.addCreditLedgerEntry(entry);
}

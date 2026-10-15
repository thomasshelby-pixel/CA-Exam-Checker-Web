import type { Amendment, QuestionModel, Subject } from '../../src/types';

export type TaxationExamPeriod = 'MAY2027' | 'SEP2027' | 'JAN2028';

export interface TaxationCurriculumSelection {
  isTaxation: true;
  isNewEdition: boolean;
  examPeriod: TaxationExamPeriod | null;
  editionLabel: string;
  officialSources: string[];
  promptContext: string;
}

const INCOME_TAX_SOURCE =
  'https://www.icai.org/post/bos-int-course-p3-taxation-msj27-28';
const GST_SOURCE =
  'https://www.icai.org/post/sm-intermediate-paper3-secb-msj27-28';

const INCOME_TAX_CHAPTERS = [
  '1. Basic Concepts',
  '2. Residential Status and Scope of Total Income',
  '3. Heads of Income',
  '4. Income of Other Persons included in Total Income of Assessee',
  '5. Set-Off or Carry Forward and Set-off of Losses',
  '6. Deductions from Gross Total Income',
  '7. Tax Deduction or Collection at Source and Advance Tax',
  '8. Provisions for filing Return of Income and Self Assessment',
  '9. Income Tax Liability - Computation and Optimisation',
];

const HEADS_OF_INCOME_UNITS = [
  'Salaries',
  'Income from House Property',
  'Profits and Gains of Business or Profession',
  'Capital Gains',
  'Income from Other Sources',
];

const GST_CHAPTERS = [
  '1. GST in India - An Introduction',
  '2. Supply under GST',
  '3. Charge of GST',
  '4. Place of Supply',
  '5. Exemptions from GST',
  '6. Time of Supply',
  '7. Value of Supply',
  '8. Input Tax Credit',
  '9. Registration',
  '10. Tax Invoice; Credit and Debit Notes',
  '11. Accounts and Records',
  '12. E-Way Bill',
  '13. Payment of Tax',
  '14. Tax Deduction at Source and Collection of Tax at Source',
  '15. Returns',
];

export function normalizeTaxationAttempt(value: string): TaxationExamPeriod | null {
  const compact = String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

  if (compact.includes('MAY2027') || compact.includes('2027MAY')) return 'MAY2027';
  if (
    compact.includes('SEP2027') ||
    compact.includes('SEPTEMBER2027') ||
    compact.includes('2027SEP') ||
    compact.includes('2027SEPTEMBER')
  ) return 'SEP2027';
  if (
    compact.includes('JAN2028') ||
    compact.includes('JANUARY2028') ||
    compact.includes('2028JAN') ||
    compact.includes('2028JANUARY')
  ) return 'JAN2028';

  return null;
}

function isIntermediateTaxation(caLevel: string, subject: Subject): boolean {
  if (!String(caLevel || '').toUpperCase().includes('INTERMEDIATE')) return false;

  const combined = `${subject.name || ''} ${subject.code || ''}`.toLowerCase();
  return subject.paperNumber === 3 ||
    /taxation|income[- ]?tax|goods and services tax|\bgst\b/.test(combined);
}

export function resolveTaxationCurriculumContext(
  caLevel: string,
  attempt: string,
  subject: Subject,
): TaxationCurriculumSelection | null {
  if (!isIntermediateTaxation(caLevel, subject)) return null;

  const examPeriod = normalizeTaxationAttempt(attempt);
  if (!examPeriod) {
    return {
      isTaxation: true,
      isNewEdition: false,
      examPeriod: null,
      editionLabel: `Existing attempt-specific Taxation references — ${attempt || 'unspecified attempt'}; May 2027 edition not applied`,
      officialSources: [],
      promptContext: [
        'This is CA Intermediate Taxation, but the attempt has not been mapped to the May 2027 onward editions.',
        'Do not automatically apply the Income-tax Act, 2025 / Income-tax Rules, 2026 edition to this attempt.',
        'Use only attempt-appropriate question references and amendments supplied below. If applicability is unclear, flag it for manual review rather than guessing.',
      ].join('\n'),
    };
  }

  const commonHeader = [
    'The selected CA Intermediate Taxation attempt is covered by the ICAI May 2027 onward study-material listing.',
    `Selected exam attempt: ${examPeriod}`,
    'Section A is Income-tax Law; Section B is Goods and Services Tax (GST).',
  ].join('\n');

  const incomeTax = [
    'SECTION A — INCOME-TAX LAW',
    'Edition: May 2027 onwards.',
    'Use the Income-tax Act, 2025 and Income-tax Rules, 2026 material for this attempt.',
    'Do not reuse Income-tax Act, 1961 section numbers, rates, thresholds or rules as current law unless the question explicitly calls for historical or transition treatment.',
    'Official ICAI material page: ' + INCOME_TAX_SOURCE,
    'Chapter structure:',
    ...INCOME_TAX_CHAPTERS,
    'Chapter 3 — Heads of Income units:',
    ...HEADS_OF_INCOME_UNITS.map((unit) => '- ' + unit),
  ].join('\n');

  const gst = [
    'SECTION B — GOODS AND SERVICES TAX',
    'Edition: May 2027 onwards.',
    'Use the attempt-applicable GST study material and separately applicable statutory amendments supplied with the evaluation.',
    'Official ICAI material page: ' + GST_SOURCE,
    'Chapter structure:',
    ...GST_CHAPTERS,
  ].join('\n');

  return {
    isTaxation: true,
    isNewEdition: true,
    examPeriod,
    editionLabel: 'CA Intermediate Taxation — May 2027 onwards (' + examPeriod + ')',
    officialSources: [INCOME_TAX_SOURCE, GST_SOURCE],
    promptContext: [
      commonHeader,
      '',
      incomeTax,
      '',
      gst,
      '',
      'Marking safeguards:',
      '- Prefer attempt-matched question/marking references over earlier-attempt references.',
      '- If no attempt-matched model answer or marking scheme is supplied, do not claim that one was consulted.',
      '- Do not invent statutory references. When unsure, reduce confidence and set manual review.',
      '- Registry chapter titles guide syllabus mapping; they are not themselves a suggested answer or marking scheme.',
    ].join('\n'),
  };
}

function isGeneralReference(attempt: string): boolean {
  const value = String(attempt || '').trim().toLowerCase();
  return !value ||
    /all attempts|all exams|general|common|all papers|all periods|onwards/.test(value);
}

export function filterTaxationQuestionsForAttempt(
  questions: QuestionModel[],
  attempt: string,
): QuestionModel[] {
  const target = normalizeTaxationAttempt(attempt);
  if (!target) return questions;

  return questions.filter((question) => {
    const sourceAttempt = String(question.attempt || '');
    if (isGeneralReference(sourceAttempt)) return true;

    // An explicitly labelled "May 2027 onwards" question is valid for all
    // attempts included in that edition's applicability window.
    if (/onwards/i.test(sourceAttempt) && normalizeTaxationAttempt(sourceAttempt)) {
      return true;
    }

    return normalizeTaxationAttempt(sourceAttempt) === target;
  });
}

export function filterTaxationAmendmentsForAttempt(
  amendments: Amendment[],
  attempt: string,
): Amendment[] {
  const target = normalizeTaxationAttempt(attempt);
  if (!target) return amendments;

  return amendments.filter((amendment) => {
    const applicable = String(amendment.applicableAttempt || '');
    if (isGeneralReference(applicable)) return true;

    if (/onwards/i.test(applicable) && normalizeTaxationAttempt(applicable)) {
      return true;
    }

    return normalizeTaxationAttempt(applicable) === target;
  });
}

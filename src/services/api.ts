import {
  User,
  Subject,
  Chapter,
  Amendment,
  QuestionModel,
  EvaluationReport,
  CreditLedgerEntry,
  PricingPlan,
  PaymentOrder,
  Institute,
  Batch,
  Assignment,
  InstituteTest,
  NotificationItem,
  SupportTicket,
  AuditLog,
  PermanentFreeEntry,
} from '../types';

const BASE_URL = '/api';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('ca_auth_token') || '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const api = {
  // Auth
  async register(data: any): Promise<{ user: User; token: string }> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async login(email: string, role?: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch user');
    }
    return res.json();
  },

  async updateProfile(data: Partial<User>): Promise<{ user: User }> {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update profile');
    }
    return res.json();
  },

  // Academics & Metadata
  async getAcademics(level?: string): Promise<{
    subjects: Subject[];
    chapters: Chapter[];
    amendments: Amendment[];
    questions: QuestionModel[];
  }> {
    const query = level ? `?level=${encodeURIComponent(level)}` : '';
    const res = await fetch(`${BASE_URL}/meta/academics${query}`);
    if (!res.ok) throw new Error('Failed to load academic syllabus');
    return res.json();
  },

  // Evaluations
  async checkEligibility(): Promise<{
    canEvaluate: boolean;
    reason: string;
    source: string;
    remainingCredits: number;
    freeRemaining: number;
  }> {
    const res = await fetch(`${BASE_URL}/evaluations/eligibility`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to check eligibility');
    return res.json();
  },

  async evaluateAnswerSheet(payload: {
    subjectId: string;
    caLevel: string;
    attempt: string;
    pages: any[];
  }): Promise<{ report: EvaluationReport }> {
    const res = await fetch(`${BASE_URL}/evaluations/evaluate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Evaluation failed');
    }
    return res.json();
  },

  async getEvaluations(filters?: { subjectId?: string; caLevel?: string }): Promise<{ evaluations: EvaluationReport[] }> {
    const params = new URLSearchParams();
    if (filters?.subjectId) params.append('subjectId', filters.subjectId);
    if (filters?.caLevel) params.append('caLevel', filters.caLevel);

    const res = await fetch(`${BASE_URL}/evaluations?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch evaluations');
    return res.json();
  },

  async getEvaluationById(id: string): Promise<{ report: EvaluationReport }> {
    const res = await fetch(`${BASE_URL}/evaluations/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch evaluation report');
    return res.json();
  },

  // Credits & Payments
  async getCreditLedger(): Promise<{
    purchasedCredits: number;
    freeEvaluationsUsed: number;
    freeEvaluationsLimit: number;
    isPermanentFree: boolean;
    eligibility: any;
    ledger: CreditLedgerEntry[];
  }> {
    const res = await fetch(`${BASE_URL}/credits/ledger`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch credit ledger');
    return res.json();
  },

  async getPricing(): Promise<{ plans: PricingPlan[]; default10SheetsPriceINR: number }> {
    const res = await fetch(`${BASE_URL}/pricing`);
    if (!res.ok) throw new Error('Failed to fetch pricing plans');
    return res.json();
  },

  async createOrder(planId: string): Promise<{ order: PaymentOrder }> {
    const res = await fetch(`${BASE_URL}/payments/create-order`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ planId }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create payment order');
    }
    return res.json();
  },

  async verifyPayment(orderId: string, paymentId: string): Promise<{ success: boolean; order: PaymentOrder; creditsAdded: number }> {
    const res = await fetch(`${BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderId, paymentId }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Payment verification failed');
    }
    return res.json();
  },

  // Institute
  async getInstituteDashboard(): Promise<any> {
    const res = await fetch(`${BASE_URL}/institute/dashboard`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load institute dashboard');
    return res.json();
  },

  async getInstituteStudents(): Promise<{ students: User[] }> {
    const res = await fetch(`${BASE_URL}/institute/students`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load institute students');
    return res.json();
  },

  async addInstituteStudent(data: { name: string; email: string; caLevel?: string; batchId?: string }): Promise<any> {
    const res = await fetch(`${BASE_URL}/institute/students/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add student to institute');
    return res.json();
  },

  async createBatch(data: { name: string; caLevel: string; attempt: string }): Promise<{ batch: Batch }> {
    const res = await fetch(`${BASE_URL}/institute/batches`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create batch');
    return res.json();
  },

  async createAssignment(data: any): Promise<{ assignment: Assignment }> {
    const res = await fetch(`${BASE_URL}/institute/assignments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create assignment');
    return res.json();
  },

  async createInstituteTest(data: any): Promise<{ test: InstituteTest }> {
    const res = await fetch(`${BASE_URL}/institute/tests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create test');
    return res.json();
  },

  // Admin
  async verifyAdminPasscode(passcode: string): Promise<{ verified: boolean; user: User; token: string }> {
    const res = await fetch(`${BASE_URL}/admin/verify-passcode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Incorrect Admin Password');
    }
    return res.json();
  },

  async getAdminDashboard(): Promise<any> {
    const res = await fetch(`${BASE_URL}/admin/dashboard`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load admin dashboard');
    return res.json();
  },

  async getAdminUsers(): Promise<{ users: User[] }> {
    const res = await fetch(`${BASE_URL}/admin/users`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load admin users');
    return res.json();
  },

  async updateAdminUser(id: string, updates: Partial<User>): Promise<{ user: User }> {
    const res = await fetch(`${BASE_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
  },

  async updateUserStatus(id: string, status: 'ACTIVE' | 'BLOCKED'): Promise<{ user: User }> {
    const res = await fetch(`${BASE_URL}/admin/users/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update user status');
    }
    return res.json();
  },

  async deleteAdminUser(id: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete user');
    }
    return res.json();
  },

  async getPermanentFreeList(): Promise<{ entries: PermanentFreeEntry[] }> {
    const res = await fetch(`${BASE_URL}/admin/permanent-free`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load permanent free list');
    return res.json();
  },

  async addPermanentFree(email: string, reason: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/admin/permanent-free`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, reason }),
    });
    if (!res.ok) throw new Error('Failed to add permanent free entry');
    return res.json();
  },

  async removePermanentFree(email: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/admin/permanent-free/${encodeURIComponent(email)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to remove permanent free entry');
    return res.json();
  },

  async createSubject(data: any): Promise<{ subject: Subject }> {
    const res = await fetch(`${BASE_URL}/admin/subjects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create subject');
    return res.json();
  },

  async createAmendment(data: any): Promise<{ amendment: Amendment }> {
    const res = await fetch(`${BASE_URL}/admin/amendments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create amendment');
    return res.json();
  },

  async getAuditLogs(): Promise<{ logs: AuditLog[] }> {
    const res = await fetch(`${BASE_URL}/admin/audit-logs`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load audit logs');
    return res.json();
  },

  // Support & Notifications
  async getNotifications(): Promise<{ notifications: NotificationItem[] }> {
    const res = await fetch(`${BASE_URL}/notifications`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load notifications');
    return res.json();
  },

  async markNotificationRead(id: string): Promise<void> {
    await fetch(`${BASE_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
  },

  async getSupportTickets(): Promise<{ tickets: SupportTicket[] }> {
    const res = await fetch(`${BASE_URL}/support/tickets`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load support tickets');
    return res.json();
  },

  async createSupportTicket(data: { name: string; email: string; subject: string; message: string; evaluationId?: string }): Promise<{ ticket: SupportTicket }> {
    const res = await fetch(`${BASE_URL}/support/tickets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create support ticket');
    return res.json();
  },

  async replySupportTicket(id: string, adminReply: string, status?: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/admin/support/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ adminReply, status }),
    });
    if (!res.ok) throw new Error('Failed to update support ticket');
    return res.json();
  },
};

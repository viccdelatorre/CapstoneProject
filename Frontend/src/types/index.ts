export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  school: string;
  fieldOfStudy: string;
  location: string;
  story: string;
  goalAmount: number;
  raisedAmount: number;
  verified: boolean;
  tags: string[];
  createdAt: string;
  urgency: 'low' | 'medium' | 'high';
}

export interface Campaign {
  id: string;
  studentId: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  deadline: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  milestones: Milestone[];
  updates: Update[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  evidenceType: 'receipt' | 'document' | 'photo';
}

export interface Update {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  images?: string[];
}

export interface Donation {
  id: string;
  donorId: string;
  studentId: string;
  amount: number;
  message?: string;
  anonymous: boolean;
  recurring: boolean;
  feeCovered: boolean;
  createdAt: string;
  receiptId: string;
}

export interface Receipt {
  id: string;
  donationId: string;
  amount: number;
  date: string;
  studentName: string;
  taxDeductible: boolean;
  downloadUrl: string;
}

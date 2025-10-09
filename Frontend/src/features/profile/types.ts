export interface Goal {
  title: string;
  targetAmount: number;
  description?: string;
}

export interface ProfileCreateBody {
  displayName: string;
  bio: string;
  story: string;
  goals: Goal[];
  country: string;
  school: string;
  program: string;
  profileImageId?: string;
}

export interface ProfileCreateResponse {
  profileId: string;
}

export interface Profile extends ProfileCreateBody {
  id: string;
  createdAt: string;
}
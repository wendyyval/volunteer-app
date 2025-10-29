export interface UserProfile {
  fullName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  skills: string[];
  preferences?: string;
  availability: string[];
}
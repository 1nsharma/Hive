export type FoodType = "veg" | "non-veg";

export type DonationStatus = "pending" | "claimed" | "delivered" | "flagged";

export interface Donation {
  id: string;
  donorName: string;
  foodType: FoodType;
  servings: number;
  freshnessHours: number;
  address: string;
  lat: number;
  lon: number;
  timestamp: string;
  status: DonationStatus;
  notes?: string;
  photoUrl?: string;
}

export type TaskStatus = "available" | "claimed" | "delivered" | "flagged";

export interface VolunteerTask {
  id: string;
  donationId: string;
  donation: Donation;
  volunteerName: string;
  status: TaskStatus;
  ngoId: string;
  ngoName: string;
  riskScore: number;
  riskReason?: string;
  timestamp: string;
  distanceMetres: number;
  progress: number; // 0 = not started, 50 = in transit, 100 = completed
  pickupVerified?: boolean;
}

export interface NgoCenter {
  id: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
  mealsReceived: number;
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  category: "AI" | "Security" | "Ops" | "Donation";
  message: string;
  status: "ok" | "warning" | "danger";
}

export interface ArchitectureNode {
  id: string;
  title: string;
  tier: "frontend" | "gateway" | "microservice" | "ai" | "database";
  role: string;
  techStack: string;
  spec: string;
  simulatedPayload: string;
}

import { User } from "./User";

export interface Request {
  _id: string;
  requestId :  string;
  requestor: string | User;
  requestedTo: string | User;
  status: "pending" | "accepted" | "rejected" | "donated" | "expired" | "cancelled";
  requiredBloodGroup: string;
  requiredUntil: string;
  urgency: "low" | "medium" | "high";
}
import type { UserRole } from "@/types/dashboard";

export interface PersonaDetails {
  name: string;
  title: string;
  initials: string;
}

export const personaDetailsByRole: Record<UserRole, PersonaDetails> = {
  "R&D": {
    name: "Dr. Alex Meyer",
    title: "R&D Scientist",
    initials: "AM",
  },
  MSAT: {
    name: "Jacob Weiss",
    title: "MSAT Team Member",
    initials: "JW",
  },
};

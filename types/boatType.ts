export interface Boat {
  id: string;
  name: string;
  goldCargo: number;
  captain: string;
  status: "docked" | "sailing" | "lookingForAFight";
  crewSize: number;
  timesPillaged: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
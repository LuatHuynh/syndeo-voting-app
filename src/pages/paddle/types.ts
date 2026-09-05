export type Screen =
  | "home"
  | "create"
  | "session"
  | "score"
  | "summary"
  | "report"
  | "payment"
  | "review"
  | "profile";

export type Role = "host" | "player";

export type SessionTime = {
  hour: string;
  minute: string;
};

export type SetCount = number | "";

export type SessionStatus = "open" | "completed";

export type CurrentUserParticipation = "none" | "invited" | "checked-in";

export type SessionParticipant = {
  id: string;
  name: string;
  initials: string;
  level: string;
  paid: boolean;
  checkedIn: boolean;
  isCurrentUser: boolean;
};

export type MatchFormat = "singles" | "doubles";

export type MatchTeam = {
  participantIds: string[];
};

export type MatchResult = {
  id: string;
  setNumber: number;
  format: MatchFormat;
  teamA: MatchTeam;
  teamB: MatchTeam;
  scoreA: number;
  scoreB: number;
  winnerTeam: "A" | "B";
  createdAt: Date;
};

export type SessionSettlement = {
  collected: number;
  courtCost: number;
  drinkCost: number;
  otherCost: number;
  note: string;
};

export type PaddleSession = {
  id: string;
  name: string;
  date: Date;
  time: SessionTime;
  location: string;
  costMode: "fixed" | "range";
  fixedCost: string;
  minimumCost: string;
  maximumCost: string;
  setCount: SetCount;
  participants: SessionParticipant[];
  matchHistory: MatchResult[];
  settlement: SessionSettlement;
  isHostedByCurrentUser: boolean;
  currentUserParticipation: CurrentUserParticipation;
  isCurrentUserPaid: boolean;
  status: SessionStatus;
};

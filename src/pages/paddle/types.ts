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

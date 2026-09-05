import { atom } from "jotai";
import type {
  CurrentUserParticipation,
  MatchResult,
  PaddleSession,
  SessionSettlement,
  SessionParticipant,
} from "./types";

const participantBase = [
  { id: "ma", name: "Minh Anh", initials: "MA", level: "TB+" },
  { id: "qh", name: "Quang Huy", initials: "QH", level: "TB" },
  { id: "lc", name: "Linh Chi", initials: "LC", level: "TB" },
  { id: "tk", name: "Tuan Kiet", initials: "TK", level: "TB+" },
];

const createParticipants = (
  currentUserId: string,
  checkedInIds: string[],
  paidIds: string[] = [],
): SessionParticipant[] =>
  participantBase.map((participant) => ({
    ...participant,
    isCurrentUser: participant.id === currentUserId,
    checkedIn: checkedInIds.includes(participant.id),
    paid: paidIds.includes(participant.id),
  }));

export const createDefaultHostParticipants = () =>
  createParticipants("ma", [], []);

export const createDefaultSettlement = (): SessionSettlement => ({
  collected: 0,
  courtCost: 0,
  drinkCost: 0,
  otherCost: 0,
  note: "",
});

export const getCurrentUserParticipation = (
  isHostedByCurrentUser: boolean,
  participants: SessionParticipant[],
): CurrentUserParticipation => {
  if (isHostedByCurrentUser) return "none";

  const currentUser = participants.find(
    (participant) => participant.isCurrentUser,
  );
  if (!currentUser) return "none";

  return currentUser.checkedIn ? "checked-in" : "invited";
};

const sampleCompletedHistory: MatchResult[] = [
  {
    id: "set-1",
    setNumber: 1,
    format: "doubles",
    teamA: { participantIds: ["ma", "qh"] },
    teamB: { participantIds: ["lc", "tk"] },
    scoreA: 21,
    scoreB: 16,
    winnerTeam: "A",
    createdAt: new Date(2026, 7, 22, 20, 15),
  },
  {
    id: "set-2",
    setNumber: 2,
    format: "singles",
    teamA: { participantIds: ["ma"] },
    teamB: { participantIds: ["lc"] },
    scoreA: 18,
    scoreB: 21,
    winnerTeam: "B",
    createdAt: new Date(2026, 7, 22, 20, 35),
  },
];

const initialSessions: PaddleSession[] = [
  {
    id: "after-work",
    name: "Padel after work",
    date: new Date(2026, 8, 5),
    time: { hour: "19", minute: "00" },
    location: "Padel Hub, Quan 2",
    costMode: "fixed",
    fixedCost: "180000",
    minimumCost: "150000",
    maximumCost: "220000",
    setCount: "",
    participants: createParticipants("ma", ["ma", "qh"], ["ma", "qh"]),
    matchHistory: [],
    settlement: createDefaultSettlement(),
    isHostedByCurrentUser: true,
    currentUserParticipation: "none",
    isCurrentUserPaid: false,
    status: "open",
  },
  {
    id: "weekday-ladder",
    name: "Weekday ladder",
    date: new Date(2026, 8, 8),
    time: { hour: "18", minute: "30" },
    location: "Padel Hub, Quan 2",
    costMode: "fixed",
    fixedCost: "200000",
    minimumCost: "",
    maximumCost: "",
    setCount: 5,
    participants: createParticipants("ma", [], []),
    matchHistory: [],
    settlement: createDefaultSettlement(),
    isHostedByCurrentUser: true,
    currentUserParticipation: "none",
    isCurrentUserPaid: false,
    status: "open",
  },
  {
    id: "sunday-social",
    name: "Sunday social",
    date: new Date(2026, 7, 31),
    time: { hour: "09", minute: "00" },
    location: "The Padel Club, Quan 7",
    costMode: "range",
    fixedCost: "",
    minimumCost: "150000",
    maximumCost: "200000",
    setCount: "",
    participants: createParticipants(
      "ma",
      ["ma", "qh", "lc", "tk"],
      ["ma", "qh"],
    ),
    matchHistory: sampleCompletedHistory,
    settlement: {
      collected: 720000,
      courtCost: 540000,
      drinkCost: 80000,
      otherCost: 0,
      note: "Giữ lại quỹ cho buổi sau",
    },
    isHostedByCurrentUser: true,
    currentUserParticipation: "none",
    isCurrentUserPaid: false,
    status: "completed",
  },
  {
    id: "friday-night",
    name: "Friday night doubles",
    date: new Date(2026, 7, 22),
    time: { hour: "20", minute: "00" },
    location: "Padel Central, Binh Thanh",
    costMode: "fixed",
    fixedCost: "180000",
    minimumCost: "",
    maximumCost: "",
    setCount: 3,
    participants: createParticipants(
      "ma",
      ["ma", "qh", "lc", "tk"],
      ["ma", "qh"],
    ),
    matchHistory: sampleCompletedHistory,
    settlement: {
      collected: 700000,
      courtCost: 520000,
      drinkCost: 90000,
      otherCost: 10000,
      note: "Thiếu 1 người chưa chuyển khoản",
    },
    isHostedByCurrentUser: true,
    currentUserParticipation: "none",
    isCurrentUserPaid: false,
    status: "completed",
  },
  {
    id: "saturday-mix",
    name: "Saturday mix",
    date: new Date(2026, 7, 30),
    time: { hour: "08", minute: "30" },
    location: "The Padel Club, Quan 7",
    costMode: "fixed",
    fixedCost: "160000",
    minimumCost: "",
    maximumCost: "",
    setCount: 5,
    participants: createParticipants(
      "ma",
      ["ma", "qh", "lc", "tk"],
      ["ma", "qh"],
    ),
    matchHistory: sampleCompletedHistory,
    settlement: {
      collected: 680000,
      courtCost: 500000,
      drinkCost: 85000,
      otherCost: 15000,
      note: "",
    },
    isHostedByCurrentUser: false,
    currentUserParticipation: "checked-in",
    isCurrentUserPaid: true,
    status: "completed",
  },
  {
    id: "morning-rally",
    name: "Morning rally",
    date: new Date(2026, 7, 24),
    time: { hour: "07", minute: "00" },
    location: "Padel Hub, Quan 2",
    costMode: "range",
    fixedCost: "",
    minimumCost: "120000",
    maximumCost: "180000",
    setCount: 3,
    participants: createParticipants("ma", ["qh", "lc", "tk"], ["ma", "qh"]),
    matchHistory: sampleCompletedHistory,
    settlement: {
      collected: 620000,
      courtCost: 500000,
      drinkCost: 70000,
      otherCost: 20000,
      note: "",
    },
    isHostedByCurrentUser: false,
    currentUserParticipation: "invited",
    isCurrentUserPaid: true,
    status: "completed",
  },
];

export const sessionsAtom = atom<PaddleSession[]>(initialSessions);
export const selectedSessionIdAtom = atom(initialSessions[0].id);

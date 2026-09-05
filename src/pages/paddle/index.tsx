import { useRef, useState } from "react";
import type { TouchEvent } from "react";
import { useAtom } from "jotai";
import { currency, formatMoney, TAB_SCREENS } from "./constants";
import PaddleHeader from "./components/paddle-header";
import CreateSessionScreen from "./screens/create-session-screen";
import {
  HomeScreen,
  ProfileScreen,
  ReportScreen,
} from "./screens/main-screens";
import {
  PaymentScreen,
  ScoreScreen,
  SummaryScreen,
} from "./screens/match-screens";
import ReviewScreen from "./screens/review-screen";
import SessionScreen from "./screens/session-screen";
import {
  createDefaultSettlement,
  createDefaultHostParticipants,
  getCurrentUserParticipation,
  selectedSessionIdAtom,
  sessionsAtom,
} from "./store";
import type {
  PaddleSession,
  Role,
  Screen,
  SessionSettlement,
  SessionTime,
  SetCount,
} from "./types";

const PAGE_TITLES: Partial<Record<Screen, string>> = {
  create: "Tạo buổi chơi",
  session: "Chi tiết buổi chơi",
  score: "Nhập kết quả",
  summary: "Tổng kết buổi chơi",
  payment: "Thanh toán",
  review: "Đánh giá",
};

const countCheckedInParticipants = (session?: PaddleSession) =>
  session?.participants.filter((participant) => participant.checkedIn).length ??
  0;

const checkedInParticipants = (session?: PaddleSession) =>
  session?.participants.filter((participant) => participant.checkedIn) ?? [];

export default function PaddleApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [role, setRole] = useState<Role>("host");
  const [savedScore, setSavedScore] = useState(false);
  const [sessions, setSessions] = useAtom(sessionsAtom);
  const [selectedSessionId, setSelectedSessionId] = useAtom(
    selectedSessionIdAtom,
  );
  const [sessionName, setSessionName] = useState("Padel after work");
  const [sessionDate, setSessionDate] = useState(new Date(2026, 8, 5));
  const [sessionTime, setSessionTime] = useState<SessionTime>({
    hour: "19",
    minute: "00",
  });
  const [costMode, setCostMode] = useState("fixed");
  const [fixedCost, setFixedCost] = useState("180000");
  const [minimumCost, setMinimumCost] = useState("150000");
  const [maximumCost, setMaximumCost] = useState("220000");
  const [setCount, setSetCount] = useState<SetCount>("");
  const [scheduleNextSet, setScheduleNextSet] = useState(true);
  const [venueRating, setVenueRating] = useState(4);
  const [toast, setToast] = useState("");
  const swipeStartX = useRef<number | null>(null);
  const selectedSession =
    sessions.find((session) => session.id === selectedSessionId) ?? sessions[0];

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  const goHome = () => setScreen("home");
  const isTabScreen = TAB_SCREENS.includes(screen);
  const activeTabIndex = TAB_SCREENS.indexOf(screen);
  const sessionCost =
    costMode === "fixed"
      ? currency(Number(fixedCost || 0))
      : `${formatMoney(minimumCost)} - ${formatMoney(maximumCost)} d`;
  const roleScopedSessions =
    role === "host"
      ? sessions.filter((session) => session.isHostedByCurrentUser)
      : sessions.filter(
          (session) =>
            !session.isHostedByCurrentUser &&
            session.currentUserParticipation !== "none",
        );

  const updateSelectedSession = (updates: Partial<PaddleSession>) => {
    setSessions((currentSessions) =>
      currentSessions.map((session) =>
        session.id === selectedSessionId ? { ...session, ...updates } : session,
      ),
    );
  };

  const selectSession = (sessionId: string) => {
    const session = sessions.find((item) => item.id === sessionId);
    if (!session) return;

    setSelectedSessionId(sessionId);
    setSessionName(session.name);
    setSessionDate(session.date);
    setSessionTime(session.time);
    setCostMode(session.costMode);
    setFixedCost(session.fixedCost);
    setMinimumCost(session.minimumCost);
    setMaximumCost(session.maximumCost);
    setSetCount(session.setCount);
  };

  const createSession = () => {
    const sessionId = `session-${Date.now()}`;
    const newSession: PaddleSession = {
      id: sessionId,
      name: sessionName,
      date: sessionDate,
      time: sessionTime,
      location: "Padel Hub, Quan 2",
      costMode: costMode === "range" ? "range" : "fixed",
      fixedCost,
      minimumCost,
      maximumCost,
      setCount,
      participants: createDefaultHostParticipants(),
      matchHistory: [],
      settlement: createDefaultSettlement(),
      isHostedByCurrentUser: true,
      currentUserParticipation: "none",
      isCurrentUserPaid: false,
      status: "open",
    };

    setSessions((currentSessions) => [newSession, ...currentSessions]);
    setSelectedSessionId(sessionId);
    setScreen("session");
    notify("Buổi chơi đã được tạo");
  };

  const handleTabSwipeStart = (event: TouchEvent<HTMLDivElement>) => {
    swipeStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTabSwipeEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = swipeStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    swipeStartX.current = null;

    if (startX === null || endX === undefined || Math.abs(endX - startX) < 48)
      return;

    const direction = endX < startX ? 1 : -1;
    const nextIndex = Math.min(
      Math.max(activeTabIndex + direction, 0),
      TAB_SCREENS.length - 1,
    );
    setScreen(TAB_SCREENS[nextIndex]);
  };

  const tabContent = (
    <div
      className="paddle-tab-viewport"
      onTouchStart={handleTabSwipeStart}
      onTouchEnd={handleTabSwipeEnd}
    >
      <div
        className="paddle-tab-track"
        style={{
          transform: `translate3d(-${activeTabIndex * 33.333333}%, 0, 0)`,
        }}
      >
        <HomeScreen
          role={role}
          sessions={sessions}
          onRoleChange={setRole}
          onSessionSelect={selectSession}
          onScreenChange={setScreen}
        />
        <ReportScreen
          role={role}
          sessions={roleScopedSessions}
          onSessionSelect={selectSession}
          onScreenChange={setScreen}
        />
        <ProfileScreen onScreenChange={setScreen} onNotify={notify} />
      </div>
    </div>
  );

  let detailContent;
  switch (screen) {
    case "create":
      detailContent = (
        <CreateSessionScreen
          sessionName={sessionName}
          sessionDate={sessionDate}
          sessionTime={sessionTime}
          costMode={costMode}
          fixedCost={fixedCost}
          minimumCost={minimumCost}
          maximumCost={maximumCost}
          setCount={setCount}
          onSessionNameChange={setSessionName}
          onSessionDateChange={setSessionDate}
          onSessionTimeChange={setSessionTime}
          onCostModeChange={setCostMode}
          onFixedCostChange={setFixedCost}
          onMinimumCostChange={setMinimumCost}
          onMaximumCostChange={setMaximumCost}
          onSetCountChange={setSetCount}
          onSubmit={createSession}
        />
      );
      break;
    case "session":
      detailContent = (
        <SessionScreen
          role={role}
          checkedIn={countCheckedInParticipants(selectedSession)}
          participants={selectedSession?.participants ?? []}
          paid={selectedSession?.isCurrentUserPaid ?? false}
          isSessionComplete={selectedSession?.status === "completed"}
          sessionName={selectedSession?.name ?? sessionName}
          sessionTime={selectedSession?.time ?? sessionTime}
          setCount={selectedSession?.setCount ?? setCount}
          sessionCost={
            selectedSession
              ? selectedSession.costMode === "fixed"
                ? currency(Number(selectedSession.fixedCost || 0))
                : `${formatMoney(selectedSession.minimumCost)} - ${formatMoney(selectedSession.maximumCost)} d`
              : sessionCost
          }
          matchHistory={selectedSession?.matchHistory ?? []}
          onToggleCheckIn={(participantId) => {
            if (!selectedSession || selectedSession.status === "completed")
              return;

            setSessions((currentSessions) =>
              currentSessions.map((session) => {
                if (session.id !== selectedSession.id) return session;

                const participant = session.participants.find(
                  (item) => item.id === participantId,
                );
                if (!participant) return session;

                const isAllowed = role === "host" || participant.isCurrentUser;
                if (!isAllowed) return session;

                const participants = session.participants.map((item) =>
                  item.id === participantId
                    ? { ...item, checkedIn: !item.checkedIn }
                    : item,
                );

                return {
                  ...session,
                  participants,
                  currentUserParticipation: getCurrentUserParticipation(
                    session.isHostedByCurrentUser,
                    participants,
                  ),
                };
              }),
            );
          }}
          onTogglePaid={(participantId) => {
            if (!selectedSession || role !== "host") return;

            setSessions((currentSessions) =>
              currentSessions.map((session) => {
                if (session.id !== selectedSession.id) return session;

                const participant = session.participants.find(
                  (item) => item.id === participantId,
                );
                if (!participant) return session;

                const nextPaid = !participant.paid;
                const participants = session.participants.map((item) =>
                  item.id === participantId ? { ...item, paid: nextPaid } : item,
                );

                return {
                  ...session,
                  participants,
                  isCurrentUserPaid: participants.find(
                    (item) => item.isCurrentUser,
                  )?.paid ?? session.isCurrentUserPaid,
                };
              }),
            );
          }}
          onViewSummary={() => {
            updateSelectedSession({ status: "completed" });
            setScreen("summary");
          }}
          onScreenChange={setScreen}
          onNotify={notify}
        />
      );
      break;
    case "score":
      detailContent = (
        <ScoreScreen
          savedScore={savedScore}
          checkedInParticipants={checkedInParticipants(selectedSession)}
          nextSetNumber={(selectedSession?.matchHistory.length ?? 0) + 1}
          scheduleNextSet={scheduleNextSet}
          onScheduleNextSetChange={setScheduleNextSet}
          onSave={(result) => {
            if (!selectedSession) return;

            setSessions((currentSessions) =>
              currentSessions.map((session) => {
                if (session.id !== selectedSession.id) return session;

                return {
                  ...session,
                  matchHistory: [
                    ...session.matchHistory,
                    {
                      ...result,
                      id: `set-${Date.now()}`,
                      createdAt: new Date(),
                    },
                  ],
                };
              }),
            );
            setSavedScore(true);
            setScreen("session");
            notify(`Đã lưu kết quả set ${result.setNumber}`);
          }}
        />
      );
      break;
    case "summary":
      detailContent = (
        <SummaryScreen
          isHost={role === "host"}
          participantCount={selectedSession?.participants.length ?? 0}
          sessionName={selectedSession?.name ?? sessionName}
          setCount={selectedSession?.setCount ?? setCount}
          settlement={
            selectedSession?.settlement ?? createDefaultSettlement()
          }
          onSettlementChange={(updates: Partial<SessionSettlement>) => {
            if (!selectedSession) return;

            setSessions((currentSessions) =>
              currentSessions.map((session) => {
                if (session.id !== selectedSession.id) return session;

                return {
                  ...session,
                  settlement: {
                    ...session.settlement,
                    ...updates,
                  },
                };
              }),
            );
          }}
          onScreenChange={setScreen}
          onNotify={notify}
        />
      );
      break;
    case "payment":
      detailContent = (
        <PaymentScreen
          sessionName={selectedSession?.name ?? sessionName}
          sessionCost={
            selectedSession
              ? selectedSession.costMode === "fixed"
                ? currency(Number(selectedSession.fixedCost || 0))
                : `${formatMoney(selectedSession.minimumCost)} - ${formatMoney(selectedSession.maximumCost)} d`
              : sessionCost
          }
          onConfirm={() => {
            if (!selectedSession) return;

            setSessions((currentSessions) =>
              currentSessions.map((session) => {
                if (session.id !== selectedSession.id) return session;

                return {
                  ...session,
                  isCurrentUserPaid: true,
                  participants: session.participants.map((participant) =>
                    participant.isCurrentUser
                      ? { ...participant, paid: true }
                      : participant,
                  ),
                };
              }),
            );
            setScreen("session");
            notify("Đã xác nhận thanh toán");
          }}
        />
      );
      break;
    case "review":
      detailContent = (
        <ReviewScreen
          isHost={role === "host"}
          venueRating={venueRating}
          onVenueRatingChange={setVenueRating}
          onSubmit={() => {
            goHome();
            notify("Cảm ơn đánh giá của bạn");
          }}
        />
      );
      break;
    default:
      detailContent = null;
  }

  return (
    <div className="paddle-app">
      <PaddleHeader
        isTabScreen={isTabScreen}
        title={PAGE_TITLES[screen]}
        onHome={goHome}
        onNotify={() => notify("Bạn không có thông báo mới")}
      />
      {isTabScreen ? tabContent : detailContent}
      {isTabScreen && (
        <nav className="paddle-nav">
          <button
            className={screen === "home" ? "is-active" : ""}
            type="button"
            onClick={goHome}
          >
            <span>⌂</span>Trang chủ
          </button>
          <button
            className={screen === "report" ? "is-active" : ""}
            type="button"
            onClick={() => setScreen("report")}
          >
            <span>▤</span>Buổi chơi
          </button>
          <button
            className={screen === "profile" ? "is-active" : ""}
            type="button"
            onClick={() => setScreen("profile")}
          >
            <span>◉</span>Cá nhân
          </button>
        </nav>
      )}
      {toast && (
        <div className="paddle-toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}

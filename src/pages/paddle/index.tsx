import { useRef, useState } from "react";
import type { TouchEvent } from "react";
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
import type { Role, Screen, SessionTime, SetCount } from "./types";

const PAGE_TITLES: Partial<Record<Screen, string>> = {
  create: "Tạo buổi chơi",
  session: "Chi tiết buổi chơi",
  score: "Nhập kết quả",
  summary: "Tổng kết buổi chơi",
  payment: "Thanh toán",
  review: "Đánh giá",
};

export default function PaddleApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [role, setRole] = useState<Role>("host");
  const [checkedIn, setCheckedIn] = useState(2);
  const [paid, setPaid] = useState(false);
  const [savedScore, setSavedScore] = useState(false);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
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
          sessionName={sessionName}
          sessionTime={sessionTime}
          onRoleChange={setRole}
          onScreenChange={setScreen}
        />
        <ReportScreen role={role} onScreenChange={setScreen} />
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
          onSubmit={() => {
            setIsSessionComplete(false);
            setScreen("session");
            notify("Buổi chơi đã được tạo");
          }}
        />
      );
      break;
    case "session":
      detailContent = (
        <SessionScreen
          role={role}
          checkedIn={checkedIn}
          paid={paid}
          isSessionComplete={isSessionComplete}
          sessionName={sessionName}
          sessionTime={sessionTime}
          setCount={setCount}
          sessionCost={sessionCost}
          onCheckIn={() => setCheckedIn((count) => Math.min(4, count + 1))}
          onViewSummary={() => {
            setIsSessionComplete(true);
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
          scheduleNextSet={scheduleNextSet}
          onScheduleNextSetChange={setScheduleNextSet}
          onSave={() => {
            setSavedScore(true);
            setScreen("session");
            notify("Đã lưu kết quả set 1");
          }}
        />
      );
      break;
    case "summary":
      detailContent = (
        <SummaryScreen
          sessionName={sessionName}
          setCount={setCount}
          paid={paid}
          onScreenChange={setScreen}
          onNotify={notify}
        />
      );
      break;
    case "payment":
      detailContent = (
        <PaymentScreen
          sessionName={sessionName}
          sessionCost={sessionCost}
          onConfirm={() => {
            setPaid(true);
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

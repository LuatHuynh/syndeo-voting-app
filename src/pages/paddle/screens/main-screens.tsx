import type { PaddleSession, Role, Screen } from "../types";

type ScreenChange = (screen: Screen) => void;

type SessionListProps = {
  sessions: PaddleSession[];
  onSessionSelect: (sessionId: string) => void;
  onScreenChange: ScreenChange;
};

type HomeScreenProps = SessionListProps & {
  role: Role;
  onRoleChange: (role: Role) => void;
};

const statusLabel = (status: PaddleSession["status"]) =>
  status === "open" ? "Đang mở" : "Đã kết thúc";

const sessionDate = (session: PaddleSession) => ({
  day: String(session.date.getDate()).padStart(2, "0"),
  month: session.date.getMonth() + 1,
});

export function HomeScreen({
  role,
  sessions,
  onRoleChange,
  onSessionSelect,
  onScreenChange,
}: HomeScreenProps) {
  const isHost = role === "host";
  const hostedSessions = sessions.filter(
    (session) => session.isHostedByCurrentUser,
  );
  const playerSessions = sessions.filter(
    (session) =>
      !session.isHostedByCurrentUser &&
      session.currentUserParticipation !== "none",
  );

  const openSession = (session: PaddleSession) => {
    onSessionSelect(session.id);
    onScreenChange("session");
  };

  return (
    <main className="paddle-content paddle-home">
      <section className="paddle-hero">
        <div className="paddle-hero-copy">
          <p>Chao buoi sang, Minh</p>
          <h2>Ra san cung nhau</h2>
          <span>To chuc va theo doi moi tran padel.</span>
        </div>
        <div className="paddle-court-art" aria-hidden="true">
          <i />
          <i />
          <b />
        </div>
      </section>

      <div className="paddle-role-switch" aria-label="Chọn vai trò">
        <button
          className={isHost ? "is-active" : ""}
          type="button"
          onClick={() => onRoleChange("host")}
        >
          Host
        </button>
        <button
          className={!isHost ? "is-active" : ""}
          type="button"
          onClick={() => onRoleChange("player")}
        >
          Người chơi
        </button>
      </div>

      {isHost ? (
        <section className="paddle-section">
          <div className="paddle-section-heading">
            <div>
              <p className="paddle-eyebrow">Buổi chơi của bạn</p>
              <h2>Buổi chơi</h2>
            </div>
            {hostedSessions.length > 3 && (
              <button
                className="paddle-text-button"
                type="button"
                onClick={() => onScreenChange("report")}
              >
                Xem tất cả
              </button>
            )}
          </div>
          <div className="paddle-session-list">
            {hostedSessions.slice(0, 3).map((session) => {
              const date = sessionDate(session);
              return (
                <button
                  className="paddle-session-card"
                  type="button"
                  key={session.id}
                  onClick={() => openSession(session)}
                >
                  <div className="paddle-date">
                    <strong>{date.day}</strong>
                    <span>THG {date.month}</span>
                  </div>
                  <div className="paddle-session-main">
                    <span
                      className={`paddle-status ${
                        session.status === "completed" ? "is-completed" : ""
                      }`}
                    >
                      {statusLabel(session.status)}
                    </span>
                    <strong>{session.name}</strong>
                    <span>
                      {session.time.hour}:{session.time.minute} -{" "}
                      {session.location}
                    </span>
                  </div>
                  <span className="paddle-chevron">›</span>
                </button>
              );
            })}
          </div>
          <button
            className="paddle-primary-button mt-4"
            type="button"
            onClick={() => onScreenChange("create")}
          >
            <span aria-hidden="true">+</span> Tạo buổi chơi mới
          </button>
        </section>
      ) : (
        <section className="paddle-section">
          <p className="paddle-eyebrow">Lịch của bạn</p>
          <h2>Buổi chơi đã tham gia</h2>
          <div className="paddle-session-list">
            {playerSessions.map((session) => (
              <button
                className="paddle-player-session"
                type="button"
                key={session.id}
                onClick={() => openSession(session)}
              >
                <span className="paddle-status">
                  {session.currentUserParticipation === "checked-in"
                    ? "Đã check-in"
                    : "Được mời"}
                </span>
                <strong>{session.name}</strong>
                <span>
                  {session.time.hour}:{session.time.minute} · {session.location}
                </span>
                <div>
                  <span className="paddle-avatar mini">MA</span>
                  <span className="paddle-avatar mini">QH</span>
                  <span className="paddle-avatar mini">+2</span>
                </div>
              </button>
            ))}
          </div>
          <div className="paddle-tip">
            <span>◎</span>
            <p>Check-in khi đến sân để host có thể xếp trận cho bạn.</p>
          </div>
        </section>
      )}

      <section className="paddle-section paddle-quick-actions">
        <p className="paddle-eyebrow">Lối tắt</p>
        <div>
          <button type="button" onClick={() => onScreenChange("report")}>
            <span>▤</span> Báo cáo
          </button>
          <button type="button" onClick={() => onScreenChange("review")}>
            <span>☆</span> Đánh giá
          </button>
          <button type="button" onClick={() => onScreenChange("profile")}>
            <span>◉</span> Cá nhân
          </button>
        </div>
      </section>
    </main>
  );
}

type ReportScreenProps = SessionListProps & {
  role: Role;
};

export function ReportScreen({
  role,
  sessions,
  onSessionSelect,
  onScreenChange,
}: ReportScreenProps) {
  const openSession = (session: PaddleSession) => {
    onSessionSelect(session.id);
    onScreenChange("session");
  };

  return (
    <main className="paddle-content">
      <section className="paddle-report-top">
        <p className="paddle-eyebrow">Mùa này</p>
        <h2>Báo cáo của {role === "host" ? "host" : "người chơi"}</h2>
        <div>
          <span>
            <b>{sessions.length}</b> buổi chơi
          </span>
          <span>
            <b>32</b> set
          </span>
          <span>
            <b>75%</b> thắng
          </span>
        </div>
      </section>
      <section className="paddle-section">
        <div className="paddle-section-heading">
          <div>
            <p className="paddle-eyebrow">Lịch sử gần đây</p>
            <h2>Trận đã chơi</h2>
          </div>
        </div>
        {sessions.map((session) => {
          const date = sessionDate(session);
          return (
            <button
              className="paddle-history-row"
              type="button"
              key={session.id}
              onClick={() => openSession(session)}
            >
              <span className="paddle-date small">
                <strong>{date.day}</strong>
                <span>THG {date.month}</span>
              </span>
              <span>
                <strong>{session.name}</strong>
                <small>{statusLabel(session.status)}</small>
              </span>
              <span>›</span>
            </button>
          );
        })}
      </section>
    </main>
  );
}

type ProfileScreenProps = {
  onScreenChange: ScreenChange;
  onNotify: (message: string) => void;
};

export function ProfileScreen({
  onScreenChange,
  onNotify,
}: ProfileScreenProps) {
  return (
    <main className="paddle-content">
      <section className="paddle-profile-hero">
        <span className="paddle-avatar large">MA</span>
        <h2>Minh Anh</h2>
        <p>TB+ · 12 buổi chơi</p>
      </section>
      <section className="paddle-section paddle-profile-list">
        <button type="button" onClick={() => onScreenChange("report")}>
          <span>▤</span> Lịch sử buổi chơi <b>›</b>
        </button>
        <button type="button" onClick={() => onScreenChange("review")}>
          <span>☆</span> Đánh giá của tôi <b>›</b>
        </button>
        <button type="button" onClick={() => onNotify("Cài đặt sẽ sớm có mặt")}>
          <span>⚙</span> Cài đặt <b>›</b>
        </button>
      </section>
    </main>
  );
}

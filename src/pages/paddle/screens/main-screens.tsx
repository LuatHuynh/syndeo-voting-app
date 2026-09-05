import type { Role, Screen, SessionTime } from "../types";

type ScreenChange = (screen: Screen) => void;

type HomeScreenProps = {
  role: Role;
  sessionName: string;
  sessionTime: SessionTime;
  onRoleChange: (role: Role) => void;
  onScreenChange: ScreenChange;
};

export function HomeScreen({
  role,
  sessionName,
  sessionTime,
  onRoleChange,
  onScreenChange,
}: HomeScreenProps) {
  const isHost = role === "host";

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
              <h2>Sắp diễn ra</h2>
            </div>
            <button
              className="paddle-text-button"
              type="button"
              onClick={() => onScreenChange("report")}
            >
              Xem tất cả
            </button>
          </div>
          <button
            className="paddle-session-card"
            type="button"
            onClick={() => onScreenChange("session")}
          >
            <div className="paddle-date">
              <strong>05</strong>
              <span>THG 9</span>
            </div>
            <div className="paddle-session-main">
              <span className="paddle-status">Dang mo</span>
              <strong>{sessionName}</strong>
              <span>
                {sessionTime.hour}:{sessionTime.minute} - Padel Hub, Quan 2
              </span>
            </div>
            <span className="paddle-chevron">›</span>
          </button>
          <button
            className="paddle-primary-button"
            type="button"
            onClick={() => onScreenChange("create")}
          >
            <span aria-hidden="true">+</span> Tạo buổi chơi mới
          </button>
        </section>
      ) : (
        <section className="paddle-section">
          <p className="paddle-eyebrow">Lịch của bạn</p>
          <h2>Trận sắp tới</h2>
          <button
            className="paddle-player-session"
            type="button"
            onClick={() => onScreenChange("session")}
          >
            <span className="paddle-status">Đã xác nhận</span>
            <strong>{sessionName}</strong>
            <span>
              Hôm nay, {sessionTime.hour}:{sessionTime.minute} · Padel Hub, Quan
              2
            </span>
            <div>
              <span className="paddle-avatar mini">MA</span>
              <span className="paddle-avatar mini">QH</span>
              <span className="paddle-avatar mini">+2</span>
            </div>
          </button>
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

type ReportScreenProps = {
  role: Role;
  onScreenChange: ScreenChange;
};

export function ReportScreen({ role, onScreenChange }: ReportScreenProps) {
  return (
    <main className="paddle-content">
      <section className="paddle-report-top">
        <p className="paddle-eyebrow">Mùa này</p>
        <h2>Báo cáo của {role === "host" ? "host" : "người chơi"}</h2>
        <div>
          <span>
            <b>12</b> buổi chơi
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
        {["Padel after work", "Saturday mix", "Morning rally"].map(
          (name, index) => (
            <button
              className="paddle-history-row"
              type="button"
              key={name}
              onClick={() => onScreenChange("session")}
            >
              <span className="paddle-date small">
                <strong>{5 - index * 2}</strong>
                <span>THG 9</span>
              </span>
              <span>
                <strong>{name}</strong>
                <small>{index === 0 ? "Thắng 2 - 1" : "Đã hoàn thành"}</small>
              </span>
              <span>›</span>
            </button>
          ),
        )}
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

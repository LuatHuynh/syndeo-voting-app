import { Button } from "zmp-ui";
import { participants } from "../constants";
import type { Role, Screen, SessionTime, SetCount } from "../types";

type SessionScreenProps = {
  role: Role;
  checkedIn: number;
  paid: boolean;
  isSessionComplete: boolean;
  sessionName: string;
  sessionTime: SessionTime;
  setCount: SetCount;
  sessionCost: string;
  onCheckIn: () => void;
  onViewSummary: () => void;
  onScreenChange: (screen: Screen) => void;
  onNotify: (message: string) => void;
};

export default function SessionScreen({
  role,
  checkedIn,
  paid,
  isSessionComplete,
  sessionName,
  sessionTime,
  setCount,
  sessionCost,
  onCheckIn,
  onViewSummary,
  onScreenChange,
  onNotify,
}: SessionScreenProps) {
  const isHost = role === "host";

  return (
    <main className="paddle-content">
      <section className="paddle-session-banner">
        <div>
          <span className="paddle-status">Dang mo</span>
          <h2>{sessionName}</h2>
          <p>
            Thu 05 thg 9 · {sessionTime.hour}:{sessionTime.minute} - 21:00
          </p>
          <p>⌖ Padel Hub, Quan 2</p>
        </div>
        <button
          type="button"
          onClick={() => onNotify("Đã sao chép link trận đấu")}
        >
          ↗
        </button>
      </section>
      <section className="paddle-info-strip">
        <span>
          <b>{checkedIn}/4</b> check-in
        </span>
        <span>
          <b>{sessionCost}</b>/người
        </span>
        <span>
          <b>{setCount || "Tuỳ chọn"}</b> set
        </span>
      </section>
      <section className="paddle-section">
        <div className="paddle-section-heading">
          <div>
            <p className="paddle-eyebrow">Người tham gia</p>
            <h2>Có mặt tại sân</h2>
          </div>
          <button
            className="paddle-text-button"
            type="button"
            onClick={onCheckIn}
          >
            + Check-in
          </button>
        </div>
        <div className="paddle-participants">
          {participants.map((participant, index) => {
            const hasPaid = participant.paid || (paid && index === 0);
            return (
              <div key={participant.name}>
                <span className="paddle-avatar">{participant.initials}</span>
                <span>
                  <strong>
                    {participant.name}
                    {index === 0 ? " (bạn)" : ""}
                  </strong>
                  <small>
                    {participant.level} ·{" "}
                    {index < checkedIn ? "Đã check-in" : "Chưa đến"}
                  </small>
                </span>
                <span className={hasPaid ? "paddle-paid" : "paddle-unpaid"}>
                  {hasPaid ? "Đã trả" : "Chưa trả"}
                </span>
              </div>
            );
          })}
        </div>
      </section>
      <div className="paddle-action-stack">
        {isHost ? (
          <>
            <Button
              className="paddle-primary-button"
              fullWidth
              onClick={() => onScreenChange("score")}
            >
              Nhập kết quả trận đấu
            </Button>
            <Button
              className="paddle-secondary-button"
              variant="secondary"
              fullWidth
              onClick={onViewSummary}
            >
              {isSessionComplete
                ? "Xem tổng kết buổi chơi"
                : "Kết thúc buổi chơi"}
            </Button>
          </>
        ) : (
          <>
            <Button
              className="paddle-primary-button"
              fullWidth
              onClick={() => onScreenChange("payment")}
            >
              {paid ? "Đã thanh toán" : "Thanh toán qua ZaloPay"}
            </Button>
            <Button
              className="paddle-secondary-button"
              variant="secondary"
              fullWidth
              onClick={() => onScreenChange("review")}
            >
              Đánh giá sân và host
            </Button>
          </>
        )}
      </div>
    </main>
  );
}

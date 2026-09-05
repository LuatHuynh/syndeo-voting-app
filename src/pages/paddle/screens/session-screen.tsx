import { Button } from "zmp-ui";
import type {
  MatchResult,
  Role,
  Screen,
  SessionParticipant,
  SessionTime,
  SetCount,
} from "../types";

type SessionScreenProps = {
  role: Role;
  checkedIn: number;
  participants: SessionParticipant[];
  paid: boolean;
  isSessionComplete: boolean;
  sessionName: string;
  sessionTime: SessionTime;
  setCount: SetCount;
  sessionCost: string;
  matchHistory: MatchResult[];
  onToggleCheckIn: (participantId: string) => void;
  onTogglePaid: (participantId: string) => void;
  onViewSummary: () => void;
  onScreenChange: (screen: Screen) => void;
  onNotify: (message: string) => void;
};

export default function SessionScreen({
  role,
  checkedIn,
  participants,
  paid,
  isSessionComplete,
  sessionName,
  sessionTime,
  setCount,
  sessionCost,
  matchHistory,
  onToggleCheckIn,
  onTogglePaid,
  onViewSummary,
  onScreenChange,
  onNotify,
}: SessionScreenProps) {
  const isHost = role === "host";
  const participantNameById = new Map(
    participants.map((participant) => [participant.id, participant.name]),
  );
  const resolveWinnerTeam = (match: MatchResult): "A" | "B" | null => {
    if (match.scoreA >= 21 && match.scoreB < 21) return "A";
    if (match.scoreB >= 21 && match.scoreA < 21) return "B";
    return null;
  };
  const teamLabel = (ids: string[]) =>
    ids
      .map((id) => participantNameById.get(id) ?? id.toUpperCase())
      .join(" + ");

  return (
    <main className="paddle-content">
      <section className="paddle-session-banner">
        <div>
          <span
            className={`paddle-status ${
              isSessionComplete ? "is-completed" : ""
            }`}
          >
            {isSessionComplete ? "Đã kết thúc" : "Đang mở"}
          </span>
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
          <b>
            {checkedIn}/{participants.length}
          </b>
          check-in
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
        </div>
        <div className="paddle-participants">
          {participants.map((participant) => {
            const hasPaid = participant.isCurrentUser
              ? paid || participant.paid
              : participant.paid;
            const canToggle =
              !isSessionComplete && (isHost || participant.isCurrentUser);
            const canTogglePaid = isHost;
            return (
              <div key={participant.id}>
                <span className="paddle-avatar">{participant.initials}</span>
                <span>
                  <strong>
                    {participant.name}
                    {participant.isCurrentUser ? " (bạn)" : ""}
                  </strong>
                  <small>
                    {participant.level} ·{" "}
                    {participant.checkedIn ? "Đã check-in" : "Chưa đến"}
                  </small>
                </span>
                <button
                  className="paddle-checkin-toggle"
                  type="button"
                  disabled={!canToggle}
                  onClick={() => onToggleCheckIn(participant.id)}
                >
                  {participant.checkedIn ? "Bỏ check-in" : "Check-in"}
                </button>
                <button
                  className={`paddle-checkin-toggle ${
                    hasPaid ? "paddle-paid" : "paddle-unpaid"
                  }`}
                  type="button"
                  disabled={!canTogglePaid}
                  onClick={() => onTogglePaid(participant.id)}
                >
                  {hasPaid ? "Đã trả" : "Chưa trả"}
                </button>
              </div>
            );
          })}
        </div>
      </section>
      <section className="paddle-section">
        <div className="paddle-section-heading">
          <div>
            <p className="paddle-eyebrow">Lịch sử</p>
            <h2>Lịch sử các cặp đấu</h2>
          </div>
        </div>
        {matchHistory.length === 0 ? (
          <p className="paddle-history-empty">
            Chưa có kết quả nào. Hãy nhập set đầu tiên để bắt đầu lịch sử.
          </p>
        ) : (
          <div className="paddle-match-history-list">
            {matchHistory.map((match) => (
              <div className="paddle-match-history-item" key={match.id}>
                <div className="paddle-match-history-head">
                  <span>Set {match.setNumber}</span>
                  <span>
                    {match.format === "doubles" ? "Đánh cặp" : "Đánh đơn"}
                  </span>
                </div>
                <div className="paddle-match-history-row">
                  <div>
                    <strong
                      className={
                        resolveWinnerTeam(match) === "A" ? "is-winner" : ""
                      }
                    >
                      {teamLabel(match.teamA.participantIds)}
                    </strong>
                  </div>
                  <b>
                    {match.scoreA}:{match.scoreB}
                  </b>
                  <div className="text-right">
                    <strong
                      className={
                        resolveWinnerTeam(match) === "B" ? "is-winner" : ""
                      }
                    >
                      {teamLabel(match.teamB.participantIds)}
                    </strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <div className="paddle-action-stack">
        {isHost ? (
          <>
            <Button
              className="paddle-primary-button"
              fullWidth
              disabled={isSessionComplete}
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
            {/*
            <Button
              className="paddle-primary-button"
              fullWidth
              onClick={() => onScreenChange("payment")}
            >
              {paid ? "Đã thanh toán" : "Thanh toán qua ZaloPay"}
            </Button>
            */}
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

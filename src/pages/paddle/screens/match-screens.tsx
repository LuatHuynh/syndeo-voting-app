import { useEffect, useMemo, useState } from "react";
import { Button, Checkbox, Input } from "zmp-ui";
import { currency } from "../constants";
import type {
  MatchFormat,
  MatchResult,
  Screen,
  SessionParticipant,
  SetCount,
} from "../types";

type ScoreScreenProps = {
  savedScore: boolean;
  checkedInParticipants: SessionParticipant[];
  nextSetNumber: number;
  scheduleNextSet: boolean;
  onScheduleNextSetChange: (value: boolean) => void;
  onSave: (result: Omit<MatchResult, "id" | "createdAt">) => void;
};

const getSelectable = (
  participants: SessionParticipant[],
  excludedIds: string[],
) =>
  participants.filter((participant) => !excludedIds.includes(participant.id));

const participantLabel = (participant?: SessionParticipant) =>
  participant ? `${participant.name} (${participant.initials})` : "";

export function ScoreScreen({
  savedScore,
  checkedInParticipants,
  nextSetNumber,
  scheduleNextSet,
  onScheduleNextSetChange,
  onSave,
}: ScoreScreenProps) {
  const [format, setFormat] = useState<MatchFormat>("doubles");
  const [teamA1, setTeamA1] = useState("");
  const [teamA2, setTeamA2] = useState("");
  const [teamB1, setTeamB1] = useState("");
  const [teamB2, setTeamB2] = useState("");
  const [scoreA, setScoreA] = useState("6");
  const [scoreB, setScoreB] = useState("4");

  const byId = useMemo(
    () =>
      new Map(
        checkedInParticipants.map((participant) => [
          participant.id,
          participant,
        ]),
      ),
    [checkedInParticipants],
  );

  useEffect(() => {
    if (checkedInParticipants.length < 4) {
      setFormat("singles");
    }
  }, [checkedInParticipants.length]);

  useEffect(() => {
    const ids = checkedInParticipants.map((participant) => participant.id);

    const first = ids[0] ?? "";
    const second = ids[1] ?? "";
    const third = ids[2] ?? "";
    const fourth = ids[3] ?? "";

    setTeamA1((value) => (ids.includes(value) ? value : first));
    setTeamB1((value) => {
      if (ids.includes(value) && value !== first) return value;
      return second || "";
    });
    setTeamA2((value) => {
      if (ids.includes(value) && value !== first && value !== second)
        return value;
      return third || "";
    });
    setTeamB2((value) => {
      if (
        ids.includes(value) &&
        value !== first &&
        value !== second &&
        value !== third
      ) {
        return value;
      }
      return fourth || "";
    });
  }, [checkedInParticipants]);

  const hasEnoughForSingles = checkedInParticipants.length >= 2;
  const hasEnoughForDoubles = checkedInParticipants.length >= 4;

  const selectedIds =
    format === "doubles" ? [teamA1, teamA2, teamB1, teamB2] : [teamA1, teamB1];
  const nonEmptySelectedIds = selectedIds.filter(Boolean);
  const hasDuplicateSelection =
    new Set(nonEmptySelectedIds).size !== nonEmptySelectedIds.length;

  const scoreANumber = Number(scoreA || 0);
  const scoreBNumber = Number(scoreB || 0);
  const hasValidScores =
    Number.isFinite(scoreANumber) && Number.isFinite(scoreBNumber);
  const winnerTeam: "A" | "B" | null =
    scoreANumber >= 21 && scoreBNumber < 21
      ? "A"
      : scoreBNumber >= 21 && scoreANumber < 21
        ? "B"
        : null;

  const canSave =
    (format === "singles" ? hasEnoughForSingles : hasEnoughForDoubles) &&
    nonEmptySelectedIds.length === (format === "singles" ? 2 : 4) &&
    !hasDuplicateSelection &&
    hasValidScores &&
    winnerTeam !== null;

  const buildTeamText = (ids: string[]) =>
    ids
      .map((id) => byId.get(id))
      .filter((participant): participant is SessionParticipant =>
        Boolean(participant),
      )
      .map((participant) => participant.initials)
      .join(" + ");

  return (
    <main className="paddle-content">
      <section className="paddle-match-card">
        <p className="paddle-eyebrow">Set {nextSetNumber} · Sân 02</p>
        <div className="paddle-format-switch">
          <button
            type="button"
            className={format === "singles" ? "is-active" : ""}
            onClick={() => setFormat("singles")}
            disabled={!hasEnoughForSingles}
          >
            Đánh đơn
          </button>
          <button
            type="button"
            className={format === "doubles" ? "is-active" : ""}
            onClick={() => setFormat("doubles")}
            disabled={!hasEnoughForDoubles}
          >
            Đánh cặp
          </button>
        </div>
        <p className="paddle-score-note">
          Chỉ hiển thị người đã check-in để nhập kết quả.
        </p>
        {!hasEnoughForSingles && (
          <p className="paddle-score-warning">
            Cần tối thiểu 2 người đã check-in.
          </p>
        )}
        {format === "doubles" && !hasEnoughForDoubles && (
          <p className="paddle-score-warning">
            Cần tối thiểu 4 người đã check-in cho đánh cặp.
          </p>
        )}

        {hasEnoughForSingles && (
          <div className="paddle-lineup-grid">
            <label>
              Team A
              <select
                value={teamA1}
                onChange={(event) => setTeamA1(event.target.value)}
              >
                {getSelectable(checkedInParticipants, []).map((participant) => (
                  <option key={participant.id} value={participant.id}>
                    {participantLabel(participant)}
                  </option>
                ))}
              </select>
            </label>

            {format === "doubles" && (
              <label>
                Team A (người 2)
                <select
                  value={teamA2}
                  onChange={(event) => setTeamA2(event.target.value)}
                >
                  {getSelectable(checkedInParticipants, [teamA1]).map(
                    (participant) => (
                      <option key={participant.id} value={participant.id}>
                        {participantLabel(participant)}
                      </option>
                    ),
                  )}
                </select>
              </label>
            )}

            <label>
              Team B
              <select
                value={teamB1}
                onChange={(event) => setTeamB1(event.target.value)}
              >
                {getSelectable(
                  checkedInParticipants,
                  format === "doubles" ? [teamA1, teamA2] : [teamA1],
                ).map((participant) => (
                  <option key={participant.id} value={participant.id}>
                    {participantLabel(participant)}
                  </option>
                ))}
              </select>
            </label>

            {format === "doubles" && (
              <label>
                Team B (người 2)
                <select
                  value={teamB2}
                  onChange={(event) => setTeamB2(event.target.value)}
                >
                  {getSelectable(checkedInParticipants, [
                    teamA1,
                    teamA2,
                    teamB1,
                  ]).map((participant) => (
                    <option key={participant.id} value={participant.id}>
                      {participantLabel(participant)}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        )}

        <div className="paddle-versus">
          <div className={winnerTeam === "A" ? "is-winner" : ""}>
            <span className="paddle-avatar">MA</span>
            <strong>
              {buildTeamText(
                format === "doubles" ? [teamA1, teamA2] : [teamA1],
              ) || "Chưa chọn"}
            </strong>
          </div>
          <b>VS</b>
          <div className={winnerTeam === "B" ? "is-winner" : ""}>
            <span className="paddle-avatar coral">QH</span>
            <strong>
              {buildTeamText(
                format === "doubles" ? [teamB1, teamB2] : [teamB1],
              ) || "Chưa chọn"}
            </strong>
          </div>
        </div>
        <div className="paddle-score-input">
          <div className={winnerTeam === "A" ? "is-winner" : ""}>
            <Input
              id="minh-anh-score"
              name="minhAnhScore"
              type="number"
              value={scoreA}
              min={0}
              max={21}
              onChange={(event) => setScoreA(event.target.value)}
              aria-label="Tỷ số team A"
            />
          </div>
          <span>:</span>
          <div className={winnerTeam === "B" ? "is-winner" : ""}>
            <Input
              id="quang-huy-score"
              name="quangHuyScore"
              type="number"
              value={scoreB}
              min={0}
              max={21}
              onChange={(event) => setScoreB(event.target.value)}
              aria-label="Tỷ số team B"
            />
          </div>
        </div>
      </section>
      <section className="paddle-section">
        <p className="paddle-eyebrow">Kết quả</p>
        <h2>Đội nào đạt 21 điểm sẽ thắng</h2>
        <div className="paddle-result-hint">
          {winnerTeam === "A"
            ? "Team A đã thắng set"
            : winnerTeam === "B"
              ? "Team B đã thắng set"
              : "Chưa có đội thắng. Cần đúng 1 đội đạt 21 điểm."}
        </div>
        <Checkbox
          id="schedule-next-set"
          name="scheduleNextSet"
          className="paddle-toggle"
          value="next-set"
          checked={scheduleNextSet}
          onChange={(event: { target: { checked: boolean } }) =>
            onScheduleNextSetChange(event.target.checked)
          }
          label="Xếp set tiếp theo"
        />
      </section>
      <Button
        className="paddle-primary-button paddle-bottom-action"
        fullWidth
        disabled={!canSave}
        onClick={() => {
          if (!canSave || winnerTeam === null) return;

          onSave({
            setNumber: nextSetNumber,
            format,
            teamA: {
              participantIds:
                format === "doubles" ? [teamA1, teamA2] : [teamA1],
            },
            teamB: {
              participantIds:
                format === "doubles" ? [teamB1, teamB2] : [teamB1],
            },
            scoreA: Number(scoreA || 0),
            scoreB: Number(scoreB || 0),
            winnerTeam,
          });
        }}
      >
        {/* {savedScore ? "Đã lưu" : "Lưu kết quả"} */}
        Lưu kết quả
      </Button>
    </main>
  );
}

type SummaryScreenProps = {
  isHost: boolean;
  participantCount: number;
  sessionName: string;
  setCount: SetCount;
  settlement: {
    collected: number;
    courtCost: number;
    drinkCost: number;
    otherCost: number;
    note: string;
  };
  onSettlementChange: (updates: {
    collected?: number;
    courtCost?: number;
    drinkCost?: number;
    otherCost?: number;
    note?: string;
  }) => void;
  onScreenChange: (screen: Screen) => void;
  onNotify: (message: string) => void;
};

const parseMoneyInput = (value: string) => Number(value.replace(/\D/g, "") || 0);

export function SummaryScreen({
  isHost,
  participantCount,
  sessionName,
  setCount,
  settlement,
  onSettlementChange,
  onScreenChange,
  onNotify,
}: SummaryScreenProps) {
  const totalExpense =
    settlement.courtCost + settlement.drinkCost + settlement.otherCost;
  const remaining = settlement.collected - totalExpense;
  const remainingClassName =
    remaining >= 0 ? "positive" : "negative";

  return (
    <main className="paddle-content">
      <section className="paddle-summary-hero">
        <p>Buổi chơi đã hoàn thành</p>
        <h2>{sessionName}</h2>
        <div className="paddle-completion">✓</div>
        <span>{participantCount} người chơi · {setCount || "Tuỳ chọn"} set</span>
      </section>
      <section className="paddle-section">
        <p className="paddle-eyebrow">Thu chi</p>
        <h2>Tổng kết</h2>
        {isHost && (
          <div className="paddle-summary-form">
            <label>
              Tiền đã thu
              <Input
                type="text"
                value={String(settlement.collected)}
                onChange={(event) =>
                  onSettlementChange({
                    collected: parseMoneyInput(event.target.value),
                  })
                }
              />
            </label>
            <label>
              Thuê sân
              <Input
                type="text"
                value={String(settlement.courtCost)}
                onChange={(event) =>
                  onSettlementChange({
                    courtCost: parseMoneyInput(event.target.value),
                  })
                }
              />
            </label>
            <label>
              Nước uống
              <Input
                type="text"
                value={String(settlement.drinkCost)}
                onChange={(event) =>
                  onSettlementChange({
                    drinkCost: parseMoneyInput(event.target.value),
                  })
                }
              />
            </label>
            <label>
              Chi phí khác
              <Input
                type="text"
                value={String(settlement.otherCost)}
                onChange={(event) =>
                  onSettlementChange({
                    otherCost: parseMoneyInput(event.target.value),
                  })
                }
              />
            </label>
            <label>
              Ghi chú
              <Input
                type="text"
                value={settlement.note}
                onChange={(event) =>
                  onSettlementChange({ note: event.target.value })
                }
              />
            </label>
          </div>
        )}
        <div className="paddle-balance">
          <div>
            <span>Tiền đã thu</span>
            <strong>{currency(settlement.collected)}</strong>
          </div>
          <div>
            <span>Tiền đã chi</span>
            <strong>{currency(totalExpense)}</strong>
          </div>
          <div className={remainingClassName}>
            <span>Còn lại</span>
            <strong>{currency(remaining)}</strong>
          </div>
        </div>
      </section>
      <section className="paddle-section">
        <p className="paddle-eyebrow">Chi phí</p>
        <div className="paddle-expenses">
          <span>
            Thuê sân<b>{currency(settlement.courtCost)}</b>
          </span>
          <span>
            Nước uống <b>{currency(settlement.drinkCost)}</b>
          </span>
          <span>
            Chi phí khác <b>{currency(settlement.otherCost)}</b>
          </span>
        </div>
        {settlement.note && <p className="paddle-summary-note">{settlement.note}</p>}
      </section>
      <div className="paddle-action-stack">
        {/*
        <Button
          className="paddle-primary-button"
          fullWidth
          onClick={() => onNotify("Đã gửi nhắc thanh toán cho 2 người")}
        >
          Nhắc người chưa thanh toán
        </Button>
        */}
        <Button
          className="paddle-secondary-button"
          variant="secondary"
          fullWidth
          onClick={() => onNotify("Đã lưu thông tin tổng kết")}
        >
          Lưu tổng kết
        </Button>
        <Button
          className="paddle-secondary-button"
          variant="secondary"
          fullWidth
          onClick={() => onScreenChange("report")}
        >
          Xem báo cáo
        </Button>
      </div>
    </main>
  );
}

type PaymentScreenProps = {
  sessionName: string;
  sessionCost: string;
  onConfirm: () => void;
};

export function PaymentScreen({
  sessionName,
  sessionCost,
  onConfirm,
}: PaymentScreenProps) {
  void onConfirm;

  return (
    <main className="paddle-content paddle-payment-page">
      <section className="paddle-payment-card">
        <p className="paddle-eyebrow">Thanh toán cho buổi chơi</p>
        <h2>{sessionName}</h2>
        <div className="paddle-amount">{sessionCost}</div>
        <div className="paddle-payment-lines">
          <span>
            Phí sân <b>{currency(135000)}</b>
          </span>
          <span>
            Nước uống <b>{currency(20000)}</b>
          </span>
          <span>
            Quỹ buổi chơi <b>{currency(25000)}</b>
          </span>
        </div>
      </section>
      <div className="paddle-pay-method">
        <span className="paddle-zalo-mark">Z</span>
        <span>
          <strong>ZaloPay</strong>
          <small>Thanh toán an toàn trong Zalo</small>
        </span>
        <span>›</span>
      </div>
      {/*
      <Button
        className="paddle-primary-button paddle-bottom-action"
        fullWidth
        onClick={onConfirm}
      >
        Xác nhận thanh toán
      </Button>
      */}
    </main>
  );
}

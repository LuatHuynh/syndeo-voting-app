import { Button, Checkbox, Input, Radio } from "zmp-ui";
import { currency } from "../constants";
import type { Screen, SetCount } from "../types";

type ScoreScreenProps = {
  savedScore: boolean;
  scheduleNextSet: boolean;
  onScheduleNextSetChange: (value: boolean) => void;
  onSave: () => void;
};

export function ScoreScreen({
  savedScore,
  scheduleNextSet,
  onScheduleNextSetChange,
  onSave,
}: ScoreScreenProps) {
  return (
    <main className="paddle-content">
      <section className="paddle-match-card">
        <p className="paddle-eyebrow">Set 1 · Sân 02</p>
        <div className="paddle-versus">
          <div>
            <span className="paddle-avatar">MA</span>
            <strong>Minh Anh</strong>
          </div>
          <b>VS</b>
          <div>
            <span className="paddle-avatar coral">QH</span>
            <strong>Quang Huy</strong>
          </div>
        </div>
        <div className="paddle-score-input">
          <Input
            id="minh-anh-score"
            name="minhAnhScore"
            type="number"
            defaultValue="6"
            aria-label="Tỷ số Minh Anh"
          />
          <span>:</span>
          <Input
            id="quang-huy-score"
            name="quangHuyScore"
            type="number"
            defaultValue="4"
            aria-label="Tỷ số Quang Huy"
          />
        </div>
      </section>
      <section className="paddle-section">
        <p className="paddle-eyebrow">Kết quả</p>
        <h2>Ai thắng set này?</h2>
        <Radio.Group
          name="setWinner"
          className="paddle-winner-row"
          defaultValue="minh-anh"
          options={[
            { id: "winner-minh-anh", value: "minh-anh", label: "Minh Anh" },
            { id: "winner-quang-huy", value: "quang-huy", label: "Quang Huy" },
          ]}
        />
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
        onClick={onSave}
      >
        {savedScore ? "Đã lưu" : "Lưu kết quả"}
      </Button>
    </main>
  );
}

type SummaryScreenProps = {
  sessionName: string;
  setCount: SetCount;
  paid: boolean;
  onScreenChange: (screen: Screen) => void;
  onNotify: (message: string) => void;
};

export function SummaryScreen({
  sessionName,
  setCount,
  paid,
  onScreenChange,
  onNotify,
}: SummaryScreenProps) {
  return (
    <main className="paddle-content">
      <section className="paddle-summary-hero">
        <p>Buổi chơi đã hoàn thành</p>
        <h2>{sessionName}</h2>
        <div className="paddle-completion">✓</div>
        <span>4 người chơi · {setCount || "Tuỳ chọn"} set</span>
      </section>
      <section className="paddle-section">
        <p className="paddle-eyebrow">Thu chi</p>
        <h2>Tổng kết</h2>
        <div className="paddle-balance">
          <div>
            <span>Tiền đã thu</span>
            <strong>{currency(paid ? 720000 : 360000)}</strong>
          </div>
          <div>
            <span>Tiền đã chi</span>
            <strong>{currency(620000)}</strong>
          </div>
          <div className="positive">
            <span>Còn lại</span>
            <strong>{currency(paid ? 100000 : -260000)}</strong>
          </div>
        </div>
      </section>
      <section className="paddle-section">
        <p className="paddle-eyebrow">Chi phí</p>
        <div className="paddle-expenses">
          <span>
            Thuê sân<b>{currency(540000)}</b>
          </span>
          <span>
            Nước uống<b>{currency(80000)}</b>
          </span>
        </div>
      </section>
      <div className="paddle-action-stack">
        <Button
          className="paddle-primary-button"
          fullWidth
          onClick={() => onNotify("Đã gửi nhắc thanh toán cho 2 người")}
        >
          Nhắc người chưa thanh toán
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
      <Button
        className="paddle-primary-button paddle-bottom-action"
        fullWidth
        onClick={onConfirm}
      >
        Xác nhận thanh toán
      </Button>
    </main>
  );
}

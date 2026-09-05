import { Button, DatePicker, Input, Picker, Radio } from "zmp-ui";
import { SET_PICKER_OPTIONS, TIME_PICKER_DATA } from "../constants";
import MoneyInput from "../components/money-input";
import type { SessionTime, SetCount } from "../types";

type CreateSessionScreenProps = {
  sessionName: string;
  sessionDate: Date;
  sessionTime: SessionTime;
  costMode: string;
  fixedCost: string;
  minimumCost: string;
  maximumCost: string;
  setCount: SetCount;
  onSessionNameChange: (value: string) => void;
  onSessionDateChange: (value: Date) => void;
  onSessionTimeChange: (value: SessionTime) => void;
  onCostModeChange: (value: string) => void;
  onFixedCostChange: (value: string) => void;
  onMinimumCostChange: (value: string) => void;
  onMaximumCostChange: (value: string) => void;
  onSetCountChange: (value: SetCount) => void;
  onSubmit: () => void;
};

export default function CreateSessionScreen({
  sessionName,
  sessionDate,
  sessionTime,
  costMode,
  fixedCost,
  minimumCost,
  maximumCost,
  setCount,
  onSessionNameChange,
  onSessionDateChange,
  onSessionTimeChange,
  onCostModeChange,
  onFixedCostChange,
  onMinimumCostChange,
  onMaximumCostChange,
  onSetCountChange,
  onSubmit,
}: CreateSessionScreenProps) {
  return (
    <main className="paddle-content">
      <div className="paddle-form">
        <div className="paddle-form-intro">
          <p className="paddle-eyebrow">Thiết lập trận</p>
          <h2>Bắt đầu một buổi chơi</h2>
        </div>
        <Input
          id="session-name"
          name="sessionName"
          label="Tên buổi chơi"
          value={sessionName}
          onChange={(event) => onSessionNameChange(event.target.value)}
          required
        />
        <div id="session-date" data-name="sessionDate">
          <DatePicker
            label="Ngày chơi"
            defaultValue={sessionDate}
            onChange={(value) => onSessionDateChange(value)}
            locale="vi-VN"
            dateFormat="dd/mm/yyyy"
            title="Chọn ngày chơi"
            mask
            maskClosable
            action={{ text: "Xong", close: true }}
          />
        </div>
        <Picker
          id="session-time"
          name="sessionTime"
          label="Giờ bắt đầu"
          title="Chọn giờ bắt đầu"
          data={TIME_PICKER_DATA}
          value={sessionTime}
          onChange={(value) =>
            onSessionTimeChange({
              hour: String(value.hour?.value ?? "19"),
              minute: String(value.minute?.value ?? "00"),
            })
          }
          formatPickedValueDisplay={(value) =>
            `${value.hour?.displayName ?? "19"}:${value.minute?.displayName ?? "00"}`
          }
          mask
          maskClosable
          action={{ text: "Xong", close: true }}
        />
        <Input
          id="session-location"
          name="sessionLocation"
          label="Địa điểm"
          defaultValue="Padel Hub, Quan 2"
          required
        />
        <div className="paddle-zaui-field">
          <span>Chi phí mỗi người</span>
          <Radio.Group
            name="costMode"
            value={costMode}
            onChange={(value) => onCostModeChange(String(value))}
            className="flex gap-4 *:!flex-row"
            options={[
              { id: "cost-mode-fixed", value: "fixed", label: "Cố định" },
              { id: "cost-mode-range", value: "range", label: "Trong khoảng" },
            ]}
          />
          {costMode === "fixed" ? (
            <MoneyInput
              id="fixed-cost"
              name="fixedCost"
              value={fixedCost}
              onChange={onFixedCostChange}
            />
          ) : (
            <div className="paddle-money-range">
              <MoneyInput
                id="minimum-cost"
                name="minimumCost"
                label="Từ"
                value={minimumCost}
                onChange={onMinimumCostChange}
              />
              <MoneyInput
                id="maximum-cost"
                name="maximumCost"
                label="Đến"
                value={maximumCost}
                onChange={onMaximumCostChange}
              />
            </div>
          )}
        </div>
        <Picker
          id="set-count"
          name="setCount"
          label="Số set chơi (tuỳ chọn)"
          title="Chọn số set"
          data={[{ name: "sets", options: SET_PICKER_OPTIONS }]}
          value={{ sets: setCount }}
          onChange={(value) =>
            onSetCountChange(
              value.sets?.value === "" ? "" : Number(value.sets?.value),
            )
          }
          formatPickedValueDisplay={(value) =>
            `${value.sets?.displayName ?? "Không chọn"}`
          }
          mask
          maskClosable
          action={{ text: "Xong", close: true }}
        />
        <Button
          className="paddle-primary-button"
          fullWidth
          htmlType="button"
          onClick={onSubmit}
        >
          Tạo buổi chơi
        </Button>
      </div>
    </main>
  );
}

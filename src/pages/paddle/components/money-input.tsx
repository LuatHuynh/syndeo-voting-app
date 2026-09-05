import { Input } from "zmp-ui";
import type { InputProps } from "zmp-ui/input";
import { formatMoney } from "../constants";

type MoneyInputProps = Omit<InputProps, "value" | "onChange" | "type"> & {
  value: string;
  onChange: (value: string) => void;
};

export default function MoneyInput({
  value,
  onChange,
  suffix = "₫",
  inputMode = "numeric",
  ...inputProps
}: MoneyInputProps) {
  return (
    <Input
      {...inputProps}
      type="text"
      inputMode={inputMode}
      value={formatMoney(value)}
      onChange={(event) => onChange(event.target.value.replace(/\D/g, ""))}
      suffix={suffix}
    />
  );
}

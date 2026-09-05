import type { Screen } from "./types";

export const TAB_SCREENS: Screen[] = ["home", "report", "profile"];

export const TIME_PICKER_DATA = [
  {
    name: "hour",
    options: Array.from({ length: 24 }, (_, hour) => {
      const value = String(hour).padStart(2, "0");
      return { value, displayName: value };
    }),
  },
  {
    name: "minute",
    options: Array.from({ length: 60 }, (_, minute) => {
      const value = String(minute).padStart(2, "0");
      return { value, displayName: value };
    }),
  },
];

export const SET_PICKER_OPTIONS = [
  { value: "", displayName: "Không chọn" },
  ...Array.from({ length: 16 }, (_, index) => {
    const value = index + 5;
    return { value, displayName: `${value} set` };
  }),
];

export const participants = [
  { name: "Minh Anh", initials: "MA", paid: true, level: "TB+" },
  { name: "Quang Huy", initials: "QH", paid: true, level: "TB" },
  { name: "Linh Chi", initials: "LC", paid: false, level: "TB" },
  { name: "Tuan Kiet", initials: "TK", paid: false, level: "TB+" },
];

export const currency = (value: number) => `${value.toLocaleString("vi-VN")} d`;

export const formatMoney = (value: string) =>
  value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

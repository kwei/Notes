export const ROUTES: Record<string, string> = {
  // "My Notes": "/",
  "消費分析": "/spending",
  // "My Profile": "/profile",
  "任務規劃": "/task/v2",
};

export const ROUTE_TABLE: Record<string, string> = {
  // "/": "My Notes",
  "/spending": "消費分析",
  // "/profile": "My Profile",
  "/task/v2": "任務規劃",
};

export enum TASK_STATUS {
  COMPLETE = "Complete",
  IN_PROGRESS = "In Progress",
  NEW_REQUEST = "New Request",
  BACKLOG = "Backlog",
}

export const TASK_TABLE: Record<string, TASK_STATUS> = {
  "Backlog": TASK_STATUS.BACKLOG,
  "New Request": TASK_STATUS.NEW_REQUEST,
  "In Progress": TASK_STATUS.IN_PROGRESS,
  "Complete": TASK_STATUS.COMPLETE,
};

export enum TASK_COLOR {
  LIGHT_GRAY = "#D2D2D2B2",
  Gray = "#a4a4a4B2",
  Brown = "#bb553eB2",
  Orange = "#ffaf75B2",
  Yellow = "#ffe375B2",
  Green = "#7eff75B2",
  Blue = "#758cffB2",
  Purple = "#cc75ffB2",
  Pink = "#ff75baB2",
  Red = "#ff7575B2",
}

export const COLOR_TABLE: Record<string, TASK_COLOR> = {
  default: TASK_COLOR.LIGHT_GRAY,
  gray: TASK_COLOR.Gray,
  brown: TASK_COLOR.Brown,
  orange: TASK_COLOR.Orange,
  yellow: TASK_COLOR.Yellow,
  green: TASK_COLOR.Green,
  blue: TASK_COLOR.Blue,
  purple: TASK_COLOR.Purple,
  pink: TASK_COLOR.Pink,
  red: TASK_COLOR.Red,
};

export enum TOAST_TYPE {
  success,
  warning,
  error,
  info,
}

export const TOAST_TYPE_COLOR: Record<TOAST_TYPE, string> = {
  [TOAST_TYPE.success]: TASK_COLOR.Green,
  [TOAST_TYPE.warning]: TASK_COLOR.Orange,
  [TOAST_TYPE.error]: TASK_COLOR.Red,
  [TOAST_TYPE.info]: TASK_COLOR.Blue,
};

export const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "https://localhost:3000"
    : "https://notes-kweis-projects.vercel.app";

export enum INPUT_RECORD_TYPE {
  ADD,
  UPDATE,
  DELETE,
  CLEAR,
}

export enum RecordModalType {
  Step_1 = "1",
  Step_2 = "2",
  Step_2_1 = "2-1",
  Step_3 = "3",
  Step_4 = "4",
}

export enum SPENDING_PAGE_TAB {
  DEFAULT = "",
  CHART_BY_MONTH = "monthly",
  ANNUAL_REVIEW = "annually",
}

export const SPENDING_PAGE_TAB_LABEL = {
  [SPENDING_PAGE_TAB.DEFAULT]: "主畫面",
  [SPENDING_PAGE_TAB.CHART_BY_MONTH]: "月度回顧",
  [SPENDING_PAGE_TAB.ANNUAL_REVIEW]: "年度回顧",
}

export const SPENDING_PAGE_TABS = [
  SPENDING_PAGE_TAB.DEFAULT,
  SPENDING_PAGE_TAB.CHART_BY_MONTH,
  SPENDING_PAGE_TAB.ANNUAL_REVIEW,
];

export const DEFAULT_CATEGORIES = [
  "飲食",
  "交通",
  "娛樂",
  "日常",
  "醫療",
  "代墊",
  "薪水",
  "獎金",
  "投資",
  "還款",
  "其他",
];

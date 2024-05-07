export const ROUTES: Record<string, string> = {
  "My Notes": "/",
  // "My Profile": "/profile",
  "Task Manager": "/task",
};

export const ROUTE_TABLE: Record<string, string> = {
  "/": "My Notes",
  // "/profile": "My Profile",
  "/task": "Task Manager",
};

export enum TASK_STATUS {
  COMPLETE = "Complete",
  IN_PROGRESS = "In Progress",
  NEW_REQUEST = "New Request",
  BACKLOG = "Backlog",
}

export const TASK_TABLE: Record<string, TASK_STATUS> = {
  Backlog: TASK_STATUS.BACKLOG,
  "New Request": TASK_STATUS.NEW_REQUEST,
  "In Progress": TASK_STATUS.IN_PROGRESS,
  Complete: TASK_STATUS.COMPLETE,
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

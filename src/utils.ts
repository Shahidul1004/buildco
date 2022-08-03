import { RGBColor } from "react-color";

export enum activeToolOptions {
  select = "select",
  scale = "scale",
  pan = "pan",
  rectangle = "rectangle",
  polygon = "polygon",
  length = "length",
  count = "count",
  deduct = "deduct",
  annotate = "annotate",
}

export type scaleInfoType = {
  calibrated: boolean;
  x: number;
  y: number;
  L: number; //store in ft
};

export type polygonType = {
  name: string;
  points: number[];
  key: number;
  deductRect: deductRectType[];
  group: number;
  hover: boolean;
  height: number;
  depth: number;
  // pitch: number;
};

export type lengthType = {
  name: string;
  points: number[];
  key: number;
  group: number;
  hover: boolean;
};

export type countType = {
  points: number[];
  type: iconType;
  key: number;
  group: number;
  hover: boolean;
};

export type annotateType = {
  key: number;
  points: number[];
  text: string;
  fontColor: RGBColor;
  fontSize: number;
  backgroundColor: RGBColor;
};

export enum groupTypeName {
  shape = "shape",
  length = "length",
  count = "count",
  all = "all",
}
export enum unitType {
  ft = "ft",
  in = "in",
}
export enum iconType {
  circle = "CircleIcon",
  triangle = "ChangeHistoryIcon",
  square = "CropSquareIcon",
}
export type groupType = {
  id: number;
  name: string;
  type: groupTypeName;
  color: RGBColor;
  unit?: unitType;
  icon?: iconType;
  height?: number;
  depth?: number;
  // pitch?: number;
};
export type activeGroupType = {
  shape: number;
  length: number;
  count: number;
};

export type deductRectType = {
  points: number[];
  key: number;
};

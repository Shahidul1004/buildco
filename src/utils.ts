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
}

export type scaleInfoType = {
  calibrated: boolean;
  x: number;
  y: number;
  L: number; //store in ft
};

export type rectType = {
  x: number;
  y: number;
  width: number;
  height: number;
  key: number;
  rotation: number;
  deductRect: deductRectType[];
};

export type polygonType = {
  points: number[];
  key: number;
  deductRect: deductRectType[];
  group: number;
};

export type lengthType = {
  points: number[];
  key: number;
  scaleFactor: number;
};

export enum groupTypeName {
  shape = "shape",
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
};
export type activeGroupType = {
  shape: number;
  count: number;
};

export type deductRectType = {
  points: number[];
  key: number;
};

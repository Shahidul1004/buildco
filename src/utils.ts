export enum activeToolOptions {
  select = "select",
  scale = "scale",
  pan = "pan",
  rectangle = "rectangle",
  polygon = "polygon",
}

export type scaleInfoType = {
  calibrated: boolean;
  x: number;
  y: number;
  prevScale: number;
  L: number;
};

export type rectType = {
  x: number;
  y: number;
  width: number;
  height: number;
  key: number;
  scaleFactor: number;
  rotation: number;
};

export type polygonType = {
  points: number[];
  key: number;
  scaleFactor: number;
};

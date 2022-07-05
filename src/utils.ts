export enum activeToolOptions {
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

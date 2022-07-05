import { Stage } from "konva/lib/Stage";
import { RefObject, useRef, useState } from "react";
import { Image, Layer, Line, Rect } from "react-konva";
import ScaleMeasurementModal from "../modal/ScaleMeasurementModal";
import { scaleInfoType } from "../utils";
import { Html } from "react-konva-utils";
import { useTheme } from "@mui/material";

type propsType = {
  stageRef: RefObject<Stage>;
  scaleFactor: number;
  scaleInfo: scaleInfoType[][];
  changeScaleInfo: React.Dispatch<React.SetStateAction<scaleInfoType[][]>>;
  changeShowScaleModal: React.Dispatch<React.SetStateAction<boolean>>;
  enteredScale: any;
};

const Scale = ({
  stageRef,
  scaleFactor,
  scaleInfo,
  changeScaleInfo,
  changeShowScaleModal,
  enteredScale,
}: propsType): JSX.Element => {
  const theme = useTheme();
  const [scale, setScale] = useState<number[]>([]);

  const scalling = useRef<boolean>(false);
  const layers = stageRef.current?.getStage().getLayers()!;
  stageRef.current?.getStage().draggable(false);
  layers.forEach((layer) => {
    if (layer.attrs.name !== "imageLayer" && layer.attrs.name !== "scaleLayer")
      layer.hide();
  });

  const handleMouseDownImageLayer = (event: any) => {
    if (scalling.current === false) {
      console.log("down");
      scalling.current = true;
      event.target.getStage().container().style.cursor = "crosshair";
      const { x, y } = event.target.getStage().getPointerPosition();

      setScale([
        x - (stageRef.current?.attrs.x | 0),
        y - (stageRef.current?.attrs.y | 0),
      ]);
    } else if (scalling.current === true) {
      console.log("down2");
      scalling.current = false;
      event.target.getStage().container().style.cursor = "default";
      const { x, y } = event.target.getStage().getPointerPosition();
      setScale((prev: any) => {
        const temp = [...prev];
        return [
          temp[0],
          temp[1],
          x - (stageRef.current?.attrs.x | 0),
          y - (stageRef.current?.attrs.y | 0),
        ];
      });

      enteredScale.current = {
        x: Math.abs(scale[0] - (x - (stageRef.current?.attrs.x | 0))),
        y: Math.abs(scale[1] - (y - (stageRef.current?.attrs.y | 0))),
        scaleFactor: scaleFactor,
      };

      changeShowScaleModal(true);
    }
  };

  const handleMouseMoveImageLayer = (event: any) => {
    if (scale.length > 0 && scalling.current) {
      console.log("move");
      const { x, y } = event.target.getStage().getPointerPosition();
      setScale((prev: any) => {
        const temp = [...prev];
        return [
          temp[0],
          temp[1],
          x - (stageRef.current?.attrs.x | 0),
          y - (stageRef.current?.attrs.y | 0),
        ];
      });
    }
  };

  return (
    <>
      <Layer
        name="scaleLayer"
        onClick={handleMouseDownImageLayer}
        onMouseMove={handleMouseMoveImageLayer}
      >
        <Rect
          id="dummy-rect"
          height={stageRef.current?.getStage().attrs.height}
          width={stageRef.current?.getStage().attrs.width}
        />
        <Line
          points={scale.map((point) => point / scaleFactor)}
          stroke="green"
          strokeWidth={8}
        ></Line>
      </Layer>
    </>
  );
};

export default Scale;

import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import { RefObject, useRef, useState } from "react";
import { Layer, Rect, Text } from "react-konva";
import { activeToolOptions, scaleInfoType } from "../utils";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  activeTool: activeToolOptions;
  stageRef: RefObject<Stage>;
  scaleFactor: number;
  scaleInfo: scaleInfoType[][];
};

type rectType = {
  x: number;
  y: number;
  width: number;
  height: number;
  key: number;
  scaleFactor: number;
};

const getRectArea = (scaleObj: scaleInfoType, rect: rectType): string => {
  const { x, y, L, calibrated, prevScale } = scaleObj;
  const { height, width, scaleFactor: currScale } = rect;

  if (calibrated) {
    return `
      ${
        (height * width * L * L * prevScale * prevScale) /
        (currScale * currScale * (x * x + y * y))
      } ft2`;
  } else {
    return `${height * width}px`;
  }
};

const Rectangle = ({
  selectedPdf,
  selectedPage,
  scaleInfo,
  activeTool,
  stageRef,
  scaleFactor,
}: propsType): JSX.Element => {
  const [rect, setRect] = useState<rectType[]>([]);
  const [newRect, setNewRect] = useState<rectType[]>([]);
  const tooltipRef = useRef<Konva.Text>(null);

  const handleMouseDownRectLayer = (event: any) => {
    if (activeTool !== activeToolOptions.rectangle) return;
    console.log("down");
    if (newRect.length === 0) {
      const text = tooltipRef.current!;
      const { x, y } = event.target.getStage().getPointerPosition();
      console.log(
        x - (stageRef.current?.attrs.x | 0),
        y - (stageRef.current?.attrs.y | 0)
      );

      const newRectObj: rectType = {
        x: x - (stageRef.current?.attrs.x | 0),
        y: y - (stageRef.current?.attrs.y | 0),
        width: 0,
        height: 0,
        key: rect.length + 1,
        scaleFactor: scaleFactor,
      };
      text.text(
        getRectArea(scaleInfo[selectedPdf][selectedPage], newRectObj).toString()
      );
      text.position({
        x: (x - (stageRef.current?.attrs.x | 0)) / scaleFactor,
        y: (y - (stageRef.current?.attrs.y | 0)) / scaleFactor,
      });
      text.show();
      setNewRect([newRectObj]);
    }
  };

  const handleMouseMoveRectLayer = (event: any) => {
    console.log("move", newRect);
    if (newRect.length === 1) {
      const text = tooltipRef.current!;
      const sx = newRect[0].x;
      const sy = newRect[0].y;
      const key = newRect[0].key;
      const scaleFactor = newRect[0].scaleFactor;
      const { x, y } = event.target.getStage().getPointerPosition();
      const newRectObj: rectType = {
        x: sx,
        y: sy,
        width: x - (stageRef.current?.attrs.x | 0) - sx,
        height: y - (stageRef.current?.attrs.y | 0) - sy,
        key: key,
        scaleFactor: scaleFactor,
      };

      text.text(
        getRectArea(scaleInfo[selectedPdf][selectedPage], newRectObj).toString()
      );
      text.position({
        x: (x - (stageRef.current?.attrs.x | 0)) / scaleFactor,
        y: (y - (stageRef.current?.attrs.y | 0)) / scaleFactor,
      });
      setNewRect([newRectObj]);
    }
  };
  const handleMouseUpRectLayer = (event: any) => {
    console.log("up", newRect);
    if (newRect.length === 1) {
      const text = tooltipRef.current!;
      const sx = newRect[0].x;
      const sy = newRect[0].y;
      const key = newRect[0].key;
      const scaleFactor = newRect[0].scaleFactor;
      const { x, y } = event.target.getStage().getPointerPosition();

      const annotationToAdd = {
        x: sx,
        y: sy,
        width: x - (stageRef.current?.attrs.x | 0) - sx,
        height: y - (stageRef.current?.attrs.y | 0) - sy,
        key: key,
        scaleFactor: scaleFactor,
      };
      setRect((prev) => [...prev, annotationToAdd]);
      // rect.push(annotationToAdd);
      setNewRect([]);
      text.hide();
    }
  };

  const rectsToDraw = [...rect, ...newRect];

  return (
    <Layer
      name="rectLayer"
      onMouseDown={handleMouseDownRectLayer}
      onMouseMove={handleMouseMoveRectLayer}
      onMouseUp={handleMouseUpRectLayer}
    >
      <Rect
        id="dummy-rect"
        height={stageRef.current?.getStage().attrs.height}
        width={stageRef.current?.getStage().attrs.width}
      />
      <Text
        id="rect-tooltip"
        ref={tooltipRef}
        text=""
        fontFamily="Calibri"
        fontSize={30}
        padding={5}
        textFill="white"
        fill="black"
        alpha={1}
        visible={false}
      />
      {rectsToDraw.map((rect) => (
        <Rect
          x={rect.x / rect.scaleFactor}
          y={rect.y / rect.scaleFactor}
          width={rect.width / rect.scaleFactor}
          height={rect.height / rect.scaleFactor}
          fill="green"
          stroke="black"
          opacity={0.5}
        />
      ))}
    </Layer>
  );
};

export default Rectangle;

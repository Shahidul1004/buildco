import _ from "lodash";
import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import { RefObject, useEffect, useRef, useState } from "react";
import { Layer, Rect, Line, Text } from "react-konva";
import { activeToolOptions, lengthType, scaleInfoType } from "../utils";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  activeTool: activeToolOptions;
  stageRef: RefObject<Stage>;
  scaleFactor: number;
  scaleInfo: scaleInfoType[][];
  length: lengthType[];
  changeLength: React.Dispatch<React.SetStateAction<lengthType[][][]>>;
};

const Length = ({
  selectedPdf,
  selectedPage,
  scaleInfo,
  activeTool,
  stageRef,
  scaleFactor,
  length,
  changeLength,
}: propsType): JSX.Element => {
  const needCleanup = useRef<boolean>(false);
  const [newLength, setNewLength] = useState<lengthType[]>([]);
  const [movePoint, setMovePoint] = useState<number[]>([]);
  const layerRef = useRef<Konva.Layer>(null);
  const tooltipRef = useRef<Konva.Text>(null);

  useEffect(() => {
    const text = tooltipRef.current!;
    if (activeTool === activeToolOptions.length) {
      needCleanup.current = true;
      layerRef.current?.moveToTop();
    }
    return () => {
      if (needCleanup.current) {
        text.hide();
        setNewLength([]);
        setMovePoint([]);
      }
    };
  }, [activeTool]);

  const handleMouseDownLengthLayer = (event: any) => {
    if (activeTool !== activeToolOptions.length) return;
    if (newLength.length === 0) {
      const text = tooltipRef.current!;
      const { x, y } = event.target.getStage().getPointerPosition();

      const newLengthObj: lengthType = {
        points: [
          x - (stageRef.current?.attrs.x | 0),
          y - (stageRef.current?.attrs.y | 0),
        ],
        key: length.length + 1,
        scaleFactor: scaleFactor,
      };

      text.text(
        "length"
        //getPolyArea(scaleInfo[selectedPdf][selectedPage], newRectObj).toString()
      );
      text.position({
        x: (x - (stageRef.current?.attrs.x | 0)) / scaleFactor,
        y: (y - (stageRef.current?.attrs.y | 0)) / scaleFactor,
      });
      text.show();
      setNewLength([newLengthObj]);
    } else {
      const text = tooltipRef.current!;
      const { x, y } = event.target.getStage().getPointerPosition();

      const newLengthObj: lengthType = {
        ...newLength[0],
        points: [
          ...newLength[0].points,
          x - (stageRef.current?.attrs.x | 0),
          y - (stageRef.current?.attrs.y | 0),
        ],
        scaleFactor: scaleFactor,
      };

      text.text(
        "length"
        //getPolyArea(scaleInfo[selectedPdf][selectedPage], newRectObj).toString()
      );
      text.position({
        x: (x - (stageRef.current?.attrs.x | 0)) / scaleFactor,
        y: (y - (stageRef.current?.attrs.y | 0)) / scaleFactor,
      });
      setNewLength([newLengthObj]);
      setMovePoint([]);
    }
  };

  const handleMouseMoveLengthLayer = (event: any) => {
    if (activeTool !== activeToolOptions.length) return;
    if (newLength.length > 0) {
      const text = tooltipRef.current!;
      const { x, y } = event.target.getStage().getPointerPosition();

      setMovePoint([
        x - (stageRef.current?.attrs.x | 0),
        y - (stageRef.current?.attrs.y | 0),
      ]);

      const newLengthObj: lengthType = {
        ...newLength[0],
        points: [
          ...newLength[0].points,
          x - (stageRef.current?.attrs.x | 0),
          y - (stageRef.current?.attrs.y | 0),
        ],
        scaleFactor: scaleFactor,
      };

      text.text(
        "length"
        //getPolyArea(scaleInfo[selectedPdf][selectedPage], newRectObj).toString()
      );
      text.position({
        x: (x - (stageRef.current?.attrs.x | 0)) / scaleFactor,
        y: (y - (stageRef.current?.attrs.y | 0)) / scaleFactor,
      });
    }
  };

  const handleDblClickLengthLayer = (event: any) => {
    if (activeTool !== activeToolOptions.length) return;
    const text = tooltipRef.current!;
    text.hide();
    if (newLength.length > 0 && newLength[0].points.length >= 6) {
      const actualPoints = newLength[0].points;
      // const firstPoints = [actualPoints[0], actualPoints[1]]; //no need
      actualPoints.pop();
      actualPoints.pop();
      changeLength((prev) => {
        const prevCopy = _.cloneDeep(prev);
        const temp = prevCopy[selectedPdf][selectedPage];
        temp.push({
          ...newLength[0],
          points: [...actualPoints],
          scaleFactor: scaleFactor,
        });
        prevCopy[selectedPdf][selectedPage] = temp;
        return prevCopy;
      });
    }
    setMovePoint([]);
    setNewLength([]);
  };

  const Obj: lengthType[] = [];
  if (newLength.length === 1) {
    Obj.push({
      ...newLength[0],
      points: [...newLength[0].points, ...movePoint],
    });
  }

  const lengthsToDraw = [...length, ...Obj];

  return (
    <Layer
      name="lengthLayer"
      ref={layerRef}
      onMouseDown={handleMouseDownLengthLayer}
      onMouseMove={handleMouseMoveLengthLayer}
      onDblClick={handleDblClickLengthLayer}
    >
      <Rect
        id="dummy-rect"
        height={stageRef.current?.getStage().attrs.height}
        width={stageRef.current?.getStage().attrs.width}
      />
      <Text
        id="length-tooltip"
        ref={tooltipRef}
        text=""
        fontFamily="Calibri"
        fontSize={30}
        padding={5}
        textFill="white"
        fill="black"
        alpha={1}
        visible={false}
        zInde
      />
      {lengthsToDraw.map((length) => (
        <Line
          points={length.points.map((point) => point / length.scaleFactor)}
          fill="green"
          stroke="black"
          strokeWidth={5}
          opacity={0.5}
        />
      ))}
    </Layer>
  );
};

export default Length;

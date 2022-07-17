import _ from "lodash";
import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import { RefObject, useEffect, useRef, useState } from "react";
import { Layer, Rect, Line, Text } from "react-konva";
import {
  activeGroupType,
  activeToolOptions,
  groupType,
  lengthType,
  scaleInfoType,
  unitType,
} from "../utils";
import { getLength } from "../reusables/helpers";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  activeTool: activeToolOptions;
  stageRef: RefObject<Stage>;
  scaleFactor: number;
  scaleInfo: scaleInfoType[][];
  length: lengthType[];
  changeLength: React.Dispatch<React.SetStateAction<lengthType[][][]>>;
  group: groupType[];
  activeGroup: activeGroupType;
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
  group,
  activeGroup,
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
          x - (stageRef.current?.attrs.x | 0) / scaleFactor,
          y - (stageRef.current?.attrs.y | 0) / scaleFactor,
        ],
        key: length.length + 1,
        group: activeGroup.shape,
      };

      const { calibrated } = scaleInfo[selectedPdf][selectedPage];
      text.text(
        0 +
          (calibrated === false
            ? "px"
            : group.find((grp) => grp.id === activeGroup.shape)?.unit ===
              unitType.ft
            ? "ft"
            : "in")
      );
      text.position({
        x: (x - (stageRef.current?.attrs.x | 0)) / scaleFactor + 35,
        y: (y - (stageRef.current?.attrs.y | 0)) / scaleFactor,
      });
      text.show();
      setNewLength([newLengthObj]);
    } else {
      const text = tooltipRef.current!;
      const { x: cursorX, y: cursorY } = event.target
        .getStage()
        .getPointerPosition();

      const newLengthObj: lengthType = {
        ...newLength[0],
        points: [
          ...newLength[0].points,
          cursorX - (stageRef.current?.attrs.x | 0) / scaleFactor,
          cursorY - (stageRef.current?.attrs.y | 0) / scaleFactor,
        ],
      };

      const { x, y, L, calibrated } = scaleInfo[selectedPdf][selectedPage];
      const length = getLength(newLengthObj.points);
      if (calibrated === false) text.text(length + "px");
      else {
        const area = (length * L) / Math.sqrt(x * x + y * y);
        if (
          group.find((grp) => grp.id === activeGroup.shape)?.unit ===
          unitType.ft
        )
          text.text(area + "ft");
        else text.text(12 * area + "in");
      }

      text.position({
        x: (x - (stageRef.current?.attrs.x | 0)) / scaleFactor + 35,
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
      const { x: cursorX, y: cursorY } = event.target
        .getStage()
        .getPointerPosition();

      setMovePoint([
        cursorX - (stageRef.current?.attrs.x | 0) / scaleFactor,
        cursorY - (stageRef.current?.attrs.y | 0) / scaleFactor,
      ]);

      const newLengthObj: lengthType = {
        ...newLength[0],
        points: [
          ...newLength[0].points,
          cursorX - (stageRef.current?.attrs.x | 0) / scaleFactor,
          cursorY - (stageRef.current?.attrs.y | 0) / scaleFactor,
        ],
      };
      const { x, y, L, calibrated } = scaleInfo[selectedPdf][selectedPage];
      const length = getLength(newLengthObj.points);
      if (calibrated === false) text.text(length + "px");
      else {
        const area = (length * L) / Math.sqrt(x * x + y * y);
        if (
          group.find((grp) => grp.id === activeGroup.shape)?.unit ===
          unitType.ft
        )
          text.text(area + "ft");
        else text.text(12 * area + "in");
      }

      text.position({
        x: (x - (stageRef.current?.attrs.x | 0)) / scaleFactor + 35,
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
      actualPoints.pop();
      actualPoints.pop();
      changeLength((prev) => {
        const prevCopy = _.cloneDeep(prev);
        const temp = prevCopy[selectedPdf][selectedPage];
        temp.push({
          ...newLength[0],
          points: [...actualPoints],
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
          points={length.points}
          key={length.key}
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

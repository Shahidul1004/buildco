import _ from "lodash";
import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import { RefObject, useEffect, useRef, useState } from "react";
import { Layer, Rect, Shape, Text } from "react-konva";
import { activeToolOptions, polygonType, scaleInfoType } from "../utils";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  activeTool: activeToolOptions;
  stageRef: RefObject<Stage>;
  scaleFactor: number;
  scaleInfo: scaleInfoType[][];
  polygon: polygonType[];
  changePolygon: React.Dispatch<React.SetStateAction<polygonType[][][]>>;
};

const Polygon = ({
  selectedPdf,
  selectedPage,
  scaleInfo,
  activeTool,
  stageRef,
  scaleFactor,
  polygon,
  changePolygon,
}: propsType): JSX.Element => {
  const needCleanup = useRef<boolean>(false);
  const [newPolygon, setNewPolygon] = useState<polygonType[]>([]);
  const [movePoint, setMovePoint] = useState<number[]>([]);
  const layerRef = useRef<Konva.Layer>(null);
  const tooltipRef = useRef<Konva.Text>(null);

  useEffect(() => {
    const text = tooltipRef.current!;
    if (activeTool === activeToolOptions.polygon) {
      needCleanup.current = true;
      layerRef.current?.moveToTop();
    }
    return () => {
      if (needCleanup.current) {
        text.hide();
        setNewPolygon([]);
        setMovePoint([]);
      }
    };
  }, [activeTool]);

  const handleMouseDownPolygonLayer = (event: any) => {
    if (activeTool !== activeToolOptions.polygon) return;
    if (newPolygon.length === 0) {
      const text = tooltipRef.current!;
      const { x, y } = event.target.getStage().getPointerPosition();

      const newPolygonObj: polygonType = {
        points: [
          x - (stageRef.current?.attrs.x | 0),
          y - (stageRef.current?.attrs.y | 0),
        ],
        key: polygon.length + 1,
        scaleFactor: scaleFactor,
      };

      text.text(
        "area"
        //getPolyArea(scaleInfo[selectedPdf][selectedPage], newRectObj).toString()
      );
      text.position({
        x: (x - (stageRef.current?.attrs.x | 0)) / scaleFactor,
        y: (y - (stageRef.current?.attrs.y | 0)) / scaleFactor,
      });
      text.show();
      setNewPolygon([newPolygonObj]);
    } else {
      const text = tooltipRef.current!;
      const { x, y } = event.target.getStage().getPointerPosition();

      const newPolygonObj: polygonType = {
        ...newPolygon[0],
        points: [
          ...newPolygon[0].points,
          x - (stageRef.current?.attrs.x | 0),
          y - (stageRef.current?.attrs.y | 0),
        ],
        scaleFactor: scaleFactor,
      };

      text.text(
        "area"
        //getPolyArea(scaleInfo[selectedPdf][selectedPage], newRectObj).toString()
      );
      text.position({
        x: (x - (stageRef.current?.attrs.x | 0)) / scaleFactor,
        y: (y - (stageRef.current?.attrs.y | 0)) / scaleFactor,
      });
      setNewPolygon([newPolygonObj]);
      setMovePoint([]);
    }
  };

  const handleMouseMovePolygonLayer = (event: any) => {
    if (activeTool !== activeToolOptions.polygon) return;
    if (newPolygon.length > 0) {
      const text = tooltipRef.current!;
      const { x, y } = event.target.getStage().getPointerPosition();

      setMovePoint([
        x - (stageRef.current?.attrs.x | 0),
        y - (stageRef.current?.attrs.y | 0),
      ]);

      const newPolygonObj: polygonType = {
        ...newPolygon[0],
        points: [
          ...newPolygon[0].points,
          x - (stageRef.current?.attrs.x | 0),
          y - (stageRef.current?.attrs.y | 0),
        ],
        scaleFactor: scaleFactor,
      };

      text.text(
        "area"
        //getPolyArea(scaleInfo[selectedPdf][selectedPage], newRectObj).toString()
      );
      text.position({
        x: (x - (stageRef.current?.attrs.x | 0)) / scaleFactor,
        y: (y - (stageRef.current?.attrs.y | 0)) / scaleFactor,
      });
    }
  };

  const handleDblClickPolygonLayer = (event: any) => {
    if (activeTool !== activeToolOptions.polygon) return;
    const text = tooltipRef.current!;
    text.hide();
    if (newPolygon.length > 0 && newPolygon[0].points.length >= 8) {
      const actualPoints = newPolygon[0].points;
      // const firstPoints = [actualPoints[0], actualPoints[1]]; //no need
      actualPoints.pop();
      actualPoints.pop();
      changePolygon((prev) => {
        const prevCopy = _.cloneDeep(prev);
        const temp = prevCopy[selectedPdf][selectedPage];
        temp.push({
          ...newPolygon[0],
          points: [...actualPoints],
          scaleFactor: scaleFactor,
        });
        prevCopy[selectedPdf][selectedPage] = temp;
        return prevCopy;
      });
      setMovePoint([]);
      setNewPolygon([]);
    } else {
      setMovePoint([]);
      setNewPolygon([]);
    }
  };

  const Obj: polygonType[] = [];
  if (newPolygon.length === 1) {
    Obj.push({
      ...newPolygon[0],
      points: [...newPolygon[0].points, ...movePoint],
    });
  }

  const polygonsToDraw = [...polygon, ...Obj];

  return (
    <Layer
      name="polygonLayer"
      ref={layerRef}
      onMouseDown={handleMouseDownPolygonLayer}
      onMouseMove={handleMouseMovePolygonLayer}
      onDblClick={handleDblClickPolygonLayer}
    >
      <Rect
        id="dummy-rect"
        height={stageRef.current?.getStage().attrs.height}
        width={stageRef.current?.getStage().attrs.width}
      />
      <Text
        id="polygon-tooltip"
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
      {polygonsToDraw.map((polygon) => (
        <Shape
          fill="green"
          stroke="black"
          opacity={0.5}
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            ctx.moveTo(
              polygon.points[0] / polygon.scaleFactor,
              polygon.points[1] / polygon.scaleFactor
            );
            const points = polygon.points;
            for (let idx = 2; idx < points.length; idx += 2)
              ctx.lineTo(
                points[idx] / polygon.scaleFactor,
                points[idx + 1] / polygon.scaleFactor
              );

            ctx.closePath();
            ctx.fillStrokeShape(shape);
          }}
        />
      ))}
    </Layer>
  );
};

export default Polygon;

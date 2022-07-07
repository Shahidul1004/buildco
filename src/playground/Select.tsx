import _ from "lodash";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import { createRef, RefObject, useEffect, useRef } from "react";
import { Layer, Rect, Shape, Text, Transformer } from "react-konva";
import {
  activeToolOptions,
  polygonType,
  rectType,
  scaleInfoType,
} from "../utils";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  activeTool: activeToolOptions;
  stageRef: RefObject<Stage>;
  scaleFactor: number;
  scaleInfo: scaleInfoType[][];
  rect: rectType[];
  changeRect: React.Dispatch<React.SetStateAction<rectType[][][]>>;
  polygon: polygonType[];
  changePolygon: React.Dispatch<React.SetStateAction<polygonType[][][]>>;
};

const Select = ({
  selectedPdf,
  selectedPage,
  activeTool,
  stageRef,
  scaleFactor,
  scaleInfo,
  rect,
  changeRect,
  polygon,
  changePolygon,
}: propsType): JSX.Element => {
  const needCleanup = useRef<boolean>(false);
  const layerRef = useRef<Konva.Layer>(null);
  const tooltipRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const rectRef = useRef(rect.map(() => createRef<Konva.Rect>()));
  const polygonRef = useRef(polygon.map(() => createRef<Konva.Shape>()));

  useEffect(() => {
    const text = tooltipRef.current!;
    if (activeTool === activeToolOptions.select) {
      needCleanup.current = true;
      //   layerRef.current?.moveToTop();
    }
    return () => {
      if (needCleanup.current) {
        // text.hide();
        // setNewPolygon([]);
        // setMovePoint([]);
      }
    };
  }, [activeTool]);

  console.log(polygon);

  return (
    <Layer
      name="selectLayer"
      ref={layerRef}
      onClick={(e) => {
        if (e.target.attrs.id === "dummy-rect") {
          trRef.current!.nodes([]);
          trRef.current!.getLayer()!.batchDraw();
        }
      }}
    >
      <Rect
        id="dummy-rect"
        height={stageRef.current?.getStage().attrs.height}
        width={stageRef.current?.getStage().attrs.width}
      />
      <Text
        id="select-tooltip"
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
      {rect.map((item, index) => (
        <Rect
          ref={rectRef.current[index]}
          key={item.key}
          x={item.x / item.scaleFactor}
          y={item.y / item.scaleFactor}
          width={item.width / item.scaleFactor}
          height={item.height / item.scaleFactor}
          rotation={item.rotation}
          fill="green"
          // stroke="black"
          opacity={0.5}
          draggable={true}
          onMouseOver={() => {
            trRef.current!.nodes([rectRef.current[index].current!]);
            trRef.current!.getLayer()!.batchDraw();
          }}
          onClick={() => {
            trRef.current!.nodes([rectRef.current[index].current!]);
            trRef.current!.getLayer()!.batchDraw();
          }}
          onDragEnd={(e: any) => {
            changeRect((prev) => {
              const prevCopy = _.cloneDeep(prev);
              const temp = prevCopy[selectedPdf][selectedPage];
              temp.splice(index, 1, {
                ...item,
                x: e.target.x() * item.scaleFactor,
                y: e.target.y() * item.scaleFactor,
              });
              return prevCopy;
            });
          }}
          onTransformEnd={(e) => {
            const x = e.target.attrs.x * item.scaleFactor;
            const y = e.target.attrs.y * item.scaleFactor;
            const height =
              e.target.attrs.height * e.target.attrs.scaleX * item.scaleFactor;
            const width =
              e.target.attrs.width * e.target.attrs.scaleY * item.scaleFactor;
            const rotation = e.target.attrs.rotation;

            changeRect((prev) => {
              const prevCopy = _.cloneDeep(prev);
              const temp = prevCopy[selectedPdf][selectedPage];
              temp.splice(index, 1, {
                ...item,
                x,
                y,
                height,
                width,
                rotation,
              });
              return prevCopy;
            });
            e.target._clearTransform();
            e.target.clearCache();
          }}
        />
      ))}
      {polygon.map((item, index) => (
        <Shape
          ref={polygonRef.current[index]}
          key={item.key}
          fill="green"
          // stroke="black"
          opacity={0.5}
          sceneFunc={(ctx, shape) => {
            ctx.beginPath();
            ctx.moveTo(
              item.points[0] / item.scaleFactor,
              item.points[1] / item.scaleFactor
            );
            const points = item.points;
            for (let idx = 2; idx < points.length; idx += 2)
              ctx.lineTo(
                points[idx] / item.scaleFactor,
                points[idx + 1] / item.scaleFactor
              );

            ctx.closePath();
            ctx.fillStrokeShape(shape);
          }}
          draggable={true}
          onMouseOver={() => {
            polygonRef.current[index].current!.getSelfRect = function () {
              const Xs = item.points.filter((num, indx) => indx % 2 === 0);
              const Ys = item.points.filter((num, indx) => indx % 2 === 1);
              const Xmin = Math.min(...Xs);
              const Xmax = Math.max(...Xs);
              const Ymin = Math.min(...Ys);
              const Ymax = Math.max(...Ys);

              return {
                x: Xmin / item.scaleFactor,
                y: Ymin / item.scaleFactor,
                width: (Xmax - Xmin) / item.scaleFactor,
                height: (Ymax - Ymin) / item.scaleFactor,
              };
            };
            trRef.current!.nodes([polygonRef.current[index].current!]);
            trRef.current!.getLayer()!.batchDraw();
          }}
          onClick={() => {
            polygonRef.current[index].current!.getSelfRect = function () {
              const Xs = item.points.filter((num, indx) => indx % 2 === 0);
              const Ys = item.points.filter((num, indx) => indx % 2 === 1);
              const Xmin = Math.min(...Xs);
              const Xmax = Math.max(...Xs);
              const Ymin = Math.min(...Ys);
              const Ymax = Math.max(...Ys);

              return {
                x: Xmin / item.scaleFactor,
                y: Ymin / item.scaleFactor,
                width: (Xmax - Xmin) / item.scaleFactor,
                height: (Ymax - Ymin) / item.scaleFactor,
              };
            };
            trRef.current!.nodes([polygonRef.current[index].current!]);
            trRef.current!.getLayer()!.batchDraw();
          }}
          onDragEnd={(e: KonvaEventObject<DragEvent>) => {
            const x = e.target.x();
            const y = e.target.y();
            changePolygon((prev) => {
              const prevCopy = _.cloneDeep(prev);
              const temp = prevCopy[selectedPdf][selectedPage];
              const points = temp[index];

              temp.splice(index, 1, {
                ...points,
                points: points.points.map((pt, idx) => {
                  if (idx % 2 === 0) return pt + x * item.scaleFactor;
                  return pt + y * item.scaleFactor;
                }),
              });
              return prevCopy;
            });
            e.target._clearTransform();
            e.target.clearCache();
          }}
          onTransformEnd={(e) => {
            const rotation = e.target.attrs.rotation;
            const transformedPoints: number[] = [];
            for (let i = 0; i < item.points.length; i += 2) {
              const { x, y } = e.target.getTransform().point({
                x: item.points[i] / item.scaleFactor,
                y: item.points[i + 1] / item.scaleFactor,
              });
              transformedPoints.push(x * item.scaleFactor);
              transformedPoints.push(y * item.scaleFactor);
            }
            changePolygon((prev) => {
              const prevCopy = _.cloneDeep(prev);
              const temp = prevCopy[selectedPdf][selectedPage];
              temp.splice(index, 1, {
                ...item,
                points: transformedPoints,
              });
              return prevCopy;
            });
            e.target._clearTransform();
            e.target.clearCache();
          }}
        />
      ))}
      <Transformer ref={trRef} />
    </Layer>
  );
};
export default Select;

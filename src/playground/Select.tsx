import _ from "lodash";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Stage } from "konva/lib/Stage";
import { createRef, RefObject, useEffect, useRef } from "react";
import { Group, Layer, Rect, Shape, Text, Transformer } from "react-konva";
import {
  activeToolOptions,
  deductRectType,
  lengthType,
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
  length: lengthType[];
  changeLength: React.Dispatch<React.SetStateAction<lengthType[][][]>>;
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
  length,
  changeLength,
}: propsType): JSX.Element => {
  const needCleanup = useRef<boolean>(false);
  const layerRef = useRef<Konva.Layer>(null);
  const tooltipRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const polygonRef = useRef(polygon.map(() => createRef<Konva.Shape>()));
  const lengthRef = useRef(length.map(() => createRef<Konva.Line>()));

  let deltaX = 0,
    deltaY = 0,
    transformer: any = null,
    transformerIndex = -1;
  const getTransformedPoint = (p1: number, p2: number, idx: number) => {
    if (transformerIndex !== -1 && transformerIndex !== idx)
      return { x: p1, y: p2 };
    let ptX = p1,
      ptY = p2;
    if (transformer) {
      const { x, y } = transformer.point({
        x: ptX,
        y: ptY,
      });
      ptX = x;
      ptY = y;
    }
    return { x: ptX + deltaX, y: ptY + deltaY };
  };

  useEffect(() => {
    const text = tooltipRef.current!;
    if (activeTool === activeToolOptions.select) {
      needCleanup.current = true;
      //   layerRef.current?.moveToTop();
    }
    return () => {
      if (needCleanup.current) {
        text.hide();
      }
    };
  }, [activeTool]);

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

      {polygon.map((item, index) => (
        <Group
          clipFunc={(ctx) => {
            ctx.beginPath();
            const { x, y } = getTransformedPoint(
              item.points[0],
              item.points[1],
              index
            );
            ctx.moveTo(x, y);
            for (let idx = 2; idx < item.points.length; idx += 2) {
              const { x, y } = getTransformedPoint(
                item.points[idx],
                item.points[idx + 1],
                index
              );
              ctx.lineTo(x, y);
            }
            if (item.points.length <= 4) {
              const { x, y } = getTransformedPoint(
                item.points[2],
                item.points[2 + 1] + 0.1,
                index
              );
              ctx.lineTo(x, y);
            }
            ctx.closePath();

            for (let idx = 0; idx < item.deductRect.length; idx++) {
              const points = item.deductRect[idx].points;
              const len = points.length;
              const { x, y } = getTransformedPoint(
                points[len - 2],
                points[len - 1],
                index
              );
              ctx.moveTo(x, y);
              for (let idx = len - 3; idx > 0; idx -= 2) {
                const { x, y } = getTransformedPoint(
                  points[idx - 1],
                  points[idx],
                  index
                );
                ctx.lineTo(x, y);
              }
              ctx.closePath();
            }
          }}
        >
          <Shape
            ref={polygonRef.current[index]}
            key={item.key}
            fill="green"
            // stroke="black"
            opacity={0.5}
            sceneFunc={(ctx, shape) => {
              ctx.beginPath();
              ctx.moveTo(item.points[0], item.points[1]);
              const points = item.points;
              for (let idx = 2; idx < points.length; idx += 2)
                ctx.lineTo(points[idx], points[idx + 1]);

              ctx.closePath();
              ctx.fillStrokeShape(shape);
            }}
            draggable={true}
            onClick={() => {
              polygonRef.current[index].current!.getSelfRect = function () {
                const Xs = item.points.filter((num, indx) => indx % 2 === 0);
                const Ys = item.points.filter((num, indx) => indx % 2 === 1);
                const Xmin = Math.min(...Xs);
                const Xmax = Math.max(...Xs);
                const Ymin = Math.min(...Ys);
                const Ymax = Math.max(...Ys);

                return {
                  x: Xmin,
                  y: Ymin,
                  width: Xmax - Xmin,
                  height: Ymax - Ymin,
                };
              };
              trRef.current!.nodes([polygonRef.current[index].current!]);
              trRef.current!.getLayer()!.batchDraw();
            }}
            onDragStart={(e) => {
              transformerIndex = index;
              transformer = null;
            }}
            onDragMove={(e: KonvaEventObject<DragEvent>) => {
              deltaX = e.target.x();
              deltaY = e.target.y();
            }}
            onDragEnd={(e: KonvaEventObject<DragEvent>) => {
              const x = e.target.x();
              const y = e.target.y();

              changePolygon((prev) => {
                const prevCopy = _.cloneDeep(prev);
                const polygons = prevCopy[selectedPdf][selectedPage];
                const currentPolygon = polygons[index];

                const deducts = currentPolygon.deductRect;
                const finalDeducts: deductRectType[] = deducts.map((deduct) => {
                  const key = deduct.key;
                  const points = deduct.points;

                  return {
                    key: key,
                    points: points.map((pt, index) => {
                      if (index % 2 === 0) return pt + x;
                      else return pt + y;
                    }),
                  };
                });
                polygons.splice(index, 1, {
                  ...currentPolygon,
                  deductRect: finalDeducts,
                  points: currentPolygon.points.map((pt, idx) => {
                    if (idx % 2 === 0) return pt + x;
                    return pt + y;
                  }),
                });
                return prevCopy;
              });
              e.target._clearTransform();
              e.target.clearCache();
            }}
            onTransformStart={(e) => {
              transformerIndex = index;
              deltaX = 0;
              deltaY = 0;
            }}
            onTransform={(e) => {
              transformer = e.target.getTransform();
            }}
            onTransformEnd={(e) => {
              const transformedPoints: number[] = [];
              for (let i = 0; i < item.points.length; i += 2) {
                const { x, y } = e.target.getTransform().point({
                  x: item.points[i],
                  y: item.points[i + 1],
                });
                transformedPoints.push(x);
                transformedPoints.push(y);
              }
              const transformedDeducts: deductRectType[] = item.deductRect.map(
                (deduct) => {
                  const key = deduct.key;
                  const points = deduct.points;

                  for (let i = 0; i < points.length; i += 2) {
                    const { x, y } = e.target.getTransform().point({
                      x: points[i],
                      y: points[i + 1],
                    });
                    points[i] = x;
                    points[i + 1] = y;
                  }

                  return {
                    key: key,
                    points: points,
                  };
                }
              );
              changePolygon((prev) => {
                const prevCopy = _.cloneDeep(prev);
                const temp = prevCopy[selectedPdf][selectedPage];
                temp.splice(index, 1, {
                  ...item,
                  points: transformedPoints,
                  deductRect: transformedDeducts,
                });
                return prevCopy;
              });
              e.target._clearTransform();
              e.target.clearCache();
            }}
          />
        </Group>
      ))}
      {length.map((item, index) => (
        <Shape
          ref={lengthRef.current[index]}
          key={item.key}
          stroke="black"
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

            ctx.fillStrokeShape(shape);
          }}
          draggable={true}
          onMouseOver={() => {
            lengthRef.current[index].current!.getSelfRect = function () {
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
            trRef.current!.nodes([lengthRef.current[index].current!]);
            trRef.current!.getLayer()!.batchDraw();
          }}
          onClick={() => {
            lengthRef.current[index].current!.getSelfRect = function () {
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
            trRef.current!.nodes([lengthRef.current[index].current!]);
            trRef.current!.getLayer()!.batchDraw();
          }}
          onDragEnd={(e: KonvaEventObject<DragEvent>) => {
            const x = e.target.x();
            const y = e.target.y();
            changeLength((prev) => {
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
            const transformedPoints: number[] = [];
            for (let i = 0; i < item.points.length; i += 2) {
              const { x, y } = e.target.getTransform().point({
                x: item.points[i] / item.scaleFactor,
                y: item.points[i + 1] / item.scaleFactor,
              });
              transformedPoints.push(x * item.scaleFactor);
              transformedPoints.push(y * item.scaleFactor);
            }
            changeLength((prev) => {
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

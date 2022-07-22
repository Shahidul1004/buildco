import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import _ from "lodash";
import { RefObject, useEffect, useRef } from "react";
import { Circle, Layer, Rect, RegularPolygon } from "react-konva";
import { rgba2hex } from "../reusables/helpers";
import {
  activeGroupType,
  activeToolOptions,
  countType,
  groupType,
  iconType,
  scaleInfoType,
} from "../utils";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  activeTool: activeToolOptions;
  stageRef: RefObject<Stage>;
  scaleFactor: number;
  scaleInfo: scaleInfoType[][];
  count: countType[];
  changeCount: React.Dispatch<React.SetStateAction<countType[][][]>>;
  group: groupType[];
  activeGroup: activeGroupType;
};

const Count = ({
  selectedPdf,
  selectedPage,
  scaleInfo,
  activeTool,
  stageRef,
  scaleFactor,
  count,
  changeCount,
  group,
  activeGroup,
}: propsType): JSX.Element => {
  const needCleanup = useRef<boolean>(false);
  const layerRef = useRef<Konva.Layer>(null);

  useEffect(() => {
    if (activeTool === activeToolOptions.count) {
      needCleanup.current = true;
      layerRef.current?.moveToTop();
    }
  }, [activeTool]);

  const handleMouseDownCountLayer = (event: any) => {
    if (activeTool !== activeToolOptions.count) return;

    const { x, y } = event.target.getStage().getPointerPosition();

    const newCountObj: countType = {
      points: [
        (x - (stageRef.current?.attrs.x | 0)) / scaleFactor,
        (y - (stageRef.current?.attrs.y | 0)) / scaleFactor,
      ],
      key: count.length + 1,
      group: activeGroup.count,
      hover: false,
      type: group.find((grp) => grp.id === activeGroup.count)?.icon!,
    };

    changeCount((prev) => {
      const prevCopy = _.cloneDeep(prev);
      const temp = prevCopy[selectedPdf][selectedPage];
      temp.push(newCountObj);
      prevCopy[selectedPdf][selectedPage] = temp;
      return prevCopy;
    });
  };

  return (
    <Layer
      name="countLayer"
      ref={layerRef}
      onMouseDown={handleMouseDownCountLayer}
    >
      <Rect
        id="dummy-rect"
        height={stageRef.current?.getStage().attrs.height}
        width={stageRef.current?.getStage().attrs.width}
      />

      {count.map((cnt, index) => (
        <>
          {cnt.type === iconType.circle ? (
            <Circle
              key={cnt.key}
              x={cnt.points[0]}
              y={cnt.points[1]}
              radius={10}
              fill={
                cnt.hover
                  ? "pink"
                  : rgba2hex(group.find((grp) => grp.id === cnt.group)?.color)
              }
              stroke="black"
              strokeWidth={1 / scaleFactor}
              opacity={0.5}
            />
          ) : cnt.type === iconType.triangle ? (
            <RegularPolygon
              key={cnt.key}
              sides={3}
              x={cnt.points[0]}
              y={cnt.points[1]}
              radius={10}
              fill={
                cnt.hover
                  ? "pink"
                  : rgba2hex(group.find((grp) => grp.id === cnt.group)?.color)
              }
              stroke="black"
              strokeWidth={1 / scaleFactor}
              opacity={0.5}
            />
          ) : (
            <RegularPolygon
              key={cnt.key}
              sides={4}
              x={cnt.points[0]}
              y={cnt.points[1]}
              radius={10}
              fill={
                cnt.hover
                  ? "pink"
                  : rgba2hex(group.find((grp) => grp.id === cnt.group)?.color)
              }
              stroke="black"
              strokeWidth={1 / scaleFactor}
              opacity={0.5}
            />
          )}
        </>
      ))}
    </Layer>
  );
};

export default Count;
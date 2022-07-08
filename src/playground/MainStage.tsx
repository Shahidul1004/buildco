import Konva from "konva";
import { useRef, useState } from "react";
import { Image, Layer, Stage } from "react-konva";
import ScaleMeasurementModal from "../modal/ScaleMeasurementModal";
import {
  activeToolOptions,
  lengthType,
  polygonType,
  rectType,
  scaleInfoType,
} from "../utils";
import Length from "./Length";
import Polygon from "./Polygon";
import Rectangle from "./Rectangle";
import Scale from "./Scale";
import Select from "./Select";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  blob: HTMLImageElement;
  zoomLevel: number;
  activeTool: activeToolOptions;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
  scaleInfo: scaleInfoType[][];
  changeScaleInfo: React.Dispatch<React.SetStateAction<scaleInfoType[][]>>;
  rect: rectType[];
  changeRect: React.Dispatch<React.SetStateAction<rectType[][][]>>;
  polygon: polygonType[];
  changePolygon: React.Dispatch<React.SetStateAction<polygonType[][][]>>;
  length: lengthType[];
  changeLength: React.Dispatch<React.SetStateAction<lengthType[][][]>>;
};

const MainStage = ({
  selectedPdf,
  selectedPage,
  blob,
  zoomLevel,
  activeTool,
  changeActiveTool,
  scaleInfo,
  changeScaleInfo,
  rect,
  changeRect,
  polygon,
  changePolygon,
  length,
  changeLength,
}: propsType): JSX.Element => {
  const stageRef = useRef<Konva.Stage>(null);

  const enteredScale = useRef<any>();
  const [showScaleModal, setShowScaleModal] = useState<boolean>(false);

  const scaleFactor =
    zoomLevel >= 50
      ? 0.5 * (1 + (zoomLevel - 50) / 50.0)
      : 0.5 * (1 + (0.5 * (zoomLevel - 50)) / 50.0);

  if (activeTool === activeToolOptions.pan) {
    stageRef.current?.getStage().draggable(true);
  } else {
    stageRef.current?.getStage().draggable(false);
  }

  return (
    <>
      <Stage
        width={Math.max(blob.width, window.innerWidth)}
        height={Math.max(blob.height, window.innerHeight)}
        scaleX={scaleFactor}
        scaleY={scaleFactor}
        ref={stageRef}
      >
        <Layer name="imageLayer">
          <Image id="image" image={blob} />
        </Layer>
        {[activeToolOptions.scale].includes(activeTool) && (
          <Scale
            scaleFactor={scaleFactor}
            stageRef={stageRef}
            scaleInfo={scaleInfo}
            changeScaleInfo={changeScaleInfo}
            changeShowScaleModal={setShowScaleModal}
            enteredScale={enteredScale}
            activeTool={activeTool}
          />
        )}
        {[
          activeToolOptions.pan,
          activeToolOptions.rectangle,
          activeToolOptions.polygon,
          activeToolOptions.length,
        ].includes(activeTool) && (
          <Rectangle
            selectedPdf={selectedPdf}
            selectedPage={selectedPage}
            scaleInfo={scaleInfo}
            stageRef={stageRef}
            scaleFactor={scaleFactor}
            activeTool={activeTool}
            rect={rect}
            changeRect={changeRect}
          />
        )}
        {[
          activeToolOptions.pan,
          activeToolOptions.rectangle,
          activeToolOptions.polygon,
          activeToolOptions.length,
        ].includes(activeTool) && (
          <Polygon
            selectedPdf={selectedPdf}
            selectedPage={selectedPage}
            scaleInfo={scaleInfo}
            stageRef={stageRef}
            scaleFactor={scaleFactor}
            activeTool={activeTool}
            polygon={polygon}
            changePolygon={changePolygon}
          />
        )}

        {[
          activeToolOptions.pan,
          activeToolOptions.rectangle,
          activeToolOptions.polygon,
          activeToolOptions.length,
        ].includes(activeTool) && (
          <Length
            selectedPdf={selectedPdf}
            selectedPage={selectedPage}
            scaleInfo={scaleInfo}
            stageRef={stageRef}
            scaleFactor={scaleFactor}
            activeTool={activeTool}
            length={length}
            changeLength={changeLength}
          />
        )}

        {[activeToolOptions.select].includes(activeTool) && (
          <Select
            selectedPdf={selectedPdf}
            selectedPage={selectedPage}
            activeTool={activeTool}
            stageRef={stageRef}
            scaleFactor={scaleFactor}
            scaleInfo={scaleInfo}
            rect={rect}
            changeRect={changeRect}
            polygon={polygon}
            changePolygon={changePolygon}
            length={length}
            changeLength={changeLength}
          />
        )}
      </Stage>
      {showScaleModal && (
        <ScaleMeasurementModal
          selectedPdf={selectedPdf}
          selectedPage={selectedPage}
          enteredScale={enteredScale.current}
          scaleInfo={scaleInfo}
          changeScaleInfo={changeScaleInfo}
          changeShowScaleModal={setShowScaleModal}
        />
      )}
    </>
  );
};

export default MainStage;

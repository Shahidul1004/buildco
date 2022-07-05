import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import { Image, Layer, Line, Rect, Stage, Transformer } from "react-konva";
import ScaleMeasurementModal from "../modal/ScaleMeasurementModal";
import { activeToolOptions, scaleInfoType } from "../utils";
import Rectangle from "./Rectangle";
import Scale from "./Scale";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  blob: HTMLImageElement;
  zoomLevel: number;
  activeTool: activeToolOptions;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
  scaleInfo: scaleInfoType[][];
  changeScaleInfo: React.Dispatch<React.SetStateAction<scaleInfoType[][]>>;
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
}: propsType): JSX.Element => {
  const stageRef = useRef<Konva.Stage>(null);
  const imageLayerRef = useRef<Konva.Layer>(null);

  const enteredScale = useRef<any>();
  const [showScaleModal, setShowScaleModal] = useState<boolean>(false);

  const scaleFactor =
    zoomLevel >= 50
      ? 0.5 * (1 + (zoomLevel - 50) / 50.0)
      : 0.5 * (1 + (0.5 * (zoomLevel - 50)) / 50.0);
  console.log("scaleFactor", scaleFactor);

  if (activeTool === activeToolOptions.pan) {
    stageRef.current?.getStage().draggable(true);
    stageRef.current
      ?.getStage()
      .getLayers()
      .map((layer) => layer.show());
  } else {
    stageRef.current?.getStage().draggable(false);
  }

  return (
    <>
      <Stage
        width={blob.width}
        height={blob.height}
        scaleX={scaleFactor}
        scaleY={scaleFactor}
        ref={stageRef}
      >
        <Layer name="imageLayer" ref={imageLayerRef}>
          <Image id="image" image={blob} />
        </Layer>
        {activeTool === activeToolOptions.scale && (
          <Scale
            scaleFactor={scaleFactor}
            stageRef={stageRef}
            scaleInfo={scaleInfo}
            changeScaleInfo={changeScaleInfo}
            changeShowScaleModal={setShowScaleModal}
            enteredScale={enteredScale}
          />
        )}

        {activeTool !== activeToolOptions.scale && (
          <Rectangle
            selectedPdf={selectedPdf}
            selectedPage={selectedPage}
            scaleInfo={scaleInfo}
            stageRef={stageRef}
            scaleFactor={scaleFactor}
            activeTool={activeTool}
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

// var stageWidth = window.innerWidth;
// var stageHeight = 300;
// var viewportPadding = 10;
// var stage = new Konva.Stage({

// 		x: 0,
// 		y: 0,
//     container: 'container',
//     width: stageWidth,
//     height: stageHeight
// });
// var zoom = 0.5;
// stage.scaleX(zoom);
// stage.scaleY(zoom);
// stage.draw();

// var layer = new Konva.Layer();
// var background = new Konva.Rect({
// 		x: 0,
// 		y: 0,
// 		fill: 'red',
//     width: stageWidth,
//     height: stageHeight,
// });

// var img = new Image();

// img.onload = function() {
// 		var imageWidth = stageWidth - (viewportPadding * 2);
//   	var ratio = imageWidth / this.naturalWidth;
//   	var imageHeight = this.naturalHeight * ratio;
//     var floorImage = new Konva.Image({
//     		x: viewportPadding,
//         y: viewportPadding,
//         image: img,
//         width: imageWidth,
//         height: imageHeight,
//     });
//     layer.add(floorImage);

//     background.height(imageHeight + (viewportPadding * 2));
//     stage.draw();
// };

// img.src = 'https://dspncdn.com/a1/media/originals/fa/06/eb/fa06ebac2b188e309cff600400d34e41.jpg';

// layer.add(background);
// stage.add(layer);
// stage.draw();

// stage.on('wheel', function(e) {
//   var deltaX = e.evt.deltaX;
//   var deltaY = e.evt.deltaY;
//   var scrollStep = Math.abs(deltaY * 1);

//     if (deltaY < 0) {
//       var yPos = layer.y() + scrollStep;

//       if (yPos > 0) {
//       	yPos = 0;
//       }

//       layer.y(yPos);
//       layer.batchDraw();

//     } else if (deltaY > 0) {
//       var yPos = layer.y() - scrollStep;
//     	var remainingDistance = background.height() - stage.height() / stage.scaleY();

//       if (yPos < -remainingDistance) {
//         yPos = -remainingDistance;
//       }

//       layer.y(yPos);
//       layer.batchDraw();
//     }
// });

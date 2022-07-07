import { Box, BoxProps, styled } from "@mui/material";
import * as pdfjsLib from "pdfjs-dist";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../Context";
import {
  activeToolOptions,
  polygonType,
  rectType,
  scaleInfoType,
} from "../utils";
import MainStage from "./MainStage";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  page: pdfjsLib.PDFPageProxy;
  zoomLevel: number;
  activeTool: activeToolOptions;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
  scaleInfo: scaleInfoType[][];
  changeScaleInfo: React.Dispatch<React.SetStateAction<scaleInfoType[][]>>;
  rect: rectType[];
  changeRect: React.Dispatch<React.SetStateAction<rectType[][][]>>;
  polygon: polygonType[];
  changePolygon: React.Dispatch<React.SetStateAction<polygonType[][][]>>;
};

const Playground = ({
  selectedPdf,
  selectedPage,
  page,
  zoomLevel,
  activeTool,
  changeActiveTool,
  scaleInfo,
  changeScaleInfo,
  rect,
  changeRect,
  polygon,
  changePolygon,
}: propsType): JSX.Element => {
  const context = useContext(Context);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const [blob, setBlob] = useState<HTMLImageElement>();

  useEffect(() => {
    const createBlob = async () => {
      const canvas = hiddenCanvasRef.current!;
      const ctx = canvas.getContext("2d")!;

      const viewport = page.getViewport({ scale: 2 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const promises: Promise<Blob>[] = [];
      await page
        .render({
          canvasContext: ctx,
          viewport: viewport,
        })
        .promise.then(() => {
          const promise = new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
              function (blob) {
                resolve(blob as Blob);
              },
              `image/png`,
              1
            );
          });
          promises.push(promise);
        });
      Promise.all(promises).then(async (blob) => {
        const img = new window.Image();
        img.src = URL.createObjectURL(blob[0]);
        img.onload = () => {
          setBlob(img);
        };
      });
    };
    createBlob();
  }, [page]);
  return (
    <>
      <PlaygroundContainer navHeight={context.navHeight}>
        {blob && (
          <MainStage
            selectedPdf={selectedPdf}
            selectedPage={selectedPage}
            blob={blob}
            zoomLevel={zoomLevel}
            activeTool={activeTool}
            changeActiveTool={changeActiveTool}
            scaleInfo={scaleInfo}
            changeScaleInfo={changeScaleInfo}
            rect={rect}
            changeRect={changeRect}
            polygon={polygon}
            changePolygon={changePolygon}
          />
        )}
      </PlaygroundContainer>
      <canvas style={{ display: "none" }} ref={hiddenCanvasRef} />
    </>
  );
};

export default Playground;

interface CustomBoxProps extends BoxProps {
  navHeight: string;
}
const PlaygroundContainer = styled(Box)<CustomBoxProps>(
  ({ theme, navHeight }) => ({
    position: "fixed",
    top: navHeight,
    left: 0,
    width: "100vw",
    height: `calc(100vh - ${navHeight})`,
    backgroundColor: theme.color.secondary,
  })
);

import { Box } from "@mui/material";
import { useRef, useState } from "react";
import Header from "./header/Header";
import {
  getFileName,
  PdfjsDocument,
  pdfjsExtractPages,
} from "./reusables/helpers";
import * as pdfjsLib from "pdfjs-dist";
import PreviewSection from "./preview/PreviewSection";
import Playground from "./playground/Playground";
import {
  activeToolOptions,
  lengthType,
  polygonType,
  rectType,
  scaleInfoType,
} from "./utils";
import LoadingModal from "./modal/LoadingModal";

const Homepage = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);
  const uploadedFiles = useRef<File[]>([]);
  const fileName = useRef<string[]>([]);
  const pdfDocs = useRef<pdfjsLib.PDFDocumentProxy[]>([]);
  const pdfPages = useRef<pdfjsLib.PDFPageProxy[][]>([]);
  const [pdfOrder, setPdfOrder] = useState<number[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<number>(-1);
  const [selectedPage, setSelectedPage] = useState<number[]>([]);
  const [zoomLevel, setZoomLevel] = useState<number[][]>([]);
  const [activeTool, setActiveTool] = useState<activeToolOptions>(
    activeToolOptions.pan
  );
  const [scaleInfo, setScaleInfo] = useState<scaleInfoType[][]>([]);

  const [rect, setRect] = useState<rectType[][][]>([]);
  const [polygon, setPolygon] = useState<polygonType[][][]>([]);
  const [length, setLength] = useState<lengthType[][][]>([]);

  //simplified values to use

  const fileUploadHandler = async (files: FileList) => {
    setLoading(true);
    const names = await getFileName(files);
    const docs = await PdfjsDocument(files);
    const pages: pdfjsLib.PDFPageProxy[][] = [];
    const newZoomLevel: number[][] = [];
    const newScaleInfo: scaleInfoType[][] = [];
    const newRect: rectType[][][] = [];
    const newPolygon: polygonType[][][] = [];
    const newLength: lengthType[][][] = [];
    for (const doc of docs) {
      pages.push(
        await pdfjsExtractPages(
          doc,
          [...Array(doc.numPages).keys()].map((e) => e + 1)
        )
      );
      newZoomLevel.push([...Array(doc.numPages).keys()].map((e) => 50));
      newScaleInfo.push(
        [...Array(doc.numPages).keys()].map((e) => {
          return {
            calibrated: false,
            x: 1,
            y: 0,
            prevScale: 0.5,
            L: 1,
          };
        })
      );

      newRect.push([...Array(doc.numPages).keys()].map((_e) => []));
      newPolygon.push([...Array(doc.numPages).keys()].map((e) => []));
      newLength.push([...Array(doc.numPages).keys()].map((e) => []));
    }
    const prevCount = uploadedFiles.current.length;
    uploadedFiles.current.push(...files);
    fileName.current.push(...names);
    pdfDocs.current.push(...docs);
    pdfPages.current.push(...pages);

    setRect((prev) => [...prev, ...newRect]);
    setPolygon((prev) => [...prev, ...newPolygon]);
    setLength((prev) => [...prev, ...newLength]);
    setScaleInfo((prev) => [...prev, ...newScaleInfo]);
    setZoomLevel((prev) => [...prev, ...newZoomLevel]);
    setSelectedPage((prev) => [
      ...prev,
      ...[...Array(files.length).keys()].map((ind) => 0),
    ]);

    setPdfOrder((prev) => [
      ...prev,
      ...[...Array(files.length).keys()].map((ind) => ind + prevCount),
    ]);
    setLoading(false);
  };

  return (
    <>
      <Box>
        <Header
          onFileUpload={fileUploadHandler}
          fileName={fileName.current}
          selectedPdf={selectedPdf}
          changeSelectedPdf={setSelectedPdf}
          selectedPage={selectedPage[selectedPdf]}
          pdfOrder={pdfOrder}
          changePdfOrder={setPdfOrder}
          currentZoomLevel={
            selectedPdf === -1
              ? 50
              : zoomLevel[selectedPdf][selectedPage[selectedPdf]]
          }
          changeZoomLevel={setZoomLevel}
          activeTool={activeTool}
          changeActiveTool={setActiveTool}
        />
        {selectedPdf !== -1 && (
          <PreviewSection
            selectedPdf={selectedPdf}
            selectedPage={selectedPage[selectedPdf]}
            changeSelectedPage={setSelectedPage}
            pages={pdfPages.current[selectedPdf]}
            changeLoading={setLoading}
          />
        )}
        {selectedPdf !== -1 && (
          <Playground
            selectedPdf={selectedPdf}
            selectedPage={selectedPage[selectedPdf]}
            page={pdfPages.current[selectedPdf][selectedPage[selectedPdf]]}
            zoomLevel={zoomLevel[selectedPdf][selectedPage[selectedPdf]]}
            activeTool={activeTool}
            changeActiveTool={setActiveTool}
            scaleInfo={scaleInfo}
            changeScaleInfo={setScaleInfo}
            rect={rect[selectedPdf][selectedPage[selectedPdf]]}
            changeRect={setRect}
            polygon={polygon[selectedPdf][selectedPage[selectedPdf]]}
            changePolygon={setPolygon}
            length={length[selectedPdf][selectedPage[selectedPdf]]}
            changeLength={setLength}
          />
        )}
      </Box>
      {loading && <LoadingModal />}
    </>
  );
};

export default Homepage;

import { Box, styled } from "@mui/material";
import { MutableRefObject } from "react";
import { activeToolOptions } from "../utils";
import Annotate from "./Annotate";
import Count from "./Count";
import Deduct from "./Deduct";
import Length from "./Length";
import Page from "./Page";
import Pan from "./Pan";
import Polygon from "./Polygon";
import Rectangle from "./Rectangle";
import Redo from "./Redo";

import Scale from "./Scale";
import Select from "./Select";
import Undo from "./Undo";
import ZoomIn from "./ZoomIn";
import ZoomOut from "./ZoomOut";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  currentZoomLevel: number;
  changeZoomLevel: React.Dispatch<React.SetStateAction<number[][]>>;
  activeTool: activeToolOptions;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
  showPage: boolean;
  toggleShowPage: React.Dispatch<React.SetStateAction<boolean>>;
  undoStack: MutableRefObject<(() => void)[]>;
  redoStack: MutableRefObject<(() => void)[]>;
  captureStates: () => void;
};

const ToolsContainer = ({
  selectedPdf,
  selectedPage,
  currentZoomLevel,
  changeZoomLevel,
  activeTool,
  changeActiveTool,
  showPage,
  toggleShowPage,
  undoStack,
  redoStack,
  captureStates,
}: propsType): JSX.Element => {
  return (
    <Container>
      <Page showPage={showPage} toggleShowPage={toggleShowPage} />
      <Select activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Scale activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Rectangle activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Polygon activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Deduct activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Count activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Length activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Annotate activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Pan activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <ZoomIn
        selectedPdf={selectedPdf}
        selectedPage={selectedPage}
        currentZoomLevel={currentZoomLevel}
        changeZoomLevel={changeZoomLevel}
      />
      <ZoomOut
        selectedPdf={selectedPdf}
        selectedPage={selectedPage}
        currentZoomLevel={currentZoomLevel}
        changeZoomLevel={changeZoomLevel}
      />
      <Undo
        undoStack={undoStack}
        redoStack={redoStack}
        captureStates={captureStates}
      />
      <Redo
        undoStack={undoStack}
        redoStack={redoStack}
        captureStates={captureStates}
      />
    </Container>
  );
};

export default ToolsContainer;

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-end",
  color: theme.color.primary,
}));

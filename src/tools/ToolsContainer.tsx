import { Box, styled } from "@mui/material";
import { activeToolOptions } from "../utils";
import Pan from "./Pan";
import Polygon from "./Polygon";
import Rectangle from "./Rectangle";

import Scale from "./Scale";
import ZoomIn from "./ZoomIn";
import ZoomOut from "./ZoomOut";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  zoomLevel: number;
  changeZoomLevel: React.Dispatch<React.SetStateAction<number[][]>>;
  activeTool: activeToolOptions;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
};

const ToolsContainer = ({
  selectedPdf,
  selectedPage,
  zoomLevel,
  changeZoomLevel,
  activeTool,
  changeActiveTool,
}: propsType): JSX.Element => {
  return (
    <Container>
      <Scale activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Pan activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Rectangle activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Polygon activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <ZoomIn
        selectedPdf={selectedPdf}
        selectedPage={selectedPage}
        zoomLevel={zoomLevel}
        changeZoomLevel={changeZoomLevel}
      />
      <ZoomOut
        selectedPdf={selectedPdf}
        selectedPage={selectedPage}
        zoomLevel={zoomLevel}
        changeZoomLevel={changeZoomLevel}
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

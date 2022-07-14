import { Box, styled } from "@mui/material";
import { activeToolOptions } from "../utils";
import Count from "./Count";
import Deduct from "./Deduct";
import Length from "./Length";
import Pan from "./Pan";
import Polygon from "./Polygon";
import Rectangle from "./Rectangle";

import Scale from "./Scale";
import Select from "./Select";
import ZoomIn from "./ZoomIn";
import ZoomOut from "./ZoomOut";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  currentZoomLevel: number;
  changeZoomLevel: React.Dispatch<React.SetStateAction<number[][]>>;
  activeTool: activeToolOptions;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
};

const ToolsContainer = ({
  selectedPdf,
  selectedPage,
  currentZoomLevel,
  changeZoomLevel,
  activeTool,
  changeActiveTool,
}: propsType): JSX.Element => {
  return (
    <Container>
      <Select activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Scale activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Pan activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Rectangle activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Polygon activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Deduct activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Count activeTool={activeTool} changeActiveTool={changeActiveTool} />
      <Length activeTool={activeTool} changeActiveTool={changeActiveTool} />
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
    </Container>
  );
};

export default ToolsContainer;

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-end",
  color: theme.color.primary,
}));

import { useContext } from "react";

import { styled, Box } from "@mui/material";
import AppBar, { AppBarProps } from "@mui/material/AppBar";
import Toolbar, { ToolbarProps } from "@mui/material/Toolbar";
import Typography, { TypographyProps } from "@mui/material/Typography";

import { Context } from "../Context";
import FileSection from "./FileSection";
import ToolsContainer from "../tools/ToolsContainer";
import { activeToolOptions } from "../utils";

type props = {
  onFileUpload: (files: FileList) => void;
  fileName: string[];
  pdfOrder: number[];
  changePdfOrder: React.Dispatch<React.SetStateAction<number[]>>;
  selectedPdf: number;
  changeSelectedPdf: React.Dispatch<React.SetStateAction<number>>;
  selectedPage: number;
  currentZoomLevel: number;
  changeZoomLevel: React.Dispatch<React.SetStateAction<number[][]>>;
  activeTool: activeToolOptions;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
};

const Header = ({
  onFileUpload,
  fileName,
  pdfOrder,
  changePdfOrder,
  selectedPdf,
  changeSelectedPdf,
  selectedPage,
  currentZoomLevel,
  changeZoomLevel,
  activeTool,
  changeActiveTool,
}: props): JSX.Element => {
  const context = useContext(Context);

  return (
    <CustomAppBar height={context.navHeight}>
      <CustomToolbar height={context.navHeight}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Logo> Build</Logo>
          <ToolsContainer
            selectedPdf={selectedPdf}
            selectedPage={selectedPage}
            currentZoomLevel={currentZoomLevel}
            changeZoomLevel={changeZoomLevel}
            activeTool={activeTool}
            changeActiveTool={changeActiveTool}
          />
          <FileSection
            onFileUpload={onFileUpload}
            fileName={fileName}
            pdfOrder={pdfOrder}
            selectedPdf={selectedPdf}
            changeSelectedPdf={changeSelectedPdf}
            changePdfOrder={changePdfOrder}
          />
        </Box>
      </CustomToolbar>
    </CustomAppBar>
  );
};

export default Header;

interface CustomAppBarProps extends AppBarProps {
  height: string;
}
const CustomAppBar = styled(AppBar)<CustomAppBarProps>(({ theme, height }) => ({
  position: "fixed",
  backgroundColor: theme.color.navbar,
  height: height,
}));

interface CustomToolbarProps extends ToolbarProps {
  height: string;
}
const CustomToolbar = styled(Toolbar)<CustomToolbarProps>(({ height }) => ({
  minHeight: "40px !important",
  height: height,
}));

const Logo = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontStyle: "normal",
  fontWeight: 700,
  fontSize: "17px",
  lineHeight: "30px",
  background:
    "linear-gradient(90deg, #F9E4E4 -5.26%, #E90C0C 71.33%, #AD1C1C 110.53%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  [theme.breakpoints.up("md")]: {
    fontSize: "20px",
  },
}));

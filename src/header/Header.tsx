import { useContext, useState } from "react";

import { styled, Box } from "@mui/material";
import AppBar, { AppBarProps } from "@mui/material/AppBar";
import Toolbar, { ToolbarProps } from "@mui/material/Toolbar";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { ReactComponent as LogoIcon } from "../assets/icons/logo.svg";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { Context } from "../Context";
import FileSection from "./FileSection";
import ToolsContainer from "../tools/ToolsContainer";
import {
  activeGroupType,
  activeToolOptions,
  countType,
  groupType,
  lengthType,
  polygonType,
  scaleInfoType,
} from "../utils";
import Page from "../tools/Page";
import PreviewSection from "../preview/PreviewSection";
import GroupSection from "../group/GroupSection";
import MeasurementSection from "../measurement/MeasurementSection";

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
  scaleInfo: scaleInfoType[][];
  showPage: boolean;
  toggleShowPage: React.Dispatch<React.SetStateAction<boolean>>;
  showMeasurements: boolean;
  toggleShowMeasurements: React.Dispatch<React.SetStateAction<boolean>>;
  group: groupType[];
  changeGroup: React.Dispatch<React.SetStateAction<groupType[]>>;
  activeGroup: activeGroupType;
  changeActiveGroup: React.Dispatch<React.SetStateAction<activeGroupType>>;
  polygon: polygonType[][][];
  changePolygon: React.Dispatch<React.SetStateAction<polygonType[][][]>>;
  length: lengthType[][][];
  changeLength: React.Dispatch<React.SetStateAction<lengthType[][][]>>;
  count: countType[][][];
  changeCount: React.Dispatch<React.SetStateAction<countType[][][]>>;
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
  showPage,
  toggleShowPage,
  showMeasurements,
  toggleShowMeasurements,
  scaleInfo,
  group,
  changeGroup,
  activeGroup,
  changeActiveGroup,
  polygon,
  changePolygon,
  length,
  changeLength,
  count,
  changeCount,
}: props): JSX.Element => {
  const context = useContext(Context);

  console.log(activeTool);

  return (
    <Wrapper>
      <ToolBar>
        <LogoIcon style={{ width: "90px", paddingRight: "10px" }} />
        <ToolsContainer
          selectedPdf={selectedPdf}
          selectedPage={selectedPage}
          currentZoomLevel={currentZoomLevel}
          changeZoomLevel={changeZoomLevel}
          activeTool={activeTool}
          changeActiveTool={changeActiveTool}
          showPage={showPage}
          toggleShowPage={toggleShowPage}
        />

        {(activeTool === activeToolOptions.rectangle ||
          activeTool === activeToolOptions.polygon ||
          activeTool === activeToolOptions.length ||
          activeTool === activeToolOptions.count) && (
          <GroupSection
            activeTool={activeTool}
            group={group}
            changeGroup={changeGroup}
            activeGroup={activeGroup}
            changeActiveGroup={changeActiveGroup}
          />
        )}
        <Box
          onClick={() => toggleShowMeasurements((prev) => !prev)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer",
            padding: "4px 6px 4px 10px",
            borderRadius: "12px",
            ":hover": {
              backgroundColor: "#e4e7ed",
            },
          }}
        >
          <Typography
            noWrap
            fontWeight="500"
            lineHeight="1.5"
            letterSpacing="0.00938em"
            fontSize="14px"
            sx={{
              color: "#4b4646",
              maxWidth: "180px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            MEASUREMENTS
          </Typography>
          {showMeasurements ? (
            <KeyboardArrowDownIcon />
          ) : (
            <KeyboardArrowUpIcon />
          )}
        </Box>
      </ToolBar>
    </Wrapper>
  );
};

export default Header;

const ToolBar = styled(Box)({
  position: "fixed",
  top: "50px",
  // left: "5%",
  width: "90%",
  boxSizing: "border-box",
  backgroundColor: "white",
  borderRadius: "32px",
  boxShadow: "0px 1px 4px 0px gray",
  padding: "10px",
  paddingLeft: "30px",
  paddingRight: "30px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  zIndex: 900,
});

const Wrapper = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "center",
});

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

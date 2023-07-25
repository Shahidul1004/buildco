import { MutableRefObject } from "react";

import { styled, Box, BoxProps } from "@mui/material";
import Typography from "@mui/material/Typography";
import { ReactComponent as LogoIcon } from "../assets/icons/logo.svg";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ToolsContainer from "../tools/ToolsContainer";
import { activeGroupType, activeToolOptions, groupType } from "../utils";
import GroupSection from "../group/GroupSection";

type props = {
  selectedPdf: number;
  selectedPage: number;
  currentZoomLevel: number;
  changeZoomLevel: React.Dispatch<React.SetStateAction<number[][]>>;
  activeTool: activeToolOptions;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
  showPage: boolean;
  toggleShowPage: React.Dispatch<React.SetStateAction<boolean>>;
  showMeasurements: boolean;
  toggleShowMeasurements: React.Dispatch<React.SetStateAction<boolean>>;
  group: groupType[];
  changeGroup: React.Dispatch<React.SetStateAction<groupType[]>>;
  activeGroup: activeGroupType;
  changeActiveGroup: React.Dispatch<React.SetStateAction<activeGroupType>>;
  undoStack: MutableRefObject<(() => void)[]>;
  redoStack: MutableRefObject<(() => void)[]>;
  captureStates: () => void;
};

const Header = ({
  selectedPdf,
  selectedPage,
  currentZoomLevel,
  changeZoomLevel,
  activeTool,
  changeActiveTool,
  showPage,
  toggleShowPage,
  showMeasurements,
  toggleShowMeasurements,
  group,
  changeGroup,
  activeGroup,
  changeActiveGroup,
  undoStack,
  redoStack,
  captureStates,
}: props): JSX.Element => {
  return (
    <Wrapper>
      <ToolBar
        isGroupOpen={
          activeTool === activeToolOptions.rectangle ||
          activeTool === activeToolOptions.polygon ||
          activeTool === activeToolOptions.length ||
          activeTool === activeToolOptions.count
        }
      >
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
          undoStack={undoStack}
          redoStack={redoStack}
          captureStates={captureStates}
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
            undoStack={undoStack}
            redoStack={redoStack}
            captureStates={captureStates}
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

interface CustomBoxProps extends BoxProps {
  isGroupOpen: boolean;
}

const ToolBar = styled(Box)<CustomBoxProps>(({ isGroupOpen }) => ({
  position: "fixed",
  top: "50px",
  width: isGroupOpen ? "1430px" : "1030px",
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
  gap: "10px",
  zIndex: 900,
}));

const Wrapper = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "center",
});

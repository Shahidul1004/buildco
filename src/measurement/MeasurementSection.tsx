import { Box, BoxProps, Button, styled, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { Context } from "../Context";
import {
  countType,
  groupType,
  groupTypeName,
  lengthType,
  polygonType,
  scaleInfoType,
} from "../utils";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Title from "./Title";
import ShapeGroup from "./ShapeGroup";
import LengthGroup from "./LengthGroup";
import CountGroup from "./CountGroup";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  scaleInfo: scaleInfoType;
  group: groupType[];
  changeGroup: React.Dispatch<React.SetStateAction<groupType[]>>;
  polygon: polygonType[][][];
  changePolygon: React.Dispatch<React.SetStateAction<polygonType[][][]>>;
  length: lengthType[][][];
  changeLength: React.Dispatch<React.SetStateAction<lengthType[][][]>>;
  count: countType[][][];
  changeCount: React.Dispatch<React.SetStateAction<countType[][][]>>;
};

const MeasurementSection = ({
  selectedPdf,
  selectedPage,
  scaleInfo,
  group,
  changeGroup,
  polygon,
  changePolygon,
  length,
  changeLength,
  count,
  changeCount,
}: propsType): JSX.Element => {
  const context = useContext(Context);
  const theme = useTheme();
  const [show, setShow] = useState<boolean>(false);

  const toggleShow = () => {
    setShow((prev) => !prev);
  };

  return (
    <>
      <Button
        variant="contained"
        endIcon={show ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        sx={{
          position: "fixed",
          top: `calc(${context.navHeight} + 2px)`,
          right: 0,
          width: "450px",
          height: "30px",
          color: theme.color.primary,
          backgroundColor: "white",
          zIndex: 10000,
          borderRadius: 0,
          boxShadow:
            "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
          ":hover": {
            color: theme.color.primary,
            backgroundColor: theme.color.buttonHover,
            boxShadow:
              "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
          },
        }}
        onClick={toggleShow}
      >
        MEASUREMENTS
      </Button>
      {show && (
        <Container navHeight={context.navHeight} sx={{ cursor: "pointer" }}>
          <Title />
          {group.map((grp, index) => (
            <>
              {grp.type === groupTypeName.shape ? (
                <ShapeGroup
                  selectedPdf={selectedPdf}
                  selectedPage={selectedPage}
                  scaleInfo={scaleInfo}
                  key={index}
                  groupIndex={index}
                  group={grp}
                  groups={group}
                  changeGroup={changeGroup}
                  polygon={polygon[selectedPdf][selectedPage]}
                  changePolygon={changePolygon}
                />
              ) : grp.type === groupTypeName.length ? (
                <LengthGroup
                  selectedPdf={selectedPdf}
                  selectedPage={selectedPage}
                  scaleInfo={scaleInfo}
                  key={index}
                  groupIndex={index}
                  group={grp}
                  groups={group}
                  changeGroup={changeGroup}
                  length={length[selectedPdf][selectedPage]}
                  changeLength={changeLength}
                />
              ) : grp.type === groupTypeName.all ? (
                <></>
              ) : (
                <CountGroup
                  selectedPdf={selectedPdf}
                  selectedPage={selectedPage}
                  scaleInfo={scaleInfo}
                  key={index}
                  groupIndex={index}
                  group={grp}
                  groups={group}
                  changeGroup={changeGroup}
                  count={count[selectedPdf][selectedPage]}
                  changeCount={changeCount}
                />
              )}
            </>
          ))}
        </Container>
      )}
    </>
  );
};

export default MeasurementSection;

interface CustomBoxProps extends BoxProps {
  navHeight: string;
}
const Container = styled(Box)<CustomBoxProps>(({ theme, navHeight }) => ({
  position: "fixed",
  top: `calc( ${navHeight} + 30px + 2px)`,
  right: "0px",
  backgroundColor: "white",
  height: "500px",
  width: "450px",
  boxShadow:
    "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
  zIndex: 13000,

  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  cursor: "auto !important",
}));

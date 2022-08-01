import { Box, BoxProps, styled } from "@mui/material";
import { useContext } from "react";
import { Context } from "../Context";
import {
  countType,
  groupType,
  groupTypeName,
  lengthType,
  polygonType,
  scaleInfoType,
} from "../utils";
import Title from "./Title";
import ShapeGroup from "./ShapeGroup";
import LengthGroup from "./LengthGroup";
import CountGroup from "./CountGroup";
import DefaultGroup from "./DefaultGroup";

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
  isGroupOpen: boolean;
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
  isGroupOpen,
}: propsType): JSX.Element => {
  const context = useContext(Context);

  return (
    <Container
      navHeight={context.navHeight}
      sx={{ cursor: "pointer" }}
      isGroupOpen={isGroupOpen}
    >
      <Box
        sx={{
          overflow: "hidden",
          overflowY: "auto",
          maxHeight: "calc(100vh - 300px)",
        }}
      >
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
        <DefaultGroup
          selectedPdf={selectedPdf}
          selectedPage={selectedPage}
          scaleInfo={scaleInfo}
          groupIndex={group.findIndex((grp) => grp.type === groupTypeName.all)}
          group={group.find((grp) => grp.type === groupTypeName.all)!}
          groups={group}
          changeGroup={changeGroup}
          polygon={polygon[selectedPdf][selectedPage]}
          changePolygon={changePolygon}
          length={length[selectedPdf][selectedPage]}
          changeLength={changeLength}
          count={count[selectedPdf][selectedPage]}
          changeCount={changeCount}
        />
      </Box>
    </Container>
  );
};

export default MeasurementSection;

interface CustomBoxProps extends BoxProps {
  navHeight: string;
  isGroupOpen: boolean;
}
const Container = styled(Box)<CustomBoxProps>(
  ({ theme, navHeight, isGroupOpen }) => ({
    position: "fixed",
    top: "50px",
    right: isGroupOpen ? `calc(50% - 715px)` : `calc(50% - 515px)`,
    width: "510px",
    backgroundColor: "white",
    borderRadius: "32px",
    boxShadow: "0px 3px 4px 0px gray",
    padding: "75px 0px 100px 0px",
    paddingLeft: "25px",
    paddingRight: "25px",
    boxSizing: "border-box",
    zIndex: 600,

    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    cursor: "auto !important",
  })
);

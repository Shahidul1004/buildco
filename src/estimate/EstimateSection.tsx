import { Box, Typography } from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import CustomButton from "../reusables/Button";
import {
  countType,
  groupType,
  lengthType,
  polygonType,
  scaleInfoType,
} from "../utils";
import EstimatePerPdf from "./EstimatePerPdf";

type propsType = {
  pdfOrder: number[];
  fileName: string[];
  scaleInfo: scaleInfoType[][];
  group: groupType[];
  polygon: polygonType[][][];
  length: lengthType[][][];
  count: countType[][][];
  toggleShowEstimate: React.Dispatch<React.SetStateAction<boolean>>;
};

const EstimateSection = ({
  pdfOrder,
  fileName,
  scaleInfo,
  group,
  polygon,
  length,
  count,
  toggleShowEstimate,
}: propsType): JSX.Element => {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <Box
        sx={{
          marginTop: "30px",
          width: "1087px",
          display: "flex",
        }}
      >
        <CustomButton
          backgroundcolor="#ffa700"
          hoverbackgroudcolor="#ff8700"
          Color="white"
          hovercolor="white"
          sx={{
            borderRadius: "4px",
            padding: "3px 6px",
            height: "35px",
          }}
          onClick={() => toggleShowEstimate((prev) => !prev)}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <ReplyIcon />
            Back to Measure
          </Box>
        </CustomButton>
        <Typography
          sx={{
            marginLeft: "315px",
            color: "#222222",
            fontSize: "24px",
            fontWeight: "500",
          }}
        >
          All Measurements
        </Typography>
      </Box>
      {pdfOrder.map((order) => (
        <EstimatePerPdf
          key={order}
          scaleInfo={scaleInfo[order]}
          fileName={fileName[order]}
          group={group}
          polygon={polygon[order]}
          length={length[order]}
          count={count[order]}
        />
      ))}
    </Box>
  );
};

export default EstimateSection;

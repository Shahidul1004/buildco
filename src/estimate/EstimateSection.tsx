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
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

type propsType = {
  pdfOrder: number[];
  fileName: string[];
  scaleInfo: scaleInfoType[][];
  group: groupType[];
  polygon: polygonType[][][];
  length: lengthType[][][];
  count: countType[][][];
  toggleShowEstimate: React.Dispatch<React.SetStateAction<boolean>>;
  toggleShowCost: React.Dispatch<React.SetStateAction<boolean>>;
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
  toggleShowCost,
}: propsType): JSX.Element => {
  const pdfRef = useRef<HTMLDivElement>(null);
  const hiddenText = useRef<HTMLDivElement>(null);

  return (
    <>
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
            justifyContent: "space-between",
            alignItems: "center",
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
            onClick={() => {
              toggleShowCost(false);
              toggleShowEstimate(false);
            }}
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
              color: "#222222",
              fontSize: "24px",
              fontWeight: "500",
            }}
          >
            All Measurements
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: "20px",
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
              onClick={useReactToPrint({
                content: () => pdfRef.current,
                onBeforeGetContent: () => {
                  hiddenText.current!.style.display = "block";
                },
                onAfterPrint: () => {
                  hiddenText.current!.style.display = "none";
                },
              })}
            >
              Export
            </CustomButton>
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
              onClick={() => {
                toggleShowEstimate(false);
                toggleShowCost(true);
              }}
            >
              Calculate Cost
            </CustomButton>
          </Box>
        </Box>
        <Box ref={pdfRef}>
          <Box
            sx={{
              marginTop: "10px",
              marginBottom: "20px",
              width: "1087px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              ref={hiddenText}
              sx={{
                color: "#FFBC01",
                fontSize: "24px",
                fontWeight: "500",
                display: "none",
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
      </Box>
    </>
  );
};

export default EstimateSection;

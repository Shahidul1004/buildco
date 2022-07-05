import { Box, styled, TextField, Typography } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import CustomButton from "../reusables/Button";
import React, { useContext, useRef } from "react";
import { Context } from "../Context";
import { scaleInfoType } from "../utils";

type propTypes = {
  selectedPdf: number;
  selectedPage: number;
  enteredScale: any;
  scaleInfo: scaleInfoType[][];
  changeScaleInfo: React.Dispatch<React.SetStateAction<scaleInfoType[][]>>;
  changeShowScaleModal: React.Dispatch<React.SetStateAction<boolean>>;
};
const ScaleMeasurementModal = ({
  selectedPdf,
  selectedPage,
  enteredScale,
  scaleInfo,
  changeScaleInfo,
  changeShowScaleModal,
}: propTypes): JSX.Element => {
  const textRef = useRef<any>(null);

  const onClose = () => {
    const text = textRef.current?.value as string;
    if (text.trim().length) {
      changeScaleInfo((prev) => {
        const temp = [...prev];
        const t = temp[selectedPdf];
        t.splice(selectedPage, 1, {
          calibrated: true,
          x: enteredScale.x,
          y: enteredScale.y,
          prevScale: enteredScale.scaleFactor,
          L: +text.trim(),
        });
        temp[selectedPdf] = t;
        return temp;
      });
      changeShowScaleModal(false);
    } else {
      alert("invalid name");
    }
  };
  const onCancel = () => {
    changeShowScaleModal(false);
  };

  return (
    <>
      <OverLay />
      <ModalContainer>
        <Box
          sx={{
            width: "400px",
            display: "flex",
            flexFlow: "column nowrap",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Typography fontWeight="500">Set Scale</Typography>
          <Typography fontSize={14}>
            Enter known measurement between two points (ft):
          </Typography>

          <TextField
            fullWidth
            placeholder="ex:5"
            //   innerRef={textRef}
            inputRef={textRef}
            sx={{
              "& .MuiOutlinedInput-input": {
                padding: "10px",
              },
            }}
          />
          <Box sx={{ marginTop: "25px", display: "flex", gap: "10px" }}>
            <CustomButton
              variant="outlined"
              onClick={onCancel}
              sx={{
                padding: "6px",
              }}
            >
              Cancel
            </CustomButton>
            <CustomButton
              variant="contained"
              Color="white"
              hovercolor="white"
              backgroundcolor="primary.main"
              hoverbackgroudcolor="primary.dark"
              onClick={onClose}
              sx={{
                padding: "6px 20px",
              }}
            >
              Find Scale
            </CustomButton>
          </Box>
        </Box>
      </ModalContainer>
    </>
  );
};
export default ScaleMeasurementModal;

const OverLay = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  zIndex: 1000,
});

const ModalContainer = styled(Box)({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  padding: "20px",
  zIndex: 1000,
  borderRadius: "5px",
});

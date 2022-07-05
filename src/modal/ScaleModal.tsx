import { Box, styled, Typography } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import CustomButton from "../reusables/Button";

type propTypes = {
  onClose: () => void;
  onCancel: () => void;
};
const ScaleModal = ({ onClose, onCancel }: propTypes): JSX.Element => {
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
          <WarningAmberIcon />
          <Typography fontWeight="500">Find Page Scale</Typography>
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
export default ScaleModal;

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

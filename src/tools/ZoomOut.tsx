import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import { Typography } from "@mui/material";
import { useRef, useState } from "react";
import CustomButton from "../reusables/Button";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  zoomLevel: number;
  changeZoomLevel: React.Dispatch<React.SetStateAction<number[][]>>;
};

const ZoomOut = ({
  selectedPdf,
  selectedPage,
  zoomLevel,
  changeZoomLevel,
}: propsType): JSX.Element => {
  const timerPool = useRef<NodeJS.Timeout[]>([]);
  const [click, setClick] = useState<boolean>(false);

  const handleClick = async () => {
    for (const timer of timerPool.current) {
      clearTimeout(timer);
    }
    setClick(true);
    const timer = setTimeout(() => {
      setClick(false);
    }, 100);
    timerPool.current.push(timer);

    const newLevel = zoomLevel - 10;
    if (newLevel >= 0)
      changeZoomLevel((prev) => {
        const temp = [...prev];
        const selectedPdfZooms = temp[selectedPdf];
        selectedPdfZooms[selectedPage] = newLevel;
        temp.splice(selectedPdf, 1, selectedPdfZooms);
        return temp;
      });
  };
  return (
    <CustomButton
      sx={{
        display: "flex",
        flexFlow: "column nowrap",
      }}
      onClick={handleClick}
      disabled={zoomLevel <= 0}
    >
      <ZoomOutIcon
        fontSize="medium"
        color={`${click ? "primary" : "inherit"}`}
      />
      <Typography fontSize={13} color={`${click ? "primary" : "inherit"}`}>
        Zoom Out
      </Typography>
    </CustomButton>
  );
};

export default ZoomOut;

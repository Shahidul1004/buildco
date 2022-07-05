import ScaleIcon from "@mui/icons-material/Scale";
import { Typography } from "@mui/material";
import { useState } from "react";
import ScaleModal from "../modal/ScaleModal";
import CustomButton from "../reusables/Button";
import { activeToolOptions } from "../utils";

type propsType = {
  activeTool: activeToolOptions;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
};

const Scale = ({ activeTool, changeActiveTool }: propsType): JSX.Element => {
  const [modal, setModal] = useState<boolean>(false);
  const handleChangeActiveTool = () => {
    changeActiveTool(activeToolOptions["scale"]);
    setModal(true);
  };
  return (
    <>
      <CustomButton
        sx={{
          display: "flex",
          flexFlow: "column nowrap",
        }}
        onClick={handleChangeActiveTool}
        disabled={activeTool === activeToolOptions["scale"]}
      >
        <ScaleIcon
          fontSize="small"
          color={`${
            activeTool === activeToolOptions["scale"] ? "primary" : "inherit"
          }`}
        />
        <Typography
          fontSize={13}
          color={`${
            activeTool === activeToolOptions["scale"] ? "primary" : "inherit"
          }`}
        >
          Scale
        </Typography>
      </CustomButton>
      {modal && (
        <ScaleModal
          onClose={() => {
            setModal(false);
          }}
          onCancel={() => {
            setModal(false);
            changeActiveTool(activeToolOptions["pan"]);
          }}
        />
      )}
    </>
  );
};

export default Scale;

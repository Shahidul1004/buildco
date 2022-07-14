import { Typography } from "@mui/material";
import { useState } from "react";
import ScaleModal from "../modal/ScaleModal";
import CustomButton from "../reusables/Button";
import { activeToolOptions } from "../utils";
import { ReactComponent as ScaleIcon } from "../assets/icons/scale.svg";

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
          style={{ height: "20px" }}
          fill={`${
            activeTool === activeToolOptions["scale"] ? "#1976d2" : "inherit"
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

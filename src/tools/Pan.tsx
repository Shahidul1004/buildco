import OpenWithIcon from "@mui/icons-material/OpenWith";
import { Typography } from "@mui/material";
import { useState } from "react";

import CustomButton from "../reusables/Button";
import { activeToolOptions } from "../utils";

type propsType = {
  activeTool: activeToolOptions;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
};

const Pan = ({ activeTool, changeActiveTool }: propsType): JSX.Element => {
  const handleChangeActiveTool = () => {
    changeActiveTool(activeToolOptions["pan"]);
  };
  return (
    <>
      <CustomButton
        sx={{
          padding: "0px 6px",
          display: "flex",
          flexFlow: "column nowrap",
        }}
        onClick={handleChangeActiveTool}
        disabled={activeTool === activeToolOptions["pan"]}
      >
        <OpenWithIcon
          fontSize="small"
          color={`${
            activeTool === activeToolOptions["pan"] ? "primary" : "inherit"
          }`}
          style={{ width: "20px", height: "20px" }}
        />
        <Typography
          fontSize={12}
          color={`${
            activeTool === activeToolOptions["pan"] ? "primary" : "inherit"
          }`}
        >
          Pan
        </Typography>
      </CustomButton>
    </>
  );
};

export default Pan;

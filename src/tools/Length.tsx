import { Typography } from "@mui/material";
import CustomButton from "../reusables/Button";
import { activeToolOptions } from "../utils";
import { ReactComponent as LengthIcon } from "../assets/icons/length.svg";

type propsType = {
  activeTool: activeToolOptions;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
};

const Length = ({ activeTool, changeActiveTool }: propsType): JSX.Element => {
  const handleChangeActiveTool = () => {
    changeActiveTool(activeToolOptions.length);
  };

  return (
    <CustomButton
      sx={{
        display: "flex",
        flexFlow: "column nowrap",
      }}
      onClick={handleChangeActiveTool}
      disabled={activeTool === activeToolOptions.length}
    >
      <LengthIcon
        fill={`${
          activeTool === activeToolOptions.length ? "#1976d2" : "inherit"
        }`}
      />

      <Typography
        fontSize={13}
        color={`${
          activeTool === activeToolOptions.length ? "primary" : "inherit"
        }`}
      >
        Length
      </Typography>
    </CustomButton>
  );
};

export default Length;

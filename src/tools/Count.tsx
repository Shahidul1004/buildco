import { Typography } from "@mui/material";
import CustomButton from "../reusables/Button";
import { activeToolOptions } from "../utils";
import { ReactComponent as CountIcon } from "../assets/icons/count.svg";

type propsType = {
  activeTool: activeToolOptions;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
};

const Count = ({ activeTool, changeActiveTool }: propsType): JSX.Element => {
  const handleChangeActiveTool = () => {
    changeActiveTool(activeToolOptions.count);
  };

  return (
    <CustomButton
      sx={{
        display: "flex",
        flexFlow: "column nowrap",
      }}
      onClick={handleChangeActiveTool}
      disabled={activeTool === activeToolOptions.count}
    >
      <CountIcon
        fill={`${
          activeTool === activeToolOptions.count ? "#1976d2" : "inherit"
        }`}
      />

      <Typography
        fontSize={13}
        color={`${
          activeTool === activeToolOptions.count ? "primary" : "inherit"
        }`}
      >
        Count
      </Typography>
    </CustomButton>
  );
};

export default Count;

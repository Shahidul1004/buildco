import { Typography } from "@mui/material";
import CustomButton from "../reusables/Button";
import { activeToolOptions } from "../utils";
import { ReactComponent as Cursor } from "../assets/icons/cursor.svg";

type propsType = {
  activeTool: activeToolOptions;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
};

const Select = ({ activeTool, changeActiveTool }: propsType): JSX.Element => {
  const handleChangeActiveTool = () => {
    changeActiveTool(activeToolOptions.select);
  };

  return (
    <CustomButton
      sx={{
        display: "flex",
        flexFlow: "column nowrap",
      }}
      onClick={handleChangeActiveTool}
      disabled={activeTool === activeToolOptions.select}
    >
      <Cursor
        fill={`${
          activeTool === activeToolOptions.select ? "#1976d2" : "inherit"
        }`}
      />

      <Typography
        fontSize={13}
        color={`${
          activeTool === activeToolOptions.select ? "primary" : "inherit"
        }`}
      >
        Select
      </Typography>
    </CustomButton>
  );
};

export default Select;

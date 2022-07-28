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
        padding: "0px 6px",
        display: "flex",
        flexFlow: "column nowrap",
      }}
      onClick={handleChangeActiveTool}
      disabled={activeTool === activeToolOptions.select}
    >
      <Cursor
        fill={`${
          activeTool === activeToolOptions.select ? "#FFBC01" : "inherit"
        }`}
        style={{ width: "20px", height: "20px" }}
      />

      <Typography
        fontSize={12}
        sx={{
          color: `${
            activeTool === activeToolOptions.select ? "#FFBC01" : "inherit"
          }`,
        }}
      >
        Select
      </Typography>
    </CustomButton>
  );
};

export default Select;

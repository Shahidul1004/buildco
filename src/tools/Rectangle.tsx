import Crop54SharpIcon from "@mui/icons-material/Crop54Sharp";
import { Typography } from "@mui/material";
import CustomButton from "../reusables/Button";
import { activeToolOptions } from "../utils";

type propsType = {
  activeTool: activeToolOptions;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
};

const Rectangle = ({
  activeTool,
  changeActiveTool,
}: propsType): JSX.Element => {
  const handleChangeActiveTool = () => {
    changeActiveTool(activeToolOptions.rectangle);
  };

  return (
    <CustomButton
      sx={{
        padding: "0px 6px",
        display: "flex",
        flexFlow: "column nowrap",
      }}
      onClick={handleChangeActiveTool}
      disabled={activeTool === activeToolOptions.rectangle}
    >
      <Crop54SharpIcon
        fontSize="medium"
        color={`${
          activeTool === activeToolOptions.rectangle ? "primary" : "inherit"
        }`}
        style={{ width: "20px", height: "20px" }}
      />
      <Typography
        fontSize={12}
        color={`${
          activeTool === activeToolOptions.rectangle ? "primary" : "inherit"
        }`}
      >
        Rectangle
      </Typography>
    </CustomButton>
  );
};

export default Rectangle;

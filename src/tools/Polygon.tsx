import HexagonOutlinedIcon from "@mui/icons-material/HexagonOutlined";
import { Typography } from "@mui/material";
import CustomButton from "../reusables/Button";
import { activeToolOptions } from "../utils";

type propsType = {
  activeTool: activeToolOptions;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
};

const Polygon = ({ activeTool, changeActiveTool }: propsType): JSX.Element => {
  const handleChangeActiveTool = () => {
    changeActiveTool(activeToolOptions.polygon);
  };

  return (
    <CustomButton
      sx={{
        padding: "0px 6px",
        display: "flex",
        flexFlow: "column nowrap",
      }}
      onClick={handleChangeActiveTool}
      disabled={activeTool === activeToolOptions.polygon}
    >
      <HexagonOutlinedIcon
        fontSize="medium"
        color={`${
          activeTool === activeToolOptions.polygon ? "primary" : "inherit"
        }`}
        style={{ width: "20px", height: "20px" }}
      />
      <Typography
        fontSize={12}
        color={`${
          activeTool === activeToolOptions.polygon ? "primary" : "inherit"
        }`}
      >
        Polygon
      </Typography>
    </CustomButton>
  );
};

export default Polygon;

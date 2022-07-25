import { Typography } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";

import CustomButton from "../reusables/Button";
import { activeToolOptions } from "../utils";

type propsType = {
  activeTool: activeToolOptions;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
};

const Annotate = ({ activeTool, changeActiveTool }: propsType): JSX.Element => {
  const handleChangeActiveTool = () => {
    changeActiveTool(activeToolOptions.annotate);
  };

  return (
    <CustomButton
      sx={{
        padding: "0px 6px",
        display: "flex",
        flexFlow: "column nowrap",
      }}
      onClick={handleChangeActiveTool}
      disabled={activeTool === activeToolOptions.annotate}
    >
      <CreateIcon
        fontSize="medium"
        color={`${
          activeTool === activeToolOptions.annotate ? "primary" : "inherit"
        }`}
        style={{ width: "20px", height: "20px" }}
      />

      <Typography
        fontSize={12}
        color={`${
          activeTool === activeToolOptions.annotate ? "primary" : "inherit"
        }`}
      >
        Annotate
      </Typography>
    </CustomButton>
  );
};

export default Annotate;

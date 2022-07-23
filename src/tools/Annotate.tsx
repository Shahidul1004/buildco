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
      />

      <Typography
        fontSize={13}
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

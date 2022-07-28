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
        style={{
          width: "20px",
          height: "20px",
          color: `${
            activeTool === activeToolOptions.annotate ? "#FFBC01" : "inherit"
          }`,
        }}
      />

      <Typography
        fontSize={12}
        sx={{
          color: `${
            activeTool === activeToolOptions.annotate ? "#FFBC01" : "inherit"
          }`,
        }}
      >
        Annotate
      </Typography>
    </CustomButton>
  );
};

export default Annotate;

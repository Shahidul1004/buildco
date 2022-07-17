import { Typography } from "@mui/material";
import CustomButton from "../reusables/Button";
import { activeToolOptions } from "../utils";
import { ReactComponent as DeductIcon } from "../assets/icons/deduct.svg";

type propsType = {
  activeTool: activeToolOptions;
  changeActiveTool: React.Dispatch<React.SetStateAction<activeToolOptions>>;
};

const Deduct = ({ activeTool, changeActiveTool }: propsType): JSX.Element => {
  const handleChangeActiveTool = () => {
    changeActiveTool(activeToolOptions.deduct);
  };

  return (
    <CustomButton
      sx={{
        display: "flex",
        flexFlow: "column nowrap",
      }}
      onClick={handleChangeActiveTool}
      disabled={activeTool === activeToolOptions.deduct}
    >
      <DeductIcon
        fill={`${
          activeTool === activeToolOptions.deduct ? "#1976d2" : "inherit"
        }`}
      />

      <Typography
        fontSize={13}
        color={`${
          activeTool === activeToolOptions.deduct ? "primary" : "inherit"
        }`}
      >
        Deduct
      </Typography>
    </CustomButton>
  );
};

export default Deduct;
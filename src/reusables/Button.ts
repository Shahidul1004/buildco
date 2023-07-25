import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material";

interface CustomButtonProps extends ButtonProps {
  buttoncolor?: string;
  hovercolor?: string;
  backgroundcolor?: string;
  hoverbackgroudcolor?: string;
}

const CustomButton = styled(Button)<CustomButtonProps>(
  ({
    theme,
    buttoncolor,
    hovercolor,
    backgroundcolor,
    hoverbackgroudcolor,
  }) => ({
    textTransform: "none",
    minWidth: "1px",
    color: buttoncolor ? buttoncolor : theme.color.primary,
    backgroundColor: backgroundcolor ? backgroundcolor : theme.color.button,
    ":hover": {
      color: hovercolor ? hovercolor : theme.color.primary,
      backgroundColor: hoverbackgroudcolor
        ? hoverbackgroudcolor
        : theme.color.buttonHover,
    },
  })
);

export default CustomButton;

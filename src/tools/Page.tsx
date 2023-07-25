import { Typography } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import CustomButton from "../reusables/Button";

type propsType = {
  showPage: boolean;
  toggleShowPage: React.Dispatch<React.SetStateAction<boolean>>;
};

const Page = ({ showPage, toggleShowPage }: propsType): JSX.Element => {
  return (
    <CustomButton
      sx={{
        padding: "0px 6px",
        display: "flex",
        flexFlow: "column nowrap",
      }}
      onClick={() => toggleShowPage((prev) => !prev)}
    >
      <PictureAsPdfIcon
        fontSize="small"
        style={{
          width: "20px",
          height: "20px",
          color: `${showPage ? "#FFBC01" : "inherit"}`,
        }}
      />
      <Typography
        fontSize={12}
        sx={{
          color: `${showPage ? "#FFBC01" : "inherit"}`,
        }}
      >
        Page
      </Typography>
    </CustomButton>
  );
};

export default Page;

import { Typography } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import CustomButton from "../reusables/Button";

type propsType = {
  showPage: boolean;
  toggleShowPage: React.Dispatch<React.SetStateAction<boolean>>;
};

const Page = ({ showPage, toggleShowPage }: propsType): JSX.Element => {
  return (
    <>
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
          color={`${showPage ? "primary" : "inherit"}`}
          style={{ width: "20px", height: "20px" }}
        />
        <Typography fontSize={12} color={`${showPage ? "primary" : "inherit"}`}>
          Page
        </Typography>
      </CustomButton>
    </>
  );
};

export default Page;

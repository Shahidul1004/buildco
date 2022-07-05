import {
  Box,
  BoxProps,
  Button,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import * as pdfjsLib from "pdfjs-dist";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Context } from "../Context";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import PreviewPdf from "./PreviewPdf";
type propTypes = {
  selectedPdf: number;
  selectedPage: number;
  changeSelectedPage: Dispatch<SetStateAction<number[]>>;
  pages: pdfjsLib.PDFPageProxy[];
};

const PreviewSection = ({
  selectedPdf,
  selectedPage,
  changeSelectedPage,
  pages,
}: propTypes): JSX.Element => {
  const context = useContext(Context);
  const theme = useTheme();
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    setShow(true);
  }, [selectedPdf]);

  const toggleShow = () => {
    setShow((prev) => !prev);
  };

  return (
    <>
      <Button
        variant="contained"
        endIcon={show ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        sx={{
          position: "fixed",
          top: `calc(${context.navHeight} + 2px)`,
          left: 0,
          width: "200px",
          height: "30px",
          color: theme.color.primary,
          backgroundColor: "white",
          zIndex: 10000,
          borderRadius: 0,
          boxShadow:
            "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
          ":hover": {
            color: theme.color.primary,
            backgroundColor: theme.color.buttonHover,
            boxShadow:
              "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
          },
        }}
        onClick={toggleShow}
      >
        PAGE
      </Button>
      {show && (
        <PreviewContainer navHeight={context.navHeight}>
          {pages.map((page, order: number) => (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "10px",
                margin: "20px 0px",
              }}
            >
              <PreviewPdf
                height={200}
                width={150}
                key={order}
                page={page}
                pageNumber={order}
                isSelectedPage={selectedPage === order}
                selectedPdf={selectedPdf}
                changeSelectedPage={changeSelectedPage}
              />
              <Typography>{order + 1}</Typography>
            </Box>
          ))}
        </PreviewContainer>
      )}
    </>
  );
};

export default PreviewSection;

interface CustomBoxProps extends BoxProps {
  navHeight: string;
}

const PreviewContainer = styled(Box)<CustomBoxProps>(
  ({ navHeight, theme }) => ({
    position: "fixed",
    top: `calc(${navHeight} + 40px)`,
    left: 0,
    width: "200px",
    height: `calc(100vh - ${navHeight})`,
    background: theme.color.buttonHover,
    overflow: "hidden",
    overflowY: "auto",
    zIndex: 10000,
    boxShadow:
      "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
  })
);

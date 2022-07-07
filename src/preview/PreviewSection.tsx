import {
  Box,
  BoxProps,
  Button,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import * as pdfjsLib from "pdfjs-dist";
import React, {
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
import { InView } from "react-intersection-observer";
type propTypes = {
  selectedPdf: number;
  selectedPage: number;
  changeSelectedPage: Dispatch<SetStateAction<number[]>>;
  pages: pdfjsLib.PDFPageProxy[];
  changeLoading: Dispatch<SetStateAction<boolean>>;
};

const PreviewSection = ({
  selectedPdf,
  selectedPage,
  changeSelectedPage,
  pages,
  changeLoading,
}: propTypes): JSX.Element => {
  const context = useContext(Context);
  const theme = useTheme();
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    setShow(true);
    changeLoading(true);
    setTimeout(() => {
      changeLoading(false);
    }, Math.min(pages.length * 10, 4000));
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
            <InView key={order}>
              {({ inView, ref, entry }) => (
                <Box
                  ref={ref}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "10px",
                    margin: "20px 0px",
                  }}
                >
                  {inView && (
                    <>
                      <PreviewPdf
                        height={200}
                        width={150}
                        page={page}
                        pageNumber={order}
                        isSelectedPage={selectedPage === order}
                        selectedPdf={selectedPdf}
                        changeSelectedPage={changeSelectedPage}
                      />
                      <Typography>{order + 1}</Typography>
                    </>
                  )}
                </Box>
              )}
            </InView>
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
    height: `calc(100vh - ${navHeight} - 40px)`,
    background: theme.color.buttonHover,
    overflow: "hidden",
    overflowY: "auto",
    zIndex: 10000,
    boxShadow:
      "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
  })
);

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

  useEffect(() => {
    changeLoading(true);
    setTimeout(() => {
      changeLoading(false);
    }, Math.min(pages.length * 10, 4000));
  }, [selectedPdf]);

  console.log(pages);

  return (
    <PreviewContainer navHeight={context.navHeight}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          overflowX: "auto",
        }}
      >
        {pages.map((page, order: number) => (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "5px",
              margin: "20px",
            }}
          >
            <PreviewPdf
              height={200}
              width={200}
              page={page}
              pageNumber={order}
              isSelectedPage={selectedPage === order}
              selectedPdf={selectedPdf}
              changeSelectedPage={changeSelectedPage}
            />
            <Typography fontSize="14px" sx={{ color: "#333333" }}>
              page {order + 1}
            </Typography>
          </Box>
        ))}
      </Box>
    </PreviewContainer>
  );
};

export default PreviewSection;

interface CustomBoxProps extends BoxProps {
  navHeight: string;
}

const PreviewContainer = styled(Box)<CustomBoxProps>(
  ({ navHeight, theme }) => ({
    position: "fixed",
    top: "50px",
    left: "5%",
    width: "90%",
    boxSizing: "border-box",
    backgroundColor: "white",
    borderRadius: "32px",
    boxShadow: "0px 1px 4px 0px gray",
    padding: "10px",
    paddingTop: "70px",
    paddingLeft: "30px",
    paddingRight: "30px",
    display: "flex",
    alignItems: "center",
    zIndex: 700,
  })
);

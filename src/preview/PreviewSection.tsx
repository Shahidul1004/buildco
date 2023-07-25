import { Box, BoxProps, styled, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { FixedSizeList } from "react-window";
import PreviewPdf from "./PreviewPdf";
import { PDFPageProxy } from "pdfjs-dist";

type propTypes = {
  selectedPdf: number;
  selectedPage: number;
  changeSelectedPage: Dispatch<SetStateAction<number[]>>;
  pages: PDFPageProxy[];
  previewPages: HTMLImageElement[];
  isGroupOpen: boolean;
};

const PreviewSection = ({
  selectedPdf,
  selectedPage,
  changeSelectedPage,
  pages,
  previewPages,
  isGroupOpen,
}: propTypes): JSX.Element => {
  const ListItem = ({ index, style }) => {
    const page = pages[index];
    return (
      <Box
        style={style}
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
          height={page.getViewport({ scale: 1 }).height}
          width={page.getViewport({ scale: 1 }).width}
          ratio={Math.min(
            200 / page.getViewport({ scale: 1 }).height,
            200 / page.getViewport({ scale: 1 }).width
          )}
          previewPage={previewPages[index]}
          pageNumber={index}
          isSelectedPage={selectedPage === index}
          selectedPdf={selectedPdf}
          changeSelectedPage={changeSelectedPage}
        />
        <Typography fontSize="14px" sx={{ color: "#333333" }}>
          page {index + 1}
        </Typography>
      </Box>
    );
  };

  return (
    <PreviewContainer isGroupOpen={isGroupOpen}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          overflowX: "auto",
        }}
      >
        <FixedSizeList
          height={270}
          itemCount={previewPages.length}
          itemSize={244}
          width={isGroupOpen ? 1370 : 970}
          direction="horizontal"
          layout="horizontal"
          style={{
            overflowY: "hidden",
          }}
        >
          {ListItem}
        </FixedSizeList>
      </Box>
    </PreviewContainer>
  );
};

export default PreviewSection;

interface CustomBoxProps extends BoxProps {
  isGroupOpen: boolean;
}

const PreviewContainer = styled(Box)<CustomBoxProps>(({ isGroupOpen }) => ({
  position: "fixed",
  top: "50px",
  left: isGroupOpen ? `calc(50% - 715px)` : `calc(50% - 515px)`,
  width: isGroupOpen ? "1430px" : "1030px",
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
}));

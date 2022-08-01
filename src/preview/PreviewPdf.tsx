import { Box } from "@mui/material";
import * as pdfjsLib from "pdfjs-dist";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

type propTypes = {
  page: pdfjsLib.PDFPageProxy;
  height: number;
  width: number;
  pageNumber: number;
  isSelectedPage: boolean;
  changeSelectedPage: Dispatch<SetStateAction<number[]>>;
  selectedPdf: number;
};

const PreviewPdf = ({
  page,
  height,
  width,
  pageNumber,
  isSelectedPage,
  changeSelectedPage,
  selectedPdf,
}: propTypes): JSX.Element => {
  const [dimension, setDimension] = useState<{
    height: string;
    width: string;
  }>();
  const cnvRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = cnvRef.current;
    const ctx = canvas!.getContext("2d") as CanvasRenderingContext2D;
    const viewport = page.getViewport({ scale: 1 });

    canvas!.height = viewport.height;
    canvas!.width = viewport.width;

    const ratio = Math.min(height / canvas!.height, width / canvas!.width);

    setDimension({
      height: canvas!.height * ratio + "px",
      width: canvas!.width * ratio + "px",
    });

    page.render({ canvasContext: ctx, viewport });
    canvas!.style.height = canvas!.height * ratio + "px";
    canvas!.style.width = canvas!.width * ratio + "px";
  }, [page]);

  return (
    <Box
      sx={{
        position: "relative",
        height: dimension ? dimension.height : height,
        width: dimension ? dimension.width : width,
        border: isSelectedPage ? "2px solid #FFBC01" : "2px solid transparent",
        boxShadow: "0 0 8px 0px rgb(0 0 0 / 20%)",
        ":hover": {
          boxShadow: "0 0 8px 4px rgb(0 0 0 / 20%)",
        },
      }}
    >
      <canvas
        style={{ background: "white", cursor: "pointer" }}
        ref={cnvRef}
        onClick={() =>
          changeSelectedPage((prev) => {
            const temp = [...prev];
            temp.splice(selectedPdf, 1, pageNumber);
            return temp;
          })
        }
      />
    </Box>
  );
};

export default PreviewPdf;

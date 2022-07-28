import * as pdfjsLib from "pdfjs-dist";
import { scaleInfoType } from "../utils";
pdfjsLib.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry.js");

// const readFileAsync = (file: File) => {
//   return new Promise((resolve, reject) => {
//     let reader = new FileReader();
//     reader.onload = () => {
//       resolve(reader.result);
//     };
//     reader.onerror = reject;
//     reader.readAsArrayBuffer(file);
//   });
// };
// const downloadDocument = (
//   file: File,
//   filename: string,
//   type: string,
//   ref: HTMLAnchorElement
// ) => {
//   const link = ref.current;
//   link.download = filename;
//   let binaryData = [];
//   binaryData.push(file);
//   link.href = URL.createObjectURL(new Blob(binaryData, { type: type }));
//   link.click();
// };

const getFileName = async (
  files: File | FileList
): Promise<string | string[]> => {
  if (files instanceof File) return files.name;
  const names = [];
  for (const file of files) {
    names.push(file.name);
  }
  return names;
};

const PdfjsDocument = async (
  files: FileList
): Promise<pdfjsLib.PDFDocumentProxy[]> => {
  const docs: pdfjsLib.PDFDocumentProxy[] = [];
  for (const file of files) {
    const pdfDoc = await pdfjsLib
      .getDocument(URL.createObjectURL(file))
      .promise.then((pdf: pdfjsLib.PDFDocumentProxy) => pdf);
    docs.push(pdfDoc);
  }
  return docs;
};

// const PdfLibDocument = async (files) => {
//   if (files.length === undefined) {
//     // eslint-disable-next-line no-undef
//     return await PDFLib.PDFDocument.load(await readFileAsync(files));
//   }
//   const docs = [];
//   for (const file of files) {
//     // eslint-disable-next-line no-undef
//     const pdfDoc = await PDFLib.PDFDocument.load(await readFileAsync(file));
//     docs.push(pdfDoc);
//   }
//   return docs;
// };

const pdfjsExtractPages = async (
  pdfDoc: pdfjsLib.PDFDocumentProxy,
  pageIndex: number[]
): Promise<pdfjsLib.PDFPageProxy[]> => {
  const pdfPages: pdfjsLib.PDFPageProxy[] = [];
  const promises: Promise<pdfjsLib.PDFPageProxy>[] = [];

  for (const index of pageIndex) {
    await pdfDoc.getPage(index).then((page) => {
      const promise = new Promise<pdfjsLib.PDFPageProxy>((resolve, reject) =>
        resolve(page)
      );
      promises.push(promise);
    });
  }
  await Promise.all(promises).then((pages) => {
    pdfPages.push(...pages);
  });
  return pdfPages;
};

// const createNewDocument = async (
//   pdfDoc,
//   pageIndex,
//   pageRotation,
//   fileName,
//   ref
// ) => {
//   if (pageIndex.length !== pageRotation.length) {
//     return;
//   }
//   // eslint-disable-next-line no-undef
//   const newPdf = await PDFLib.PDFDocument.create();
//   const pages = await newPdf.copyPages(pdfDoc, [...pageIndex]);
//   pages.map((page, index) => {
//     if (pageRotation[index]) {
//       // eslint-disable-next-line no-undef
//       page.setRotation(PDFLib.degrees(90 * pageRotation[index]));
//     }
//     newPdf.addPage(page);
//   });
//   const pdfData = await newPdf.save();
//   downloadDocument(pdfData, fileName, "application/pdf", ref);
// };

// const createImageBuffer = async (images) => {
//   const promises = [];
//   for (const image of images) {
//     const reader = new FileReader();
//     reader.readAsDataURL(image);
//     const promise = new Promise((resolve, reject) => {
//       reader.onloadend = () => resolve(reader.result);
//     });
//     promises.push(promise);
//   }
//   const bufferPromises = [];
//   await Promise.all(promises).then((results) => {
//     for (const result of results) {
//       const img = new Image();
//       img.src = result;
//       const bufferPromise = new Promise((resolve, reject) => {
//         setTimeout(() => {
//           reject();
//         }, 5000);
//         img.onload = () => resolve(img);
//       });
//       bufferPromises.push(bufferPromise);
//     }
//   });
//   const imageBuffers = [];
//   await Promise.all(bufferPromises).then((buffers) => {
//     imageBuffers.push(...buffers);
//   });
//   return imageBuffers;
// };

// const createImageURL = async (images) => {
//   const promises = [];
//   const imageUrls = [];
//   for (const image of images) {
//     const reader = new FileReader();
//     reader.readAsDataURL(image);
//     const promise = new Promise((resolve, reject) => {
//       reader.onloadend = (e) => resolve(e.target.result);
//     });
//     promises.push(promise);
//   }
//   await Promise.all(promises).then((results) => {
//     imageUrls.push(...results);
//   });
//   return imageUrls;
// };

// const getRGBColorCode = (color) => {
//   if (color === "black") return [0, 0, 0];
//   if (color === "green") return [0, 0.5, 0];
//   if (color === "blue") return [0, 0, 1];
//   if (color === "red") return [1, 0, 0];
//   if (color === "orange") return [1, 0.5, 0];
//   if (color === "yellow") return [1, 1, 0];
//   if (color === "white") return [1, 1, 1];
// };

// const getURLforCustomFont = (font) => {
//   if (font === "Roboto_400_normal")
//     return "https://fonts.gstatic.com/s/roboto/v29/KFOmCnqEu92Fr1Mu4mxK.woff2";
//   if (font === "Courier Prime_400_normal")
//     return "https://fonts.gstatic.com/s/courierprime/v5/u-450q2lgwslOqpF_6gQ8kELawFpWg.woff2";
//   if (font === "Montserrat_400_normal")
//     return "https://fonts.gstatic.com/s/montserrat/v23/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw9aXpsog.woff2";
// };

const getPairedPoint = (point: number[]) => {
  const paired = [];
  for (let idx = 0; idx < point.length; idx += 2) {
    paired.push([point[idx], point[idx + 1]]);
  }
  return paired as any;
};

const rgba2hex = (rgba: any) => {
  if (!rgba) return "#ffffff";
  const { r, g, b, a } = rgba;
  var outParts = [
    r.toString(16),
    g.toString(16),
    b.toString(16),
    Math.round(a * 255)
      .toString(16)
      .substring(0, 2),
  ];
  outParts.forEach(function (part, i) {
    if (part.length === 1) {
      outParts[i] = "0" + part;
    }
  });
  return "#" + outParts.join("");
};

const isClockwise = (points: number[]) => {
  let vertices = [...points, points[0], points[1]];
  let area = 0.0;
  for (let i = 2; i < vertices.length; i += 2) {
    area +=
      (vertices[i] - vertices[i - 2]) * (vertices[i + 1] + vertices[i + 1 - 2]);
  }
  return area < 0;
};
const polygonArea = (vertices: number[]) => {
  var total = 0;
  for (var i = 0, l = vertices.length / 2; i < l; i++) {
    var addX = vertices[2 * i];
    var addY = vertices[2 * i === vertices.length - 2 ? 1 : 2 * i + 3];
    var subX = vertices[2 * i === vertices.length - 2 ? 0 : 2 * i + 2];
    var subY = vertices[2 * i + 1];
    total += addX * addY * 0.5;
    total -= subX * subY * 0.5;
  }
  return Math.abs(total);
};

const getLength = (points: number[]) => {
  let length = 0.0;
  for (let i = 2; i < points.length; i += 2) {
    const deltaX = points[i] - points[i - 2];
    const deltaY = points[i + 1] - points[i + 1 - 2];
    length += Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }
  return length;
};

const getScaledVolume = (
  area: number,
  scaleInfo: scaleInfoType,
  unit: string,
  height: number | undefined,
  depth: number | undefined,
  pitch: number | undefined
) => {
  const dim = height || depth || pitch;
  if (unit === "px") {
    if (dim) {
      return `${(area * dim).toFixed(2)} px3`;
    } else {
      return `${area.toFixed(2)} px2`;
    }
  } else if (unit === "ft") {
    if (dim) {
      return `${(
        (area * scaleInfo.L * scaleInfo.L * dim) /
        (1.0 * scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y)
      ).toFixed(2)} ft3`;
    } else {
      return `${(
        (area * scaleInfo.L * scaleInfo.L) /
        (1.0 * scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y)
      ).toFixed(2)} ft2`;
    }
  } else if (unit === "in") {
    if (dim) {
      return `${(
        (area * scaleInfo.L * scaleInfo.L * dim * 144) /
        (1.0 * scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y)
      ).toFixed(2)} in3`;
    } else {
      return `${(
        (area * scaleInfo.L * scaleInfo.L * 144) /
        (1.0 * scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y)
      ).toFixed(2)} in2`;
    }
  } else {
    return "0 unit";
  }
};

const getScaledArea = (
  area: number,
  scaleInfo: scaleInfoType,
  unit: string
) => {
  if (unit === "px") {
    return `${area.toFixed(2)} px2`;
  } else if (unit === "ft") {
    return `${(
      (area * scaleInfo.L * scaleInfo.L) /
      (1.0 * scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y)
    ).toFixed(2)} ft2`;
  } else if (unit === "in") {
    return `${(
      (area * scaleInfo.L * scaleInfo.L * 144) /
      (1.0 * scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y)
    ).toFixed(2)} in2`;
  } else {
    return "0 unit";
  }
};

export {
  // readFileAsync,
  getFileName,
  PdfjsDocument,
  // PdfLibDocument,
  pdfjsExtractPages,
  // createNewDocument,
  // downloadDocument,
  // createImageBuffer,
  // createImageURL,
  // getRGBColorCode,
  // getURLforCustomFont,
  getPairedPoint,
  rgba2hex,
  polygonArea,
  isClockwise,
  getLength,
  getScaledVolume,
  getScaledArea,
};

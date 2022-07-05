import * as pdfjsLib from "pdfjs-dist";
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
};

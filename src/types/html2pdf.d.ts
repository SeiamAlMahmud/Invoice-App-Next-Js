// declare module 'html2pdf.js' {
//     interface Html2PdfOptions {
//       filename?: string;
//       image?: { type: string; quality: number };
//       jsPDF?: { unit: string; format: string; orientation: string };
//     }
  
//     interface Html2Pdf {
//       (): Html2Pdf; // Fix: html2pdf function returns Html2Pdf, not void
//       from(element: HTMLElement): Html2Pdf;
//       toPdf(): unknown; // We use unknown for now as it's safer than any
//       save(): void;
//       set(options: Html2PdfOptions): Html2Pdf;
//     }
  
//     const html2pdf: Html2Pdf;
//     export default html2pdf;
//   }
  
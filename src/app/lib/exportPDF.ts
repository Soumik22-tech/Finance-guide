import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportBudgetPDF(
  elementId: string,
  fileName: string
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Temporarily make element visible if hidden, capture, then restore
  const canvas = await html2canvas(element, {
    // @ts-ignore
    scale: 2, // retina quality
    useCORS: true,
    backgroundColor: "#f8f9fc",
    logging: false,
    onclone: (doc: Document) => {
      const style = doc.createElement("style");
      style.innerHTML = `* { font-family: Arial, sans-serif !important; }`;
      doc.head.appendChild(style);
    }
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * pageWidth) / canvas.width;

  // If content taller than one page, split across pages
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(fileName);
}

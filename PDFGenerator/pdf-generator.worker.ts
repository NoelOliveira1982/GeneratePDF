import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(pdfMake as any).addVirtualFileSystem(pdfFonts);

interface WorkerMessage {
  jsonContent: string;
}

function parseContentJson(jsonString: string): TDocumentDefinitions {
  try {
    return JSON.parse(jsonString) as TDocumentDefinitions;
  } catch (e) {
    console.error("Erro ao analisar JSON:", e);
    return {
      content: [
        { text: "Erro: JSON inválido", style: 'error' },
        { text: jsonString, style: 'rawContent' }
      ],
      styles: {
        error: { color: 'red', fontSize: 14 },
        rawContent: { fontSize: 10, color: '#666' }
      }
    };
  }
}

self.addEventListener("message", (event: MessageEvent<WorkerMessage>) => {
  const { jsonContent } = event.data;

  if (!jsonContent) {
    console.error("JSON vazio ou inválido.");
    return;
  }

  const docDefinition = parseContentJson(jsonContent);
  const pdfDocGenerator = pdfMake.createPdf(docDefinition);

  pdfDocGenerator.getBlob((blob) => {
    const reader = new FileReader();
    reader.onload = () => {
      self.postMessage({ pdfBase64: reader.result });
    };
    reader.readAsDataURL(blob);
  });
});
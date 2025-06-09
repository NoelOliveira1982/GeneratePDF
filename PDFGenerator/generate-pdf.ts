import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from "pdfmake/interfaces";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(pdfMake as any).addVirtualFileSystem(pdfFonts);

export function parseContentJson(jsonString: string): TDocumentDefinitions {
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

export async function generatePDF(contentJson: string, docName: string): Promise<void> {
  try {
    if (!contentJson) {
      throw new Error("JSON de conteúdo não fornecido");
    }

    const docDefinition = parseContentJson(contentJson);
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.download(docName);

  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
  }
}
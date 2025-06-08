//const worker = new Worker('../out/pdf-worker.bundle.js');

const worker = new Worker(new URL('./pdf-generator.worker.ts', import.meta.url), {
  type: 'module',
});


export async function generatePDF(contentJson: string, docName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      if (!contentJson) {
        throw new Error("JSON de conteúdo não fornecido");
      }

      worker.onmessage = (event) => {
        if (event.data.error) {
          console.error("Erro vindo do worker via postMessage:", event.data.error);
          reject(new Error(event.data.error));
          return;
        }

        if (event.data.pdfBase64) {
          const link = document.createElement('a');
          link.href = event.data.pdfBase64;
          link.download = docName + ".pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          resolve();
        }
      };

      worker.onerror = (event: ErrorEvent) => {
        console.error("Erro no worker:", event);
        reject(new Error(event.message));
      };

      worker.postMessage({ jsonContent: contentJson });

    } catch (error) {
      console.error("Erro ao iniciar geração do PDF:", error);
      reject(error);
    }
  });
}

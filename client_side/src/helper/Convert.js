
export default function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = error => {
      reject(error);
    };
  });
}

export async function downloadResume(resumeUrl) {
  if (resumeUrl !== 'N/A') {
    // Constant string for the file name
    const fileName = 'PostFile';

    // Create an anchor element to initiate the download
    var link = document.createElement('a');
    link.href = resumeUrl;

    // Set the download attribute with the constant file name
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // Handle the case when the resume is not available
    alert('File not available for download.');
  }
};

export function viewResumeInPDF(base64Data) {
  if (base64Data !== 'N/A') {
    // Check if the provided data is a PDF
    if (base64Data.startsWith('data:application/pdf')) {
      const pdfWindow = window.open('', '_blank');
      pdfWindow.document.write(`
        <html>
          <head>
            <title>Job Description</title>
          </head>
          <body>
            <iframe width="100%" height="100%" src="${base64Data}" type="application/pdf"></iframe>
          </body>
        </html>
      `);
      pdfWindow.document.close();
    } else {
      alert('The file is not in PDF format. Please download the file.');
    }
  } else {
    alert('Resume not available for viewing.');
  }
}






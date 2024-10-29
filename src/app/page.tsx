// // pages/index.tsx
// "use client";

// import { useEffect, useState } from 'react';

// const FileReader: React.FC = () => {
//   const [content, setContent] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchFileContent = async () => {
//       try {
//         const response = await fetch('/api/getpath');

//         const data = await response.json();
//         setContent(data.content);
//       } catch (err: unknown) {
//         if (err instanceof Error) {
//           setError(err.message); // Safely access the error message
//         } else {
//           setError('An unknown error occurred');
//         }
//       }
//     };

//     fetchFileContent();
//   }, []);

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div>
//       {content ? <pre>{content}</pre> : 'Loading...'}
//     </div>
//   );
// };

// const HomePage: React.FC = () => {
//   return (
//     <div>
//       <h1>File Content</h1>
//       <FileReader />
//     </div>
//   );
// };

// export default HomePage;





"use client";

import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string | ArrayBuffer | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [excelData, setExcelData] = useState<any[][]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    setContent(null);
    setError(null);
    setPdfUrl(null);
    setExcelData([]);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;

        if (result !== undefined) {
          if (selectedFile.type.startsWith('image/')) {
            setContent(result as string);
          } else if (selectedFile.type === 'application/pdf') {
            const blob = new Blob([result as ArrayBuffer], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
          } else if (
            selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            selectedFile.type === 'application/vnd.ms-excel'
          ) {
            const data = new Uint8Array(result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            setExcelData(jsonData as any[][]);
          } else if (
            selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            selectedFile.type === 'application/msword'
          ) {
            const blob = new Blob([result as ArrayBuffer], { type: selectedFile.type });
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
          } else if (selectedFile.type === 'text/plain' || selectedFile.type === 'application/xml' || selectedFile.type === 'text/xml') {
            setContent(result as string);
          } else {
            setError('File content is not readable.');
          }
        }
      };

      if (selectedFile.type.startsWith('image/')) {
        reader.readAsDataURL(selectedFile);
      } else if (selectedFile.type === 'application/pdf') {
        reader.readAsArrayBuffer(selectedFile);
      } else if (
        selectedFile.type.startsWith('application/vnd.openxmlformats-officedocument') ||
        selectedFile.type.startsWith('application/vnd.ms-excel')
      ) {
        reader.readAsArrayBuffer(selectedFile);
      } else {
        reader.readAsText(selectedFile);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {file && <h4>Selected File: {file.name}</h4>}
      {content && !pdfUrl && (
        <div>
          <h3>File Content:</h3>
          {file?.type.startsWith('image/') ? (
            <img src={content as string} alt="Uploaded" style={{ maxWidth: '100%' }} />
          ) : (
            <pre>{content.toString()}</pre>
          )}
        </div>
      )}
      {excelData.length > 0 && (
        <div>
          <h3>Excel Data:</h3>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <tbody>
              {excelData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} style={{ border: '1px solid black', padding: '8px' }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pdfUrl && (
        <div>
          <h3>Preview:</h3>
          <iframe src={pdfUrl} width="600" height="400" title="Document Preview" />
          <button onClick={() => window.open(pdfUrl)}>Print Document</button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

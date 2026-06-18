import { useState } from 'react';
import './App.css';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/db-test');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ message: 'Failed to connect', error: err.message });
    }
    setLoading(false);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Vui lòng chọn file trước!');
      return;
    }

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setUploadResult(data);
    } catch (err) {
      setUploadResult({ message: 'Upload failed', error: err.message });
    }
  };

  return (
    <div>
      <h1>AI Resume Analyzer</h1>

      <hr />
      <h2>Upload Resume</h2>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      {selectedFile && (
        <p>Đã chọn: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)</p>
      )}
      <button onClick={handleUpload}>Upload File</button>
      {uploadResult && (
        <pre>{JSON.stringify(uploadResult, null, 2)}</pre>
      )}

      <hr />
      <h2>Test Backend</h2>
      <button onClick={testConnection}>Test Backend Connection</button>
      {loading && <p>Loading...</p>}
      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}

export default App;

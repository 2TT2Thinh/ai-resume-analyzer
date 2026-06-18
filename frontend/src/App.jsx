import { useState } from 'react';
import './App.css';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div>
      <h1>AI Resume Analyzer</h1>
      <button onClick={testConnection}>Test Backend Connection</button>
      {loading && <p>Loading...</p>}
      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}

export default App;

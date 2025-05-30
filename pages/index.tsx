import { useState } from 'react';

type UploadResult = Record<string, unknown> | null;

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<UploadResult>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data: UploadResult = await res.json();
      setResult(data);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>UGC IP Verification</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        style={{ marginLeft: '1rem' }}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      {file && (
        <p style={{ marginTop: '1rem' }}>
          Selected file: <strong>{file.name}</strong>
        </p>
      )}

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Result:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}

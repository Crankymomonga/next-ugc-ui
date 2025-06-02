return (
  <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
    <h1>UGC IP Verification</h1>

    <input
      type="file"
      onChange={(e) => setFile(e.target.files?.[0] || null)}
      accept="image/*"
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
  </main> // ← これが抜けている！
);

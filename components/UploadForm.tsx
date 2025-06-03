import React, { useState } from "react";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    setResponse(json);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
}

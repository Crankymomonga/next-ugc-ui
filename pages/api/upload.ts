import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false, // ストリーム処理するため
  },
};

// 型定義：ReadableStreamの型を明示
async function bufferRequestStream(req: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = req.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const readable = req as unknown as ReadableStream<Uint8Array>; // ← これで any を使わずキャスト
    const fileBuffer = await bufferRequestStream(readable);

    res.status(200).json({
      message: 'ファイル受け取り完了',
      size: fileBuffer.length,
    });
  } catch (error) {
    console.error('Upload handler error:', error);
    res.status(500).json({ message: 'Upload failed on server' });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const chunks: Buffer[] = [];
    const reader = req as unknown as AsyncIterable<Buffer>;
    for await (const chunk of reader) {
      chunks.push(chunk);
    }
    const fileBuffer = Buffer.concat(chunks);

    res.status(200).json({
      message: 'ファイル受け取り完了',
      size: fileBuffer.length,
    });
  } catch (error) {
    console.error('Upload handler error:', error);
    res.status(500).json({ message: 'Upload failed on server' });
  }
}

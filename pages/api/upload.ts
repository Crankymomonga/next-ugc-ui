import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const chunks: Buffer[] = [];
    for await (const chunk of req.body as any) {
      chunks.push(chunk);
    }
    const fileBuffer = Buffer.concat(chunks);

    // 仮の処理：ファイルサイズだけ返す
    res.status(200).json({
      message: 'ファイル受け取り完了',
      size: fileBuffer.length,
    });
  } catch (error) {
    console.error('Upload handler error:', error);
    res.status(500).json({ message: 'Upload failed on server' });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File as FormidableFile } from 'formidable';
import fs from 'fs';


export const config = {
  api: {
    bodyParser: false, // ← ファイルアップロードには必要
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = formidable({ uploadDir: './temp', keepExtensions: true });

  try {
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Formidable error:', err);
        return res.status(500).json({ message: 'Form parsing failed' });
      }

      const uploadedFile = files.file as FormidableFile;
      if (!uploadedFile || Array.isArray(uploadedFile)) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // ここでファイルサイズなどを返すだけ（例）
      const stats = fs.statSync(uploadedFile.filepath);

      return res.status(200).json({
        message: 'ファイル受け取り完了',
        size: stats.size,
        filename: uploadedFile.originalFilename,
      });
    });
  } catch (error) {
    console.error('Upload handler error:', error);
    res.status(500).json({ message: 'Upload failed on server' });
  }
}

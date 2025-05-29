import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import os from 'os';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // 必須: formidable を使うときは bodyParser を無効化
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const uploadDir = path.join(os.tmpdir(), 'uploads');

  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Formidable error:', err);
        return res.status(500).json({ message: 'Form parsing failed' });
      }

      const fileData = files.file;
      const uploadedFile = Array.isArray(fileData) ? fileData[0] : fileData;

      if (!uploadedFile || !uploadedFile.filepath) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const stats = fs.statSync(uploadedFile.filepath);

      return res.status(200).json({
        message: 'ファイル受け取り完了',
        size: stats.size,
        filename: uploadedFile.originalFilename || 'unknown',
      });
    });
  } catch (error) {
    console.error('Upload handler error:', error);
    return res.status(500).json({ message: 'Upload failed on server' });
  }
}

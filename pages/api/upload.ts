import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File as FormidableFile } from 'formidable';
import fs from 'fs';
import path from 'path';

// Next.jsがbodyParserを使わないように設定
export const config = {
  api: {
    bodyParser: false,
  },
};

// アップロードディレクトリを指定
const uploadDir = path.join(process.cwd(), '/temp');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = formidable({ uploadDir, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parsing error:', err);
      return res.status(500).json({ message: 'Upload failed on server' });
    }

    const uploadedFile = files.file as FormidableFile;
    const filePath = uploadedFile.filepath;

    // ここでAI解析に回せるよう、filePathを渡す
    console.log('Uploaded file saved at:', filePath);

    return res.status(200).json({
      message: 'ファイル受け取り完了',
      path: filePath,
      size: uploadedFile.size,
    });
  });
}

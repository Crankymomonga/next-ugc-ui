from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from utils.vision import analyze_image

load_dotenv()

# gcloud-key.json を環境変数から保存（必要な場合）
if os.getenv("GCLOUD_KEY_JSON"):
    with open("gcloud-key.json", "w") as f:
        f.write(os.getenv("GCLOUD_KEY_JSON"))

app = FastAPI()

# ✅ CORS 設定（Vercel からのリクエストを許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://next-ugc-ui.vercel.app"],  # デプロイ先ドメインに応じて変更
    allow_credentials=True,
    allow_methods=["*"],  # または ["GET", "POST", "OPTIONS"] に限定してもOK
    allow_headers=["*"],  # または ["Content-Type"] に限定してもOK
)

# ✅ 画像アップロードAPI
@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    result = await analyze_image(file)
    return result

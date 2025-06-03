# main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from utils.vision import analyze_image  # 自前の画像解析処理

load_dotenv()

# gcloud-key.json を環境変数から保存（必要な場合）
if os.getenv("GCLOUD_KEY_JSON"):
    with open("gcloud-key.json", "w") as f:
        f.write(os.getenv("GCLOUD_KEY_JSON"))

app = FastAPI()

# CORS 設定：Vercel の URL を明示
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://next-ugc-ui.vercel.app"],  # ✅ 本番フロントエンドURL
    allow_credentials=True,
    allow_methods=["*"],  # "GET", "POST", "OPTIONS" でもOK
    allow_headers=["*"],  # "Content-Type" でもOK
)

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    result = await analyze_image(file)
    return result

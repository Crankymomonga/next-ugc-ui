from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from utils.vision import analyze_image

load_dotenv()

# gcloud-key.json を環境変数から保存
if os.getenv("GCLOUD_KEY_JSON"):
    with open("gcloud-key.json", "w") as f:
        f.write(os.getenv("GCLOUD_KEY_JSON"))

app = FastAPI()

# ✅ ここが重要：Vercel 本番 URL を明示
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://next-ugc-ui.vercel.app"],
    allow_credentials=True,_

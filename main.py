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

# ✅ CORS設定：Vercelの本番URLを明示
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://next-ugc-ui.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    result = await analyze_image(file)
    return result

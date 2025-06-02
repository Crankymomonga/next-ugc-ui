from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from utils.vision import analyze_image

load_dotenv()

# === gcloud-key.json を環境変数からファイルとして保存 ===
if os.getenv("GCLOUD_KEY_JSON"):
    with open("gcloud-key.json", "w") as f:
        f.write(os.getenv("GCLOUD_KEY_JSON"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    result = await analyze_image(file)
    return result

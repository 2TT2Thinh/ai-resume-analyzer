from fastapi import FastAPI, File, UploadFile

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI AI Service!"}

@app.get("/analyze")
def analyze_resume():
    return {"status": "ready", "service": "resume-analyzer"}

@app.post("/process")
async def process_resume(file: UploadFile = File(...)):
    contents = await file.read()
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "size_bytes": len(contents),
    }

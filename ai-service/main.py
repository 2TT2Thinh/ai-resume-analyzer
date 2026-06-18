from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI AI Service!"}

@app.get("/analyze")
def analyze_resume():
    return {"status": "ready", "service": "resume-analyzer"}

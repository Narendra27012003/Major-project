from fastapi import APIRouter
from pydantic import BaseModel
import os
import google.generativeai as genai
from dotenv import load_dotenv

router = APIRouter()

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Configure Gemini API
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")  # You can use gemini-pro, gemini-flash etc.

class QueryRequest(BaseModel):
    query: str

@router.post("/ask-ai")
async def ask_ai(request: QueryRequest):
    try:
        response = model.generate_content(request.query)
        return {"response": response.text}
    except Exception as e:
        print("Error:", e)
        return {"response": "Sorry, I could not process your request."}

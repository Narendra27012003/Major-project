# app/api/ask_ai.py
from fastapi import APIRouter
from pydantic import BaseModel
import os
import google.generativeai as genai
from dotenv import load_dotenv
from .ai_pdf import pdf_memory  # Shared in-memory context

router = APIRouter()

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

class ChatHistory(BaseModel):
    messages: list[str]

@router.post("/ask-ai")
async def ask_ai(payload: ChatHistory):
    try:
        history = "\n".join(payload.messages[-10:])  # Limit to last 10 messages
        pdf_context = pdf_memory.get("last_pdf_text", "")[:3000]  # Limit to first 3K chars

        prompt = f"""
You are a heart health assistant.
Here is the last uploaded report content (if any):
{pdf_context}

Chat history:
{history}

Answer appropriately based on the report and user conversation.
"""
        response = model.generate_content(prompt)
        return {"response": response.text}
    except Exception as e:
        print("Error:", e)
        return {"response": "Sorry, I could not process your request."}

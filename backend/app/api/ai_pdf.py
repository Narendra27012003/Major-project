# app/api/ai_pdf.py
from fastapi import APIRouter, UploadFile, File
import fitz  # PyMuPDF
import os
import google.generativeai as genai

router = APIRouter()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

# 🧠 In-memory store (session-level context)
pdf_memory = {}

@router.post("/analyze-pdf")
async def analyze_pdf(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        with open("temp.pdf", "wb") as f:
            f.write(contents)

        text = ""
        doc = fitz.open("temp.pdf")
        for page in doc:
            text += page.get_text()
        doc.close()

        pdf_memory["last_pdf_text"] = text  # Store report context

        prompt = (
            "This is a heart health report. Please suggest how the person can improve their heart health:\n\n"
            + text
        )
        response = model.generate_content(prompt)
        return {"suggestion": response.text}
    except Exception as e:
        print("Error:", e)
        return {"suggestion": "Error analyzing PDF."}

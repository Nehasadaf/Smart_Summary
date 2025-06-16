import os
import sys
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-2.0-flash")
input_text = sys.argv[1]

prompt = f"Summarize the following text in a concise way:\n\n{input_text}"

response = model.generate_content(prompt)
print(response.text.strip())

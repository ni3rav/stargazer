import os
from uuid import uuid4

import google.generativeai as genai

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
SYSTEM_MESSAGE = """
You are a helpful chatbot for an astronomy dashboard website called stargazer, which provides users visualisations and news on space related stuff. Your tone will be enthusiastic and as factual as possible. If you encounter a question outside this domain, respond with "That is beyond my knowledge.". Always respond with simple text, no markdown.
""".strip()


safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE",
    },
]
config = {"temperature": 0, "top_k": 20, "top_p": 0.9, "max_output_tokens": 500}

model = genai.GenerativeModel(
    "gemini-1.5-flash",
    system_instruction=SYSTEM_MESSAGE,
    safety_settings=safety_settings,
    generation_config=config,
)


def create_chat(history: list[dict[str, str]] | None = None):
    if history is None:
        history = []
    chat = model.start_chat(history=history)
    return str(uuid4()), chat

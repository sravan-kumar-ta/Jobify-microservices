from django.conf import settings
from openai import OpenAI


class OpenAIClient:
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.embedding_model = settings.OPENAI_EMBEDDING_MODEL
        self.chat_model = settings.OPENAI_CHAT_MODEL

    def create_embedding(self, text: str) -> list[float]:
        response = self.client.embeddings.create(
            model=self.embedding_model,
            input=text,
        )
        return response.data[0].embedding

    def generate_cover_letter(self, prompt: str) -> str:
        response = self.client.chat.completions.create(
            model=self.chat_model,
            temperature=0.4,
            max_completion_tokens=250,
            messages=[
                {
                    "role": "system",
                    "content": "You write professional, realistic job application cover letters.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
        )

        return response.choices[0].message.content.strip()

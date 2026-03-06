import google.generativeai as genai
from django.conf import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-pro")

def analyze_resume(resume_text, job_description):

    try:
        prompt = f"""
        Analyze this resume against the job description.

        Resume:
        {resume_text}

        Job Description:
        {job_description}

        Return:
        - Matching Score
        - Missing Skills
        - Suggestions
        """

        response = model.generate_content(prompt)

        return response.text

    except Exception as e:
        print("AI Error:", e)
        return "AI analysis failed"
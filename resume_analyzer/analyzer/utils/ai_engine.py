import os
import google.generativeai as genai

# configure API key
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# load model
model = genai.GenerativeModel("gemini-1.5-flash-latest")


def generate_recommendations(resume_text, jd):

    prompt = f"""
You are an ATS resume analyzer.

Compare the candidate resume with the job description.

Job Description:
{jd}

Candidate Resume:
{resume_text}

Return:

1. ATS Match Score (0-100)

2. Matching Skills

3. Missing Skills

4. Resume Strengths

5. Suggestions to Improve Resume

6. Final Recommendation
"""

    response = model.generate_content(prompt)

    return response.text
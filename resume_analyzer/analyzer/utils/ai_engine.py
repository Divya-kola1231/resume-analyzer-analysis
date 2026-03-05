import google.generativeai as genai

# Put your Gemini API key here
genai.configure(api_key="AIzaSyD_x7Hi3hPS5vC88BFMhNfs4PQn-k9AjxU")

model = genai.GenerativeModel("gemini-1.5-flash")

def generate_recommendations(resume_text, jd):

    prompt = f"""
    Compare the following resume with the job description.

    Resume:
    {resume_text}

    Job Description:
    {jd}

    Give suggestions to improve the resume and list missing skills.
    """

    response = model.generate_content(prompt)

    return response.text
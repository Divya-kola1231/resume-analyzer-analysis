from openai import OpenAI

client = OpenAI(
    api_key="sk-0e11872154b3481fb92bf9036578b546",
    base_url="https://api.deepseek.com"
)

def generate_recommendations(resume_text, jd):

    prompt = f"""
    Compare the resume with the job description.

    Resume:
    {resume_text}

    Job Description:
    {jd}

    Give:
    - Matching score
    - Missing skills
    - Suggestions
    """

    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content
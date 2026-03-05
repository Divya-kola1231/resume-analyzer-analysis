from rest_framework.decorators import api_view
from rest_framework.response import Response

from .utils.resume_parser import extract_resume_text
from .utils.skill_extractor import extract_skills
from .utils.matcher import match_skills
from .utils.ai_engine import generate_recommendations


@api_view(['POST'])
def analyze_resume(request):

    resume_file = request.FILES.get('resume')
    jd = request.data.get('job_description')

    resume_text = extract_resume_text(resume_file)

    resume_skills = extract_skills(resume_text)

    jd_skills = extract_skills(jd.lower())

    score, missing = match_skills(resume_skills, jd_skills)

    try:
        ai_suggestions = generate_recommendations(resume_text, jd)
    except Exception as e:
        print("AI Error:", e)
    ai_suggestions = "AI suggestions unavailable"

    return Response({
        "resume_skills": resume_skills,
        "job_description_skills": jd_skills,
        "missing_skills": missing,
        "score": round(score, 2),
        "ai_recommendations": ai_suggestions
    })
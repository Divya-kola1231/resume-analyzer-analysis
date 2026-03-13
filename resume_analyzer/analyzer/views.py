from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .utils.resume_parser import extract_resume_text
from .utils.ai_engine import generate_recommendations, suggest_roles
from .utils.job_search import fetch_jobs
import json


@csrf_exempt
def analyze_resume(request):
    if request.method == "POST":
        resume_file = request.FILES.get("resume")
        jd = request.POST.get("job_description", "")

        if not resume_file:
            return JsonResponse({"error": "Missing resume file"})

        resume_text = extract_resume_text(resume_file)
        analysis = generate_recommendations(resume_text, jd)

        # Auto-suggest roles from extracted skills
        roles_raw = suggest_roles(analysis, "")
        role_list = [r.strip() for r in roles_raw.split("\n") if r.strip()]

        return JsonResponse({
            "analysis": analysis,
            "suggested_roles": role_list
        })

    return JsonResponse({"message": "Invalid request"})


@csrf_exempt
def fetch_jobs_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            roles = data.get("roles", [])
            location = data.get("location", "India")
            experience = data.get("experience", None)  # ← NEW: experience filter

            if not roles:
                return JsonResponse({"error": "Missing roles for job search"})

            jobs = fetch_jobs(roles, location, experience)  # ← pass experience

            return JsonResponse({"jobs": jobs})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"message": "Invalid request"})
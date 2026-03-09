from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .utils.resume_parser import extract_resume_text
from .utils.ai_engine import generate_recommendations


@csrf_exempt
def analyze_resume(request):

    if request.method == "POST":

        resume_file = request.FILES.get("resume")
        jd = request.POST.get("job_description")

        if not resume_file or not jd:
            return JsonResponse({"error": "Missing resume or job description"})

        resume_text = extract_resume_text(resume_file)

        analysis = generate_recommendations(resume_text, jd)

        return JsonResponse({
            "analysis": analysis
        })

    return JsonResponse({"message": "Invalid request"})
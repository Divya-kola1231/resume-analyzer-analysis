from django.urls import path
from .views import analyze_resume,fetch_jobs_view

urlpatterns = [
    path("analyze/", analyze_resume),
    path("jobs/", fetch_jobs_view),
]
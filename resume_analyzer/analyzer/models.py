from django.db import models

class ResumeAnalysis(models.Model):

    resume = models.FileField(upload_to="resumes/")
    job_description = models.TextField()

    score = models.FloatField()

    missing_skills = models.TextField()

    recommendations = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
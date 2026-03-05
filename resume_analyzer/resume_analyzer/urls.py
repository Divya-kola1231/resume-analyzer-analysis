from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def home(request):
    return HttpResponse("Resume Analyzer Backend Running")

urlpatterns = [
    path('', home),  # Home page
    path('admin/', admin.site.urls),
    path('api/', include('analyzer.urls')),
]
from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'school/home.html')

# Basic Education views
def grade_school(request):
    return render(request, 'school/basic_education/grade_school.html')

def junior_high(request):
    return render(request, 'school/basic_education/junior_high.html')

def senior_high(request):
    return render(request, 'school/basic_education/senior_high.html')

# College view
def college(request):
    return render(request, 'school/college.html')

# DHEI view
def dhei(request):
    return render(request, 'school/dhei.html')

# Admission Process view
def admission_process(request):
    return render(request, 'school/admission_process.html')

# News Update view
def news_update(request):
    return render(request, 'school/news_update.html')

# ORBIT views
def hali_program(request):
    return render(request, 'school/orbit/hali_program.html')

def coil_program(request):
    return render(request, 'school/orbit/coil_program.html')

# SHS-HEI view
def shs_hei(request):
    return render(request, 'school/shs_hei.html')

# E-Library view
def e_library(request):
    return render(request, 'school/e_library.html')

# Activity Calendar view
def activity_calendar(request):
    return render(request, 'school/activity_calendar.html')

# About views
def about_hccci(request):
    return render(request, 'school/about/about_hccci.html')

def vision_mission(request):
    return render(request, 'school/about/vision_mission.html')

def school_seal(request):
    return render(request, 'school/about/school_seal.html')

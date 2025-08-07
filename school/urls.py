from django.urls import path
from .views import *

urlpatterns = [
    path('', home, name='home'),
    
    # Basic Education URLs
    path('basic-education/grade-school/', grade_school, name='grade_school'),
    path('basic-education/junior-high/', junior_high, name='junior_high'),
    path('basic-education/senior-high/', senior_high, name='senior_high'),
    
    # College URL
    path('college/', college, name='college'),
    
    # DHEI URL
    path('dhei/', dhei, name='dhei'),
    
    # Admission Process URL
    path('admission-process/', admission_process, name='admission_process'),
    
    # News Update URL
    path('news-update/', news_update, name='news_update'),
    
    # ORBIT URLs
    path('orbit/hali-program/', hali_program, name='hali_program'),
    path('orbit/coil-program/', coil_program, name='coil_program'),
    
    # SHS-HEI URL
    path('shs-hei/', shs_hei, name='shs_hei'),
    
    # E-Library URL
    path('e-library/', e_library, name='e_library'),
    
    # Activity Calendar URL
    path('activity-calendar/', activity_calendar, name='activity_calendar'),
    
    # About URLs
    path('about/hccci/', about_hccci, name='about_hccci'),
    path('about/vision-mission/', vision_mission, name='vision_mission'),
    path('about/school-seal/', school_seal, name='school_seal'),
]
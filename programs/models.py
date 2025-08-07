from django.db import models
from django.utils import timezone
from django.db.models import JSONField
import uuid
import os

def unique_upload_path(instance, filename):
    ext = os.path.splitext(filename)[1]  # Gets file extension
    unique_filename = f"{uuid.uuid4()}{ext}"
    return os.path.join('programs_images/', unique_filename)

class CollegeDepartment(models.Model):
    department_name = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.department_name or "Unnamed Department"

class CollegeCourse(models.Model):
    course_short_name = models.CharField(max_length=255, blank=True, null=True)
    course_image = models.ImageField(upload_to=unique_upload_path, blank=True, null=True)
    course_name = models.CharField(max_length=255, blank=True, null=True)
    department = models.ForeignKey(CollegeDepartment, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.course_short_name or self.course_name or "Unnamed Course"

class ShsTrack(models.Model):
    track_name = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.track_name or "Unnamed Track"

class Shs_Strand(models.Model):
    strand_name = models.CharField(max_length=255, blank=True, null=True)
    track = models.ForeignKey(ShsTrack, on_delete=models.CASCADE, blank=True, null=True)
    strand_image = models.ImageField(upload_to=unique_upload_path, blank=True, null=True)
    
    def __str__(self):
        return self.strand_name or "Unnamed Strand"

class Programs(models.Model):
    college_course = models.ForeignKey(CollegeCourse, on_delete=models.CASCADE, null=True, blank=True)
    shs_strand = models.ForeignKey(Shs_Strand, on_delete=models.CASCADE, null=True, blank=True)
    type = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=250, default='Pending')

    def __str__(self):
        return f"{self.type.capitalize()} Program" if self.type else "Unnamed Program"

class ProgramsPageContent(models.Model):
    description = models.TextField(blank=True, null=True)
    description_img = models.ImageField(upload_to=unique_upload_path, blank=True, null=True)
    skills = models.JSONField(default=list, blank=True)
    skills_img = models.ImageField(upload_to=unique_upload_path, blank=True, null=True)
    career_opportunities = models.JSONField(default=list, blank=True)
    related_articles = models.JSONField(default=list, blank=True, null=True)

    def __str__(self):
        return f"Content ID {self.id}"

class ProgramsPage(models.Model):
    slug = models.SlugField(unique=True, max_length=255)
    program = models.ForeignKey(Programs, on_delete=models.CASCADE, null=True)
    content = models.ForeignKey(ProgramsPageContent, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(default=timezone.now, blank=True)
    updated_at = models.DateTimeField(default=timezone.now, blank=True)

    def __str__(self):
        return self.slug

    def get_absolute_url(self):
        return f'/{self.slug}/'

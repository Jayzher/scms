from django.db import models
from django.utils.text import slugify
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.db.models import JSONField
from io import BytesIO
from PIL import Image, ExifTags
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from accounts.models import CustomUser

# Map SDG numbers to titles
SDG_TITLES = {
    1: "No Poverty",
    2: "Zero Hunger",
    3: "Good Health and Well-being",
    4: "Quality Education",
    5: "Gender Equality",
    6: "Clean Water and Sanitation",
    7: "Affordable and Clean Energy",
    8: "Decent Work and Economic Growth",
    9: "Industry, Innovation and Infrastructure",
    10: "Reduced Inequality",
    11: "Sustainable Cities and Communities",
    12: "Responsible Consumption and Production",
    13: "Climate Action",
    14: "Life Below Water",
    15: "Life on Land",
    16: "Peace, Justice and Strong Institutions",
    17: "Partnerships for the Goals",
}

# Convert to Django choices
SDG_CHOICES = [(num, title) for num, title in SDG_TITLES.items()]

class Page(models.Model):
    author = models.ForeignKey(CustomUser, on_delete=models.PROTECT, null=True)
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=255)
    post_description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(null=True, blank=True)  # Manually handled
    updated_at = models.DateTimeField(null=True, blank=True)  # Manually handled

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return f'/{self.slug}/'

class Category(models.Model):
    page = models.ForeignKey(Page, on_delete=models.CASCADE)
    goal_number = models.IntegerField(
        choices=SDG_CHOICES,
        blank=True,
        null=True
    )
    category_name = models.CharField(
        max_length=255,
        editable=False,
        blank=True,
        null=True
    )

    def save(self, *args, **kwargs):
        # Auto-generate category_name based on goal_number
        if self.goal_number:
            self.category_name = SDG_TITLES.get(self.goal_number)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Goal {self.goal_number}: {self.category_name or 'Unknown'}"

class ContentSection(models.Model):
    page = models.ForeignKey(Page, on_delete=models.CASCADE)
    content = models.TextField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0, null=True, blank=True)

    image_ids = models.JSONField(default=list, blank=True)  # ✅ Note: `default=list`, not `[]`

    class Meta:
        ordering = ['order']

class GalleryImage(models.Model):
    page = models.ForeignKey(Page, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='gallery_images/')
    thumbnail = models.ImageField(upload_to='gallery_images/thumbnails/', editable=False, blank=True, null=True)
    title = models.CharField(max_length=255, blank=True)
    is_featured = models.BooleanField(default=False)
    marked_for_deletion = models.BooleanField(default=False)

    def __str__(self):
        return self.title or f'Image for {self.page.title}'

    def save(self, *args, **kwargs):
        is_new = self.pk is None  # Check if this is a new instance

        # Check if an existing thumbnail needs to be deleted
        if not is_new and self.image_changed() and self.thumbnail:
            self.delete_thumbnail()  # Delete the old thumbnail file

        super().save(*args, **kwargs)

        # Generate and save thumbnail if it's a new instance or if the image has changed
        if self.image and (not self.thumbnail or self.image_changed() or is_new):
            thumbnail_content = self.make_thumbnail(self.image, size=(400, 400))  # Set max size to 400px
            thumbnail_name = self.generate_thumbnail_name()
            self.thumbnail.save(thumbnail_name, thumbnail_content, save=False)
            super().save(update_fields=['thumbnail'])  # Only save the thumbnail field

    def delete_thumbnail(self):
        """
        Delete the existing thumbnail file from storage.
        """
        if self.thumbnail and default_storage.exists(self.thumbnail.name):
            default_storage.delete(self.thumbnail.name)

    def image_changed(self):
        try:
            old_instance = GalleryImage.objects.get(pk=self.pk)
            return old_instance.image != self.image
        except GalleryImage.DoesNotExist:
            return True

    def make_thumbnail(self, image, size=(400, 400)):
        """
        Generate a high-quality, compressed thumbnail with max dimensions of 400x400.
        Corrects orientation based on EXIF data before resizing.
        """
        img = Image.open(image)

        # Handle EXIF orientation data
        try:
            exif = img._getexif()
            if exif is not None:
                for tag, value in exif.items():
                    if ExifTags.TAGS.get(tag, tag) == 'Orientation':
                        if value == 3:
                            img = img.rotate(180, expand=True)
                        elif value == 6:
                            img = img.rotate(270, expand=True)
                        elif value == 8:
                            img = img.rotate(90, expand=True)
        except (AttributeError, KeyError, IndexError):
            pass  # EXIF data is not present or could not be processed

        img = img.convert("RGB")  # Convert to RGB if necessary
        img.thumbnail(size, Image.LANCZOS)  # Resize with aspect ratio maintained

        # Save thumbnail to a BytesIO object
        thumb_io = BytesIO()
        img.save(thumb_io, format='JPEG', quality=100, optimize=True)

        return ContentFile(thumb_io.getvalue())

    def generate_thumbnail_name(self):
        """
        Generate a name for the thumbnail.
        """
        base_name = self.image.name.split('/')[-1]
        thumb_name = f"thumb_{base_name}"
        return thumb_name

# Signal to auto-generate unique slug if not provided
@receiver(pre_save, sender=Page)
def auto_generate_slug(sender, instance, **kwargs):
    if not instance.slug:
        base_slug = slugify(instance.title)
        slug = base_slug
        count = 1
        
        # Ensure the slug is unique by appending a number if needed
        while Page.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{count}"
            count += 1
            
        instance.slug = slug

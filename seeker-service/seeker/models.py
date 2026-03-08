from django.db import models


class SeekerProfile(models.Model):
    # user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
    user_id = models.UUIDField(unique=True)
    bio = models.TextField(null=True)
    profile_photo = models.ImageField(upload_to='profile pictures/', null=True)

    def __str__(self):
        return f"{self.user_id}'s Profile"


class Resume(models.Model):
    seeker = models.ForeignKey(SeekerProfile, on_delete=models.CASCADE)
    resume_title = models.CharField(max_length=120)
    resume = models.FileField(upload_to='resumes/')
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.resume_title} | {self.seeker.user_id}"


class Experience(models.Model):
    seeker = models.ForeignKey(SeekerProfile, on_delete=models.CASCADE)
    job_title = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField(null=True)
    is_current = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.seeker.user.get_full_name()} | {self.job_title} | {self.company}"


class Skills(models.Model):
    seeker = models.OneToOneField(SeekerProfile, on_delete=models.CASCADE, related_name="skills")
    # Recommended: Stores as ["python", "react", "js"]
    skills = models.JSONField(default=list, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.seeker.user_id} | Skills"


class Education(models.Model):
    seeker = models.ForeignKey(SeekerProfile, on_delete=models.CASCADE)
    degree = models.CharField(max_length=150)
    institution = models.CharField(max_length=255)

    start_year = models.CharField(max_length=150)
    end_year = models.CharField(max_length=150, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-start_year"]

    def __str__(self):
        return f"{self.degree} - {self.institution}"

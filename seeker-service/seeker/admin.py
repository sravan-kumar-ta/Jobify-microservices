from django.contrib import admin

from seeker.models import Resume, SeekerProfile, Experience, Skills, Education


class CustomResumeAdmin(admin.ModelAdmin):
    list_display = ('id', 'resume_title')


class CustomSkillsAdmin(admin.ModelAdmin):
    list_display = ('id', 'skills')


class CustomEducationAdmin(admin.ModelAdmin):
    list_display = ('id', 'degree', 'institution', 'start_year')


admin.site.register(SeekerProfile)
admin.site.register(Experience)
admin.site.register(Resume, CustomResumeAdmin)
admin.site.register(Skills, CustomSkillsAdmin)
admin.site.register(Education, CustomEducationAdmin)

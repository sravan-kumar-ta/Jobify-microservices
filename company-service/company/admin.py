from django.contrib import admin

from company.models import Company, Job, Application


class CompanyAdmin(admin.ModelAdmin):
    list_display = ('title', 'user_id', 'is_active', 'location')


class JobAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'company', 'experience', 'salary')
    list_filter = ('company',)


class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'job', 'applicant_id', 'applied_at', 'status')
    list_display_links = ('id', 'job')
    ordering = ('-id',)


admin.site.register(Company, CompanyAdmin)
admin.site.register(Job, JobAdmin)
admin.site.register(Application, ApplicationAdmin)

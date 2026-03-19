from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('company-admin/', admin.site.urls),
    path('api/company/', include('company.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


# path: "api/company/job/<uuid:job_id>/matching-payload/"
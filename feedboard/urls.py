from django.contrib import admin
from django.urls import path, include
from django.contrib.auth.views import LoginView, LogoutView
from account.views import register

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('account/', include('account.urls')),
    path('app/', include('core.urls')),
    path('admin/', admin.site.urls),
]

#urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

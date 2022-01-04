from django.urls import path
from django.contrib.auth.views import (
    PasswordChangeView,
    PasswordChangeDoneView,
    PasswordResetView,
    PasswordResetDoneView,
    PasswordResetConfirmView,
    PasswordResetCompleteView
)


urlpatterns = [
    path(
        'password_change/',
        PasswordChangeView.as_view(
            template_name='account/password_change.html'
        ),
        name='password_change'
    ),

    path(
        'password_change/done/',
        PasswordChangeDoneView.as_view(
            template_name='account/password_change_done.html'
        ),
        name='password_change_done'
    ),

    path(
        'password_reset/',
        PasswordResetView.as_view(
            template_name='account/password_reset.html'
        ),
        name='password_reset'
    ),

    path(
        'password_reset/done/',
        PasswordResetDoneView.as_view(
            template_name='account/password_reset_done.html'
        ),
        name='password_reset_done'
    ),

    path(
        'password_reset_confirm/<uidb64>/<token>/',
        PasswordResetConfirmView.as_view(
            template_name='account/password_reset_confirm.html'
        ),
        name='password_reset_confirm'
    ),

    path(
        'password_reset/complete/',
        PasswordResetCompleteView.as_view(
            template_name='account/password_reset_complete.html'
        ),
        name='password_reset_complete'
    ),
]

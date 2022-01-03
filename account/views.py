from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.utils.http import url_has_allowed_host_and_scheme
from django.utils.encoding import iri_to_uri
from account.admin import CustomUserCreationForm


def register(request):
    if request.method == "POST":
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            new_user = authenticate(username=form.cleaned_data['user_name'],
                                    password=form.cleaned_data['password1'],
                                    )
            login(request, new_user)
            if request.GET.get('next'):
                if url_has_allowed_host_and_scheme(request.GET['next'], None):
                    url = iri_to_uri(request.GET['next'])
                    return redirect(url)
            else:
                return redirect("/app/me")
    else:
        form = CustomUserCreationForm()

    context = {"form": form}
    return render(request, 'register.html', context)

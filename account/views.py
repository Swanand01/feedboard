from django.shortcuts import render, redirect

# Create your views here.
from account.admin import CustomUserCreationForm

# Create your views here.


def register(request):
    if request.method == "POST":
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('/login')
    else:
        form = CustomUserCreationForm()

    context = {"form": form}
    return render(request, 'register.html', context)

from django.forms import ModelForm
from core.models import Post


class StatusForm(ModelForm):
    class Meta:
        model = Post
        fields = ['status']

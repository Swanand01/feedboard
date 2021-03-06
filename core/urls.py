from django.urls import path
from . import views

urlpatterns = [
    path('', views.project_view, name='project_view'),
    path('me/', views.me, name='me'),
    path('create-project/', views.create_project, name='create_project'),
    path('vote/', views.vote, name='vote'),
    path('comment/', views.add_comment, name='add_comment'),
    path('search-post/', views.search_posts, name='search_posts'),
    path('delete-status/', views.delete_status, name='delete_status'),
    path('edit-post/<int:post_id>/', views.edit_post, name='edit_post'),
    path('delete-post/<int:post_id>/', views.delete_post, name='delete_post'),
    path('settings/', views.project_settings, name='project_settings'),
    path('<slug:category_slug>/', views.category_view, name='category_view'),
    path('<slug:category_slug>/settings/', views.board_settings, name='board_settings'),
    path('<slug:category_slug>/<slug:post_slug>/',
         views.post_view, name='post_view'),
]

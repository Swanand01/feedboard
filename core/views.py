from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from django.urls.base import reverse
from django.core.paginator import Paginator, EmptyPage
from django.db.models import Prefetch
from django.conf import settings
from core.models import Category, Project, ProjectAdmin, Post, Comment, Status  # Image
from account.models import CustomUser
import json


def project_view(request):
    # Needs more optimization
    user = request.user
    project = Project.objects.prefetch_related("category").first()
    if not project:
        return redirect("create_project")

    categories = project.category.prefetch_related("posts", "statuses").all()

    ctx = {
        "project": project,
        "categories": []
    }
    for category in categories:
        posts = category.posts.prefetch_related("status", Prefetch(
            "upvotes",
            to_attr="post_upvotes_")).all()
        statuses = category.statuses.all()
        cat_ctx = {
            "title": category.title,
            "id": category.id,
            "slug": category.slug,
            "count": len(posts),
            "status": {status.title: [] for status in statuses}
        }
        for post in posts:
            cat_ctx["status"][post.status.title].append({
                "title": post.title,
                "slug": post.slug,
                "content": post.content,
                "upvote_count": len(post.post_upvotes_)
            })

        ctx["categories"].append(cat_ctx)

    if user.is_authenticated:
        if ProjectAdmin.objects.filter(project=project, user=user).exists():
            ctx["is_admin"] = True

    return render(request, 'project_view.html', ctx)


@login_required
def create_project(request):
    user = request.user
    if user.is_superuser:

        if Project.objects.first():
            return HttpResponse("Project already exists")

        if request.method == 'POST':
            project_title = request.POST.get('project_title')
            project_description = request.POST.get('project_description')
            project = Project(title=project_title,
                              description=project_description)
            project.save()

            admin = ProjectAdmin(project=project, user=user)
            admin.save()

            categories = request.POST.getlist('category')
            for category in categories:
                if category != "":
                    c = Category(title=category, project=project)
                    c.save()
                    Status(category=c, title="Pending Review",
                           is_default=True).save()
                    Status(category=c, title="In Progress").save()
                    Status(category=c, title="Live").save()
            return redirect("project_view")

        return render(request, 'create_project.html')
    else:
        return HttpResponse("Unauthorised")


def category_view(request, category_slug):
    user = request.user
    project = Project.objects.prefetch_related("category").first()
    category = project.category.prefetch_related(
        "posts", "statuses").get(slug=category_slug)
    posts = category.posts.select_related(
        "user",
        "status").prefetch_related(
            Prefetch(
                "upvotes",
                to_attr="post_upvotes_")
    ).all()

    if request.method == "POST":
        if user.is_authenticated:
            post_title = request.POST.get('title')
            post_desc = request.POST.get('description')
            default_status = Status.objects.get(
                category=category, is_default=True)
            post = Post(user=user, project=project, category=category, title=post_title,
                        content=post_desc, status=default_status)
            post.save()

            # if request.FILES.getlist('image-files'):
            #     for file in request.FILES.getlist('image-files'):
            #         Image(image=file, post=post).save()

        else:
            return redirect(f"/login/?next={request.META.get('HTTP_REFERER')}")

    sort_by = request.GET.get("sort_by", "")
    if sort_by:
        posts = posts.order_by("-" + sort_by)

    filter_by = request.GET.get("filter_by", "")
    if filter_by:
        status = Status.objects.get(category=category, title=filter_by)
        posts = posts.filter(status=status)

    post_paginator = Paginator(posts, settings.POSTS_PER_PAGE)
    page_num = request.GET.get("page", 1)

    try:
        posts = post_paginator.page(page_num)
    except EmptyPage:
        posts = post_paginator.page(1)

    context = {
        'project': project,
        'category': category,
        'posts': [],
        'has_previous': posts.has_previous(),
        'has_next': posts.has_next(),
        'previous_page_number': posts.previous_page_number,
        'next_page_number': posts.next_page_number
    }

    for post in posts:
        post_data = {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "slug": post.slug,
            "status": post.status,
            'is_upvoted': user in post.post_upvotes_,
            'upvote_count': len(post.post_upvotes_)
        }
        context["posts"].append(post_data)

    if user.is_authenticated:
        if ProjectAdmin.objects.filter(project=project, user=user).exists():
            context["is_admin"] = True

    return render(request, 'category_view.html', context)


def vote(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user = request.user
        if user.is_authenticated:
            post_id = json.loads(request.body)['post_id']

            post = Post.objects.prefetch_related(
                Prefetch(
                    "upvotes",
                    to_attr="post_upvotes_")).get(id=post_id)

            if user in post.post_upvotes_:
                post.upvotes.remove(user)
            else:
                post.upvotes.add(user)

            return JsonResponse({
                'type': 'OK',
            })
        return JsonResponse({
            "type": "Redirect",
            "to_url": '/login/?next=%s' % data['to_url']
        })


def post_view(request, category_slug, post_slug):
    user = request.user
    project = Project.objects.prefetch_related("category", "posts").first()
    post = Post.objects.select_related("user", "status").prefetch_related(
        Prefetch(
            "upvotes",
            to_attr="post_upvotes_")
    ).get(
        project=project,
        slug=post_slug
    )
    statuses = post.category.statuses.all()
    comments = Comment.objects.select_related(
        "user").filter(post=post).order_by("-pub_date")
    voters = post.post_upvotes_
    # images = Image.objects.filter(post=post)
    context = {
        "user": user,
        "project": project,
        "category": post.category,
        "post": post,
        "comments": comments,
        "comments_count": len(comments),
        "voters": voters,
        "statuses": statuses,
        # "images": images,
        'is_upvoted': user in post.post_upvotes_,
        'upvote_count': len(post.post_upvotes_)
    }
    if user.is_authenticated:
        if ProjectAdmin.objects.filter(project=project, user=user).exists():
            context["is_admin"] = True

        if request.method == "POST":
            status = Status.objects.get(
                category=post.category, title=request.POST.get("status"))

            Post.objects.filter(
                project=project, slug=post_slug).update(status=status)
            return redirect(post.get_post_url())

    return render(request, "post_view.html", context)


@login_required
def edit_post(request, post_id):
    user = request.user
    post = Post.objects.select_related("user").get(id=post_id)
    ctx = {
        "post": post,
        "images": post.images.all()
    }
    if post.user == user:
        if request.method == "POST":
            post_title = request.POST.get("title")
            post_desc = request.POST.get("description")

            # if request.POST.get("removedImages"):
            #     print(request.POST.getlist("removedImages"),
            #           type(request.POST.getlist("removedImages")))
            #     removed_images = request.POST.getlist("removedImages")
            #     for id in removed_images:
            #         Image.objects.get(id=id).delete()

            post.title = post_title
            post.content = post_desc
            post.save()
            return redirect(post.get_post_url())
        return render(request, "edit_post.html", context=ctx)
    else:
        return HttpResponse("Unauthorised")


@login_required
def delete_post(request, post_id):
    user = request.user

    post = Post.objects.get(id=post_id)
    category_url = post.category.get_category_url()
    if post.user == request.user or ProjectAdmin.objects.filter(project=post.project, user=user).exists():
        post.delete()
    return redirect(category_url)


def add_comment(request):
    user = request.user
    if user.is_authenticated:
        if request.method == "POST":
            post = Post.objects.get(id=request.POST.get('post_id'))
            content = request.POST.get('comment_input')
            comment = Comment(post=post, user=user, content=content)
            comment.save()
        return redirect(post.get_post_url())
    else:
        return redirect(f"/login/?next={request.META.get('HTTP_REFERER')}")


@login_required
def project_settings(request):
    project = Project.objects.first()
    user = request.user
    if ProjectAdmin.objects.filter(project=project, user=user).exists():
        admins = ProjectAdmin.objects.filter(
            project=project).select_related("user")
        # Doubt
        context = {
            "project": project,
            "admins": admins
        }
        if request.method == "POST":
            if "project_name_change" in request.POST:
                if project.title != request.POST.get("project_name"):
                    project.title = request.POST.get("project_name")
                    project.save()
                    return redirect(reverse("project_settings"))
            elif "new_category" in request.POST:
                for category in request.POST.getlist("new_category"):
                    if category != "":
                        c = Category(title=category, project=project)
                        c.save()
                        Status(category=c, title="Pending Review",
                               is_default=True).save()
                        Status(category=c, title="In Progress").save()
                        Status(category=c, title="Live").save()
            elif "delete_project" in request.POST:
                project.delete()
                return redirect("/")

        return render(request, "project_settings.html", context)
    else:
        return HttpResponse("Unauthorised")


@login_required
def board_settings(request, category_slug):
    project = Project.objects.first()
    category = Category.objects.get(project=project, slug=category_slug)
    user = request.user
    if ProjectAdmin.objects.filter(project=project, user=user).exists():
        context = {
            "project": project,
            "category": category
        }

        if request.method == "POST":
            if "board_name_change" in request.POST:
                if category.title != request.POST.get("category_name"):
                    category.title = request.POST.get("category_name")
                    category.save()
                    return redirect(reverse("board_settings", kwargs={
                        "category_slug": category.slug
                    }))

            elif "delete_board" in request.POST:
                category.delete()
                return redirect(project.get_project_url())

            elif request.body:
                data = json.loads(request.body)
                if "type" in data.keys() and data["type"] == "status_change":
                    statuses = data["statuses"]
                    for status_id in statuses.keys():
                        status = Status.objects.get(id=status_id)
                        colour = statuses[status_id]['colour']
                        status.title = statuses[status_id]['title']
                        status.colour = colour
                        status.save()

                    new_statuses = data["new_statuses"]
                    for new_status in new_statuses:
                        status = Status(category=category,
                                        title=new_status)
                        status.save()

        return render(request, "board_settings.html", context)
    else:
        return HttpResponse("Unauthorised")


def search_posts(request):
    if request.method == "POST":
        if request.body:
            user = request.user

            data = json.loads(request.body)
            category = Category.objects.get(pk=data["category_id"])
            search_query = data["search_query"]

            context = {
                "posts": {}
            }

            posts = Post.objects.filter(
                category=category, title__icontains=search_query)
            if ProjectAdmin.objects.filter(user=user).exists():
                context["is_admin"] = True

            for post in posts:
                post_id = post.id
                post_title = post.title
                post_desc = post.content
                post_status = post.status.title
                post_url = post.get_post_url()
                edit_post_url = reverse("edit_post", kwargs={
                    "post_id": post_id
                })
                delete_post_url = reverse("delete_post", kwargs={
                    "post_id": post_id
                })
                creator = post.user.user_name
                upvotes = post.get_upvotes()
                comments = post.comments.count()
                context["posts"][post_id] = {
                    "title": post_title,
                    "description": post_desc,
                    "status": post_status,
                    "status_colour": post.status.colour,
                    "post_url": post_url,
                    "edit_post_url": edit_post_url,
                    "delete_post_url": delete_post_url,
                    "creator": creator,
                    "user_is_creator": request.user.user_name == creator,
                    "has_upvoted": request.user in post.upvotes.all(),
                    "upvotes": upvotes,
                    "comments": comments
                }
            return JsonResponse(context)


def delete_status(request):
    if request.method == "POST":
        user = CustomUser.objects.get(user_name=str(request.user))
        data = json.loads(request.body)
        status_id = data["status_id"]
        status = Status.objects.get(pk=status_id)
        category = status.category
        if ProjectAdmin.objects.filter(project=category.project, user=user).exists():
            posts = Post.objects.filter(category=category, status=status)
            default_status = Status.objects.get(
                category=category, is_default=True)

            posts.update(status=default_status)
            status.delete()
            return JsonResponse({"Status": "OK"})
        else:
            return HttpResponse("Unauthorised")


@login_required
def me(request):
    context = {}
    if request.user.is_authenticated:
        project = Project.objects.first()
        uname = str(request.user)
        user = CustomUser.objects.get(user_name=uname)
        if ProjectAdmin.objects.filter(user=user).exists():
            context["is_admin"] = True

        if request.method == "POST":
            user_name = request.POST.get("user_name")
            user.user_name = user_name
            old_password = request.POST.get("old_password")
            new_password = request.POST.get("new_password")
            if user.check_password(old_password):
                user.set_password(new_password)
            user.save()

        context["project"] = project
    return render(request, "me.html", context)

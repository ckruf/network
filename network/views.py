import json
from django.core import serializers 
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from .models import User, Comment, Like, UserFollowing, Post, NewPostForm
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.db.models import Exists, OuterRef
from .models import User


def index(request):
    return render(request, "network/index.html", {
        "postform": NewPostForm(auto_id=False),
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        profileurl = request.POST["profileurl"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password, profileurl=profileurl)
            user.profilerurl = profileurl
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

def newpost(request):
    if request.method == "POST":
        newpostform = NewPostForm(request.POST)
        if newpostform.is_valid():
            p = Post(content=newpostform.cleaned_data["content"],
                     author=request.user)
            p.save()
            return HttpResponseRedirect(reverse("index"))

def all(request):
    if request.method == "GET":
        user=request.user
        liked_by_user = Like.objects.filter(author=user,post=OuterRef('pk'))
        return render(request, "network/all.html", {
            "posts": Post.objects.all().order_by('-created').annotate(liked=Exists(liked_by_user)),
            "likes": Like.objects.filter(author=request.user),
            "postform": NewPostForm(auto_id=False)
        })

def userprofile(request, profileurl):
    if request.method == "GET":
        try:
            u = User.objects.get(profileurl=profileurl)
            return render(request, "network/profile.html", {
                "profileowner": u,
                "postform": NewPostForm(auto_id=False),
                "posts": Post.objects.filter(author=u).order_by('-created')
            })
        except ObjectDoesNotExist:
            return render(request, "network/usernonexist.html")

def suggest(request, barcontent):
    users = User.objects.filter(username__startswith=barcontent)
    return JsonResponse([user.serialize() for user in users], safe=False)

@csrf_exempt
@login_required
def like(request, postid):
    if request.method == "POST":
        user = request.user
        l = Like(author=user, post=Post.objects.get(pk=postid))
        l.save()
        return HttpResponse("Like saved")
    else:
        return HttpResponse(f"You have tried to visit like/{postid}")

@csrf_exempt
@login_required    
def unlike(request, postid):
    if request.method == "POST":
        user = request.user
        l = Like.objects.get(author=user, post=Post.objects.get(pk=postid))
        l.delete()
        return HttpResponse("Like deleted")

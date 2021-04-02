from django.contrib.auth.models import AbstractUser
from django.db import models
from django.forms import ModelForm, Textarea, TextInput, CharField


class User(AbstractUser):
    pass

class Post(models.Model):
    content = models.CharField(max_length=140)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    created = models.DateTimeField(auto_now_add=True)

class NewPostForm(ModelForm):
    class Meta:
        model = Post
        fields = ['content']
        widgets = {
            'content' : Textarea(attrs={'cols':65, 'rows':1, 'style':'resize:none; font-size:22px; overflow: hidden;', 'id':'posttextfield', 'placeholder':"What's on your mind?", 'disabled':''}),
        }
        labels = {
            'content': (''),
        }

class Comment(models.Model):
    content = models.CharField(max_length=140)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    created = models.DateTimeField(auto_now_add=True)

class Like(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="likes")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")

class UserFollowing(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")
    following_user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")


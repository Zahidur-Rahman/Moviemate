from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User
class StreamPlatform(models.Model):
    name=models.CharField(max_length=30)
    about=models.CharField(max_length=150)
    website=models.URLField()
    created_at=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name
  
    
class WatchList(models.Model):
    title=models.CharField(max_length=100)
    description=models.CharField(max_length=500)
    active=models.BooleanField(default=True)
    platform=models.ForeignKey(StreamPlatform,on_delete=models.CASCADE,related_name='watchlist')
    created_at=models.DateTimeField(auto_now_add=True)
    avg_rating=models.FloatField(default=0)
    number_rating=models.IntegerField(default=0)
    updated_at=models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.title

class Reveiw(models.Model):
    review_user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating=models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    description=models.CharField(max_length=500,null=True)
    watchlist=models.ForeignKey(WatchList,on_delete=models.CASCADE,related_name='reviews')
    created_at=models.DateTimeField(auto_now_add=True)
    activve=models.BooleanField(default=True)
    updated_at=models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"Rating: {self.rating} for {self.watchlist.title}"
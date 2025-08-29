from django.contrib import admin
from moviemate_app.models import WatchList, StreamPlatform,Reveiw
# Register your models here.
admin.site.register(WatchList)
admin.site.register(StreamPlatform)
admin.site.register(Reveiw)  # Assuming Reveiw is also a model you want to register
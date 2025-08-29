
from django.urls import path,include
# from moviemate_app.api.views import movie_list,movie_detail
from moviemate_app.api.views import WatchListAV, WatchListDetailAV,StreamPlatformListAV,WatchListGV  
from moviemate_app.api.views import  (StreamPlatformDetailAV,ReviewList,
                                      ReviewDetail,ReviewCreate,StreamPlatformListVS,UserReview)
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('stream', StreamPlatformListVS, basename='streamplatform')
urlpatterns = [
    path('list/',WatchListAV.as_view(), name='movie-list'),
    path('list2/',WatchListGV.as_view(), name='movie-list-2'),
    path('<int:pk>/',WatchListDetailAV.as_view(), name='movie-detail'),
    path('', include(router.urls)),
    # path('stream/', StreamPlatformListAV.as_view(), name='stream'),
    # path('stream/<int:pk>/', StreamPlatformDetailAV.as_view(), name='streamplatform-detail'),
    # path('review/', ReviewList.as_view(), name='review-list'),
    # path('review/<int:pk>/', ReviewDetail.as_view(), name='review-detail'),
    path('<int:pk>/review/', ReviewList.as_view(), name='review-list'),
    path('<int:pk>/review-create/', ReviewCreate.as_view(), name='review-create'),
    path('review/<int:pk>/', ReviewDetail.as_view(), name='review-detail'),
    path('reviews/', UserReview.as_view(), name='user-review-detail'),
]

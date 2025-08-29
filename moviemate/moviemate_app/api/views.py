from moviemate_app.models import WatchList, StreamPlatform,Reveiw
from moviemate_app.api.serializers import WatchListSerializer,StreamPlatformSerializer,ReviewSerializer
from rest_framework.response import Response
# from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import generics,mixins
from rest_framework import status
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated,IsAuthenticatedOrReadOnly
from moviemate_app.api.permisions import AdminOrReadOnly,ReviewUserOrReadOnly
from rest_framework.throttling import AnonRateThrottle,UserRateThrottle,ScopedRateThrottle
from moviemate_app.api.throttling import ReviewCreateThrottle,ReviewListThrottle
from django_filters.rest_framework import DjangoFilterBackend
from moviemate_app.api.pagination import WatchListPagination
import django_filters







class UserReview(generics.ListAPIView):
    serializer_class=ReviewSerializer
    
    # def get_queryset(self):
    #     username=self.kwargs['username']
    #     return Reveiw.objects.filter(review_user__username=username)
    def get_queryset(self):
        username=self.request.query_params.get('username',None)
        return Reveiw.objects.filter(review_user__username=username)



class WatchListFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(field_name='title', lookup_expr='icontains')
    platform__name = django_filters.CharFilter(field_name='platform__name', lookup_expr='icontains')
    
    class Meta:
        model = WatchList
        fields = ['title', 'platform__name']

class WatchListGV(generics.ListAPIView):
    queryset = WatchList.objects.all()
    serializer_class = WatchListSerializer
    pagination_class = WatchListPagination
    # throttle_classes = [ReviewListThrottle,AnonRateThrottle]
    filter_backends = [DjangoFilterBackend]
    filterset_class = WatchListFilter
    # permission_classes = [IsAuthenticated]
  



class WatchListAV(APIView):
    permission_classes = [AdminOrReadOnly]
    def get(self, request):
        movies = WatchList.objects.all()
        serializer = WatchListSerializer(movies, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer=WatchListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors)


class WatchListDetailAV(APIView):
    permission_classes = [AdminOrReadOnly]
    def get_object(self, pk):
        try:
            return WatchList.objects.get(id=pk)
        except WatchList.DoesNotExist:
            return None

    def get(self, request, pk):
        movie = self.get_object(pk)
        if movie is not None:
            serializer = WatchListSerializer(movie)
            return Response(serializer.data)
        else:
            return Response(status=404)  # Not Found

    def put(self, request, pk):
        movie = self.get_object(pk)
        if movie is not None:
            serializer = WatchListSerializer(movie, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors)
        else:
            return Response(status=404)

    def delete(self, request, pk):
        movie = self.get_object(pk)
        if movie is not None:
            movie.delete()
            return Response(status=204)  # No Content
        else:
            return Response(status=404)  # Not Found




class StreamPlatformListVS(viewsets.ModelViewSet):
    permission_classes = [AdminOrReadOnly]
    queryset = StreamPlatform.objects.all()
    serializer_class = StreamPlatformSerializer
    
    

    # lookup_field = 'pk'

    # def get_serializer_context(self):
    #     return {'request': self.request}

# class StreamPlatformListVS(viewsets.ViewSet):
#     def list(self,request):
#         queryset= StreamPlatform.objects.all()
#         serializer = StreamPlatformSerializer(queryset, many=True)
#         return Response(serializer.data)
#     def retrieve(self, request, pk=None):
#         queryset = StreamPlatform.objects.all()
#         watchlist = get_object_or_404(queryset, pk=pk)
#         serializer = StreamPlatformSerializer(watchlist)
#         return Response(serializer.data)
#     def create(self, request):
#         serializer= StreamPlatformSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
 
class StreamPlatformListAV(APIView):
    permission_classes = [AdminOrReadOnly]
    def get(self,request):
        platforms = StreamPlatform.objects.all()
        serializer = StreamPlatformSerializer(platforms, many=True,context={'request': request})
        return Response(serializer.data)
    def post(self,request):
        serializer=StreamPlatformSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(f"Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StreamPlatformDetailAV(APIView):
    permission_classes = [AdminOrReadOnly]
    def get_object(self, pk):
        try:
            return StreamPlatform.objects.get(id=pk)
        except StreamPlatform.DoesNotExist:
            return None

    def get(self, request, pk):
        platform = self.get_object(pk)
        if platform is not None:
            serializer = StreamPlatformSerializer(platform,context={'request': request})
            return Response(serializer.data)
        else:
            return Response(status=404)  # Not Found

    def put(self, request, pk):
        platform = self.get_object(pk)
        if platform is not None:
            serializer = StreamPlatformSerializer(platform, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors)
        else:
            return Response(status=404)

    def delete(self, request, pk):
        platform = self.get_object(pk)
        if platform is not None:
            platform.delete()
            return Response(status=204)  # No Content
        else:
            return Response(status=404)  # Not Found



class ReviewList(generics.ListAPIView):
    # queryset = Reveiw.objects.all()
    serializer_class = ReviewSerializer
    throttle_classes = [ReviewListThrottle,AnonRateThrottle]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['review_user__username','activve']
    # Remove authentication requirement for viewing reviews
    def get_queryset(self):
        pk= self.kwargs['pk']
        return Reveiw.objects.filter(watchlist=pk)

class ReviewDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Reveiw.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [ReviewUserOrReadOnly]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'review-detail'
    
    
    
    
class ReviewCreate(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ReviewCreateThrottle]
    serializer_class= ReviewSerializer
    def get_queryset(self):
        return Reveiw.objects.all()
    def perform_create(self, serializer):
        pk= self.kwargs['pk']
        
        movie = WatchList.objects.get(pk=pk)
        review_user=self.request.user
        review_queryset=Reveiw.objects.filter(watchlist=movie, review_user=review_user)
        if review_queryset.exists():
            raise ValidationError("You have already reviewed this movie!")
        
        # Save the review first
        serializer.save(watchlist=movie, review_user=review_user)
        
        # Recalculate average rating and count from all reviews
        all_reviews = Reveiw.objects.filter(watchlist=movie)
        total_reviews = all_reviews.count()
        
        if total_reviews > 0:
            total_rating = sum(review.rating for review in all_reviews)
            movie.avg_rating = total_rating / total_reviews
            movie.number_rating = total_reviews
        else:
            movie.avg_rating = 0
            movie.number_rating = 0
            
        movie.save()


# class ReviewList(mixins.ListModelMixin,mixins.CreateModelMixin,generics.GenericAPIView):
#     queryset = Reveiw.objects.all()
#     serializer_class = ReviewSerializer

#     def get(self, request, *args, **kwargs):
#         return self.list(request, *args, **kwargs)

#     def post(self, request, *args, **kwargs):
#         return self.create(request, *args, **kwargs)

# class ReviewDetail(mixins.RetrieveModelMixin,mixins.UpdateModelMixin,mixins.DestroyModelMixin,generics.GenericAPIView):
#     queryset = Reveiw.objects.all()
#     serializer_class = ReviewSerializer

#     def get(self, request, *args, **kwargs):
#         return self.retrieve(request, *args, **kwargs)




















# @api_view(['GET', 'POST'])
# def movie_list(request):
#     if request.method=='GET':
#         movies=Movie.objects.all()
#         serializer=MovieSerializer(movies, many=True) 
#         return Response(serializer.data)
#     elif request.method=='POST':
#         serializer=MovieSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         else:
#             return Response(serializer.errors)
# @api_view(['GET', 'PUT', 'DELETE'])
# def movie_detail(request, movie_id):
    
#     if request.method == 'GET':
#         try:
#             movie = Movie.objects.get(id=movie_id)
#             serializer = MovieSerializer(movie)
#             return Response(serializer.data)
#         except Movie.DoesNotExist:
#             return Response(status=404)  # Not Found
#     elif request.method == 'PUT':
#         try:
#             movie = Movie.objects.get(id=movie_id)
#             serializer= MovieSerializer(movie,data=request.data)
#             if serializer.is_valid():
#                 serializer.save()
#                 return Response(serializer.data)
#             else:
#                 return Response(serializer.errors)
#         except Movie.DoesNotExist:
#             return Response(status=404)
#     elif request.method == 'DELETE':
#         try:
#             movie = Movie.objects.get(id=movie_id)
#             movie.delete()
#             return Response(status=204)  # No Content
#         except Movie.DoesNotExist:
#             return Response(status=404)




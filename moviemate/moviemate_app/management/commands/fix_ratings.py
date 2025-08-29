from django.core.management.base import BaseCommand
from moviemate_app.models import WatchList, Reveiw


class Command(BaseCommand):
    help = 'Recalculate average ratings and review counts for all movies'

    def handle(self, *args, **options):
        movies = WatchList.objects.all()
        updated_count = 0
        
        for movie in movies:
            # Get all reviews for this movie
            reviews = Reveiw.objects.filter(watchlist=movie)
            total_reviews = reviews.count()
            
            if total_reviews > 0:
                total_rating = sum(review.rating for review in reviews)
                movie.avg_rating = total_rating / total_reviews
                movie.number_rating = total_reviews
            else:
                movie.avg_rating = 0
                movie.number_rating = 0
            
            movie.save()
            updated_count += 1
            
            self.stdout.write(
                f'Updated {movie.title}: {total_reviews} reviews, avg rating: {movie.avg_rating:.2f}'
            )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully updated {updated_count} movies')
        )

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = 'Make a user admin/staff'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username to make admin')

    def handle(self, *args, **options):
        username = options['username']
        try:
            user = User.objects.get(username=username)
            user.is_staff = True
            user.is_superuser = True
            user.save()
            self.stdout.write(
                self.style.SUCCESS(f'Successfully made {username} an admin user')
            )
        except User.DoesNotExist:
            self.stdout.write(
                self.style.ERROR(f'User {username} does not exist')
            )

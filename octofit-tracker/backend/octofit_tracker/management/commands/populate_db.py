from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting database population...')
        
        # Clear existing data
        self.stdout.write('Clearing existing data...')
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        
        # Create Teams
        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(
            name='Team Marvel',
            description='Avengers assemble! The mightiest heroes united for fitness.',
            total_points=0,
            member_count=0
        )
        
        team_dc = Team.objects.create(
            name='Team DC',
            description='Justice League united! Heroes committed to staying in peak condition.',
            total_points=0,
            member_count=0
        )
        
        # Create Marvel Users
        marvel_heroes = [
            {'email': 'tony.stark@marvel.com', 'name': 'Tony Stark', 'points': 0},
            {'email': 'steve.rogers@marvel.com', 'name': 'Steve Rogers', 'points': 0},
            {'email': 'natasha.romanoff@marvel.com', 'name': 'Natasha Romanoff', 'points': 0},
            {'email': 'bruce.banner@marvel.com', 'name': 'Bruce Banner', 'points': 0},
            {'email': 'thor.odinson@marvel.com', 'name': 'Thor Odinson', 'points': 0},
            {'email': 'peter.parker@marvel.com', 'name': 'Peter Parker', 'points': 0},
        ]
        
        # Create DC Users
        dc_heroes = [
            {'email': 'bruce.wayne@dc.com', 'name': 'Bruce Wayne', 'points': 0},
            {'email': 'clark.kent@dc.com', 'name': 'Clark Kent', 'points': 0},
            {'email': 'diana.prince@dc.com', 'name': 'Diana Prince', 'points': 0},
            {'email': 'barry.allen@dc.com', 'name': 'Barry Allen', 'points': 0},
            {'email': 'arthur.curry@dc.com', 'name': 'Arthur Curry', 'points': 0},
            {'email': 'hal.jordan@dc.com', 'name': 'Hal Jordan', 'points': 0},
        ]
        
        self.stdout.write('Creating users...')
        marvel_users = []
        for hero in marvel_heroes:
            user = User.objects.create(
                email=hero['email'],
                name=hero['name'],
                team='Team Marvel',
                points=hero['points']
            )
            marvel_users.append(user)
        
        dc_users = []
        for hero in dc_heroes:
            user = User.objects.create(
                email=hero['email'],
                name=hero['name'],
                team='Team DC',
                points=hero['points']
            )
            dc_users.append(user)
        
        all_users = marvel_users + dc_users
        
        # Update team member counts
        team_marvel.member_count = len(marvel_users)
        team_marvel.save()
        team_dc.member_count = len(dc_users)
        team_dc.save()
        
        # Create Activities
        self.stdout.write('Creating activities...')
        activity_types = ['Running', 'Cycling', 'Swimming', 'Strength Training', 'Yoga', 'Walking']
        
        for user in all_users:
            # Create 5-10 random activities per user
            num_activities = random.randint(5, 10)
            user_points = 0
            
            for i in range(num_activities):
                activity_type = random.choice(activity_types)
                duration = random.randint(20, 120)
                distance = round(random.uniform(2, 15), 2) if activity_type in ['Running', 'Cycling', 'Walking'] else 0.0
                calories = duration * random.randint(5, 10)
                points = duration + int(distance * 10)
                
                Activity.objects.create(
                    user_email=user.email,
                    user_name=user.name,
                    activity_type=activity_type,
                    duration=duration,
                    distance=distance,
                    calories_burned=calories,
                    points_earned=points
                )
                
                user_points += points
            
            # Update user points
            user.points = user_points
            user.save()
            
            # Update team points
            if user.team == 'Team Marvel':
                team_marvel.total_points += user_points
            else:
                team_dc.total_points += user_points
        
        team_marvel.save()
        team_dc.save()
        
        # Create Leaderboard entries
        self.stdout.write('Creating leaderboard...')
        sorted_users = sorted(all_users, key=lambda x: x.points, reverse=True)
        
        for rank, user in enumerate(sorted_users, start=1):
            Leaderboard.objects.create(
                user_email=user.email,
                user_name=user.name,
                team=user.team,
                total_points=user.points,
                rank=rank
            )
        
        # Create Workouts
        self.stdout.write('Creating workouts...')
        workouts_data = [
            {
                'name': 'Super Soldier Training',
                'category': 'Strength',
                'difficulty': 'Advanced',
                'duration': 60,
                'description': 'Inspired by Captain America\'s training regimen. Build strength and endurance.',
                'exercises': [
                    {'name': 'Push-ups', 'sets': 4, 'reps': 20},
                    {'name': 'Pull-ups', 'sets': 4, 'reps': 10},
                    {'name': 'Squats', 'sets': 4, 'reps': 25},
                    {'name': 'Burpees', 'sets': 3, 'reps': 15}
                ]
            },
            {
                'name': 'Speedster Sprint',
                'category': 'Cardio',
                'difficulty': 'Intermediate',
                'duration': 30,
                'description': 'Channel your inner Flash with high-intensity interval training.',
                'exercises': [
                    {'name': 'Sprint', 'duration': '30 seconds', 'rest': '30 seconds', 'rounds': 10},
                    {'name': 'Cool-down jog', 'duration': '5 minutes'}
                ]
            },
            {
                'name': 'Warrior Balance',
                'category': 'Flexibility',
                'difficulty': 'Beginner',
                'duration': 45,
                'description': 'Wonder Woman-inspired flexibility and balance training.',
                'exercises': [
                    {'name': 'Warrior Pose', 'duration': '60 seconds', 'each_side': True},
                    {'name': 'Tree Pose', 'duration': '45 seconds', 'each_side': True},
                    {'name': 'Downward Dog', 'duration': '90 seconds'},
                    {'name': 'Pigeon Pose', 'duration': '60 seconds', 'each_side': True}
                ]
            },
            {
                'name': 'Hulk Smash Circuit',
                'category': 'Strength',
                'difficulty': 'Advanced',
                'duration': 45,
                'description': 'High-intensity strength circuit for maximum power.',
                'exercises': [
                    {'name': 'Deadlifts', 'sets': 4, 'reps': 8},
                    {'name': 'Box Jumps', 'sets': 3, 'reps': 12},
                    {'name': 'Kettlebell Swings', 'sets': 4, 'reps': 15},
                    {'name': 'Battle Ropes', 'sets': 3, 'duration': '30 seconds'}
                ]
            },
            {
                'name': 'Bat-Training Basics',
                'category': 'Mixed',
                'difficulty': 'Intermediate',
                'duration': 50,
                'description': 'Batman-style training combining agility, strength, and cardio.',
                'exercises': [
                    {'name': 'Jump Rope', 'duration': '5 minutes'},
                    {'name': 'Shadow Boxing', 'sets': 3, 'duration': '3 minutes'},
                    {'name': 'Core Circuit', 'sets': 3, 'exercises': ['Plank', 'Mountain Climbers', 'Russian Twists']},
                    {'name': 'Stretching', 'duration': '10 minutes'}
                ]
            },
            {
                'name': 'Aquaman Swim',
                'category': 'Cardio',
                'difficulty': 'Beginner',
                'duration': 35,
                'description': 'Swimming workout for full-body conditioning.',
                'exercises': [
                    {'name': 'Freestyle', 'distance': '400m'},
                    {'name': 'Backstroke', 'distance': '200m'},
                    {'name': 'Breaststroke', 'distance': '200m'},
                    {'name': 'Cool-down', 'distance': '200m'}
                ]
            }
        ]
        
        for workout_data in workouts_data:
            Workout.objects.create(**workout_data)
        
        # Summary
        self.stdout.write(self.style.SUCCESS('\n=== Database Population Complete ==='))
        self.stdout.write(self.style.SUCCESS(f'Teams created: {Team.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'Users created: {User.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'Activities created: {Activity.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'Leaderboard entries: {Leaderboard.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'Workouts created: {Workout.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'\nTeam Marvel total points: {team_marvel.total_points}'))
        self.stdout.write(self.style.SUCCESS(f'Team DC total points: {team_dc.total_points}'))

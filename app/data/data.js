/**
 * Created by ic019321 on 12/20/2016.
 */
var PersonalData = (function(){

    'use strict';
    return{
        GetUserSettings:(function(){

            var userData={
                weight: 150,
                weightType: 0
            }
            return userData;
        }()),
        GetUserGoals:(function(){

            var userGoals = {
                dailyGoal:15,
                weeklyGoal:75
            };
            return userGoals;

        }()),
        GetCustomWorkouts:(function(){

            var userCustomWorkouts = {

                savedWorkouts:[{
                    "name":"Beginner Full Body Workouts",
                    "workout": ["Running in Place", "Jumping Jacks", "Windmill", "Steam Engine", "Bent Leg Twist", "Forward Lunges", "Wall Push-ups", "Step Touch", "Squats", "Overhead Arm Clap", "Elevated Crunches", "Push-ups", "Plank", "Rear Lunges", "Chest Expander", "Jump Rope Hops", "One Arm Side Push-up"]
                }]
            };
            return userCustomWorkouts;

        }())

    }

}());
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Activity, TrendingUp, Flame, Calendar, ArrowRight, Trophy } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { useWorkouts } from '../context/WorkoutContext';
import { WorkoutCard } from '../components/WorkoutCard';
import { Button } from '../components/ui/Button';
import { AICoach } from '../components/ui/AICoach';
import { useAuth } from '../context/AuthContext';
import { EditProfileModal } from '../components/ui/EditProfileModal';

export default function Home() {
    const { workouts, deleteWorkout } = useWorkouts();
    const { user } = useAuth();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const heightInMeters = (user?.height || 170) / 100;
    const bmi = user?.weight && user?.height ? (user.weight / (heightInMeters * heightInMeters)).toFixed(1) : null;

    let bmr = 0;
    if (user) {
        const weight = user.weight || 70;
        const height = user.height || 170;
        const age = user.age || 25;
        if (user.gender === 'Male') bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        else bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const totalTime = workouts.reduce((acc, curr) => acc + (parseInt(curr.duration) || 0), 0);
    const totalCalories = workouts.reduce((acc, curr) => acc + (curr.calories || 0), 0);
    const getStreak = () => {
        
        if (workouts.length === 0) return 0;
        const dates = [...new Set(workouts.map(w => w.date))].sort().reverse();
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (dates[0] !== today && dates[0] !== yesterday) return 0;
        let streak = 0;
        for (let i = 0; i < dates.length; i++) {
            const checkDate = new Date(new Date(dates[0]).getTime() - (streak * 86400000)).toISOString().split('T')[0];
            if (dates.includes(checkDate)) streak++;
            else break;
        }
        return streak;
    };

    const currentStreak = getStreak();

    return (
        <div className="space-y-12 pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-950 tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Welcome back, <span className="text-slate-900">{user?.name?.split(' ')[0] || 'User'}</span> 👋
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setIsProfileModalOpen(true)}>
                        Edit Profile
                    </Button>
                    <Link to="/add-workout">
                        <Button className="shadow-xl shadow-slate-200">
                            <Plus className="w-5 h-5 mr-2" />
                            Log Workout
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Health Health Insights - EXTREME PERSONALIZATION IDEA */}
            <div className="max-w-xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="bg-indigo-600 rounded-lg p-3 text-white shadow-sm shadow-indigo-200 flex flex-col justify-between">
                        <TrendingUp className="w-4 h-4 text-indigo-200 mb-2" />
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-200">Current BMI</p>
                            <h3 className="text-2xl font-black mt-0.5">{bmi || '--'}</h3>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm flex flex-col justify-between">
                        <Flame className="w-4 h-4 text-orange-500 mb-2" />
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Daily BMR</p>
                            <h3 className="text-lg font-black text-slate-900 mt-0.5">{Math.round(bmr).toLocaleString()} <span className="text-[9px] font-medium text-slate-400">kcal</span></h3>
                        </div>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3 text-white shadow-sm flex flex-col justify-between">
                        <Plus className="w-4 h-4 text-indigo-400 mb-2" />
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Next Step</p>
                            <h3 className="text-[11px] font-bold mt-0.5">Check AI Coach for your Plan</h3>
                        </div>
                    </div>
                </div>
            </div>


            {/* AI Coach - Full Width */}
            <div>
                <AICoach className="shadow-2xl shadow-indigo-100" />
            </div>

            {/* Stats Grid - Below AI Coach */}
            <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                        <div className="p-2 bg-blue-500 rounded-lg mb-2 shadow-md">
                            <Activity className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[9px] font-bold text-blue-700 uppercase tracking-wide mb-1">Total Workouts</span>
                        <div className="flex items-baseline gap-1">
                            <p className="text-xl font-black text-slate-900">{workouts.length}</p>
                            <span className="text-[10px] font-semibold text-slate-500">All Time</span>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                        <div className="p-2 bg-orange-500 rounded-lg mb-2 shadow-md">
                            <Flame className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[9px] font-bold text-orange-700 uppercase tracking-wide mb-1">Calories Burned</span>
                        <div className="flex items-baseline gap-1">
                            <p className="text-xl font-black text-slate-900">{totalCalories.toLocaleString()}</p>
                            <span className="text-[10px] font-semibold text-slate-500">kcal</span>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                        <div className="p-2 bg-green-500 rounded-lg mb-2 shadow-md">
                            <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[9px] font-bold text-green-700 uppercase tracking-wide mb-1">Active Minutes</span>
                        <div className="flex items-baseline gap-1">
                            <p className="text-xl font-black text-slate-900">{totalTime}</p>
                            <span className="text-[10px] font-semibold text-slate-500">mins</span>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                        <div className="p-2 bg-purple-500 rounded-lg mb-2 shadow-md">
                            <Trophy className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[9px] font-bold text-purple-700 uppercase tracking-wide mb-1">Current Streak</span>
                        <div className="flex items-baseline gap-1">
                            <p className="text-xl font-black text-slate-900">{currentStreak}</p>
                            <span className="text-[10px] font-semibold text-slate-500">Days</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-slate-400" />
                        Recent Activity
                    </h2>
                    <Link to="/add-workout">
                        <Button size="sm" variant="ghost" className="text-slate-500 hover:text-slate-950">
                            View All <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </div>

                {workouts.length === 0 ? (
                    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-12 text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                            <Activity className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">No workouts yet</h3>
                        <p className="text-slate-500 mb-6 max-w-sm mx-auto">Start your fitness journey by logging your first workout today.</p>
                        <Link to="/add-workout">
                            <Button variant="outline" className="bg-white">
                                Log First Workout
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {workouts.slice(0, 5).map(workout => (
                            <WorkoutCard
                                key={workout._id}
                                workout={workout}
                                onDelete={deleteWorkout}

                            />
                        ))}
                    </div>
                )}
            </div>

            <EditProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </div >
    );
}

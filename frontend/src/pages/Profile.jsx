import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Flame, Trophy, Calendar, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorkouts } from '../context/WorkoutContext';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { EditProfileModal } from '../components/ui/EditProfileModal';

export default function Profile() {
    const { user } = useAuth();
    const { workouts } = useWorkouts();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Calculate weekly stats from real workouts
    const activityData = [
        { day: 'Mon', minutes: 0 },
        { day: 'Tue', minutes: 0 },
        { day: 'Wed', minutes: 0 },
        { day: 'Thu', minutes: 0 },
        { day: 'Fri', minutes: 0 },
        { day: 'Sat', minutes: 0 },
        { day: 'Sun', minutes: 0 },
    ];

    const calorieData = [
        { day: 'Mon', cal: 0 },
        { day: 'Tue', cal: 0 },
        { day: 'Wed', cal: 0 },
        { day: 'Thu', cal: 0 },
        { day: 'Fri', cal: 0 },
        { day: 'Sat', cal: 0 },
        { day: 'Sun', cal: 0 },
    ];

    // Aggregation Logic (Simple version assuming current week)
    workouts.forEach(workout => {
        const date = new Date(workout.date);
        const dayIndex = date.getDay(); // 0 is Sunday, 1 is Monday...
        // Adjust for Mon-Sun array (0->6)
        const mapIndex = dayIndex === 0 ? 6 : dayIndex - 1;

        if (activityData[mapIndex]) {
            activityData[mapIndex].minutes += parseInt(workout.duration) || 0;
            calorieData[mapIndex].cal += workout.calories || 0;
        }
    });

    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce((acc, curr) => acc + (curr.calories || 0), 0);
    const totalMinutes = workouts.reduce((acc, curr) => acc + (parseInt(curr.duration) || 0), 0);

    // Dynamic Streak Calculation
    const getStreak = () => {
        if (workouts.length === 0) return 0;

        const dates = [...new Set(workouts.map(w => w.date))].sort().reverse();
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        if (dates[0] !== today && dates[0] !== yesterday) return 0;

        let streak = 0;
        let currentDate = dates[0];

        for (let i = 0; i < dates.length; i++) {
            const dateObj = new Date(currentDate);
            const checkDate = new Date(dateObj.getTime() - (streak * 86400000)).toISOString().split('T')[0];

            if (dates.includes(checkDate)) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    };

    const currentStreak = getStreak();

    // Dynamic Leveling
    const getLevel = (count) => {
        if (count >= 50) return { name: 'Elite', color: 'text-purple-600' };
        if (count >= 30) return { name: 'Platinum', color: 'text-indigo-600' };
        if (count >= 15) return { name: 'Gold', color: 'text-amber-600' };
        if (count >= 5) return { name: 'Silver', color: 'text-slate-600' };
        return { name: 'Bronze', color: 'text-orange-600' };
    };

    const level = getLevel(totalWorkouts);

    // Weekly Goal (Last 7 Days)
    const workoutsThisWeek = workouts.filter(w => {
        const wDate = new Date(w.date);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return wDate >= sevenDaysAgo;
    }).length;

    const weeklyGoal = user?.weeklyWorkoutGoal || 3;
    const goalPercent = Math.min(Math.round((workoutsThisWeek / weeklyGoal) * 100), 100);

    return (
        <div className="space-y-8 pb-10">
            {/* Validating Modals */}
            <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />

            {/* Header Section */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_2px_12px_rgba(71,85,105,0.06)] border border-slate-100 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ring-4 ring-blue-50">
                    <UserIcon className="w-10 h-10" />
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-800">{user?.name || 'Guest User'}</h1>
                    <div className="flex flex-col gap-2 mt-2">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <p className="text-slate-500 font-medium">Joined Dec 2025</p>
                            {(user?.gender && user.gender !== 'Prefer not to say') && (
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-semibold text-slate-600">{user.gender}</span>
                            )}
                        </div>

                        {(user?.age || user?.height || user?.weight) && (
                            <div className="flex items-center justify-center md:justify-start gap-3 text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 w-fit mx-auto md:mx-0">
                                {user?.age && <span>{user.age} yrs</span>}
                                <span className="text-slate-300">|</span>
                                {user?.height && <span>{user.height} cm</span>}
                                <span className="text-slate-300">|</span>
                                {user?.weight && <span>{user.weight} kg</span>}
                            </div>
                        )}

                        {user?.fitnessGoals?.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-1">
                                {user.fitnessGoals.map((goal, i) => (
                                    <span key={i} className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">{goal}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-5 flex flex-wrap justify-center md:justify-start gap-3">
                        <Button variant="secondary" size="sm" className="rounded-full px-4" onClick={() => setIsEditModalOpen(true)}>Edit Profile</Button>
                        <Button variant="primary" size="sm" className="rounded-full px-4">Share Stats</Button>
                    </div>
                </div>
                <div className="flex gap-8 text-center border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                    <div>
                        <div className="text-2xl font-bold text-slate-800">{totalWorkouts}</div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Workouts</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-800">{currentStreak}</div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Streak</div>
                    </div>
                    <div>
                        <div className={`text-2xl font-bold ${level.color}`}>{level.name}</div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Level</div>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={Trophy}
                    label="Weekly Goal"
                    value={`${workoutsThisWeek}/${weeklyGoal}`}
                    subtext={`${goalPercent}%`}
                    colorClass="bg-yellow-50 text-yellow-600"
                />
                <StatCard
                    icon={Flame}
                    label="Calories Burned"
                    value={totalCalories.toLocaleString()}
                    subtext="+12%"
                    colorClass="bg-orange-50 text-orange-600"
                />
                <StatCard
                    icon={Activity}
                    label="Active Minutes"
                    value={`${totalMinutes}m`}
                    subtext="Total"
                    colorClass="bg-blue-50 text-blue-600"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Activity Chart */}
                <div className="bg-white p-6 rounded-3xl shadow-[0_2px_12px_rgba(71,85,105,0.06)] border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-500" />
                        Activity Minutes
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#F1F5F9', radius: 8 }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar
                                    dataKey="minutes"
                                    fill="#3B82F6"
                                    radius={[6, 6, 6, 6]}
                                    barSize={32}
                                    activeBar={{ fill: '#2563EB' }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Calories Chart */}
                <div className="bg-white p-6 rounded-3xl shadow-[0_2px_12px_rgba(71,85,105,0.06)] border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        Calories Burned
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={calorieData}>
                                <defs>
                                    <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="cal"
                                    stroke="#F97316"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorCal)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

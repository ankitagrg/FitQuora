import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { Brain, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Onboarding() {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        age: user?.age || '',
        height: user?.height || '',
        weight: user?.weight || '',
        gender: user?.gender || 'Prefer not to say',
        environment: user?.environment || 'home',
        dietaryPreference: user?.dietaryPreference || 'No Restrictions',
        weeklyWorkoutGoal: user?.weeklyWorkoutGoal || 3,
        fitnessGoals: user?.fitnessGoals?.join(', ') || '',
        healthConditions: user?.healthConditions?.join(', ') || '',
        exercisePreferences: user?.exercisePreferences?.join(', ') || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };
    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedData = {
                ...formData,
                fitnessGoals: formData.fitnessGoals.split(',').map(item => item.trim()).filter(Boolean),
                healthConditions: formData.healthConditions.split(',').map(item => item.trim()).filter(Boolean),
                exercisePreferences: formData.exercisePreferences.split(',').map(item => item.trim()).filter(Boolean),
            };

            await updateProfile(updatedData);
            navigate('/dashboard');
        } catch (error) {
            console.error("Onboarding error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
                <div className="bg-slate-950 p-8 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                            <Brain className="w-6 h-6 text-indigo-400" />
                        </div>
                        <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Personalization</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Setup your profile</h1>
                    <p className="text-slate-400 text-sm mt-2">We need these details to build your unique AI workout and nutrition plan.</p>
                </div>
                <div className="p-8">
                    <div className="flex gap-2 mb-8">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-slate-950' : 'bg-slate-100'}`} />
                        ))}
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                                <h3 className="text-lg font-bold text-slate-900">The Basics</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    <Input id="age" label="Age" type="number" value={formData.age} onChange={handleChange} required />
                                    <Input id="height" label="Height (cm)" type="number" value={formData.height} onChange={handleChange} required />
                                    <Input id="weight" label="Weight (kg)" type="number" value={formData.weight} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-900 mb-2">Gender</label>
                                    <select
                                        id="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-slate-950 transition-all outline-none appearance-none cursor-pointer"
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                        <option>Prefer not to say</option>
                                    </select>
                                </div>
                                <Button type="button" onClick={handleNext} className="w-full h-12">
                                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        )}
                        {step === 2 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                                <h3 className="text-lg font-bold text-slate-900">Your Environment</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-900 mb-2">Primary Goal</label>
                                        <Input
                                            id="fitnessGoals"
                                            placeholder="e.g. Weight Loss, Muscle Gain"
                                            value={formData.fitnessGoals}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-900 mb-2">Where do you work out?</label>
                                        <select
                                            id="environment"
                                            value={formData.environment}
                                            onChange={handleChange}
                                            className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-slate-950 transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="home">Home (Bodyweight/Minimal Equipment)</option>
                                            <option value="gym">Gym (Full Equipment)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-900 mb-2">Dietary Preference</label>
                                        <select
                                            id="dietaryPreference"
                                            value={formData.dietaryPreference}
                                            onChange={handleChange}
                                            className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-slate-950 transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            <option>No Restrictions</option>
                                            <option>Vegetarian</option>
                                            <option>Non-Vegetarian</option>
                                            <option>Vegan</option>
                                            <option>Pescatarian</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-900 mb-2">Weekly Workout Goal (Days)</label>
                                        <select
                                            id="weeklyWorkoutGoal"
                                            value={formData.weeklyWorkoutGoal}
                                            onChange={handleChange}
                                            className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-slate-950 transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7].map(num => (
                                                <option key={num} value={num}>{num} days per week</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button type="button" variant="ghost" onClick={handleBack} className="flex-1">Back</Button>
                                    <Button type="button" onClick={handleNext} className="flex-[2]">Continue</Button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                                <h3 className="text-lg font-bold text-slate-900">Final Details</h3>
                                <div>
                                    <label className="block text-sm font-bold text-slate-900 mb-2">Health Conditions</label>
                                    <Input
                                        id="healthConditions"
                                        placeholder="e.g. Back Pain, None"
                                        value={formData.healthConditions}
                                        onChange={handleChange}
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">Leave blank if none. AI will avoid exercises that could hurt these areas.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-900 mb-2">Exercise Preferences</label>
                                    <Input
                                        id="exercisePreferences"
                                        placeholder="e.g. Yoga, HIIT, Cardio"
                                        value={formData.exercisePreferences}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <Button type="button" variant="ghost" onClick={handleBack} className="flex-1">Back</Button>
                                    <Button type="submit" className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
                                        {loading ? 'Analyzing...' : 'Complete Setup'}
                                        <CheckCircle2 className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

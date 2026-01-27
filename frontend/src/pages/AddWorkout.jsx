import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft, Dumbbell } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useWorkouts } from '../context/WorkoutContext';

export default function AddWorkout() {
    const navigate = useNavigate();
    const { addWorkout } = useWorkouts();

    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState('');
    const [exercises, setExercises] = useState([
        { name: '', sets: '', reps: '', weight: '' }
    ]);

    const handleAddExercise = () => {
        setExercises([...exercises, { name: '', sets: '', reps: '', weight: '' }]);
    };

    const handleRemoveExercise = (index) => {
        const newExercises = exercises.filter((_, i) => i !== index);
        setExercises(newExercises);
    };
    const handleExerciseChange = (index, field, value) => {
        const newExercises = [...exercises];
        newExercises[index][field] = value;
        setExercises(newExercises);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !duration) return;
        const calories = Math.floor(parseInt(duration) * 5 + Math.random() * 50);
        addWorkout({
            title,
            duration: `${duration} min`,
            exercises: exercises.filter(e => e.name),
            calories
        });
        navigate('/');
    };

    return (
        <div className="max-w-3xl mx-auto pb-20">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <Button variant="ghost" className="mb-2 pl-0 gap-2 text-slate-500 hover:text-slate-900" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold text-slate-950">Log Workout</h1>
                    <p className="text-slate-500 mt-1">Record your session details.</p>
                </div>
                <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200 hidden sm:flex">
                    <Dumbbell className="w-6 h-6" />
                </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1 h-6 bg-slate-950 rounded-full"></div>
                        <h2 className="text-xl font-bold text-slate-950">Session Details</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <Input
                            id="title"
                            label="Workout Title"
                            placeholder="e.g. Upper Body Power"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="text-slate-950 font-medium placeholder:text-slate-400 border-slate-200 focus:border-slate-950 focus:ring-slate-950"
                            labelClassName="text-slate-700 font-bold"
                        />
                        <Input
                            id="duration"
                            label="Duration (minutes)"
                            type="number"
                            placeholder="60"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                            className="text-slate-950 font-medium placeholder:text-slate-400 border-slate-200 focus:border-slate-950 focus:ring-slate-950"
                            labelClassName="text-slate-700 font-bold"
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-6 bg-slate-950 rounded-full"></div>
                            <h2 className="text-xl font-bold text-slate-950">Exercises</h2>
                        </div>
                        <Button type="button" variant="secondary" size="sm" onClick={handleAddExercise} className="gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 border-none">
                            <Plus className="w-4 h-4" />
                            Add Exercise
                        </Button>
                    </div>

                    {exercises.map((exercise, index) => (
                        <div key={index} className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 relative group transition-all hover:shadow-2xl hover:shadow-slate-200/50">
                            {exercises.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveExercise(index)}
                                    className="absolute top-6 right-6 p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                            <div className="grid gap-6">
                                <div className="flex gap-4 items-start">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-50 text-slate-500 font-bold flex items-center justify-center text-sm border border-slate-100">
                                        {index + 1}
                                    </span>
                                    <div className="flex-1">
                                        <Input
                                            label="Exercise Name"
                                            placeholder="e.g. Bench Press"
                                            value={exercise.name}
                                            onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                                            required
                                            className="text-slate-950 font-bold text-lg placeholder:text-slate-300 border-transparent bg-transparent px-0 border-b border-b-slate-100 rounded-none focus:ring-0 focus:border-b-slate-950 transition-colors"
                                            labelClassName="text-slate-500 text-xs uppercase tracking-wider"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 pl-12">
                                    <Input
                                        label="Sets"
                                        placeholder="0"
                                        type="number"
                                        value={exercise.sets}
                                        onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                                        className="text-slate-950 font-medium text-center"
                                        labelClassName="text-center block w-full text-slate-500"
                                    />
                                    <Input
                                        label="Reps"
                                        placeholder="0"
                                        type="number"
                                        value={exercise.reps}
                                        onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                                        className="text-slate-950 font-medium text-center"
                                        labelClassName="text-center block w-full text-slate-500"
                                    />
                                    <Input
                                        label="Weight (kg)"
                                        placeholder="0"
                                        type="number"
                                        value={exercise.weight}
                                        onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                                        className="text-slate-950 font-medium text-center"
                                        labelClassName="text-center block w-full text-slate-500"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 md:hidden z-30">
                    <Button type="submit" size="lg" className="w-full shadow-xl shadow-slate-950/20">
                        <Save className="w-5 h-5 mr-2" />
                        Save Workout
                    </Button>
                </div>
                <div className="hidden md:flex justify-end pt-4">
                    <Button type="submit" size="lg" className="w-full sm:w-auto gap-2 px-8 h-12 text-lg shadow-xl shadow-slate-950/20">
                        <Save className="w-5 h-5" />
                        Save Workout
                    </Button>
                </div>
            </form>
        </div>
    );
}

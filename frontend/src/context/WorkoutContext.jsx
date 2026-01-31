import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const WorkoutContext = createContext();
export function WorkoutProvider({ children }) {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const fetchWorkouts = useCallback(async () => {
        setLoading(true);
        try {
            const token = user?.token || JSON.parse(localStorage.getItem('user'))?.token;
            const response = await fetch('/api/workouts', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok && Array.isArray(data)) {
                setWorkouts(data);
            } else {
                console.error("Fetch workouts response invalid:", data);
                setWorkouts([]);
            }
        } catch (error) {
            console.error("Error fetching workouts:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchWorkouts();
        } else {
            setWorkouts([]);
        }
    }, [user, fetchWorkouts]);

    const addWorkout = async (workoutData) => {
        try {
            const token = user?.token;
            const response = await fetch('/api/workouts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(workoutData)
            });

            const newWorkout = await response.json();
            if (response.ok) {
                setWorkouts([newWorkout, ...workouts]);
                return newWorkout;
            }
        } catch (error) {
            console.error("Error adding workout:", error);
        }
    };

    const deleteWorkout = async (id) => {
        try {
            const token = user?.token;
            const response = await fetch(`/api/workouts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setWorkouts(workouts.filter(w => w._id !== id)); 
            }
        } catch (error) {
            console.error("Error deleting workout:", error);
        }
    };

    return (
        <WorkoutContext.Provider value={{ workouts, loading, addWorkout, deleteWorkout }}>
            {children}
        </WorkoutContext.Provider>
    );
}

export const useWorkouts = () => useContext(WorkoutContext);

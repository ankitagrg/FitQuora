import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Initial app load
    const [authLoading, setAuthLoading] = useState(false); // Login/Signup action

    useEffect(() => {
        const checkUser = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        setAuthLoading(true);
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const text = await response.text();
            console.log('Login Response:', response.status, text);

            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                throw new Error(`Server Error: ${text.substring(0, 100)}...`);
            }

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setAuthLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const signup = async (name, email, password, age, height, weight) => {
        setAuthLoading(true);
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, age, height, weight }),
            });

            const text = await response.text();
            console.log('Signup Response:', response.status, text);

            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                throw new Error(`Server Error: ${text.substring(0, 100)}...`);
            }

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setAuthLoading(false);
        }
    };

    const updateProfile = async (userData) => {
        try {
            const token = user?.token;
            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Update failed');
            }
            const updatedUser = { ...data, token };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
    const refreshUser = async () => {
        try {
            const token = user?.token;
            if (!token) return;

        const response = await fetch('/api/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`
                }
            });
        const data = await response.json();
            if (response.ok) {
                const updatedUser = { ...data, token };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        } catch (error) {
            console.error('Error refreshing user:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, authLoading, login, logout, signup, updateProfile, refreshUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

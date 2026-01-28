import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Dumbbell } from 'lucide-react';

export default function Signup() {
    const { signup, authLoading } = useAuth();
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        const firstName = e.target.firstName.value;
        const lastName = e.target.lastName.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const age = e.target.age.value;
        const height = e.target.height.value;
        const weight = e.target.weight.value ? Number(e.target.weight.value) : null;
        const fullName = `${firstName} ${lastName}`;

        try {
            await signup(fullName, email, password, Number(age), Number(height), weight);
            navigate('/onboarding');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-slate-950 selection:text-white">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-12 h-12 bg-slate-950 text-white rounded-xl flex items-center justify-center shadow-xl shadow-slate-950/20">
                        <Dumbbell className="w-7 h-7" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-950 tracking-tight">
                    Create an account
                </h2>
                <p className="mt-2 text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-slate-900 hover:text-slate-700 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200 border border-slate-100 sm:rounded-2xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSignup}>
                        <div className="grid grid-cols-2 gap-4">
                            <Input id="firstName" name="firstName" label="First Name" required className="bg-white text-slate-900 placeholder:text-slate-400 border-slate-200 focus:ring-slate-950 focus:border-slate-950" labelClassName="text-slate-700" />
                            <Input id="lastName" name="lastName" label="Last Name" required className="bg-white text-slate-900 placeholder:text-slate-400 border-slate-200 focus:ring-slate-950 focus:border-slate-950" labelClassName="text-slate-700" />
                        </div>

                        <Input id="email" name="email" label="Email address" type="email" required className="bg-white text-slate-900 placeholder:text-slate-400 border-slate-200 focus:ring-slate-950 focus:border-slate-950" labelClassName="text-slate-700" />

                        <Input id="password" name="password" label="Password" type="password" required className="bg-white text-slate-900 placeholder:text-slate-400 border-slate-200 focus:ring-slate-950 focus:border-slate-950" labelClassName="text-slate-700" />

                        <div className="grid grid-cols-3 gap-4">
                            <Input id="age" name="age" label="Age" type="number" required className="bg-white text-slate-900 placeholder:text-slate-400 border-slate-200 focus:ring-slate-950 focus:border-slate-950" labelClassName="text-slate-700" />
                            <Input id="height" name="height" label="Height (cm)" type="number" required className="bg-white text-slate-900 placeholder:text-slate-400 border-slate-200 focus:ring-slate-950 focus:border-slate-950" labelClassName="text-slate-700" />
                            <Input id="weight" name="weight" label="Weight (kg)" type="number" className="bg-white text-slate-900 placeholder:text-slate-400 border-slate-200 focus:ring-slate-950 focus:border-slate-950" labelClassName="text-slate-700" />
                     </div>
                     <div>
                            <Button type="submit" className="w-full bg-slate-950 text-white hover:bg-slate-800" size="lg" disabled={authLoading}>
                                {authLoading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

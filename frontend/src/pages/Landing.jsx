import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Quote } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Landing() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col text-white selection:bg-white selection:text-slate-950">

            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-950 shadow-lg shadow-white/10">
                        <Activity className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Fitquora</span>
                </div>
                <div className="flex gap-4">
                    <Link to="/login">
                        <Button variant="ghost" className="text-slate-400 hover:text-white">Sign In</Button>
                    </Link>
                    <Link to="/signup">
                        <Button className="shadow-lg shadow-white/10">Get Started</Button>
                    </Link>
                </div>
            </nav>

            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto space-y-8 relative z-10">

                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                        Forged in <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Data</span>.
                        <br />
                        Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Performance</span>.
                    </h1>

                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        The minimal, high-contrast tracker that respects your focus.
                        AI analysis, dark mode by default, and pure performance metrics.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link to="/signup">
                            <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-white/20 hover:scale-105 transition-transform bg-white text-slate-950 hover:bg-slate-200">
                                Start Your Journey
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all">
                                I have an account
                            </Button>
                        </Link>
                    </div>
                </motion.div>


                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    className="mt-32 max-w-3xl mx-auto"
                >
                    <div className="relative p-8 md:p-12">
                        <Quote className="w-12 h-12 text-slate-800 absolute -top-4 -left-4 opacity-50" />
                        <blockquote className="text-2xl md:text-3xl font-serif italic text-slate-300 leading-relaxed">
                            "The only bad workout is the one that didn't happen."
                        </blockquote>
                        <cite className="block mt-6 text-sm font-bold text-slate-500 uppercase tracking-widest not-italic">
                            — Unknown Logic
                        </cite>
                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="py-8 text-center text-slate-600 text-sm border-t border-white/5 bg-slate-950">
                <p>&copy; {new Date().getFullYear()} FitQuora. All Rights Reserved</p>
            </footer>
        </div>
    );
}

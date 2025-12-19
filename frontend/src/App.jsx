import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddWorkout from './pages/AddWorkout';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import { WorkoutProvider } from './context/WorkoutContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Main App Component
function App() {
  return (
    <AuthProvider>
      <WorkoutProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </WorkoutProvider>
    </AuthProvider>
  );
}


function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        user ? (
          (!user.fitnessGoals || user.fitnessGoals.length === 0)
            ? <Navigate to="/onboarding" replace />
            : <Navigate to="/dashboard" replace />
        ) : (
          <Landing />
        )
      } />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/onboarding" element={
        <ProtectedRoute>
          <Onboarding />
        </ProtectedRoute>
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Home />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/add-workout" element={
        <ProtectedRoute>
          <Layout>
            <AddWorkout />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <Profile />
          </Layout>
        </ProtectedRoute>
      } />

    
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

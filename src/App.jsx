import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { useProfile } from './hooks/useProfile';

// Pages
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import CommunityInsights from './pages/CommunityInsights';
import CarbonTracker from './pages/CarbonTracker';
import SolarEstimator from './pages/SolarEstimator';
import BillSimulator from './pages/BillSimulator';
import GoalsAndSavings from './pages/GoalsAndSavings';

function ProtectedRoute({ children }) {
  const { profile, clearProfile } = useProfile();
  if (!profile || !profile.appliances) {
    if (profile) clearProfile();
    return <Navigate to="/onboarding" replace />;
  }
  return children;
}

export default function App() {
  const { profile } = useProfile();

  return (
    <Router>
      <Routes>
        <Route 
          path="/onboarding" 
          element={profile ? <Navigate to="/dashboard" replace /> : <Onboarding />} 
        />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="community" element={<CommunityInsights />} />
          <Route path="carbon" element={<CarbonTracker />} />
          <Route path="solar" element={<SolarEstimator />} />
          <Route path="simulator" element={<BillSimulator />} />
          <Route path="goals" element={<GoalsAndSavings />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

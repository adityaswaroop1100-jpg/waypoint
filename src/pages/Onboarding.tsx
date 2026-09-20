import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWaypointStore } from '../store/useWaypointStore';
import { OnboardingModal } from '../components/onboarding/OnboardingModal';

export const Onboarding: React.FC = () => {
  const completeOnboarding = useWaypointStore((s) => s.completeOnboarding);
  const navigate = useNavigate();

  const handleComplete = (income: number, buffer: number) => {
    completeOnboarding(income, buffer);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <OnboardingModal isOpen={true} onComplete={handleComplete} />
    </div>
  );
};

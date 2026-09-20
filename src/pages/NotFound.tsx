import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
        <Compass className="w-8 h-8" />
      </div>
      <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest font-mono mb-1">
        404 — OFF THE MAP
      </span>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Waypoint not found</h1>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        The screen or action you're looking for doesn't exist on this route. Let's navigate you back to your primary decision compass.
      </p>

      <Link to="/">
        <Button variant="primary" icon={<ArrowLeft className="w-4 h-4" />}>
          Return to The One Move (Home)
        </Button>
      </Link>
    </div>
  );
};

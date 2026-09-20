import React from 'react';
import { Target } from 'lucide-react';
import { useWaypointStore } from '../store/useWaypointStore';
import { GoalsView } from '../components/goals/GoalsView';

export const Goals: React.FC = () => {
  const goals = useWaypointStore((s) => s.goals);
  const budgets = useWaypointStore((s) => s.budgets);
  const addGoal = useWaypointStore((s) => s.addGoal);
  const updateGoal = useWaypointStore((s) => s.updateGoal);
  const deleteGoal = useWaypointStore((s) => s.deleteGoal);
  const setBudget = useWaypointStore((s) => s.setBudget);

  return (
    <GoalsView
      goals={goals}
      budgets={budgets}
      onAddGoal={addGoal}
      onUpdateGoal={updateGoal}
      onDeleteGoal={deleteGoal}
      onSetBudget={setBudget}
    />
  );
};

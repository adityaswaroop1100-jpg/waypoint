import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Wallet,
  AlertTriangle,
  ArrowRight,
  Receipt,
  Target
} from 'lucide-react';
import { useWaypointStore } from '../store/useWaypointStore';
import { OneMoveCard } from '../components/home/OneMoveCard';
import { NextMovePreview } from '../components/home/NextMovePreview';
import { StatTile } from '../components/ui/StatTile';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatCurrency, formatPercentage } from '../lib/format';
import { DISCLAIMER_TEXT } from '../lib/constants';

export const Home: React.FC = () => {
  const transactions = useWaypointStore((s) => s.transactions);
  const currentBalance = useWaypointStore((s) => s.currentBalance);
  const doMove = useWaypointStore((s) => s.doMove);
  const dismissMove = useWaypointStore((s) => s.dismissMove);
  const decision = useWaypointStore((s) => s.getDecisionState());
  const patterns = useWaypointStore((s) => s.getPatterns());
  const navigate = useNavigate();

  const { theOneMove, nextMoves, overallHealthScore, estimatedRunwayMonths, pinnedDipPoint } = decision;

  return (
    <div className="space-y-8">
      {/* 1. HERO — THE ONE MOVE (USP 1) */}
      <section>
        <OneMoveCard
          move={theOneMove}
          allTransactions={transactions}
          onDoMove={doMove}
          onDismissMove={dismissMove}
        />
      </section>

      {/* 2. FINANCIAL HEALTH KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Checking Balance"
          value={formatCurrency(currentBalance)}
          icon={<Wallet className="w-5 h-5 text-indigo-600" />}
          trend="neutral"
          trendText="Verified"
          subValue="Available liquidity"
        />
        <StatTile
          label="Emergency Runway"
          value={`${estimatedRunwayMonths} mo`}
          icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
          trend="up"
          trendText="Lean: +2.4mo"
          subValue="Fixed burn covered"
        />
        <StatTile
          label="Active Recurring Bills"
          value={`${patterns.recurring.length} items`}
          icon={<Receipt className="w-5 h-5 text-amber-600" />}
          trend="neutral"
          trendText="Automated"
          subValue="Rent, utilities, subs"
        />
        <StatTile
          label="Waypoint Health Score"
          value={`${overallHealthScore} / 100`}
          icon={<Sparkles className="w-5 h-5 text-indigo-600" />}
          trend="up"
          trendText="Top Tier"
          subValue="Deterministic Index"
        />
      </section>

      {/* 3. WEATHER COLLISION ALERT BANNER (If Dip Detected) */}
      {pinnedDipPoint && (
        <section>
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500 text-white rounded-2xl shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-950">
                  Upcoming 27th Cash-Flow Squeeze Detected
                </h3>
                <p className="text-xs text-amber-800">
                  Rent, electricity, and card auto-debits collide within 72h. Inspect your 90-day balance curve.
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/forecast')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Inspect 90-day Forecast
            </Button>
          </div>
        </section>
      )}

      {/* 4. NEXT MOVES IN QUEUE */}
      {nextMoves.length > 0 && (
        <section>
          <NextMovePreview
            moves={nextMoves}
            allTransactions={transactions}
            onDoMove={doMove}
          />
        </section>
      )}

      {/* 5. QUICK NAVIGATION CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          hoverable
          onClick={() => navigate('/simulator')}
          className="flex flex-col justify-between"
        >
          <div>
            <div className="text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              Stress-Test Decisions
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Life Event Simulator</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Model sudden job transitions, 15% rent increases, medical outlays, or gadget purchases.
            </p>
          </div>
          <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-indigo-600">
            <span>Launch 5 scenarios</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Card>

        <Card
          hoverable
          onClick={() => navigate('/regret')}
          className="flex flex-col justify-between"
        >
          <div>
            <div className="text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              Counterfactual Math
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Regret Engine</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Discover how much flexible cash you would retain with modest percentage adjustments.
            </p>
          </div>
          <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-indigo-600">
            <span>Calculate opportunities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Card>

        <Card
          hoverable
          onClick={() => navigate('/ask')}
          className="flex flex-col justify-between"
        >
          <div>
            <div className="text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              Deterministic Q&A
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Pushback Copilot</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ask "Can I afford ₹1.5L vacation?" and get grounded mathematical answers.
            </p>
          </div>
          <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-indigo-600">
            <span>Ask a question</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Card>
      </section>
    </div>
  );
};

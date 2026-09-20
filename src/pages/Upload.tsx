import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Download,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  Layers,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { parseCSVTransactions } from '../agents/ingestor';
import { parsePDFStatement } from '../agents/pdfParser';
import { useWaypointStore } from '../store/useWaypointStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../lib/format';
import { Transaction } from '../types';

type FileMode = 'csv' | 'pdf';

interface AnalysisSummary {
  count: number;
  totalIncome: number;
  totalExpenses: number;
  topCategories: { category: string; total: number; count: number }[];
  preview: Transaction[];
  pageCount?: number;
  rawTextPreview?: string;
}

export const Upload: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisSummary | null>(null);
  const [showRawText, setShowRawText] = useState(false);
  const [activeTab, setActiveTab] = useState<FileMode>('pdf');

  const addTransactions = useWaypointStore((s) => s.addTransactions);
  const categoryOverrides = useWaypointStore((s) => s.categoryOverrides);
  const resetDemo = useWaypointStore((s) => s.resetDemo);
  const navigate = useNavigate();

  const buildAnalysis = (transactions: Transaction[], extra?: { pageCount?: number; rawTextPreview?: string }): AnalysisSummary => {
    const totalIncome = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

    const catMap = new Map<string, { total: number; count: number }>();
    for (const tx of transactions) {
      if (tx.amount < 0) {
        const prev = catMap.get(tx.category) || { total: 0, count: 0 };
        catMap.set(tx.category, { total: prev.total + Math.abs(tx.amount), count: prev.count + 1 });
      }
    }
    const topCategories = [...catMap.entries()]
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);

    return {
      count: transactions.length,
      totalIncome,
      totalExpenses,
      topCategories,
      preview: transactions.slice(0, 8),
      ...extra
    };
  };

  const handlePDF = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setAnalysis(null);
    setProcessingStep('Reading PDF file…');

    try {
      const arrayBuffer = await file.arrayBuffer();
      setProcessingStep('Extracting text from all pages…');
      const result = await parsePDFStatement(arrayBuffer, categoryOverrides);
      setIsProcessing(false);
      setProcessingStep('');

      if (!result.success) {
        setErrorMessage(result.message);
        return;
      }

      addTransactions(result.transactions);
      setAnalysis(buildAnalysis(result.transactions, {
        pageCount: result.pageCount,
        rawTextPreview: result.rawTextPreview
      }));
    } catch (e: any) {
      setIsProcessing(false);
      setProcessingStep('');
      setErrorMessage(`Unexpected error: ${e?.message || 'Could not parse PDF.'}. Try a different file.`);
    }
  };

  const handleCSV = async (text: string) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setAnalysis(null);
    setProcessingStep('Parsing CSV rows…');

    const result = await parseCSVTransactions(text, categoryOverrides);
    setIsProcessing(false);
    setProcessingStep('');

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    addTransactions(result.transactions);
    setAnalysis(buildAnalysis(result.transactions));
  };

  const handleFile = async (file: File) => {
    if (!file) return;
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isCSV = file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv');

    if (isPDF) {
      setActiveTab('pdf');
      await handlePDF(file);
    } else if (isCSV) {
      setActiveTab('csv');
      const text = await file.text();
      await handleCSV(text);
    } else {
      setErrorMessage('Unsupported file type. Please upload a PDF bank statement or a CSV file.');
    }
  };

  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await handleFile(file);
  }, [categoryOverrides]);

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleFile(file);
    e.target.value = ''; // reset so same file can be re-uploaded
  };

  const handleDownloadSampleCSV = () => {
    const sampleCSV = `Date,Description,Amount,Category
2026-09-01,Tech Corp India (Salary),85000,Income
2026-09-03,Landlord Rent Transfer,-24000,Housing & Rent
2026-09-04,Netflix Subscription,-649,Subscriptions
2026-09-04,Spotify Premium,-119,Subscriptions
2026-09-04,Disney+ Hotstar Auto-Renew,-1499,Subscriptions
2026-09-05,Cult.Fit Gym Membership,-2500,Healthcare
2026-09-11,Zomato Friday Order,-840,Food & Dining
2026-09-15,State Electricity Board,-2950,Utilities & Bills
2026-09-18,Swiggy Weekend Starter,-790,Food & Dining
2026-09-20,Uber City Ride,-340,Transportation
2026-09-22,Amazon Shopping,-3200,Shopping & Gadgets
2026-09-25,HDFC Credit Card Auto-Pay,-18400,Financial & EMI`;

    const blob = new Blob([sampleCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'waypoint_sample_statement.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const netSavings = analysis ? analysis.totalIncome - analysis.totalExpenses : 0;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <UploadCloud className="w-6 h-6 text-indigo-600" />
          Statement Ingestion & Analysis
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Upload your bank or credit card statement — PDF or CSV. All parsing happens 100% in your browser. No data is sent to any server.
        </p>
      </div>

      {/* File Type Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('pdf')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'pdf'
              ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          PDF Statement
        </button>
        <button
          onClick={() => setActiveTab('csv')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'csv'
              ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          CSV Export
        </button>
      </div>

      {/* Upload Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all bg-white ${
          isDragging ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/50'
        }`}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Analysing Statement…</p>
              <p className="text-xs text-slate-500 mt-1">{processingStep}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              {activeTab === 'pdf' ? <FileText className="w-8 h-8" /> : <FileSpreadsheet className="w-8 h-8" />}
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {activeTab === 'pdf' ? 'Upload PDF Bank Statement' : 'Upload CSV Statement Export'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-2">
              {activeTab === 'pdf'
                ? 'Supports HDFC, SBI, ICICI, Axis, Kotak, IDFC, IndusInd, Yes Bank, Federal Bank text-based PDFs.'
                : 'Standard CSV with Date, Description/Merchant, and Amount columns.'}
            </p>
            <p className="text-[11px] text-slate-400 mb-6">
              Drag & drop your file here, or click to browse. Processed entirely in your browser — zero uploads.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm">
                  <UploadCloud className="w-4 h-4" />
                  {activeTab === 'pdf' ? 'Choose PDF File' : 'Choose CSV File'}
                </span>
                <input
                  type="file"
                  accept={activeTab === 'pdf' ? '.pdf,application/pdf' : '.csv,text/csv'}
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </label>

              {activeTab === 'pdf' && (
                <a
                  href="/sample_hdfc_statement.pdf"
                  download="sample_hdfc_statement.pdf"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Sample HDFC PDF
                </a>
              )}

              {activeTab === 'csv' && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDownloadSampleCSV}
                  icon={<Download className="w-3.5 h-3.5" />}
                >
                  Download Sample CSV
                </Button>
              )}
            </div>

            {activeTab === 'pdf' && (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left max-w-lg mx-auto">
                {['HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank', 'Kotak', 'IDFC First', 'IndusInd', 'Yes Bank'].map(bank => (
                  <div key={bank} className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {bank}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Error State */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-rose-800 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-950">Could not read this file</h4>
              <p className="text-xs text-rose-700 mt-1 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => { resetDemo(); navigate('/'); }}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Use built-in sample dataset instead
          </Button>
        </div>
      )}

      {/* ─── Analysis Results ─── */}
      {analysis && (
        <div className="space-y-4">
          {/* Success Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-950">
                  {analysis.count} Transactions Ingested
                  {analysis.pageCount ? ` · ${analysis.pageCount} PDF pages` : ''}
                </h4>
                <p className="text-xs text-emerald-700">
                  All decisions have been updated. Forecast, Simulator, and Regret Engine now reflect your real data.
                </p>
              </div>
            </div>
            <Button size="sm" variant="primary" onClick={() => navigate('/')} icon={<ArrowRight className="w-4 h-4" />}>
              View The One Move
            </Button>
          </div>

          {/* Financial Summary KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Total Credits</p>
                <p className="text-xl font-extrabold text-emerald-700 tabular-nums">{formatCurrency(analysis.totalIncome)}</p>
              </div>
            </Card>

            <Card className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <TrendingDown className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Total Debits</p>
                <p className="text-xl font-extrabold text-rose-700 tabular-nums">{formatCurrency(analysis.totalExpenses)}</p>
              </div>
            </Card>

            <Card className={`p-5 flex items-center gap-4 ${netSavings >= 0 ? 'border-emerald-200 bg-emerald-50/30' : 'border-rose-200 bg-rose-50/30'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${netSavings >= 0 ? 'bg-indigo-100' : 'bg-rose-100'}`}>
                <Sparkles className={`w-5 h-5 ${netSavings >= 0 ? 'text-indigo-600' : 'text-rose-600'}`} />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Net Savings</p>
                <p className={`text-xl font-extrabold tabular-nums ${netSavings >= 0 ? 'text-indigo-700' : 'text-rose-700'}`}>
                  {netSavings >= 0 ? '+' : ''}{formatCurrency(netSavings)}
                </p>
              </div>
            </Card>
          </div>

          {/* Spending by Category */}
          {analysis.topCategories.length > 0 && (
            <Card className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-bold text-slate-900">Spending Breakdown by Category</h4>
              </div>
              <div className="space-y-3">
                {analysis.topCategories.map((cat) => {
                  const pct = analysis.totalExpenses > 0 ? (cat.total / analysis.totalExpenses) * 100 : 0;
                  return (
                    <div key={cat.category}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-800">{cat.category}</span>
                          <span className="text-[11px] text-slate-400">{cat.count} txns</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 tabular-nums">{formatCurrency(cat.total)}</span>
                          <span className="text-[11px] text-slate-400 tabular-nums w-10 text-right">{pct.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className="bg-indigo-500 h-1.5 rounded-full transition-all duration-700"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Transaction Preview Table */}
          <Card className="overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">Recent Transactions (preview)</h4>
              <span className="text-xs text-slate-400">{analysis.preview.length} of {analysis.count} shown</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold">
                  <tr>
                    <th className="px-4 py-2.5">Date</th>
                    <th className="px-4 py-2.5">Description</th>
                    <th className="px-4 py-2.5">Category</th>
                    <th className="px-4 py-2.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analysis.preview.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2.5 text-slate-500 tabular-nums whitespace-nowrap">{tx.date}</td>
                      <td className="px-4 py-2.5 font-medium text-slate-800 max-w-[220px] truncate" title={tx.merchant}>{tx.merchant}</td>
                      <td className="px-4 py-2.5">
                        <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg text-[11px] font-semibold">
                          {tx.category}
                        </span>
                      </td>
                      <td className={`px-4 py-2.5 text-right font-bold tabular-nums whitespace-nowrap ${tx.amount >= 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                        {tx.amount >= 0 ? '+' : ''}{formatCurrency(tx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Raw Text Preview (PDF only, collapsible) */}
          {analysis.rawTextPreview && (
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-3.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                onClick={() => setShowRawText(v => !v)}
              >
                <div className="flex items-center gap-2">
                  {showRawText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showRawText ? 'Hide' : 'Show'} Extracted PDF Text (first 500 chars)
                </div>
                <span className="text-slate-400">{showRawText ? '▲' : '▼'}</span>
              </button>
              {showRawText && (
                <pre className="p-4 bg-slate-950 text-emerald-400 text-[11px] font-mono overflow-x-auto max-h-52 leading-relaxed">
                  {analysis.rawTextPreview}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


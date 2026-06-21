import React, { useState, useEffect } from 'react';
import { Settings, Key, Cpu, CheckCircle2, AlertTriangle, Eye, EyeOff, Zap, Server, Lock, LogIn, TestTube2, Save } from 'lucide-react';
import { getAIConfig, saveAIConfig, explainError } from '../utils/aiErrorExplainer';

// ⚠️ Hardcoded admin password — change this before deploying to VPS
const ADMIN_PASSWORD = 'codehero2025';

// ─── Password Gate ────────────────────────────────────────────────────────────
function PasswordGate({ onUnlock }) {
    const [input, setInput] = useState('');
    const [error, setError] = useState(false);
    const [showPw, setShowPw] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input === ADMIN_PASSWORD) {
            sessionStorage.setItem('admin_unlocked', '1');
            onUnlock();
        } else {
            setError(true);
            setInput('');
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-3xl shadow-2xl shadow-blue-500/30 mb-6 rotate-3">
                        <Lock size={36} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter">Admin Panel</h1>
                    <p className="text-slate-500 mt-2 text-sm">CodeHero — AI Configuration</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className={`relative transition-all ${error ? 'animate-pulse' : ''}`}>
                        <input
                            type={showPw ? 'text' : 'password'}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Admin password"
                            autoFocus
                            className={`w-full bg-slate-900 border ${error ? 'border-rose-500' : 'border-slate-800'} text-white placeholder-slate-600 rounded-2xl px-5 py-4 pr-12 outline-none focus:border-primary transition-colors text-base font-medium`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPw(v => !v)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                        >
                            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {error && (
                        <p className="text-rose-400 text-sm font-medium flex items-center gap-2 animate-in fade-in">
                            <AlertTriangle size={14} /> Incorrect password. Try again.
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
                    >
                        <LogIn size={18} />
                        Unlock Admin
                    </button>
                </form>
            </div>
        </div>
    );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ configured }) {
    return configured ? (
        <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-3 py-1 rounded-full">
            <CheckCircle2 size={12} /> Configured
        </span>
    ) : (
        <span className="flex items-center gap-1.5 text-slate-500 text-xs font-bold bg-slate-800 px-3 py-1 rounded-full">
            <AlertTriangle size={12} /> Not Set
        </span>
    );
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────
function AdminPanel() {

    const [config, setConfig] = useState({ provider: 'groq', apiKey: '', model: 'qwen2.5:0.5b', baseUrl: 'http://localhost:11434' });
    const [saved, setSaved] = useState(false);
    const [showKey, setShowKey] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState(null); // { ok: bool, message: string }

    // Load existing config on mount
    useEffect(() => {
        const existing = getAIConfig();
        if (existing) setConfig(existing);
    }, []);

    const handleSave = () => {
        saveAIConfig(config);
        setSaved(true);
        setTestResult(null);
        setTimeout(() => setSaved(false), 2500);
    };

    const handleTest = async () => {
        setTesting(true);
        setTestResult(null);
        try {
            // Temporarily save current form state for test
            saveAIConfig(config);
            const result = await explainError('[ERROR]: Division by zero', 'begin\n  x := 10 div 0;\nend.');
            setTestResult({ ok: true, message: result });
        } catch (err) {
            setTestResult({ ok: false, message: err.message });
        } finally {
            setTesting(false);
        }
    };

    const isConfigured = config.provider === 'groq' ? !!config.apiKey : !!config.baseUrl;

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Header */}
            <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-primary to-blue-600 p-2.5 rounded-xl">
                            <Settings size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-black text-lg tracking-tight">AI Configuration</h1>
                            <p className="text-slate-500 text-xs">CodeHero Admin Panel</p>
                        </div>
                    </div>
                    <StatusBadge configured={isConfigured} />
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">

                {/* Provider Selection */}
                <div>
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">AI Provider</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Groq */}
                        <button
                            onClick={() => setConfig(c => ({ ...c, provider: 'groq' }))}
                            className={`p-5 rounded-2xl border-2 text-left transition-all ${config.provider === 'groq' ? 'border-primary bg-primary/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-xl ${config.provider === 'groq' ? 'bg-primary/20' : 'bg-slate-800'}`}>
                                    <Zap size={20} className={config.provider === 'groq' ? 'text-primary' : 'text-slate-500'} />
                                </div>
                                {config.provider === 'groq' && <CheckCircle2 size={16} className="text-primary ml-auto" />}
                            </div>
                            <div className="font-bold text-base">Groq API</div>
                            <div className="text-xs text-slate-500 mt-1">Free cloud · Fast · Internet required</div>
                        </button>

                        {/* Ollama */}
                        <button
                            onClick={() => setConfig(c => ({ ...c, provider: 'ollama' }))}
                            className={`p-5 rounded-2xl border-2 text-left transition-all ${config.provider === 'ollama' ? 'border-violet-500 bg-violet-500/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-xl ${config.provider === 'ollama' ? 'bg-violet-500/20' : 'bg-slate-800'}`}>
                                    <Server size={20} className={config.provider === 'ollama' ? 'text-violet-400' : 'text-slate-500'} />
                                </div>
                                {config.provider === 'ollama' && <CheckCircle2 size={16} className="text-violet-400 ml-auto" />}
                            </div>
                            <div className="font-bold text-base">Ollama (Local)</div>
                            <div className="text-xs text-slate-500 mt-1">100% offline · ~400MB RAM</div>
                        </button>
                    </div>
                </div>

                {/* Provider Config */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-5">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Key size={14} /> Settings
                    </h2>

                    {config.provider === 'groq' && (
                        <>
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">
                                    Groq API Key
                                    <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="ml-2 text-primary text-xs font-normal hover:underline">
                                        Get free key →
                                    </a>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showKey ? 'text' : 'password'}
                                        value={config.apiKey || ''}
                                        onChange={e => setConfig(c => ({ ...c, apiKey: e.target.value }))}
                                        placeholder="gsk_..."
                                        className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-600 rounded-xl px-4 py-3 pr-12 outline-none focus:border-primary transition-colors text-sm font-mono"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowKey(v => !v)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                    >
                                        {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <p className="text-xs text-slate-600 mt-2">Model: <span className="text-slate-400 font-mono">llama-3.1-8b-instant</span> (free tier)</p>
                            </div>
                        </>
                    )}

                    {config.provider === 'ollama' && (
                        <>
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Ollama Base URL</label>
                                <input
                                    type="text"
                                    value={config.baseUrl || 'http://localhost:11434'}
                                    onChange={e => setConfig(c => ({ ...c, baseUrl: e.target.value }))}
                                    placeholder="http://localhost:11434"
                                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-600 rounded-xl px-4 py-3 outline-none focus:border-violet-500 transition-colors text-sm font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Model Name</label>
                                <input
                                    type="text"
                                    value={config.model || 'qwen2.5:0.5b'}
                                    onChange={e => setConfig(c => ({ ...c, model: e.target.value }))}
                                    placeholder="qwen2.5:0.5b"
                                    className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-600 rounded-xl px-4 py-3 outline-none focus:border-violet-500 transition-colors text-sm font-mono"
                                />
                                <p className="text-xs text-slate-600 mt-2">Recommended: <span className="text-slate-400 font-mono">qwen2.5:0.5b</span> (~400MB) or <span className="text-slate-400 font-mono">qwen2.5:1.5b</span> (~900MB)</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={handleTest}
                        disabled={testing || !isConfigured}
                        className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-sm transition-all active:scale-95"
                    >
                        {testing ? (
                            <span className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
                        ) : (
                            <TestTube2 size={16} />
                        )}
                        {testing ? 'Testing...' : 'Test Connection'}
                    </button>

                    <button
                        onClick={handleSave}
                        className={`flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${saved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20'}`}
                    >
                        {saved ? <><CheckCircle2 size={16} /> Saved!</> : <><Save size={16} /> Save Config</>}
                    </button>
                </div>

                {/* Test Result */}
                {testResult && (
                    <div className={`p-5 rounded-2xl border animate-in fade-in slide-in-from-bottom-2 ${testResult.ok ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                        <div className={`flex items-center gap-2 font-bold text-sm mb-2 ${testResult.ok ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {testResult.ok ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
                            {testResult.ok ? 'Connection Successful!' : 'Connection Failed'}
                        </div>
                        <p className={`text-sm leading-relaxed ${testResult.ok ? 'text-emerald-200/80' : 'text-rose-200/80'}`}>
                            {testResult.message}
                        </p>
                    </div>
                )}

                {/* Info Box */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 text-xs text-slate-500 space-y-1.5">
                    <p className="font-bold text-slate-400 text-sm mb-3 flex items-center gap-2"><Cpu size={14} /> How it works</p>
                    <p>• Config saves to <code className="bg-slate-800 px-1 rounded text-slate-300">localStorage</code> in the browser</p>
                    <p>• Pascal IDE eke error ekak awama "🤖 Explain" button ekak penena</p>
                    <p>• Eka click karala AI eka reason eka simple Singlish wala kiyana</p>
                    <p>• API key server ekaka store wenawa ne — browser wala witharak</p>
                </div>
            </div>
        </div>
    );
}

// ─── Export: Password-Gated Admin ─────────────────────────────────────────────
export default function AdminPage() {
    const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('admin_unlocked') === '1');

    if (!unlocked) {
        return <PasswordGate onUnlock={() => setUnlocked(true)} />;
    }
    return <AdminPanel />;
}

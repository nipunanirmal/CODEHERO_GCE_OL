import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Gamepad2, Code, Code2, FileText, CheckCircle, ChevronLeft, ChevronRight, ChevronDown, Trophy, Lock, PlayCircle, CheckCircle2 } from 'lucide-react';

import FlowchartGame from './components/FlowchartGame';
import PseudoCodeGame from './components/PseudoCodeGame';
import { levels } from './data/levels';
import { pseudoLevels } from './data/pseudoLevels';
import { pascalLevels } from './data/pascalLevels';
import PascalGame from './components/PascalGame';
import PascalIDE from './components/PascalIDE/PascalIDE';

// Placeholders for modules
const Home = () => (
  <div className="p-12 max-w-5xl mx-auto">
    <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl animate-pulse" />
      <div className="relative z-10">
        <h1 className="text-6xl font-black text-slate-800 mb-8 tracking-tighter leading-[1.1]">
          සරල පියවරින් <br />
          <span className="text-primary italic underline underline-offset-8 decoration-primary/20">Programming</span> ඉගෙන ගනිමු!
        </h1>
        <p className="text-xl text-slate-500 mb-12 leading-relaxed font-medium max-w-2xl">
          G.C.E O/L ICT 11 ශ්‍රේණියේ 1 වන පාඩම ඉතාමත් සරලව සහ විනෝදජනක ලෙස ඉගෙන ගැනීමට අප හා එක්වන්න. පහතින් ඇති පාඩම් මාලාවෙන් එකක් තෝරා ගන්න.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ModuleCard
            to="/flowcharts"
            title="ගැලීම් සටහන්"
            desc="Flowcharts"
            color="bg-emerald-500"
            icon={<FileText size={32} />}
          />
          <ModuleCard
            to="/pseudocode"
            title="ව්‍යාජ කේත"
            desc="Pseudo Code"
            color="bg-sky-500"
            icon={<Code size={32} />}
          />
          <ModuleCard
            to="/pascal"
            title="Pascal බස"
            desc="Pascal Language"
            color="bg-amber-500"
            icon={<Code size={32} />}
          />
        </div>
      </div>
    </div>
  </div>
);

const ModuleCard = ({ to, title, desc, color, icon }) => (
  <Link to={to} className="group relative overflow-hidden bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 active:scale-95">
    <div className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:rotate-6 transition-all shadow-lg shadow-${color.split('-')[1]}-200`}>
      {icon}
    </div>
    <h3 className="text-2xl font-black text-slate-800 mb-1 tracking-tight">{title}</h3>
    <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">{desc}</p>
    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-10 transition-opacity">
      <CheckCircle size={60} />
    </div>
  </Link>
);




function AppContent() {
  const [xp, setXp] = useState(() => {
    try { return parseInt(sessionStorage.getItem('user_xp') || '0', 10); } catch { return 0; }
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // --- GAME STATE LIFTED UP ---
  // Flowcharts
  const [levelIndex, setLevelIndex] = useState(0);
  const [completedLevels, setCompletedLevels] = useState(new Set());

  // Pseudo Code
  const [pseudoLevelIndex, setPseudoLevelIndex] = useState(0);
  const [completedPseudoLevels, setCompletedPseudoLevels] = useState(new Set());

  // Pascal
  const [pascalLevelIndex, setPascalLevelIndex] = useState(0);
  const [completedPascalLevels, setCompletedPascalLevels] = useState(new Set());

  // --- NAVIGATION STATE ---
  const navigate = useNavigate();
  const location = useLocation();
  const [openSection, setOpenSection] = useState('flowcharts');

  const addXP = (amount) => {
    setXp((prev) => {
      const newValue = prev + amount;
      sessionStorage.setItem('user_xp', newValue);
      return newValue;
    });
  };

  const handleLevelSelect = (index) => {
    setLevelIndex(index);
    navigate('/flowcharts');
  };

  const handlePseudoLevelSelect = (index) => {
    setPseudoLevelIndex(index);
    navigate('/pseudocode');
  };

  const handlePascalLevelSelect = (index) => {
    setPascalLevelIndex(index);
    navigate('/pascal');
  };

  const toggleSection = (section) => {
    setOpenSection(prev => prev === section ? null : section);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 selection:bg-primary/20">
      {/* Sidebar */}
      <div
        className={`
                    ${isSidebarOpen ? 'w-80' : 'w-24'} 
                    bg-slate-950 text-white flex flex-col shadow-2xl relative z-50 transition-all duration-300 ease-in-out
                `}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-4 top-10 bg-primary text-white p-1.5 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50 border-2 border-slate-900 cursor-pointer"
        >
          {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        <div className={`p-10 mb-2 transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 scale-95 hidden'}`}>
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-primary to-blue-600 p-3 rounded-2xl shadow-2xl shadow-blue-500/40 rotate-3 animate-pulse">
              <Gamepad2 size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Code<span className="text-primary tracking-widest drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">Hero</span></h1>
          </div>
        </div>

        {/* Collapsed Logo Placeholder */}
        {!isSidebarOpen && (
          <div className="p-6 flex justify-center mb-2">
            <div className="bg-gradient-to-br from-primary to-blue-600 p-3 rounded-2xl shadow-2xl shadow-blue-500/40">
              <Gamepad2 size={24} className="text-white" />
            </div>
          </div>
        )}

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto pt-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <NavItem to="/" icon={<CheckCircle size={22} />} label="ප්‍රධාන පුවරුව" isOpen={isSidebarOpen} isActive={location.pathname === '/'} />

          {/* SECTIONS */}

          {/* FLOWCHARTS */}
          <div>
            <button
              onClick={() => toggleSection('flowcharts')}
              className={`w-full flex items-center ${isSidebarOpen ? 'justify-between px-6' : 'justify-center px-0'} py-4 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all`}
            >
              <div className="flex items-center gap-4">
                <FileText size={22} className={openSection === 'flowcharts' ? 'text-emerald-400' : ''} />
                {isSidebarOpen && <span className="font-bold tracking-tight text-lg">ගැලීම් සටහන්</span>}
              </div>
              {isSidebarOpen && (openSection === 'flowcharts' ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
            </button>

            {/* LEVEL LIST (Nested) */}
            {isSidebarOpen && openSection === 'flowcharts' && (
              <div className="ml-6 pl-4 border-l border-slate-800 space-y-1 my-2 animate-in slide-in-from-top-2 duration-200">
                {levels.map((level, idx) => {
                  const isCompleted = completedLevels.has(level.id);
                  const isActive = location.pathname === '/flowcharts' && idx === levelIndex;

                  return (
                    <button
                      key={level.id}
                      onClick={() => handleLevelSelect(idx)}
                      className={`w-full text-left p-2 rounded-lg transition-all flex items-baseline gap-3 relative group
                                                ${isActive ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:text-slate-300'}
                                            `}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isCompleted ? 'bg-emerald-500' : (isActive ? 'bg-primary' : 'bg-slate-700')}`} />
                      <span className={`text-xs font-bold truncate ${isActive ? 'text-white' : ''}`}>{level.title}</span>
                      {isCompleted && <CheckCircle2 size={10} className="text-emerald-500 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>


          {/* PSEUDO CODE */}
          <div>
            <button
              onClick={() => toggleSection('pseudocode')}
              className={`w-full flex items-center ${isSidebarOpen ? 'justify-between px-6' : 'justify-center px-0'} py-4 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all`}
            >
              <div className="flex items-center gap-4">
                <Code size={22} className={openSection === 'pseudocode' ? 'text-sky-400' : ''} />
                {isSidebarOpen && <span className="font-bold tracking-tight text-lg">ව්‍යාජ කේත</span>}
              </div>
              {isSidebarOpen && (openSection === 'pseudocode' ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
            </button>

            {/* LEVEL LIST (Nested) */}
            {isSidebarOpen && openSection === 'pseudocode' && (
              <div className="ml-6 pl-4 border-l border-slate-800 space-y-1 my-2 animate-in slide-in-from-top-2 duration-200">
                {pseudoLevels.map((level, idx) => {
                  const isCompleted = completedPseudoLevels.has(level.id);
                  const isActive = location.pathname === '/pseudocode' && idx === pseudoLevelIndex;

                  return (
                    <button
                      key={level.id}
                      onClick={() => handlePseudoLevelSelect(idx)}
                      className={`w-full text-left p-2 rounded-lg transition-all flex items-baseline gap-3 relative group
                                                ${isActive ? 'bg-sky-500/10 text-sky-400' : 'text-slate-500 hover:text-slate-300'}
                                            `}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isCompleted ? 'bg-emerald-500' : (isActive ? 'bg-sky-500' : 'bg-slate-700')}`} />
                      <span className={`text-xs font-bold truncate ${isActive ? 'text-white' : ''}`}>{level.title}</span>
                      {isCompleted && <CheckCircle2 size={10} className="text-emerald-500 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* PASCAL */}
          <div>
            <button
              onClick={() => toggleSection('pascal')}
              className={`w-full flex items-center ${isSidebarOpen ? 'justify-between px-6' : 'justify-center px-0'} py-4 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all`}
            >
              <div className="flex items-center gap-4">
                <Code size={22} className={openSection === 'pascal' ? 'text-amber-400' : ''} />
                {isSidebarOpen && <span className="font-bold tracking-tight text-lg">පැස්කල් (Pascal)</span>}
              </div>
              {isSidebarOpen && (openSection === 'pascal' ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
            </button>

            {/* LEVEL LIST (Nested) */}
            {isSidebarOpen && openSection === 'pascal' && (
              <div className="ml-6 pl-4 border-l border-slate-800 space-y-1 my-2 animate-in slide-in-from-top-2 duration-200">
                {pascalLevels.map((level, idx) => {
                  const isCompleted = completedPascalLevels.has(level.id);
                  const isActive = location.pathname === '/pascal' && idx === pascalLevelIndex;

                  return (
                    <button
                      key={level.id}
                      onClick={() => handlePascalLevelSelect(idx)}
                      className={`w-full text-left p-2 rounded-lg transition-all flex items-baseline gap-3 relative group
                                                ${isActive ? 'bg-amber-500/10 text-amber-400' : 'text-slate-500 hover:text-slate-300'}
                                            `}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isCompleted ? 'bg-emerald-500' : (isActive ? 'bg-amber-500' : 'bg-slate-700')}`} />
                      <span className={`text-xs font-bold truncate ${isActive ? 'text-white' : ''}`}>{level.title}</span>
                      {isCompleted && <CheckCircle2 size={10} className="text-emerald-500 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <NavItem to="/ide" icon={<Code2 size={22} />} label="Pascal IDE (New)" isOpen={isSidebarOpen} isActive={location.pathname === '/ide'} />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/flowcharts"
            element={
              <FlowchartGame
                xp={xp}
                addXP={addXP}
                levelIndex={levelIndex}
                setLevelIndex={setLevelIndex}
                completedLevels={completedLevels}
                setCompletedLevels={setCompletedLevels}
              />
            }
          />
          <Route
            path="/pseudocode"
            element={
              <PseudoCodeGame
                xp={xp}
                addXP={addXP}
                levelIndex={pseudoLevelIndex} // Pass lifted state
                setLevelIndex={setPseudoLevelIndex} // Pass setter
                completedLevels={completedPseudoLevels}
                setCompletedLevels={setCompletedPseudoLevels}
              />
            }
          />
          <Route
            path="/pascal"
            element={
              <PascalGame
                xp={xp}
                addXP={addXP}
                levelIndex={pascalLevelIndex}
                setLevelIndex={setPascalLevelIndex}
                completedLevels={completedPascalLevels}
                setCompletedLevels={setCompletedPascalLevels}
              />
            }
          />
          <Route path="/ide" element={<PascalIDE />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

const NavItem = ({ to, icon, label, isOpen, isActive }) => (
  <Link
    to={to}
    className={`
        flex items-center ${isOpen ? 'justify-start gap-4 px-6' : 'justify-center px-0'} 
        py-4 rounded-2xl transition-all duration-300 transform hover:translate-x-1 group relative overflow-hidden
        ${isActive ? 'bg-white/10 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}
    `}
  >
    <div className={`relative z-10 group-hover:scale-110 transition-transform ${isActive ? 'text-primary' : ''}`}>{icon}</div>
    {isOpen && <span className="font-bold relative z-10 tracking-tight text-lg animate-in fade-in slide-in-from-left-2 duration-200">{label}</span>}
  </Link>
);

export default App;

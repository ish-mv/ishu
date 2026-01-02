
import React, { useState, useEffect } from 'react';
import { ASSESSMENTS, SYLLABUS_DATA, MCQ_DATA, WEB_RESOURCES, LAB_ACTIVITIES, LAB_SCENARIOS, CASE_STUDIES_DATA } from './constants';
import { Assessment, FeedbackResponse, Unit, Slide, MCQ, LabActivity, LabScenario, CaseStudy } from './types';
import { GeminiService } from './services/geminiService';
import { 
  Cpu, Workflow, Database, Server, ChevronRight, ChevronLeft, BrainCircuit, CheckCircle, 
  AlertCircle, BookOpen, ArrowLeft, Loader2, Trophy, Presentation, Download, Sparkles, 
  ShieldAlert, Info, HelpCircle, RefreshCw, ExternalLink, Bookmark, Layers, Zap, Box, 
  Terminal, Play, Trash2, MousePointer2, Keyboard, Repeat, GitBranch, FileSpreadsheet, 
  Lock, Plus, GraduationCap, History, Globe, Building2, Mail, FileText
} from 'lucide-react';

const gemini = new GeminiService();

const App: React.FC = () => {
  const [view, setView] = useState<'assessments' | 'study' | 'syllabus' | 'quiz' | 'resources' | 'lab' | 'cases'>('assessments');
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [selectedUnitForPPT, setSelectedUnitForPPT] = useState<Unit | null>(null);
  const [pptSlides, setPptSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isGeneratingPPT, setIsGeneratingPPT] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  
  // Lab State
  const [selectedLab, setSelectedLab] = useState<LabScenario | null>(null);
  const [workflow, setWorkflow] = useState<LabActivity[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [labSuccess, setLabSuccess] = useState(false);

  // Case Study State
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);

  // Quiz State
  const [selectedUnitForQuiz, setSelectedUnitForQuiz] = useState<Unit | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<MCQ[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  const [answer, setAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    if (isGeneratingPPT) {
      const steps = [
        "Analyzing syllabus sub-topics...",
        "Drafting slide structure (50 slides)...",
        "Generating technical diagrams descriptions...",
        "Curating industry case studies...",
        "Finalizing pedagogical notes...",
        "Rendering Masterclass Deck..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        setLoadingStep(steps[i % steps.length]);
        i++;
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isGeneratingPPT]);

  const handleSelect = (a: Assessment) => {
    setSelectedAssessment(a);
    setAnswer('');
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generateUnitPPT = async (unit: Unit) => {
    setSelectedUnitForPPT(unit);
    setIsGeneratingPPT(true);
    setCurrentSlideIndex(0);
    try {
      const slides = await gemini.generateSlides(unit, SYLLABUS_DATA[unit]);
      setPptSlides(slides);
    } catch (err) {
      alert("AI generation failed. Please check your connection.");
    } finally {
      setIsGeneratingPPT(false);
    }
  };

  const startQuiz = (unit: Unit, mode: 'local' | 'ai') => {
    setSelectedUnitForQuiz(unit);
    setQuizFinished(false);
    setQuizScore(0);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);

    if (mode === 'local') {
      const questions = [...(MCQ_DATA[unit] || [])].sort(() => 0.5 - Math.random());
      setQuizQuestions(questions);
    } else {
      generateAIQuiz(unit);
    }
  };

  const generateAIQuiz = async (unit: Unit) => {
    setIsGeneratingQuiz(true);
    try {
      const questions = await gemini.generateUnitMCQs(unit, SYLLABUS_DATA[unit]);
      setQuizQuestions(questions.length > 0 ? questions : (MCQ_DATA[unit] || []));
    } catch (err) {
      setQuizQuestions(MCQ_DATA[unit] || []);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAssessment || !answer.trim()) return;
    setIsEvaluating(true);
    try {
      const result = await gemini.evaluateAssessment(
        selectedAssessment.unit,
        selectedAssessment.scenario,
        selectedAssessment.task,
        answer
      );
      setFeedback(result);
      if (result.score >= 70) setCompleted(prev => Array.from(new Set([...prev, selectedAssessment.id])));
    } catch (err) {
      alert("Evaluation failed.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const runWorkflow = async () => {
    if (!selectedLab) return;
    setIsRunning(true);
    setLogs(['Initiating Robot Worker...']);
    for (let log of selectedLab.successLogs) {
      await new Promise(r => setTimeout(r, 800));
      setLogs(prev => [...prev, log]);
    }
    const currentIds = workflow.map(a => a.id.split('_')[0]);
    const missing = selectedLab.requiredActivities.filter(id => !currentIds.includes(id));
    if (missing.length === 0) {
      setLabSuccess(true);
      setLogs(prev => [...prev, '✓ EXECUTION SUCCESSFUL.']);
    } else {
      setLogs(prev => [...prev, `✖ ERROR: Missing required activities: ${missing.join(', ')}`]);
    }
    setIsRunning(false);
  };

  const getUnitIcon = (unit: string) => {
    if (unit.includes('Unit I')) return <Cpu className="w-6 h-6 text-blue-500" />;
    if (unit.includes('Unit II')) return <Workflow className="w-6 h-6 text-indigo-500" />;
    if (unit.includes('Unit III')) return <Database className="w-6 h-6 text-blue-600" />;
    if (unit.includes('Unit IV')) return <ShieldAlert className="w-6 h-6 text-red-500" />;
    return <Server className="w-6 h-6 text-cyan-500" />;
  };

  const getActivityIcon = (icon: string) => {
    const icons: Record<string, any> = { 
      Keyboard, Box, Globe, FileSpreadsheet, FileText, GitBranch, Layers, Repeat, 
      MousePointer2, ShieldAlert, Zap, Mail, Terminal, Lock 
    };
    const Component = icons[icon] || Box;
    return <Component className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-blue-50 text-blue-950">
      <nav className="sticky top-0 z-50 bg-blue-50/80 backdrop-blur-md border-b border-blue-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setView('assessments'); setSelectedAssessment(null); setSelectedUnitForPPT(null); setSelectedUnitForQuiz(null); setSelectedCase(null); }}>
            <div className="bg-blue-600 p-2 rounded-lg"><BrainCircuit className="w-6 h-6 text-white" /></div>
            <h1 className="text-xl font-bold tracking-tight text-blue-900 hidden sm:block">CCS361: RPA Mastery</h1>
          </div>
          <div className="flex gap-2 bg-blue-100 p-1 rounded-xl border border-blue-200 overflow-x-auto no-scrollbar max-w-[60%] md:max-w-none">
            {['assessments', 'study', 'cases', 'quiz', 'lab', 'resources', 'syllabus'].map((v: any) => (
              <button key={v} onClick={() => { setView(v); setSelectedAssessment(null); setSelectedUnitForPPT(null); setSelectedUnitForQuiz(null); setSelectedCase(null); }} className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium capitalize whitespace-nowrap transition-all ${view === v ? 'bg-blue-600 text-white' : 'text-blue-600 hover:text-blue-900'}`}>
                {v === 'study' ? 'Virtual PPT' : v === 'cases' ? 'Case Studies' : v}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {view === 'assessments' && !selectedAssessment && (
          <section className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-4xl font-extrabold text-blue-900">Critical Thinking Assessments</h2>
              <p className="text-blue-700 text-lg">Master CCS361 with AI-guided feedback based on complex scenarios.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ASSESSMENTS.map(a => (
                <div key={a.id} onClick={() => handleSelect(a)} className="bg-white border border-blue-100 rounded-2xl p-6 cursor-pointer hover:border-blue-500/50 transition-all group shadow-sm hover:shadow-md">
                  {completed.includes(a.id) && <div className="text-emerald-600 text-xs font-bold mb-2 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> PASSED</div>}
                  <div className="mb-4">{getUnitIcon(a.unit)}</div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2 group-hover:text-blue-600 transition-colors">{a.title}</h3>
                  <p className="text-sm text-blue-600 mb-4 line-clamp-2">{a.description}</p>
                  <div className="text-xs font-medium text-blue-400 uppercase tracking-wider">{a.unit.split(':')[0]}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {view === 'assessments' && selectedAssessment && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            <button onClick={() => setSelectedAssessment(null)} className="flex items-center gap-2 text-blue-600 hover:text-blue-900 transition-colors"><ArrowLeft className="w-4 h-4" /> Back</button>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-blue-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-blue-600 px-6 py-4"><h3 className="text-white font-bold">{selectedAssessment.title}</h3></div>
                  <div className="p-6 space-y-4">
                    <div><h4 className="text-xs font-bold text-blue-400 uppercase mb-1">Scenario</h4><p className="text-blue-900 text-sm leading-relaxed">{selectedAssessment.scenario}</p></div>
                    <div><h4 className="text-xs font-bold text-blue-400 uppercase mb-1">Task</h4><div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 italic text-sm">{selectedAssessment.task}</div></div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white border border-blue-200 rounded-2xl p-6 shadow-sm">
                  <h4 className="text-lg font-bold text-blue-900 mb-4">Your Proposal</h4>
                  <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Enter your detailed technical strategy..." className="w-full h-64 bg-blue-50 border border-blue-100 rounded-xl p-4 text-blue-950 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm resize-none" />
                  <div className="mt-4 flex justify-end">
                    <button onClick={handleSubmit} disabled={isEvaluating || !answer.trim()} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-2 transition-colors">
                      {isEvaluating ? <Loader2 className="w-5 h-5 animate-spin"/> : <BrainCircuit className="w-5 h-5"/>} Evaluate
                    </button>
                  </div>
                </div>
                {feedback && (
                  <div className="bg-white border border-blue-200 rounded-2xl p-6 animate-in fade-in shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-black text-blue-900">Score: {feedback.score}%</span>
                      {feedback.score >= 70 ? <CheckCircle className="text-emerald-500 w-8 h-8"/> : <AlertCircle className="text-red-500 w-8 h-8"/>}
                    </div>
                    <p className="text-blue-800 text-sm italic mb-6 leading-relaxed">"{feedback.criticalAnalysis}"</p>
                    <div className="space-y-3">
                      <h5 className="text-xs font-bold text-blue-500 uppercase tracking-widest">Feedback Points:</h5>
                      <ul className="space-y-2">
                        {feedback.improvementAreas.map((area, idx) => <li key={idx} className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-xs text-blue-700">• {area}</li>)}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'study' && (
          <section className="space-y-8 animate-in fade-in">
            {!selectedUnitForPPT ? (
              <>
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                  <h2 className="text-4xl font-extrabold text-blue-900 flex items-center justify-center gap-3"><Presentation className="w-10 h-10 text-blue-600" /> Virtual PPT Generator</h2>
                  <p className="text-blue-700 text-lg">AI-powered 50-slide masterclass presentations for each unit.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.values(Unit).map(unit => (
                    <div key={unit} onClick={() => generateUnitPPT(unit)} className="bg-white border border-blue-200 p-6 rounded-2xl flex items-center justify-between group hover:border-blue-500 transition-all cursor-pointer shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">{getUnitIcon(unit)}</div>
                        <div><h3 className="text-lg font-bold text-blue-900">{unit}</h3><p className="text-xs text-blue-500 uppercase tracking-widest font-semibold">Generate Master Deck</p></div>
                      </div>
                      <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                    </div>
                  ))}
                </div>
              </>
            ) : isGeneratingPPT ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-6">
                <div className="relative"><div className="w-24 h-24 border-t-4 border-blue-500 rounded-full animate-spin"></div><Layers className="absolute inset-0 m-auto w-10 h-10 text-blue-400 animate-pulse"/></div>
                <div className="text-center"><p className="text-xl font-bold text-blue-900 uppercase tracking-tighter">AI Teacher is Drafting...</p><p className="text-blue-600 text-sm mt-2">{loadingStep}</p></div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <button onClick={() => setSelectedUnitForPPT(null)} className="flex items-center gap-2 text-blue-600 hover:text-blue-900 transition-colors"><ArrowLeft className="w-4 h-4" /> Back</button>
                  <div className="text-sm bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full font-bold border border-blue-200">Masterclass Mode: {selectedUnitForPPT}</div>
                </div>
                <div className="bg-white border border-blue-200 rounded-[40px] overflow-hidden shadow-2xl">
                  <div className="aspect-video bg-blue-100 p-12 flex flex-col justify-center relative">
                    <div className="absolute top-8 left-8 bg-blue-600/20 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-500/20">Slide {currentSlideIndex + 1} / {pptSlides.length}</div>
                    
                    <div className="max-w-4xl mx-auto w-full">
                      <h2 className="text-4xl md:text-5xl font-black text-blue-900 mb-10 border-l-8 border-blue-600 pl-8 uppercase tracking-tight">{pptSlides[currentSlideIndex]?.title}</h2>
                      <ul className="space-y-6">
                        {pptSlides[currentSlideIndex]?.bullets.map((b, i) => <li key={i} className="flex items-start gap-6 text-xl md:text-2xl text-blue-950"><span className="w-4 h-4 bg-blue-500 rounded-full mt-3 flex-shrink-0 shadow-[0_0_15px_rgba(37,99,235,0.5)]"/>{b}</li>)}
                      </ul>
                    </div>

                    <div className="absolute bottom-12 left-0 right-0 flex items-center justify-center gap-8">
                      <button onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))} disabled={currentSlideIndex === 0} className="p-4 rounded-full bg-white hover:bg-blue-50 text-blue-600 disabled:opacity-20 transition-all border border-blue-200 shadow-xl"><ChevronLeft className="w-8 h-8"/></button>
                      <div className="flex gap-2">
                        {Array.from({length: Math.min(pptSlides.length, 10)}).map((_, i) => (
                           <div key={i} className={`h-1.5 w-1.5 rounded-full ${Math.floor(currentSlideIndex / (pptSlides.length/10)) === i ? 'bg-blue-600 w-8' : 'bg-blue-200'} transition-all`}></div>
                        ))}
                      </div>
                      <button onClick={() => setCurrentSlideIndex(Math.min(pptSlides.length - 1, currentSlideIndex + 1))} disabled={currentSlideIndex === pptSlides.length - 1} className="p-4 rounded-full bg-white hover:bg-blue-50 text-blue-600 disabled:opacity-20 transition-all border border-blue-200 shadow-xl"><ChevronRight className="w-8 h-8"/></button>
                    </div>
                  </div>
                  <div className="p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 text-blue-600"><Layers className="w-6 h-6"/><h4 className="text-sm font-black uppercase tracking-widest">Visual Asset Description</h4></div>
                      <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 shadow-sm"><p className="text-sm md:text-base text-blue-800 leading-relaxed font-mono italic">{pptSlides[currentSlideIndex]?.diagramDescription}</p></div>
                    </div>
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-indigo-600"><Zap className="w-6 h-6"/><h4 className="text-sm font-black uppercase tracking-widest">Real-Time Business Case</h4></div>
                        <p className="text-lg text-blue-900 font-medium leading-relaxed bg-blue-50 p-6 rounded-3xl border border-blue-200 italic">"{pptSlides[currentSlideIndex]?.realTimeExample}"</p>
                      </div>
                      <div className="pt-8 border-t border-blue-100 space-y-4">
                        <div className="flex items-center gap-3 text-blue-400"><Info className="w-5 h-5"/><h4 className="text-xs font-black uppercase tracking-widest">Professor's Deep-Dive Note</h4></div>
                        <p className="text-sm text-blue-500 leading-relaxed">{pptSlides[currentSlideIndex]?.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {view === 'syllabus' && (
          <section className="space-y-8 animate-in fade-in max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-extrabold text-blue-900">Course Syllabus</h2>
              <p className="text-blue-700 text-lg">CCS361 – Robotic Process Automation (Full Academic Framework)</p>
            </div>
            <div className="space-y-6">
              {Object.entries(SYLLABUS_DATA).map(([unit, content]) => (
                <div key={unit} className="bg-white border border-blue-200 rounded-3xl overflow-hidden group hover:border-blue-500 transition-all shadow-sm">
                  <div className="px-8 py-5 bg-blue-50 flex items-center gap-4 border-b border-blue-100">
                    {getUnitIcon(unit)}
                    <h3 className="text-lg font-bold text-blue-900">{unit}</h3>
                  </div>
                  <div className="p-8"><p className="text-blue-800 leading-relaxed text-sm whitespace-pre-wrap">{content}</p></div>
                </div>
              ))}
            </div>
          </section>
        )}

        {view === 'quiz' && (
          <section className="space-y-8 animate-in fade-in">
            {!selectedUnitForQuiz ? (
              <>
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                  <h2 className="text-4xl font-extrabold text-blue-900 flex items-center justify-center gap-3"><GraduationCap className="w-10 h-10 text-blue-600" /> Exam Simulator</h2>
                  <p className="text-blue-700 text-lg">Test your knowledge with local banks or massive AI-generated sessions.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.values(Unit).map(unit => (
                    <div key={unit} className="bg-white border border-blue-200 p-6 rounded-3xl flex flex-col gap-4 group hover:border-blue-500 transition-all shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-xl">{getUnitIcon(unit)}</div>
                        <h3 className="text-lg font-bold text-blue-900 leading-tight">{unit}</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <button onClick={() => startQuiz(unit, 'local')} className="py-2.5 bg-blue-50 hover:bg-blue-100 rounded-xl text-xs font-bold text-blue-700 flex items-center justify-center gap-2 border border-blue-200 transition-colors"><History className="w-3 h-3"/> Local</button>
                        <button onClick={() => startQuiz(unit, 'ai')} className="py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-sm transition-colors"><Sparkles className="w-3 h-3"/> AI 50-Set</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : isGeneratingQuiz ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-6">
                <div className="w-20 h-20 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                <div className="text-center"><p className="text-xl font-bold text-blue-900">AI is crafting 50 questions...</p><p className="text-blue-600 text-sm mt-2">Balancing difficulty across syllabus topics.</p></div>
              </div>
            ) : !quizFinished ? (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex justify-between items-center text-blue-500 text-xs font-bold uppercase tracking-widest">
                  <span>Question {currentQuestionIndex + 1} / {quizQuestions.length}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Correct: {quizScore}</span>
                  </div>
                </div>
                <div className="bg-white border border-blue-200 rounded-3xl p-8 space-y-8 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 left-0 h-1 bg-blue-500 transition-all duration-500" style={{width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`}}></div>
                  <h3 className="text-2xl md:text-3xl font-bold text-blue-950 leading-tight">{quizQuestions[currentQuestionIndex]?.question}</h3>
                  <div className="space-y-3">
                    {quizQuestions[currentQuestionIndex]?.options.map((opt, i) => (
                      <button key={i} onClick={() => { if(selectedOption === null) { setSelectedOption(i); setShowExplanation(true); if(i === quizQuestions[currentQuestionIndex].correctAnswer) setQuizScore(quizScore + 1); } }} className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex justify-between items-center group/opt ${selectedOption === null ? 'border-blue-100 hover:border-blue-500 hover:bg-blue-50' : i === quizQuestions[currentQuestionIndex].correctAnswer ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : selectedOption === i ? 'border-red-500 bg-red-50 text-red-700' : 'border-blue-50 opacity-40'}`}>
                        <span className="font-medium text-lg">{opt}</span>
                        {selectedOption !== null && i === quizQuestions[currentQuestionIndex].correctAnswer && <CheckCircle className="w-6 h-6"/>}
                        {selectedOption === i && i !== quizQuestions[currentQuestionIndex].correctAnswer && <AlertCircle className="w-6 h-6"/>}
                      </button>
                    ))}
                  </div>
                  {showExplanation && (
                    <div className="p-8 bg-blue-50 border border-blue-200 rounded-3xl space-y-4 animate-in slide-in-from-top-4 shadow-inner">
                      <div className="flex items-center gap-3 text-blue-600"><Info className="w-5 h-5"/><p className="text-xs font-black uppercase tracking-widest">Professor's Insight</p></div>
                      <p className="text-blue-900 leading-relaxed">{quizQuestions[currentQuestionIndex]?.explanation}</p>
                      <div className="pt-4 flex justify-end">
                        <button onClick={() => { if(currentQuestionIndex === quizQuestions.length - 1) setQuizFinished(true); else { setCurrentQuestionIndex(currentQuestionIndex + 1); setSelectedOption(null); setShowExplanation(false); } }} className="px-10 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl transition-all">
                          {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish Simulation' : 'Next Question'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-20 space-y-8 animate-in zoom-in-95">
                <div className="w-56 h-56 rounded-full border-[12px] border-blue-100 mx-auto flex flex-col items-center justify-center bg-white shadow-2xl relative">
                  <div className={`absolute inset-0 rounded-full border-[12px] border-blue-500 transition-all duration-1000`} style={{ clipPath: `inset(0 0 ${100 - (quizScore/quizQuestions.length)*100}% 0)` }}></div>
                  <Trophy className="w-16 h-16 text-yellow-500 mb-2 relative z-10"/>
                  <span className="text-5xl font-black relative z-10 text-blue-900">{Math.round((quizScore/quizQuestions.length)*100)}%</span>
                </div>
                <div>
                  <h3 className="text-4xl font-black text-blue-900">Simulation Complete</h3>
                  <p className="text-blue-600 mt-2">You scored {quizScore} out of {quizQuestions.length} questions correctly.</p>
                </div>
                <div className="flex gap-4 justify-center">
                   <button onClick={() => setSelectedUnitForQuiz(null)} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-xl">Back to Units</button>
                   <button onClick={() => startQuiz(selectedUnitForQuiz!, 'ai')} className="px-10 py-4 bg-white text-blue-600 border border-blue-200 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-xl">Try Again</button>
                </div>
              </div>
            )}
          </section>
        )}

        {view === 'cases' && (
          <section className="space-y-8">
            {!selectedCase ? (
              <>
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                  <h2 className="text-4xl font-extrabold text-blue-900 flex items-center justify-center gap-3"><Globe className="w-10 h-10 text-blue-600" /> Industrial Case Studies</h2>
                  <p className="text-blue-700 text-lg">25 real-world scenarios mapped across all RPA syllabus modules.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {CASE_STUDIES_DATA.map(cs => (
                    <div key={cs.id} onClick={() => setSelectedCase(cs)} className="bg-white border border-blue-200 p-8 rounded-[32px] cursor-pointer hover:border-blue-500 transition-all flex flex-col gap-5 group shadow-sm">
                      <div className="flex justify-between items-center">
                        <div className="bg-blue-100 p-3 rounded-2xl group-hover:bg-blue-600 transition-all"><Building2 className="w-6 h-6 text-blue-500 group-hover:text-white" /></div>
                        <span className="text-[10px] text-blue-400 uppercase font-black tracking-widest">{cs.industry}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-blue-950 group-hover:text-blue-600 transition-colors leading-tight">{cs.title}</h3>
                        <div className="mt-3 inline-block px-3 py-1 bg-blue-50 rounded-lg border border-blue-100 text-[10px] text-blue-500 font-bold uppercase tracking-tighter">{cs.unit.split(':')[0]}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-6">
                <button onClick={() => setSelectedCase(null)} className="flex items-center gap-2 text-blue-600 hover:text-blue-900 group transition-colors"><ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Library</button>
                <div className="bg-white border border-blue-200 rounded-[48px] overflow-hidden shadow-2xl">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <h2 className="text-5xl font-black text-white relative z-10 leading-tight">{selectedCase.title}</h2>
                    <div className="mt-4 flex gap-4 relative z-10">
                       <span className="px-4 py-1.5 bg-white/10 rounded-full text-blue-50 text-xs font-black uppercase tracking-widest border border-white/10">{selectedCase.industry}</span>
                       <span className="px-4 py-1.5 bg-white/10 rounded-full text-blue-50 text-xs font-black uppercase tracking-widest border border-white/10">{selectedCase.unit}</span>
                    </div>
                  </div>
                  <div className="p-12 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-red-500"><AlertCircle className="w-6 h-6"/><h4 className="text-xs font-black uppercase tracking-widest">Business Challenge</h4></div>
                        <p className="text-blue-900 text-lg leading-relaxed">{selectedCase.challenge}</p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-blue-600"><Workflow className="w-6 h-6"/><h4 className="text-xs font-black uppercase tracking-widest">Bot Implementation</h4></div>
                        <p className="text-blue-900 text-lg leading-relaxed">{selectedCase.solution}</p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-emerald-600"><Trophy className="w-6 h-6"/><h4 className="text-xs font-black uppercase tracking-widest">Measured Impact</h4></div>
                        <p className="text-blue-900 text-lg leading-relaxed">{selectedCase.impact}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {view === 'lab' && (
          <section className="space-y-8">
            {!selectedLab ? (
              <>
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                  <h2 className="text-4xl font-extrabold text-blue-900 flex items-center justify-center gap-3"><Terminal className="w-10 h-10 text-blue-600" /> Virtual Lab Environment</h2>
                  <p className="text-blue-700 text-lg">Build complex RPA workflows following exhaustive syllabus practicals.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {LAB_SCENARIOS.map(lab => (
                    <div key={lab.id} onClick={() => { setSelectedLab(lab); setWorkflow([]); setLogs([]); setLabSuccess(false); }} className="bg-white border border-blue-200 p-8 rounded-[32px] cursor-pointer hover:border-blue-500 transition-all group shadow-sm">
                      <div className="flex justify-between items-center mb-6"><span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">{lab.unit.split(':')[0]}</span><Terminal className="w-5 h-5 text-blue-500"/></div>
                      <h3 className="text-xl font-bold text-blue-950 group-hover:text-blue-600 transition-colors leading-tight">{lab.title}</h3>
                      <p className="text-sm text-blue-600 mt-3 line-clamp-2 leading-relaxed">{lab.objective}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-6 animate-in fade-in">
                <button onClick={() => setSelectedLab(null)} className="flex items-center gap-2 text-blue-600 hover:text-blue-900 transition-colors"><ArrowLeft className="w-4 h-4" /> Exit Lab</button>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-3 bg-white border border-blue-200 rounded-[32px] p-6 shadow-xl">
                    <h4 className="text-[10px] text-blue-400 font-black mb-6 uppercase tracking-[0.2em] border-b border-blue-100 pb-4">Activity Toolbox</h4>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto no-scrollbar pr-1">
                      {LAB_ACTIVITIES.map(a => (
                        <div key={a.id} onClick={() => setWorkflow([...workflow, {...a, id: `${a.id}_${Date.now()}`}])} className="p-4 bg-blue-50 border border-blue-100 rounded-2xl hover:border-blue-500 cursor-pointer flex items-center gap-4 group transition-all">
                          <div className="p-3 bg-white rounded-xl group-hover:bg-blue-600 transition-all text-blue-500 group-hover:text-white border border-blue-100">{getActivityIcon(a.icon)}</div>
                          <span className="text-xs font-bold text-blue-900">{a.name}</span>
                          <Plus className="w-4 h-4 ml-auto text-blue-200 group-hover:text-blue-500"/>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="lg:col-span-6 bg-white border border-blue-200 rounded-[48px] p-10 min-h-[650px] flex flex-col relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                    <div className="flex justify-between items-center mb-12 relative z-10">
                      <div>
                         <h3 className="text-3xl font-black text-blue-900">{selectedLab.title}</h3>
                         <p className="text-sm text-blue-600 mt-2 font-medium italic">"{selectedLab.task}"</p>
                      </div>
                      <button onClick={runWorkflow} className="bg-blue-600 hover:bg-blue-500 px-10 py-4 rounded-[24px] font-black text-white flex items-center gap-3 shadow-[0_15px_30px_rgba(37,99,235,0.3)] transition-all active:scale-95 disabled:opacity-30 disabled:scale-100">
                        {isRunning ? <Loader2 className="w-5 h-5 animate-spin"/> : <Play className="w-5 h-5"/>} DEPLOY BOT
                      </button>
                    </div>
                    <div className="space-y-5 flex flex-col items-center flex-1 relative z-10">
                      {workflow.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-blue-200 border-2 border-dashed border-blue-100 rounded-[64px] w-full bg-blue-50/30">
                          <Layers className="w-24 h-24 mb-6 opacity-20"/><p className="text-lg font-bold">Construct Workflow Architecture</p><p className="text-xs mt-2 opacity-50">Drag and drop activities to begin</p>
                        </div>
                      ) : (
                        <>
                          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-[10px] font-black uppercase text-blue-500 border border-blue-200 shadow-sm">Start</div>
                          <ChevronRight className="w-5 h-5 text-blue-200 rotate-90"/>
                          {workflow.map((item, idx) => (
                            <React.Fragment key={item.id}>
                              <div className="w-full bg-white border border-blue-100 p-6 rounded-[32px] flex items-center justify-between group hover:border-blue-500 transition-all shadow-md border-l-[6px] border-l-blue-600">
                                <div className="flex items-center gap-5">
                                  <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">{getActivityIcon(item.icon)}</div>
                                  <div>
                                    <p className="text-lg font-black text-blue-900 leading-none mb-3">{item.name}</p>
                                    <div className="flex gap-2">
                                      {item.parameters.map(p => <span key={p} className="text-[10px] bg-blue-50 text-blue-500 px-3 py-1 rounded-lg border border-blue-100 font-mono font-bold">{p}</span>) }
                                    </div>
                                  </div>
                                </div>
                                <button onClick={() => setWorkflow(workflow.filter(w => w.id !== item.id))} className="p-3 rounded-xl hover:bg-red-50 transition-all group/btn">
                                  <Trash2 className="w-6 h-6 text-blue-200 group-hover/btn:text-red-500 transition-colors"/>
                                </button>
                              </div>
                              <ChevronRight className="w-5 h-5 text-blue-200 rotate-90"/>
                            </React.Fragment>
                          ))}
                          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-[10px] font-black uppercase text-blue-500 border border-blue-200 shadow-sm">End</div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="lg:col-span-3 bg-blue-950 border border-blue-900 rounded-[32px] p-8 flex flex-col shadow-2xl h-[650px]">
                    <h4 className="text-[10px] text-blue-400 font-black mb-8 uppercase tracking-[0.2em] flex items-center gap-3"><Terminal className="w-5 h-5" /> Output Streams</h4>
                    <div className="flex-1 font-mono text-[11px] space-y-4 overflow-y-auto no-scrollbar scroll-smooth">
                      {logs.length === 0 && (
                         <div className="h-full flex flex-col items-center justify-center opacity-20">
                            <Terminal className="w-12 h-12 mb-4 text-blue-100"/>
                            <p className="text-center italic text-blue-100">Waiting for execution trigger...</p>
                         </div>
                      )}
                      {logs.map((l, i) => (
                        <div key={i} className={`flex gap-3 leading-relaxed animate-in slide-in-from-left-2 ${l.includes('ERROR') ? 'text-red-300' : l.includes('✓') ? 'text-emerald-300' : 'text-blue-300'}`}>
                          <span className="text-blue-700 font-bold shrink-0">[{new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'})}]</span>
                          <span className="break-words">{l}</span>
                        </div>
                      ))}
                    </div>
                    {labSuccess && (
                      <div className="mt-8 bg-blue-500/10 border border-blue-500/30 p-6 rounded-[32px] text-center animate-in zoom-in-95 duration-500">
                        <Trophy className="mx-auto text-blue-400 w-14 h-14 mb-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"/>
                        <p className="text-xs text-blue-300 font-black uppercase tracking-[0.2em]">Module Validated</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {view === 'resources' && (
          <section className="space-y-8 animate-in fade-in">
             <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-4xl font-extrabold text-blue-900">Academic Resources</h2>
              <p className="text-blue-700 text-lg">Curated materials and tool manuals to support your mastery of CCS361.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {WEB_RESOURCES.map((r, i) => (
                <div key={i} className="bg-white p-8 rounded-[40px] border border-blue-200 hover:border-blue-500 transition-all flex flex-col group shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                     <div className="bg-blue-50 p-3 rounded-2xl"><Bookmark className="w-6 h-6 text-blue-600"/></div>
                     <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">{r.category}</span>
                  </div>
                  <h4 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors leading-tight text-blue-950">{r.title}</h4>
                  <p className="text-sm text-blue-600 mb-8 flex-1 leading-relaxed">{r.description}</p>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 py-4 bg-blue-100 hover:bg-blue-600 rounded-2xl text-blue-700 hover:text-white text-xs font-black uppercase tracking-widest transition-all shadow-sm group/link">
                    Explore Docs <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform"/>
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="py-20 border-t border-blue-200 text-center opacity-60 mt-20">
        <div className="flex items-center justify-center gap-3 mb-4">
           <BrainCircuit className="w-6 h-6 text-blue-600"/>
           <h4 className="text-sm font-black uppercase tracking-widest text-blue-900">CCS361: RPA Mastery</h4>
        </div>
        <p className="text-xs font-mono max-w-xl mx-auto leading-relaxed text-blue-800">Advanced academic platform integrating curriculum-mapped critical thinking assessments with Gemini-3 inference for pedagogical excellence.</p>
        <p className="text-[10px] mt-6 font-bold uppercase tracking-widest text-blue-500">© 2025 RPA Technical Institute • Powered by Gemini AI Engine</p>
      </footer>
    </div>
  );
};

export default App;
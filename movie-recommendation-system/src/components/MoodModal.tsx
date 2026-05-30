import React, { useState } from 'react';
import { Sparkles, Clock, Compass, Smile, Heart, Flame, Zap, ArrowRight, ArrowLeft, RefreshCw, X, ShieldCheck, Globe } from 'lucide-react';

interface MoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: { desire: string; duration: string; vibe: string; language: string }) => void;
}

export default function MoodModal({ isOpen, onClose, onSave }: MoodModalProps) {
  const [step, setStep] = useState(1);
  const [desire, setDesire] = useState('');
  const [duration, setDuration] = useState('');
  const [vibe, setVibe] = useState('');
  const [language, setLanguage] = useState('');
  const [isTuning, setIsTuning] = useState(false);

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      // Step 4 completed, trigger tuning animation
      setIsTuning(true);
      setTimeout(() => {
        setIsTuning(false);
        onSave({ desire, duration, vibe, language });
        onClose();
      }, 1200);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const isSelectionMade = () => {
    if (step === 1) return desire !== '';
    if (step === 2) return duration !== '';
    if (step === 3) return vibe !== '';
    if (step === 4) return language !== '';
    return false;
  };

  const resetSelection = () => {
    setDesire('');
    setDuration('');
    setVibe('');
    setLanguage('');
    setStep(1);
  };

  return (
    <div id="mood_modal_container" className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-xl w-full bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden relative shadow-2xl shadow-black flex flex-col">
        
        {/* Header Indicator / Dismiss Trigger */}
        <div className="px-6 py-4.5 border-b border-white/5 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600/15 text-blue-500 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-mono">CINE BUDDY Vibe Tuner</h2>
              <p className="text-[9px] text-white/30 uppercase font-semibold font-mono tracking-widest leading-none mt-0.5">
                Aligning movie vectors with your state of mind
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/5 text-neutral-400 hover:text-white rounded-lg transition-all cursor-pointer"
            title="Browse default catalog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Bar Header */}
        {!isTuning && (
          <div className="h-1 w-full bg-neutral-900 flex">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        )}

        {/* Dynamic Stepper Container */}
        <div className="p-8 flex-1 flex flex-col justify-center min-h-[340px]">
          {isTuning ? (
            <div className="flex flex-col items-center justify-center space-y-6 text-center animate-pulse">
              <div className="p-4 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-full animate-spin">
                <RefreshCw className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Calibrating Movie Vectors...</h3>
                <p className="text-xs text-neutral-400 mt-2 max-w-sm mx-auto">
                  Calculating Pearson correlation overlays and cosine similarity scores for your custom emotional parameters.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: DESIRED EMOTION */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest font-mono">Question 01 of 03</span>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      Which describes your heart's current desiring emotion?
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    <button
                      onClick={() => setDesire('inspired_excited')}
                      className={`p-4 rounded-xl border text-left transition-all duration-150 flex items-start gap-3 cursor-pointer ${
                        desire === 'inspired_excited'
                          ? 'bg-blue-600/10 border-blue-500 hover:border-blue-500 text-white shadow shadow-blue-500/10'
                          : 'bg-[#050505] border-white/5 text-neutral-400 hover:text-white hover:border-white/10'
                      }`}
                    >
                      <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg shrink-0 mt-0.5">
                        <Flame className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white mb-0.5">Inspired or Excited</div>
                        <p className="text-[10px] text-neutral-400 leading-normal">Seek thrilling action, blockbuster adventures, or mind-expanding Sci-Fi.</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setDesire('reflective_deep')}
                      className={`p-4 rounded-xl border text-left transition-all duration-150 flex items-start gap-3 cursor-pointer ${
                        desire === 'reflective_deep'
                          ? 'bg-blue-600/10 border-blue-500 hover:border-blue-500 text-white shadow shadow-blue-500/10'
                          : 'bg-[#050505] border-white/5 text-neutral-400 hover:text-white hover:border-white/10'
                      }`}
                    >
                      <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg shrink-0 mt-0.5">
                        <Heart className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white mb-0.5">Reflective or Emotional</div>
                        <p className="text-[10px] text-neutral-400 leading-normal">Deep characters, profound drama, emotional connections, and biographies.</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setDesire('thrilled_suspenseful')}
                      className={`p-4 rounded-xl border text-left transition-all duration-150 flex items-start gap-3 cursor-pointer ${
                        desire === 'thrilled_suspenseful'
                          ? 'bg-blue-600/10 border-blue-500 hover:border-blue-500 text-white shadow shadow-blue-500/10'
                          : 'bg-[#050505] border-white/5 text-neutral-400 hover:text-white hover:border-white/10'
                      }`}
                    >
                      <div className="p-2 bg-red-500/10 text-red-500 rounded-lg shrink-0 mt-0.5">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white mb-0.5">Thrilled or Suspenseful</div>
                        <p className="text-[10px] text-neutral-400 leading-normal">Exhilarating crime plots, tense thriller scenarios, and high-stakes mystery.</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setDesire('whimsical_wholesome')}
                      className={`p-4 rounded-xl border text-left transition-all duration-150 flex items-start gap-3 cursor-pointer ${
                        desire === 'whimsical_wholesome'
                          ? 'bg-blue-600/10 border-blue-500 hover:border-blue-500 text-white shadow shadow-blue-500/10'
                          : 'bg-[#050505] border-white/5 text-neutral-400 hover:text-white hover:border-white/10'
                      }`}
                    >
                      <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg shrink-0 mt-0.5">
                        <Smile className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white mb-0.5">Whimsical or Comforting</div>
                        <p className="text-[10px] text-neutral-400 leading-normal">Aesthetic anime, heartwarming graphics, cute animation, or sweet romances.</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: TIME COMMITMENT */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest font-mono">Question 02 of 03</span>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      How much time do you have for this cinematic journey?
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    <button
                      onClick={() => setDuration('under_120')}
                      className={`p-4 rounded-xl border text-left transition-all duration-150 flex items-center gap-3.5 cursor-pointer ${
                        duration === 'under_120'
                          ? 'bg-blue-600/10 border-blue-500 hover:border-blue-500 text-white shadow shadow-blue-500/10'
                          : 'bg-[#050505] border-white/5 text-neutral-400 hover:text-white hover:border-white/10'
                      }`}
                    >
                      <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Sip-Sized Watch</div>
                        <p className="text-[10px] text-neutral-400 mt-0.5">Under 2 hours fast-paced stories</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setDuration('120_150')}
                      className={`p-4 rounded-xl border text-left transition-all duration-150 flex items-center gap-3.5 cursor-pointer ${
                        duration === '120_150'
                          ? 'bg-blue-600/10 border-blue-500 hover:border-blue-500 text-white shadow shadow-blue-500/10'
                          : 'bg-[#050505] border-white/5 text-neutral-400 hover:text-white hover:border-white/10'
                      }`}
                    >
                      <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-sans">Standard Cinematic</div>
                        <p className="text-[10px] text-neutral-400 mt-0.5">2 to 2.5 hours balanced films</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setDuration('over_150')}
                      className={`p-4 rounded-xl border text-left transition-all duration-150 flex items-center gap-3.5 cursor-pointer ${
                        duration === 'over_150'
                          ? 'bg-blue-600/10 border-blue-500 hover:border-blue-500 text-white shadow shadow-blue-500/10'
                          : 'bg-[#050505] border-white/5 text-neutral-400 hover:text-white hover:border-white/10'
                      }`}
                    >
                      <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Full Immersive Epic</div>
                        <p className="text-[10px] text-neutral-400 mt-0.5">Over 2.5 hours grand narratives</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setDuration('any')}
                      className={`p-4 rounded-xl border text-left transition-all duration-150 flex items-center gap-3.5 cursor-pointer ${
                        duration === 'any'
                          ? 'bg-blue-600/10 border-blue-500 hover:border-blue-500 text-white shadow shadow-blue-500/10'
                          : 'bg-[#050505] border-white/5 text-neutral-400 hover:text-white hover:border-white/10'
                      }`}
                    >
                      <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">No duration limits</div>
                        <p className="text-[10px] text-neutral-400 mt-0.5">Show any runtimes</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PREFERRED VIBE */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest font-mono">Question 03 of 03</span>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      Which visual or narrative atmospheric vibe calls to you today?
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    <button
                      onClick={() => setVibe('futuristic_cosmic')}
                      className={`p-4 rounded-xl border text-left transition-all duration-150 flex items-start gap-3 cursor-pointer ${
                        vibe === 'futuristic_cosmic'
                          ? 'bg-blue-600/10 border-blue-500 hover:border-blue-500 text-white shadow shadow-blue-500/10'
                          : 'bg-[#050505] border-white/5 text-neutral-400 hover:text-white hover:border-white/10'
                      }`}
                    >
                      <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg shrink-0 mt-0.5">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white mb-0.5">Futuristic & Cosmic cosmic</div>
                        <p className="text-[10px] text-neutral-400 leading-normal">Outer space, high technology universe, time bending mysteries.</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setVibe('gritty_realistic')}
                      className={`p-4 rounded-xl border text-left transition-all duration-150 flex items-start gap-3 cursor-pointer ${
                        vibe === 'gritty_realistic'
                          ? 'bg-blue-600/10 border-blue-500 hover:border-blue-500 text-white shadow shadow-blue-500/10'
                          : 'bg-[#050505] border-white/5 text-neutral-400 hover:text-white hover:border-white/10'
                      }`}
                    >
                      <div className="p-2 bg-stone-500/10 text-stone-300 rounded-lg shrink-0 mt-0.5">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white mb-0.5">Gritty & Realistic gritty</div>
                        <p className="text-[10px] text-neutral-400 leading-normal">Raw urban streets, criminal hierarchies, deep real dramas.</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setVibe('artistic_animation')}
                      className={`p-4 rounded-xl border text-left transition-all duration-150 flex items-start gap-3 cursor-pointer ${
                        vibe === 'artistic_animation'
                          ? 'bg-blue-600/10 border-blue-500 hover:border-blue-500 text-white shadow shadow-blue-500/10'
                          : 'bg-[#050505] border-white/5 text-neutral-400 hover:text-white hover:border-white/10'
                      }`}
                    >
                      <div className="p-2 bg-pink-500/10 text-pink-500 rounded-lg shrink-0 mt-0.5">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white mb-0.5">Artistic & Whimsical realms</div>
                        <p className="text-[10px] text-neutral-400 leading-normal">Hand-drawn anime wonders, mythical spirits, Studio Ghibli fields.</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setVibe('touching_romance')}
                      className={`p-4 rounded-xl border text-left transition-all duration-150 flex items-start gap-3 cursor-pointer ${
                        vibe === 'touching_romance'
                          ? 'bg-blue-600/10 border-blue-500 hover:border-blue-500 text-white shadow shadow-blue-500/10'
                          : 'bg-[#050505] border-white/5 text-neutral-400 hover:text-white hover:border-white/10'
                      }`}
                    >
                      <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg shrink-0 mt-0.5">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white mb-0.5">Empathetic & Touching romance</div>
                        <p className="text-[10px] text-neutral-400 leading-normal">Sincere connections, nostalgic memories, slow-burning romance.</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: LANGUAGE PREFERENCE */}
              {step === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest font-mono">Question 04 of 04</span>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      What is your language preference for today?
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    <button
                      onClick={() => setLanguage('english')}
                      className={`p-4 rounded-xl border text-left transition-all duration-150 flex items-start gap-3 cursor-pointer ${
                        language === 'english'
                          ? 'bg-blue-600/10 border-blue-500 hover:border-blue-500 text-white shadow shadow-blue-500/10'
                          : 'bg-[#050505] border-white/5 text-neutral-400 hover:text-white hover:border-white/10'
                      }`}
                    >
                      <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg shrink-0 mt-0.5">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white mb-0.5">English & International</div>
                        <p className="text-[10px] text-neutral-400 leading-normal">Explore Hollywood blockbusters and global cinema entries.</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setLanguage('telugu')}
                      className={`p-4 rounded-xl border text-left transition-all duration-150 flex items-start gap-3 cursor-pointer ${
                        language === 'telugu'
                          ? 'bg-blue-600/10 border-blue-500 hover:border-blue-500 text-white shadow shadow-blue-500/10'
                          : 'bg-[#050505] border-white/5 text-neutral-400 hover:text-white hover:border-white/10'
                      }`}
                    >
                      <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg shrink-0 mt-0.5">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white mb-0.5">Telugu Cinema</div>
                        <p className="text-[10px] text-neutral-400 leading-normal">Focus on grand Tollywood epics, action blockbusters, and dramas.</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setLanguage('any')}
                      className={`p-4 rounded-xl border text-left transition-all duration-150 flex items-start gap-3 cursor-pointer ${
                        language === 'any'
                          ? 'bg-blue-600/10 border-blue-500 hover:border-blue-500 text-white shadow shadow-blue-500/10'
                          : 'bg-[#050505] border-white/5 text-neutral-400 hover:text-white hover:border-white/10'
                      }`}
                    >
                      <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg shrink-0 mt-0.5">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white mb-0.5">No Preference / Any</div>
                        <p className="text-[10px] text-neutral-400 leading-normal">Present a handpicked blend of both languages and worlds.</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        {!isTuning && (
          <div className="px-8 py-5 border-t border-white/5 bg-black/30 flex justify-between items-center gap-3 font-mono">
            <div>
              {step > 1 ? (
                <button
                  onClick={handlePrevStep}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-bold border border-white/5 rounded-xl cursor-pointer transition-all duration-150"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="text-[10px] uppercase font-bold text-neutral-500 hover:text-neutral-400 hover:underline cursor-pointer transition-all duration-150"
                >
                  Skip Questions
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] bg-white/5 px-2.5 py-1 text-neutral-400 font-bold border border-white/5 rounded-lg select-none">
                Step {step} of 4
              </span>
              <button
                onClick={handleNextStep}
                disabled={!isSelectionMade()}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold rounded-xl cursor-pointer transition-all duration-150 shadow shadow-blue-950/20"
              >
                <span>{step === 4 ? 'Calibrate Alignments' : 'Next Question'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

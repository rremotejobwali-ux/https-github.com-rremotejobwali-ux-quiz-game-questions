import React, { useState } from 'react';
import { BrainCircuit, Play, Sparkles } from 'lucide-react';
import { Difficulty } from '../types';

interface StartScreenProps {
  onStart: (topic: string, difficulty: Difficulty) => void;
}

const TOPIC_SUGGESTIONS = [
  "General Knowledge",
  "Science & Nature",
  "History",
  "Pop Culture",
  "Technology",
  "Geography"
];

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [topic, setTopic] = useState('General Knowledge');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [customTopic, setCustomTopic] = useState('');

  const handleStart = () => {
    const finalTopic = customTopic.trim() || topic;
    onStart(finalTopic, difficulty);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-6 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600">
            <BrainCircuit size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 text-center">Gemini Quiz Master</h1>
          <p className="text-slate-500 mt-2 text-center">
            Test your knowledge with AI-generated questions on any topic.
          </p>
        </div>

        <div className="space-y-6">
          
          {/* Topic Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Choose a Topic
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
              {TOPIC_SUGGESTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => { setTopic(t); setCustomTopic(''); }}
                  className={`text-sm px-3 py-2 rounded-lg border transition-all ${
                    topic === t && !customTopic
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-medium'
                      : 'border-slate-200 hover:border-indigo-300 text-slate-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            
            <div className="relative">
              <input
                type="text"
                value={customTopic}
                onChange={(e) => { setCustomTopic(e.target.value); if(e.target.value) setTopic('Custom'); }}
                placeholder="Or type your own topic (e.g., 'Quantum Physics')"
                className={`w-full px-4 py-3 rounded-lg border ${
                   customTopic ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all`}
              />
              {customTopic && (
                <Sparkles className="absolute right-3 top-3 text-indigo-500" size={18} />
              )}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Difficulty
            </label>
            <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-all ${
                    difficulty === d
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2"
          >
            <span>Start Quiz</span>
            <Play size={20} fill="currentColor" />
          </button>

        </div>
      </div>
    </div>
  );
};

export default StartScreen;

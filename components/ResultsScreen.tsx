import React from 'react';
import { QuizResult } from '../types';
import { RefreshCw, Trophy, CheckCircle2, XCircle, Share2 } from 'lucide-react';

interface ResultsScreenProps {
  result: QuizResult;
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ result, onRestart }) => {
  const percentage = Math.round((result.score / result.total) * 100);
  
  const getFeedbackMessage = () => {
    if (percentage >= 90) return "Outstanding! You're a master!";
    if (percentage >= 70) return "Great job! Very impressive.";
    if (percentage >= 50) return "Good effort! Keep learning.";
    return "Nice try! Practice makes perfect.";
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header / Score Board */}
        <div className="bg-slate-900 text-white p-8 text-center relative overflow-hidden">
           {/* Decorative background elements */}
           <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-400 via-slate-900 to-slate-900"></div>
           
           <div className="relative z-10">
            <div className="inline-flex p-3 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
              <Trophy className="text-yellow-400" size={32} />
            </div>
            <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-slate-300 mb-6">{getFeedbackMessage()}</p>
            
            <div className="flex justify-center items-end space-x-2 mb-2">
              <span className="text-6xl font-bold text-white">{result.score}</span>
              <span className="text-2xl text-slate-400 font-medium mb-2">/ {result.total}</span>
            </div>
            <div className="text-sm font-medium px-3 py-1 bg-white/20 rounded-full inline-block">
              {percentage}% Accuracy
            </div>
           </div>
        </div>

        {/* Review Section */}
        <div className="p-6 md:p-8 bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Question Review</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {result.history.map((item, idx) => (
              <div key={item.questionId} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="shrink-0">
                  {item.isCorrect ? (
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <CheckCircle2 size={20} />
                    </div>
                  ) : (
                     <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                      <XCircle size={20} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500 font-medium mb-1">Question {idx + 1}</p>
                  <p className="text-slate-900 font-medium mb-3">{item.questionText}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className={`p-2 rounded border ${item.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <span className="block text-xs uppercase tracking-wider opacity-70 mb-0.5">Your Answer</span>
                      <span className={item.isCorrect ? 'text-green-800' : 'text-red-800'}>
                        {item.options[item.selectedOptionIndex]}
                      </span>
                    </div>
                    
                    {!item.isCorrect && (
                       <div className="p-2 rounded border bg-green-50 border-green-200">
                        <span className="block text-xs uppercase tracking-wider text-green-700 opacity-70 mb-0.5">Correct Answer</span>
                        <span className="text-green-900">
                          {item.options[item.correctOptionIndex]}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {!item.isCorrect && (
                    <div className="mt-3 text-xs text-slate-500 bg-slate-100 p-2 rounded">
                      <span className="font-semibold">Explanation:</span> {item.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-200 bg-white flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRestart}
            className="flex-1 sm:flex-none px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} />
            <span>Play Again</span>
          </button>
           <button
            onClick={() => alert("Sharing functionality would go here!")} // Placeholder
            className="flex-1 sm:flex-none px-8 py-3 bg-white text-slate-700 border border-slate-300 rounded-xl font-bold hover:bg-slate-50 transition shadow-sm flex items-center justify-center gap-2"
          >
            <Share2 size={20} />
            <span>Share Result</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResultsScreen;

import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { CheckCircle2, XCircle, ArrowRight, HelpCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  onAnswer: (optionIndex: number) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  onAnswer,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setHasSubmitted(false);
  }, [question.id]);

  const handleOptionClick = (index: number) => {
    if (hasSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setHasSubmitted(true);
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      onAnswer(selectedOption);
    }
  };

  const getOptionStyles = (index: number) => {
    const baseStyle = "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 flex items-center justify-between group";
    
    if (!hasSubmitted) {
      // Resting/Hover State
      if (selectedOption === index) {
        return `${baseStyle} border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm`;
      }
      return `${baseStyle} border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700`;
    }

    // Result State
    if (index === question.correctAnswerIndex) {
      return `${baseStyle} border-green-500 bg-green-50 text-green-900`;
    }
    if (selectedOption === index && index !== question.correctAnswerIndex) {
      return `${baseStyle} border-red-500 bg-red-50 text-red-900`;
    }
    
    return `${baseStyle} border-slate-200 opacity-50`;
  };

  const progressPercentage = ((currentQuestionIndex) / totalQuestions) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-fade-in-up">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
          <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 leading-relaxed">
            {question.text}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={hasSubmitted}
                className={getOptionStyles(index)}
              >
                <span className="flex-1 font-medium">{option}</span>
                {hasSubmitted && index === question.correctAnswerIndex && (
                  <CheckCircle2 className="text-green-600 ml-2" size={20} />
                )}
                {hasSubmitted && selectedOption === index && index !== question.correctAnswerIndex && (
                  <XCircle className="text-red-600 ml-2" size={20} />
                )}
                {!hasSubmitted && selectedOption === index && (
                  <div className="w-5 h-5 rounded-full border-4 border-indigo-600"></div>
                )}
                {!hasSubmitted && selectedOption !== index && (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-indigo-400"></div>
                )}
              </button>
            ))}
          </div>
          
          {/* Explanation Area */}
          {hasSubmitted && (
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 animate-fade-in">
              <div className="flex items-start space-x-3">
                <HelpCircle className="text-indigo-500 mt-0.5 shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm mb-1">Explanation</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          {!hasSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                selectedOption !== null
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Submit Answer
            </button>
          ) : (
             <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md flex items-center space-x-2 transition-all animate-pulse-once"
            >
              <span>{currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}</span>
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;

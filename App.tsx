import React, { useState } from 'react';
import { GameState, Question, QuizResult, Difficulty } from './types';
import { generateQuizQuestions } from './services/geminiService';
import StartScreen from './components/StartScreen';
import QuestionCard from './components/QuestionCard';
import ResultsScreen from './components/ResultsScreen';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{questionId: string, selectedIdx: number}[]>([]);
  const [topic, setTopic] = useState("");

  const startGame = async (selectedTopic: string, difficulty: Difficulty) => {
    setTopic(selectedTopic);
    setGameState(GameState.LOADING);
    
    // Fetch questions from API
    const generatedQuestions = await generateQuizQuestions(selectedTopic, difficulty);
    
    setQuestions(generatedQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setGameState(GameState.PLAYING);
  };

  const handleAnswer = (selectedOptionIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    // Record answer
    const newAnswer = { 
      questionId: currentQuestion.id, 
      selectedIdx: selectedOptionIndex 
    };
    
    const updatedAnswers = [...userAnswers, newAnswer];
    setUserAnswers(updatedAnswers);

    // Move to next question or finish
    if (currentQuestionIndex < questions.length - 1) {
      // Delay slightly for visual comfort if needed, but currently QuestionCard handles submit->next flow
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameState(GameState.FINISHED);
    }
  };

  const calculateResults = (): QuizResult => {
    let score = 0;
    const history = questions.map((q) => {
      const answer = userAnswers.find(a => a.questionId === q.id);
      const selectedIdx = answer ? answer.selectedIdx : -1;
      const isCorrect = selectedIdx === q.correctAnswerIndex;
      
      if (isCorrect) score++;

      return {
        questionId: q.id,
        questionText: q.text,
        selectedOptionIndex: selectedIdx,
        correctOptionIndex: q.correctAnswerIndex,
        isCorrect,
        explanation: q.explanation,
        options: q.options
      };
    });

    return {
      score,
      total: questions.length,
      history
    };
  };

  const handleRestart = () => {
    setGameState(GameState.START);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTopic("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-100 flex flex-col">
      {/* App Header (Small) */}
      <header className="p-4 border-b border-indigo-100 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
           <div className="flex items-center space-x-2">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">Q</div>
             <span className="font-bold text-slate-800 tracking-tight">GeminiQuiz</span>
           </div>
           {gameState === GameState.PLAYING && (
             <span className="text-sm font-medium text-slate-500 px-3 py-1 bg-slate-100 rounded-full">
               Topic: {topic}
             </span>
           )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        
        {gameState === GameState.START && (
          <StartScreen onStart={startGame} />
        )}

        {gameState === GameState.LOADING && (
          <LoadingSpinner topic={topic} />
        )}

        {gameState === GameState.PLAYING && questions.length > 0 && (
          <QuestionCard
            question={questions[currentQuestionIndex]}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
          />
        )}

        {gameState === GameState.FINISHED && (
          <ResultsScreen 
            result={calculateResults()} 
            onRestart={handleRestart} 
          />
        )}

        {/* Fallback for empty state errors */}
        {gameState === GameState.PLAYING && questions.length === 0 && (
           <div className="text-center">
             <p className="text-red-500">Error loading questions. Please try again.</p>
             <button onClick={handleRestart} className="mt-4 text-indigo-600 underline">Return to Start</button>
           </div>
        )}

      </main>

      <footer className="py-6 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} Gemini Quiz Master. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;

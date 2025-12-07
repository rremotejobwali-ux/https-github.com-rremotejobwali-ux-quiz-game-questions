import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC<{ topic: string }> = ({ topic }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full"></div>
        <Loader2 className="w-16 h-16 text-indigo-600 animate-spin relative z-10" />
      </div>
      <h3 className="mt-6 text-xl font-bold text-slate-800">Generating Quiz...</h3>
      <p className="mt-2 text-slate-500 max-w-md">
        Our AI is crafting unique "{topic}" questions just for you. This usually takes a few seconds.
      </p>
    </div>
  );
};

export default LoadingSpinner;
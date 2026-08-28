import React, { useState } from 'react';
import { Volume2, Loader2 } from 'lucide-react';
import { soundService } from '../services/soundService';

interface AudioPlayerButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  rate?: number;
  label?: string;
}

export const AudioPlayerButton: React.FC<AudioPlayerButtonProps> = ({
  text,
  className = '',
  size = 'md',
  rate = 0.95,
  label,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) return;
    setIsPlaying(true);
    await soundService.speak(text, { rate });
    setIsPlaying(false);
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'px-3.5 py-2 text-base',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  return (
    <button
      id={`audio_btn_${text.toLowerCase().replace(/[^a-z0-9]/g, '_')}`}
      type="button"
      onClick={handleSpeak}
      title={`Listen to pronunciation of "${text}"`}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
        isPlaying
          ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/50'
          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60 border border-emerald-200/60 dark:border-emerald-800/40'
      } ${sizeClasses[size]} ${className}`}
    >
      {isPlaying ? (
        <Loader2 size={iconSizes[size]} className="animate-spin" />
      ) : (
        <Volume2 size={iconSizes[size]} className="shrink-0" />
      )}
      {label && <span>{label}</span>}
    </button>
  );
};

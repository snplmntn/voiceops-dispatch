import { Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceButtonProps {
  isListening: boolean;
  onMouseDown: () => void;
  onMouseUp: () => void;
  disabled?: boolean;
}

export function VoiceButton({ isListening, onMouseDown, onMouseUp, disabled }: VoiceButtonProps) {
  return (
    <button
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onMouseDown}
      onTouchEnd={onMouseUp}
      disabled={disabled}
      className={cn(
        "relative w-40 h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center transition-all duration-300",
        "bg-gradient-to-br from-accent to-accent/80",
        "shadow-[0_0_40px_rgba(255,102,0,0.3)]",
        "hover:shadow-[0_0_60px_rgba(255,102,0,0.5)]",
        "active:scale-95",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isListening && "animate-pulse-glow scale-105"
      )}
    >
      {/* Pulsing rings */}
      <div className={cn(
        "absolute inset-0 rounded-full bg-accent/30",
        "animate-ping",
        !isListening && "hidden"
      )} />
      <div className={cn(
        "absolute -inset-4 rounded-full border-2 border-accent/30",
        isListening && "animate-pulse"
      )} />
      <div className={cn(
        "absolute -inset-8 rounded-full border border-accent/20",
        isListening && "animate-pulse"
      )} />

      {/* Icon container */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        <Mic className={cn(
          "w-12 h-12 md:w-16 md:h-16 text-accent-foreground",
          isListening && "animate-bounce"
        )} />
        {isListening && (
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-4 bg-accent-foreground rounded-full animate-listening-wave"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}
      </div>
    </button>
  );
}

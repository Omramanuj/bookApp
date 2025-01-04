import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  PlayCircle, 
  PauseCircle, 
  StopCircle,
  Volume2
} from "lucide-react";

export function TTSControls({ 
  isPlaying, 
  onPlay, 
  onPause, 
  onStop,
  disabled = false 
}) {
  return (
    <div className="flex items-center gap-2 p-2">
      {!isPlaying ? (
        <Button
          onClick={onPlay}
          disabled={disabled}
          variant="ghost"
          size="icon"
        >
          <PlayCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Button
          onClick={onPause}
          disabled={disabled}
          variant="ghost"
          size="icon"
        >
          <PauseCircle className="h-6 w-6" />
        </Button>
      )}
      <Button
        onClick={onStop}
        disabled={disabled}
        variant="ghost"
        size="icon"
      >
        <StopCircle className="h-6 w-6" />
      </Button>
      <Volume2 className="h-6 w-6" />
    </div>
  );
}
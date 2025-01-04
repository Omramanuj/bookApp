
import { useState, useEffect } from 'react';

export const useTTS = () => {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      console.log(availableVoices);
      setSelectedVoice(availableVoices[0]?.name);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = (text) => {
    const newUtterance = new SpeechSynthesisUtterance(text);
    newUtterance.voice = voices.find(v => v.name === selectedVoice);
    newUtterance.rate = speed;
    
    newUtterance.onend = () => setIsPlaying(false);
    
    setUtterance(newUtterance);
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setIsPlaying(false);
  };

  const resume = () => {
    window.speechSynthesis.resume();
    setIsPlaying(true);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return {
    speak,
    pause,
    resume,
    stop,
    isPlaying,
    voices,
    selectedVoice,
    setSelectedVoice,
    speed,
    setSpeed
  };
};
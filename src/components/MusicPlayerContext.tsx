"use client";

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode, useCallback } from 'react';

interface Track {
  title: string;
  duration?: string;
  src?: string;
}

interface MusicPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track, tracks?: Track[]) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  currentTime: number;
  duration: number;
  setVolume: (volume: number) => void;
  volume: number;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
}

interface MusicPlayerProviderProps {
  children: Readonly<ReactNode>;
}

export function MusicPlayerProvider({ children }: MusicPlayerProviderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentTrackList, setCurrentTrackList] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);

  const playTrack = useCallback((track: Track, tracks?: Track[]) => {
    setCurrentTrack(track);
    if (tracks) {
      setCurrentTrackList(tracks);
    }
    setIsPlaying(true);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const playNext = useCallback(() => {
    if (currentTrack && currentTrackList.length > 0) {
      const currentIndex = currentTrackList.findIndex((t) => t.src === currentTrack.src);
      if (currentIndex !== -1 && currentIndex < currentTrackList.length - 1) {
        playTrack(currentTrackList[currentIndex + 1]);
      } else {
        playTrack(currentTrackList[0]); // Loop back to start
      }
    }
  }, [currentTrack, currentTrackList, playTrack]);

  const playPrevious = useCallback(() => {
    if (currentTrack && currentTrackList.length > 0) {
      const currentIndex = currentTrackList.findIndex((t) => t.src === currentTrack.src);
      if (currentIndex > 0) {
        playTrack(currentTrackList[currentIndex - 1]);
      } else {
        playTrack(currentTrackList[currentTrackList.length - 1]); // Loop to end
      }
    }
  }, [currentTrack, currentTrackList, playTrack]);

  const setVolume = useCallback((newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolumeState(newVolume);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (currentTrack?.src) {
        audioRef.current.src = currentTrack.src;
        audioRef.current.load();
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      } else if (!currentTrack) {
        audioRef.current.pause();
        audioRef.current.src = ""; // Clear source if no track
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleLoadedMetadata = () => setDuration(audio.duration);
      const handleEnded = playNext;

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [playNext]);

  const value = React.useMemo(() => ({
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
    playNext,
    playPrevious,
    currentTime,
    duration,
    setVolume,
    volume
  }), [currentTrack, isPlaying, playTrack, togglePlayPause, playNext, playPrevious, currentTime, duration, setVolume, volume]);

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} />
    </MusicPlayerContext.Provider>
  );
}
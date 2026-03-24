import * as Haptics from 'expo-haptics';
import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import type { Mood } from '@/types/app';

type MoodStoreValue = {
  mood: Mood;
  setMood: (nextMood: Mood) => void;
  updatedAt: Date | null;
};

const MoodStoreContext = createContext<MoodStoreValue | null>(null);

export function MoodStoreProvider({ children }: PropsWithChildren) {
  const [mood, setMoodState] = useState<Mood>('Good');
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const setMood = (nextMood: Mood) => {
    setMoodState(nextMood);
    setUpdatedAt(new Date());
    Haptics.selectionAsync();
  };

  const value = useMemo(
    () => ({
      mood,
      setMood,
      updatedAt,
    }),
    [mood, updatedAt]
  );

  return <MoodStoreContext.Provider value={value}>{children}</MoodStoreContext.Provider>;
}

export function useMoodStore() {
  const value = useContext(MoodStoreContext);

  if (!value) {
    throw new Error('useMoodStore must be used inside MoodStoreProvider.');
  }

  return value;
}

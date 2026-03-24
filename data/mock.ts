import type { ChatMessage, Peer, Resource } from '@/types/app';

export const resourceCategories = ['All', 'Anxiety', 'Focus', 'Relationships', 'Self-care', 'Crisis'] as const;

export const resources: Resource[] = [
  { id: 'r1', title: 'Calm in 5 Minutes', summary: 'A fast breathing reset for exam stress.', category: 'Anxiety', tag: 'Quick read' },
  { id: 'r2', title: 'Study Burnout Guide', summary: 'Spot burnout early and recover with structure.', category: 'Focus', tag: 'Guide' },
  { id: 'r3', title: 'Healthy Boundaries', summary: 'Scripts and examples for difficult conversations.', category: 'Relationships', tag: 'Toolkit' },
  { id: 'r4', title: 'Sleep Reset Toolkit', summary: 'Simple evening rituals for better sleep quality.', category: 'Self-care', tag: 'Toolkit' },
  { id: 'r5', title: 'Urgent Support Plan', summary: 'What to do now if you or a friend is in crisis.', category: 'Crisis', tag: 'Immediate' },
];

export const peers: Peer[] = [
  { id: 'p1', name: 'Tobi Brown', focus: ['Anxiety', 'Academic stress'], available: true, rating: 4.9 },
  { id: 'p2', name: 'Rina Nwosu', focus: ['Relationships', 'Confidence'], available: false, rating: 4.8 },
  { id: 'p3', name: 'Maya King', focus: ['Routine', 'Self-care'], available: true, rating: 4.7 },
];

export const chatMessages: ChatMessage[] = [
  { id: 'm1', fromSelf: false, text: 'Hi, I am here with you. How are you feeling right now?', time: '09:41' },
  { id: 'm2', fromSelf: true, text: 'A bit overwhelmed with classes this week.', time: '09:43' },
  { id: 'm3', fromSelf: false, text: 'Thanks for sharing. Want to try a 2-minute grounding exercise?', time: '09:44' },
];

export const moodWeek = [
  { day: 'Mon', mood: 2 },
  { day: 'Tue', mood: 3 },
  { day: 'Wed', mood: 2 },
  { day: 'Thu', mood: 4 },
  { day: 'Fri', mood: 3 },
  { day: 'Sat', mood: 4 },
  { day: 'Sun', mood: 0 },
];

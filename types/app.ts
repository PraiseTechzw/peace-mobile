export type Mood = 'Low' | 'Okay' | 'Good' | 'Great';

export type Resource = {
  id: string;
  title: string;
  summary: string;
  category: 'Anxiety' | 'Focus' | 'Relationships' | 'Self-care' | 'Crisis';
  tag: 'Quick read' | 'Toolkit' | 'Guide' | 'Immediate';
};

export type Peer = {
  id: string;
  name: string;
  focus: string[];
  available: boolean;
  rating: number;
};

export type ChatMessage = {
  id: string;
  fromSelf: boolean;
  text: string;
  time: string;
};

import { apiRequest } from './client';
import type { ChatMessage, Peer, Resource } from '@/types/app';export type MoodEntryResponse = {
  id: string;
  moodScore: number;
  note: string | null;
  recordedAt: string;
};

export type BookingSlotResponse = {
  id: string;
  startsAt: string;
  endsAt: string;
  isBooked: boolean;
  peerEducatorId: string;
};

export async function getMoodHistory() {
  return apiRequest<MoodEntryResponse[]>('/mood/history');
}

export async function createMoodEntry(input: { moodScore: number; note?: string }) {
  return apiRequest<MoodEntryResponse>('/mood', { method: 'POST', body: input });
}

export async function getOpenSlots(peerEducatorId?: string) {
  const query = peerEducatorId
    ? `?peerEducatorId=${encodeURIComponent(peerEducatorId)}`
    : '';
  return apiRequest<BookingSlotResponse[]>(`/slots${query}`);
}

export async function createBooking(input: {
  peerEducatorId: string;
  slotId: string;
  sessionType: 'chat' | 'voice' | 'video' | 'in_person';
}) {
  return apiRequest('/bookings', { method: 'POST', body: input });
}

export type ProfileResponse = {
  id: string;
  name: string;
  checkInsCount: number;
  sessionsCount: number;
  resourcesCount: number;
  notificationsEnabled: boolean;
  anonymousMode: boolean;
};

export async function getResources() {
  return apiRequest<Resource[]>('/resources');
}

export async function getPeers() {
  return apiRequest<Peer[]>('/peer-educators');
}

export async function getChatMessages() {
  return apiRequest<ChatMessage[]>('/chat');
}

export async function sendChatMessage(input: { text: string }) {
  return apiRequest<ChatMessage>('/chat', { method: 'POST', body: input });
}

export async function escalateChat() {
  return apiRequest<{ success: boolean }>('/chat/escalate', { method: 'POST' });
}

export async function getProfile() {
  return apiRequest<ProfileResponse>('/profile');
}

export async function updateProfile(input: Partial<ProfileResponse>) {
  return apiRequest<ProfileResponse>('/profile', { method: 'PATCH', body: input });
}

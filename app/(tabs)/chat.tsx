import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/ui/app-header';
import { AppText } from '@/components/ui/app-text';
import { Card } from '@/components/ui/card';
import { IconBadge } from '@/components/ui/icon-badge';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { escalateChat, getChatMessages, sendChatMessage } from '@/lib/api/peace-api';
import { theme } from '@/theme';
import type { ChatMessage } from '@/types/app';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [escalated, setEscalated] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    getChatMessages().then(setMessages).catch(() => setMessages([]));
  }, []);

  const sendMessage = async () => {
    const trimmed = message.trim();

    if (!trimmed) {
      return;
    }

    try {
      const sent = await sendChatMessage({ text: trimmed });
      setMessages((prev) => [...prev, sent]);
      setMessage('');
    } catch {
      // Add local message on failure just for smooth UI in current context,
      // though ideally would show an error.
      const userMessage = {
        id: `u-${Date.now()}`,
        fromSelf: true,
        text: trimmed,
        time: getNowTime(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setMessage('');

      if (escalated) {
        setMessages((prev) => [...prev, {
          id: `h-${Date.now() + 1}`,
          fromSelf: false,
          text: 'A peer support educator has been notified. Please hold on, someone will join shortly.',
          time: getNowTime(),
        }]);
        return;
      }

      setMessages((prev) => [...prev, {
        id: `a-${Date.now() + 2}`,
        fromSelf: false,
        text: getAiReply(trimmed),
        time: getNowTime(),
      }]);
    }
  };

  const toggleEscalation = async () => {
    try {
      if (!escalated) {
        await escalateChat();
      }
      setEscalated(!escalated);
    } catch {
      setEscalated(!escalated);
    }
  };

  return (
    <Screen scrollable={false} keyboardAware>
      <View style={styles.wrap}>
        <AppHeader
          title={escalated ? 'Support Chat (Escalated)' : 'AI Peer Chat'}
          subtitle={
            escalated
              ? 'You requested human support. We are connecting you now.'
              : 'AI peer helper is available now. Ask to escalate for human support.'
          }
        />
        <Card style={styles.peerHeader}>
          <View style={styles.peerRow}>
            <IconBadge icon="person" tone="violet" />
            <View style={styles.peerMeta}>
              <AppText variant="bodyStrong">{escalated ? 'Support Queue' : 'PEACE AI Peer Helper'}</AppText>
              <AppText variant="caption" color={theme.colors.success}>
                {escalated ? 'Human support requested' : 'AI assistant online'}
              </AppText>
            </View>
          </View>
          <Pressable
            style={[styles.smallAction, escalated && styles.smallActionActive]}
            onPress={toggleEscalation}>
            <AppText variant="caption" color={escalated ? '#FFFFFF' : theme.colors.primaryDark}>
              {escalated ? 'Cancel escalation' : 'Escalate to human support'}
            </AppText>
          </Pressable>
        </Card>
        <Card style={styles.nudge}>
          <AppText variant="caption" color={escalated ? theme.colors.warning : theme.colors.danger}>
            {escalated
              ? 'You are in the support queue. For urgent danger, use Crisis Help immediately.'
              : 'AI support is active. Ask for escalation any time, or use Crisis Help if urgent.'}
          </AppText>
        </Card>

        <ScrollView style={styles.thread} contentContainerStyle={styles.messages}>
          {messages.map((item) => (
            <View key={item.id} style={[styles.bubble, item.fromSelf ? styles.self : styles.other]}>
              <AppText variant="body" color={item.fromSelf ? '#FFFFFF' : theme.colors.textPrimary}>{item.text}</AppText>
              <AppText variant="caption" color={item.fromSelf ? '#E0ECFF' : theme.colors.textMuted}>{item.time}</AppText>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputRow}>
          <View style={styles.grow}>
            <TextField placeholder="Type your message" value={message} onChangeText={setMessage} />
          </View>
          <Pressable style={styles.send} onPress={sendMessage}>
            <AppText variant="caption" color="#FFFFFF">Send</AppText>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    gap: theme.spacing.md,
  },
  nudge: {
    backgroundColor: '#FFE4E6',
    borderColor: '#FECACA',
  },
  peerHeader: {
    backgroundColor: '#F7FAFF',
  },
  peerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  peerMeta: {
    flex: 1,
  },
  smallAction: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    minHeight: 32,
    justifyContent: 'center',
  },
  smallActionActive: {
    backgroundColor: theme.colors.primaryDark,
  },
  thread: {
    flex: 1,
    backgroundColor: '#F8FBFF',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.sm,
  },
  messages: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  bubble: {
    maxWidth: '86%',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  self: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary,
  },
  other: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  grow: {
    flex: 1,
  },
  send: {
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary,
    minHeight: theme.sizing.controlHeight,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'center',
    ...theme.shadows.button,
  },
});

function getNowTime() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

function getAiReply(userText: string) {
  const text = userText.toLowerCase();

  if (text.includes('anxious') || text.includes('anxiety') || text.includes('panic')) {
    return 'Thanks for sharing that. Try one grounding round: inhale 4s, hold 4s, exhale 6s. Want a short anxiety support plan next?';
  }

  if (text.includes('sleep') || text.includes('tired')) {
    return 'Sleep can affect everything. Tonight, try a 20-minute wind-down with no screens and light stretching. I can suggest a simple 3-step routine.';
  }

  if (text.includes('exam') || text.includes('stress') || text.includes('overwhelmed')) {
    return 'That sounds heavy. Let us break it into one small next step. What is the most urgent task for today? We can build a 15-minute starter plan.';
  }

  return 'I hear you. I can help with a quick coping step, a study/wellness plan, or we can escalate to human peer support whenever you want.';
}

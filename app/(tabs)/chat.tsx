import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp, Layout, SlideInRight, SlideInLeft, useAnimatedStyle, withSpring, withRepeat, withTiming, withSequence, withDelay, useSharedValue, interpolate } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

import { AppHeader } from '@/components/ui/app-header';
import { AppText } from '@/components/ui/app-text';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { escalateChat, getChatMessages, sendChatMessage } from '@/lib/api/peace-api';
import { theme } from '@/theme';
import type { ChatMessage } from '@/types/app';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [escalated, setEscalated] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    getChatMessages().then(setMessages).catch(() => setMessages([]));
  }, []);

  useEffect(() => {
     setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    try {
      setMessage('');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const sent = await sendChatMessage({ text: trimmed });
      setMessages((prev) => [...prev, sent]);
    } catch {
      const userMsg = { id: `u-${Date.now()}-${Math.random()}`, fromSelf: true, text: trimmed, time: getNowTime() };
      setMessages(p => [...p, userMsg]);
      setMessage('');
      
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const reply = escalated 
          ? 'Human educator notified. Hold on...' 
          : getAiReply(trimmed);
        setMessages(p => [...p, { id: `a-${Date.now()}-${Math.random()}`, fromSelf: false, text: reply, time: getNowTime() }]);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 1500);
    }
  };

  const toggleEscalation = async () => {
    try {
      if (!escalated) await escalateChat();
      setEscalated(!escalated);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      setEscalated(!escalated);
    }
  };

  return (
    <Screen withMesh scrollable={false} padded={false}>
      <View style={styles.header}>
        <AppHeader
          title={escalated ? 'Peer Support' : 'Peace Helper'}
          subtitle={escalated ? 'Connecting you to a human peer...' : 'AI assistant • Online now'}
          trailing={
            <Pressable 
              onPress={toggleEscalation} 
              style={[styles.escalateBtn, escalated ? styles.escalateActive : null] as any}
            >
              <MaterialIcons name={escalated ? 'person' : 'person-add'} size={20} color={escalated ? '#FFF' : theme.colors.primary} />
            </Pressable>
          }
        />
      </View>

      <ScrollView 
        ref={scrollRef}
        style={styles.thread} 
        contentContainerStyle={styles.messages}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.noticeWrap}>
           <Card style={[styles.nudge, escalated && styles.nudgeEscalated]}>
             <AppText variant="caption" color={escalated ? theme.colors.primaryDark : theme.colors.textSecondary}>
                {escalated 
                  ? 'Human support requested. For immediate danger, use Crisis Help.' 
                  : 'AI support is active. Tap the icon above to talk to a human peer.'}
             </AppText>
           </Card>
        </View>

        {messages.map((item, idx) => {
          const isLastInGroup = idx === messages.length - 1 || messages[idx + 1].fromSelf !== item.fromSelf;
          return (
            <Animated.View 
              key={`${item.id}-${idx}`} 
              layout={Layout.springify()} 
              entering={item.fromSelf ? SlideInRight : SlideInLeft}
              style={[styles.bubbleWrap, item.fromSelf ? styles.self : styles.other]}
            >
              <View style={[
                styles.bubble, 
                item.fromSelf ? styles.bubbleSelf : styles.bubbleOther,
                !isLastInGroup && (item.fromSelf ? { borderBottomRightRadius: 20 } : { borderBottomLeftRadius: 20 })
              ]}>
                <AppText 
                  variant="body" 
                  color={item.fromSelf ? '#FFFFFF' : theme.colors.textPrimary}
                  style={styles.messageText}
                >
                  {item.text}
                </AppText>
                <AppText 
                  variant="caption" 
                  style={styles.bubbleTime} 
                  color={item.fromSelf ? 'rgba(255,255,255,0.7)' : theme.colors.textMuted}
                >
                  {item.time}
                </AppText>
              </View>
            </Animated.View>
          );
        })}

        {isTyping && (
          <Animated.View 
            entering={FadeInUp}
            style={[styles.bubbleWrap, styles.other, styles.typingPlaceholder]}
          >
            <View style={[styles.bubble, styles.bubbleOther, { paddingVertical: 14 }]}>
              <View style={styles.typingDots}>
                <TypingDot delay={0} />
                <TypingDot delay={200} />
                <TypingDot delay={400} />
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={100}>
        <BlurView intensity={90} tint="light" style={[styles.inputContainer, { paddingBottom: (insets.bottom || 20) + 80 }]}>
          <TextField 
            placeholder="Type a message..." 
            value={message} 
            onChangeText={setMessage} 
            style={styles.inputField}
            multiline
          />
          <Pressable style={styles.sendBtn} onPress={sendMessage}>
            <MaterialIcons name="send" size={24} color="#FFF" />
          </Pressable>
        </BlurView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function TypingDot({ delay }: { delay: number }) {
  const scale = useSharedValue(0.5);
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withDelay(delay, withTiming(1, { duration: 400 })),
        withTiming(0.5, { duration: 400 })
      ),
      -1,
      true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: interpolate(scale.value, [0.5, 1], [0.4, 1]),
  }));

  return <Animated.View style={[styles.dot, style]} />;
}

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

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  escalateBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  escalateActive: {
    backgroundColor: theme.colors.primary,
  },
  noticeWrap: {
    paddingHorizontal: theme.spacing.lg,
  },
  nudge: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  nudgeEscalated: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  thread: {
    flex: 1,
  },
  messages: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  bubbleWrap: {
    maxWidth: '85%',
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    ...theme.shadows.sm,
  },
  bubbleSelf: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderBottomLeftRadius: 4,
  },
  self: {
    alignSelf: 'flex-end',
  },
  other: {
    alignSelf: 'flex-start',
  },
  bubbleTime: {
    fontSize: 10,
    marginTop: 2,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.5)',
  },
  inputField: {
    flex: 1,
    backgroundColor: '#FFF',
    maxHeight: 120,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.button,
  },
  typingPlaceholder: {
    marginBottom: theme.spacing.md,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
    width: 40,
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
});

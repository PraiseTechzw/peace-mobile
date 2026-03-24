import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/ui/app-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { useMoodStore } from '@/store/mood-store';
import { theme } from '@/theme';

export default function EditProfileScreen() {
  const [name, setName] = useState('Prais A.');
  const [email, setEmail] = useState('prais@example.com');

  return (
    <Screen>
      <AppHeader title="Edit Profile" subtitle="Update your personal information" showBack />
      
      <Card style={styles.formCard}>
        <View style={styles.field}>
          <TextField 
            placeholder="Your name" 
            value={name} 
            onChangeText={setName} 
          />
        </View>
        <View style={styles.field}>
          <TextField 
            placeholder="Your email" 
            value={email} 
            onChangeText={setEmail} 
            keyboardType="email-address"
          />
        </View>
      </Card>

      <Button onPress={() => {}}>Save Changes</Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  formCard: {
    gap: theme.spacing.lg,
    marginVertical: theme.spacing.md,
  },
  field: {
    gap: theme.spacing.xs,
  },
});

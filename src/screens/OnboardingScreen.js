import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AtlasMark from '../components/AtlasMark';
import CityInput from '../components/CityInput';
import { fonts } from '../theme';

// First-launch sign up. Saves a local profile — real cloud accounts come later.
export default function OnboardingScreen({ t, onDone }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [homeText, setHomeText] = useState('');
  const [home, setHome] = useState(null); // { city, ll }

  const ready = name.trim().length > 0;

  const start = () => {
    if (!ready) return;
    onDone({
      name: name.trim(),
      email: email.trim(),
      homeCity: home ? home.city : homeText.trim(),
      homeLL: home ? home.ll : null,
      joined: new Date().toISOString(),
    });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: t.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.brand}>
          <AtlasMark size={72} line={t.sageDeep} thin={t.sage} gold={t.gold} />
          <Text style={[styles.title, { color: t.ink }]}>Atlas</Text>
          <Text style={[styles.tagline, { color: t.muted }]}>your life, mapped</Text>
        </View>

        <Text style={[styles.welcome, { color: t.ink }]}>Let's set up your passport</Text>

        <Text style={[styles.label, { color: t.sage }]}>what should we call you?</Text>
        <TextInput
          value={name} onChangeText={setName} placeholder="Your first name" placeholderTextColor={t.muted}
          autoCorrect={false}
          style={[styles.input, { borderColor: t.sageLine, backgroundColor: t.card, color: t.ink }]}
        />

        <Text style={[styles.label, { color: t.sage }]}>email (optional, for later)</Text>
        <TextInput
          value={email} onChangeText={setEmail} placeholder="you@somewhere.com" placeholderTextColor={t.muted}
          autoCapitalize="none" keyboardType="email-address" autoCorrect={false}
          style={[styles.input, { borderColor: t.sageLine, backgroundColor: t.card, color: t.ink }]}
        />

        <Text style={[styles.label, { color: t.sage }]}>home base</Text>
        <CityInput
          t={t}
          value={homeText}
          onChangeText={(txt) => { setHomeText(txt); setHome(null); }}
          onPick={(c) => { setHomeText(c.city); setHome(c); }}
          placeholder="Where do your journeys start?"
        />

        <Pressable
          onPress={start}
          disabled={!ready}
          style={({ pressed }) => [
            styles.btn,
            { backgroundColor: t.sageDeep, opacity: ready ? 1 : 0.45, transform: [{ scale: pressed && ready ? 0.96 : 1 }] },
          ]}
        >
          <Text style={[styles.btnText, { color: t.saveText }]}>Start exploring</Text>
        </Pressable>

        <Text style={[styles.note, { color: t.muted }]}>
          Your journeys are saved on this device. Accounts and syncing across devices are coming soon.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 26, paddingVertical: 50 },
  brand: { alignItems: 'center', marginBottom: 28 },
  title: { fontFamily: fonts.display, fontSize: 38, marginTop: 10 },
  tagline: { fontFamily: fonts.accent, fontSize: 16, marginTop: 2 },
  welcome: { fontFamily: fonts.display, fontSize: 21, marginBottom: 4 },
  label: { fontFamily: fonts.accent, fontSize: 13.5, marginTop: 16, marginBottom: 6 },
  input: { borderWidth: 1.5, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 14, fontFamily: fonts.bodySemi, fontSize: 15 },
  btn: { marginTop: 26, borderRadius: 999, paddingVertical: 16, alignItems: 'center' },
  btnText: { fontFamily: fonts.bodyHeavy, fontSize: 15.5 },
  note: { fontFamily: fonts.accent, fontSize: 13, textAlign: 'center', marginTop: 16, lineHeight: 19 },
});

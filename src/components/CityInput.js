import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import Icon from './Icons';
import { suggestCities } from '../data/cities';
import { fonts } from '../theme';

// City field with offline suggestions. Calls onPick({ city, country, ll }).
export default function CityInput({ t, value, onChangeText, onPick, placeholder = 'City, country' }) {
  const [focused, setFocused] = useState(false);
  const hits = focused ? suggestCities(value) : [];

  const pick = (c) => {
    onPick({ city: `${c[0]}, ${c[1]}`, name: c[0], country: c[1], ll: [c[2], c[3]] });
    setFocused(false);
  };

  return (
    <View>
      <TextInput
        value={value}
        onChangeText={(txt) => { onChangeText(txt); if (!focused) setFocused(true); }}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder={placeholder}
        placeholderTextColor={t.muted}
        autoCorrect={false}
        style={[styles.input, { borderColor: t.sageLine, backgroundColor: t.card, color: t.ink }]}
      />
      {hits.length > 0 && (
        <View style={[styles.dropdown, { backgroundColor: t.card, borderColor: t.sageLine }]}>
          {hits.map((c, i) => (
            <Pressable
              key={`${c[0]}-${c[1]}`}
              onPress={() => pick(c)}
              style={({ pressed }) => [
                styles.item,
                i > 0 && { borderTopWidth: 1, borderTopColor: t.sageTint },
                pressed && { backgroundColor: t.sageTint },
              ]}
            >
              <Icon name="pin" size={15} color={t.sage} />
              <Text style={[styles.city, { color: t.ink }]}>{c[0]}</Text>
              <Text style={[styles.country, { color: t.muted }]}>{c[1]}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1.5, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 14, fontFamily: fonts.bodySemi, fontSize: 15 },
  dropdown: { borderWidth: 1.5, borderRadius: 14, marginTop: 6, overflow: 'hidden' },
  item: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 11, paddingHorizontal: 13 },
  city: { fontFamily: fonts.bodyBold, fontSize: 14 },
  country: { fontFamily: fonts.accent, fontSize: 12.5, marginLeft: 'auto' },
});

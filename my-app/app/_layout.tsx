import { Stack } from "expo-router";
import React, { useEffect } from 'react';
import { I18nManager } from 'react-native';

export default function RootLayout() {
  useEffect(() => {
    I18nManager.forceRTL(true);
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#007bff' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontSize: 22, fontWeight: '700' },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'لیست بیماران',
        }}
      />
      <Stack.Screen
        name="add-recipe"
        options={{
          title: 'افزودن بیمار جدید',
        }}
      />
      <Stack.Screen
        name="recipe-details"
        options={{
          title: 'جزئیات بیمار',
        }}
      />
    </Stack>
  );
}
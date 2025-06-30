import { Stack } from "expo-router";
import React from 'react';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'لیست بیماران',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="add-recipe"
        options={{
          title: 'افزودن بیمار جدید',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="recipe-details"
        options={{
          title: 'جزئیات بیمار',
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
}
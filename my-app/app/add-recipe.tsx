import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const RECIPES_STORAGE_KEY = '@medicare_recipes';

interface Recipe {
  id: string;
  nationalId: string;
  patientName: string;
  recipe: string;
  price: number;
  timestamp: string;
}

export default function AddRecipeScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ recipe?: string }>();
  let recipeToEdit: Recipe | undefined;
  try {
    recipeToEdit = params.recipe ? JSON.parse(params.recipe) : undefined;
  } catch (error) {
    console.error('Error parsing recipe params:', error);
    Alert.alert('خطا', 'داده‌های دستورالعمل نامعتبر است.');
    recipeToEdit = undefined;
    navigation.goBack();
  }

  const [nationalId, setNationalId] = useState(recipeToEdit ? recipeToEdit.nationalId : '');
  const [patientName, setPatientName] = useState(recipeToEdit ? recipeToEdit.patientName : '');
  const [recipe, setRecipe] = useState(recipeToEdit ? recipeToEdit.recipe : '');
  const [price, setPrice] = useState(recipeToEdit ? recipeToEdit.price.toString() : '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (recipeToEdit) {
      navigation.setOptions({ title: 'ویرایش دستورالعمل' });
    }
  }, [recipeToEdit, navigation]);

  const handleSaveRecipe = async () => {
    if (!nationalId || !patientName || !recipe || !price) {
      Alert.alert('اطلاعات ناقص', 'لطفاً تمام فیلدها را پر کنید.');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('خطا در قیمت', 'لطفاً یک قیمت معتبر وارد کنید.');
      return;
    }

    setIsSaving(true);
    try {
      const existingRecipesString = await AsyncStorage.getItem(RECIPES_STORAGE_KEY);
      let existingRecipes: Recipe[] = existingRecipesString ? JSON.parse(existingRecipesString) : [];

      const newRecipe = {
        id: recipeToEdit ? recipeToEdit.id : uuidv4(),
        nationalId: nationalId.trim(),
        patientName: patientName.trim(),
        recipe: recipe.trim(),
        price: parsedPrice,
        timestamp: recipeToEdit ? recipeToEdit.timestamp : new Date().toISOString(),
      };

      let updatedRecipes: Recipe[];
      if (recipeToEdit) {
        updatedRecipes = existingRecipes.map((recipe) =>
          recipe.id === recipeToEdit.id ? newRecipe : recipe
        );
      } else {
        updatedRecipes = [newRecipe, ...existingRecipes];
      }

      await AsyncStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(updatedRecipes));
      Alert.alert('موفقیت', `دستورالعمل با موفقیت ${recipeToEdit ? 'ویرایش' : 'ذخیره'} شد!`);
      setNationalId('');
      setPatientName('');
      setRecipe('');
      setPrice('');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving recipe:', error);
      Alert.alert('خطا', 'خطا در ذخیره دستورالعمل. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>
          {recipeToEdit ? 'ویرایش مشتری و دستورالعمل' : 'افزودن مشتری و دستورالعمل جدید'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="کد ملی مشتری"
          placeholderTextColor="#6c757d"
          value={nationalId}
          onChangeText={setNationalId}
          keyboardType="numeric"
          maxLength={10}
        />
        <TextInput
          style={styles.input}
          placeholder="نام بیمار"
          placeholderTextColor="#6c757d"
          value={patientName}
          onChangeText={setPatientName}
          autoCapitalize="words"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="دستور ساخت دارو"
          placeholderTextColor="#6c757d"
          value={recipe}
          onChangeText={setRecipe}
          multiline
          numberOfLines={4}
        />
        <TextInput
          style={styles.input}
          placeholder="قیمت (تومان)"
          placeholderTextColor="#6c757d"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <Button
          title={isSaving ? 'در حال ذخیره...' : recipeToEdit ? 'ذخیره تغییرات' : 'ذخیره دستورالعمل'}
          onPress={handleSaveRecipe}
          disabled={isSaving}
          color="#28a745"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#343a40',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#495057',
    backgroundColor: '#f1f3f5',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
});
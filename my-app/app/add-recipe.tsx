import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECIPES_STORAGE_KEY = '@medicare_recipes';

interface Recipe {
  id: string;
  nationalId: string;
  patientName: string;
  recipe: string;
  price: number;
  timestamp: string;
}

type RootStackParamList = {
  index: undefined;
  'add-recipe': { recipe?: string };
  'recipe-details': { recipe: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'add-recipe'>;

export default function AddRecipe() {
  const navigation = useNavigation<NavigationProp>();
  const params = useLocalSearchParams<{ recipe?: string }>();
  const [nationalId, setNationalId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [recipeText, setRecipeText] = useState('');
  const [price, setPrice] = useState('');
  const [recipeId, setRecipeId] = useState<string | null>(null);

  useEffect(() => {
    if (params.recipe) {
      try {
        const recipe: Recipe = JSON.parse(params.recipe);
        setRecipeId(recipe.id);
        setNationalId(recipe.nationalId);
        setPatientName(recipe.patientName);
        setRecipeText(recipe.recipe);
        setPrice(recipe.price.toString());
      } catch (error) {
        console.error('Error parsing recipe params:', error);
        Alert.alert('خطا', 'داده‌های دستورالعمل نامعتبر است.');
      }
    }
  }, [params.recipe]);

  const handleSaveRecipe = async () => {
    if (!nationalId || !patientName || !recipeText || !price) {
      Alert.alert('خطا', 'لطفاً تمام فیلدها را پر کنید.');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      Alert.alert('خطا', 'قیمت باید یک عدد معتبر باشد.');
      return;
    }

    const newRecipe: Recipe = {
      id: recipeId || uuidv4(),
      nationalId: nationalId.trim(),
      patientName: patientName.trim(),
      recipe: recipeText.trim(),
      price: parsedPrice,
      timestamp: new Date().toISOString(),
    };

    try {
      const storedRecipes = await AsyncStorage.getItem(RECIPES_STORAGE_KEY);
      const recipes: Recipe[] = storedRecipes ? JSON.parse(storedRecipes) : [];
      const updatedRecipes = recipeId
        ? recipes.map((r) => (r.id === recipeId ? newRecipe : r))
        : [...recipes, newRecipe];
      await AsyncStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(updatedRecipes));
      Alert.alert('موفقیت', recipeId ? 'دستورالعمل ویرایش شد!' : 'دستورالعمل اضافه شد!');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving recipe:', error);
      Alert.alert('خطا', 'خطا در ذخیره دستورالعمل.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.header}>{recipeId ? 'ویرایش دستورالعمل' : 'افزودن دستورالعمل جدید'}</Text>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>کد ملی</Text>
          <TextInput
            style={styles.input}
            placeholder="کد ملی را وارد کنید..."
            placeholderTextColor="#6c757d"
            value={nationalId}
            onChangeText={setNationalId}
            keyboardType="numeric"
            autoCapitalize="none"
          />
          <Text style={styles.cardLabel}>نام بیمار</Text>
          <TextInput
            style={styles.input}
            placeholder="نام بیمار را وارد کنید..."
            placeholderTextColor="#6c757d"
            value={patientName}
            onChangeText={setPatientName}
            autoCapitalize="words"
          />
          <Text style={styles.cardLabel}>دستور ساخت دارو</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="دستور ساخت دارو را وارد کنید..."
            placeholderTextColor="#6c757d"
            value={recipeText}
            onChangeText={setRecipeText}
            multiline
            numberOfLines={4}
          />
          <Text style={styles.cardLabel}>قیمت (تومان)</Text>
          <TextInput
            style={styles.input}
            placeholder="قیمت را وارد کنید..."
            placeholderTextColor="#6c757d"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveRecipe}
          >
            <MaterialIcons name="save" size={26} color="#ffffff" />
            <Text style={styles.buttonText}>ذخیره</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={26} color="#ffffff" />
            <Text style={styles.buttonText}>بازگشت</Text>
          </TouchableOpacity>
        </View>
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
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#343a40',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#007bff',
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 4,
  },
  input: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    color: '#343a40',
    backgroundColor: '#f1f3f5',
    marginBottom: 12,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '500',
    marginLeft: 8,
  },
});
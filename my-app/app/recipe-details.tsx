import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';

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

type NavigationProp = StackNavigationProp<RootStackParamList, 'recipe-details'>;

export default function RecipeDetails() {
  const navigation = useNavigation<NavigationProp>();
  const params = useLocalSearchParams<{ recipe?: string }>();
  let recipe: Recipe | undefined;
  try {
    recipe = params.recipe ? JSON.parse(params.recipe) : undefined;
  } catch (error) {
    console.error('Error parsing recipe params:', error);
    Alert.alert('خطا', 'داده‌های دستورالعمل نامعتبر است.');
    navigation.goBack();
    return null;
  }

  if (!recipe) {
    Alert.alert('خطا', 'دستورالعمل یافت نشد.');
    navigation.goBack();
    return null;
  }

  const handleEditRecipe = () => {
    navigation.navigate('add-recipe', { recipe: JSON.stringify(recipe) });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>جزئیات دستورالعمل</Text>
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>کد ملی:</Text>
          <Text style={styles.detailValue}>{recipe.nationalId}</Text>
          <Text style={styles.detailLabel}>نام بیمار:</Text>
          <Text style={styles.detailValue}>{recipe.patientName}</Text>
          <Text style={styles.detailLabel}>دستور ساخت دارو:</Text>
          <Text style={styles.detailValue}>{recipe.recipe}</Text>
          <Text style={styles.detailLabel}>قیمت:</Text>
          <Text style={styles.detailValue}>{recipe.price} تومان</Text>
          <Text style={styles.detailLabel}>تاریخ ثبت:</Text>
          <Text style={styles.detailValue}>
            {new Date(recipe.timestamp).toLocaleString('fa-IR')}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditRecipe}
          >
            <MaterialIcons name="edit" size={24} color="white" />
            <Text style={styles.buttonText}>ویرایش</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
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
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',
    textAlign: 'center',
  },
  detailCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#007bff',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#343a40',
    marginTop: 10,
  },
  detailValue: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
});
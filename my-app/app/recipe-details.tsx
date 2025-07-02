import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment-jalaali';

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

  // Validate timestamp
  const formattedDate = moment(recipe.timestamp).isValid()
    ? moment(recipe.timestamp).format('jYYYY/jMM/jDD HH:mm')
    : 'تاریخ نامعتبر';

  const handleEditRecipe = () => {
    navigation.navigate('add-recipe', { recipe: JSON.stringify(recipe) });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.header}>جزئیات دستورالعمل</Text>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>کد ملی:</Text>
          <Text style={styles.cardValue}>{recipe.nationalId}</Text>
          <Text style={styles.cardLabel}>نام بیمار:</Text>
          <Text style={styles.cardValue}>{recipe.patientName}</Text>
          <Text style={styles.cardLabel}>دستور ساخت دارو:</Text>
          <Text style={styles.cardValue}>{recipe.recipe}</Text>
          <Text style={styles.cardLabel}>قیمت:</Text>
          <Text style={styles.cardValue}>{recipe.price} تومان</Text>
          <Text style={styles.cardLabel}>تاریخ ثبت:</Text>
          <Text style={styles.cardValue}>{formattedDate}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditRecipe}
          >
            <Text style={styles.buttonText}>ویرایش</Text>
            <MaterialIcons name="edit" size={26} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>بازگشت</Text>
            <MaterialIcons name="arrow-back" size={26} color="#ffffff" />
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
    textAlign: 'right',
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
    borderRightWidth: 5,
    borderRightColor: '#007bff',
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#343a40',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'right',
  },
  cardValue: {
    fontSize: 17,
    color: '#495057',
    marginBottom: 8,
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    marginTop: 20,
    gap: 20,
  },
  editButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#28a745',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButton: {
    flexDirection: 'row-reverse',
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
    marginRight: 8,
    textAlign: 'right',
  },
});
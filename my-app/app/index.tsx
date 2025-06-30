import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

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

type IndexScreenNavigationProp = StackNavigationProp<RootStackParamList, 'index'>;

export default function Index() {
  const navigation = useNavigation<IndexScreenNavigationProp>();
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const storedRecipes = await AsyncStorage.getItem(RECIPES_STORAGE_KEY);
      if (storedRecipes) {
        const parsedRecipes: Recipe[] = JSON.parse(storedRecipes);
        parsedRecipes.sort((a, b) => {
          const dateA = new Date(a.timestamp).getTime();
          const dateB = new Date(b.timestamp).getTime();
          return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
        });
        setAllRecipes(parsedRecipes);
        setFilteredRecipes(parsedRecipes);
      } else {
        setAllRecipes([]);
        setFilteredRecipes([]);
      }
    } catch (error) {
      console.error('Error loading recipes from AsyncStorage:', error);
      Alert.alert('خطا', 'خطا در بارگذاری دستورالعمل‌ها.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecipes();
      return () => {};
    }, [loadRecipes])
  );

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRecipes(allRecipes);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = allRecipes.filter((recipe) =>
        recipe.nationalId.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredRecipes(filtered);
    }
  }, [searchQuery, allRecipes]);

  const handleDeleteRecipe = async (id: string) => {
    Alert.alert(
      'تأیید حذف',
      'آیا مطمئن هستید که می‌خواهید این دستورالعمل را حذف کنید؟',
      [
        { text: 'لغو', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedRecipes = allRecipes.filter((recipe) => recipe.id !== id);
              await AsyncStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(updatedRecipes));
              setAllRecipes(updatedRecipes);
              setFilteredRecipes(updatedRecipes);
              Alert.alert('موفقیت', 'دستورالعمل با موفقیت حذف شد!');
            } catch (error) {
              console.error('Error deleting recipe:', error);
              Alert.alert('خطا', 'خطا در حذف دستورالعمل.');
            }
          },
        },
      ]
    );
  };

  const handleViewDetails = (recipe: Recipe) => {
    navigation.navigate('recipe-details', { recipe: JSON.stringify(recipe) });
  };

  const navigateToAddRecipe = () => {
    navigation.navigate('add-recipe', {});
  };

  const renderItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => handleViewDetails(item)}
    >
      <Text style={styles.recipeTextBold}>کد ملی: {item.nationalId}</Text>
      <Text style={styles.recipeText}>نام بیمار: {item.patientName}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteRecipe(item.id)}
        >
          <MaterialIcons name="delete" size={20} color="white" />
          <Text style={styles.actionButtonText}>حذف</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>در حال بارگذاری لیست...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.brandContainer}>
        <Text style={styles.brandText}>داروخانه دکتر نیک جو</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="جستجو بر اساس کد ملی..."
          placeholderTextColor="#6c757d"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          keyboardType="numeric"
        />
      </View>
      <FlatList
        data={filteredRecipes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>هیچ دستورالعملی یافت نشد.</Text>
            <Text style={styles.emptyListSubText}>برای افزودن، روی دکمه + ضربه بزنید.</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadRecipes(); }} />
        }
      />
      <TouchableOpacity style={styles.addButton} onPress={navigateToAddRecipe}>
        <MaterialIcons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  brandContainer: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  brandText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#343a40',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#495057',
    backgroundColor: '#f1f3f5',
  },
  listContent: {
    padding: 15,
  },
  recipeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#007bff',
  },
  recipeTextBold: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#343a40',
  },
  recipeText: {
    fontSize: 15,
    color: '#495057',
    marginBottom: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007bff',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    padding: 20,
  },
  emptyListText: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyListSubText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
});
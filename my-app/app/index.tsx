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
import moment from 'moment-jalaali';

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
        recipe.nationalId.toLowerCase().includes(lowerCaseQuery) ||
        recipe.patientName.toLowerCase().includes(lowerCaseQuery)
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
      <Text style={styles.recipeText}>
        تاریخ ثبت: {moment(item.timestamp).isValid()
          ? moment(item.timestamp).format('jYYYY/jMM/jDD HH:mm')
          : 'تاریخ نامعتبر'}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteRecipe(item.id)}
        >
          <Text style={styles.actionButtonText}>حذف</Text>
          <MaterialIcons name="delete" size={26} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
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
          placeholder="جستجو بر اساس کد ملی یا نام بیمار..."
          placeholderTextColor="#6c757d"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          textAlign="right"
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
        <MaterialIcons name="add" size={30} color="#ffffff" />
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  brandText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '600',
    color: '#343a40',
    textAlign: 'right',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  searchInput: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    color: '#343a40',
    backgroundColor: '#f1f3f5',
    textAlign: 'right',
  },
  listContent: {
    padding: 16,
  },
  recipeCard: {
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
  recipeTextBold: {
    fontSize: 19,
    fontWeight: '700',
    color: '#343a40',
    marginBottom: 8,
    textAlign: 'right',
  },
  recipeText: {
    fontSize: 17,
    color: '#495057',
    marginBottom: 8,
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '500',
    marginRight: 8,
    textAlign: 'right',
  },
  addButton: {
    position: 'absolute',
    bottom: 32,
    left: 32,
    backgroundColor: '#007bff',
    borderRadius: 30,
    width: 64,
    height: 64,
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
    fontSize: 20,
    fontWeight: '600',
    color: '#6c757d',
    textAlign: 'right',
    marginBottom: 12,
  },
  emptyListSubText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'right',
  },
});
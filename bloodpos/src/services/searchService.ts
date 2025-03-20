import AsyncStorage from '@react-native-async-storage/async-storage';

const SEARCH_RESULTS_KEY = 'searchResults';
const API_URL = 'http://192.168.1.17:3000/api/v1/donors'

export const searchNearbyDonors = async (bloodGroup: string, latitude: number, longitude: number, distance: number) => {
  try {
    const encodedBloodGroup = encodeURIComponent(bloodGroup);
    const response = await fetch(`${API_URL}/searchNearby?bloodGroup=${encodedBloodGroup}&latitude=${latitude}&longitude=${longitude}&distance=${distance}`);
    const results = await response.json();

    if (response.ok) {
      await AsyncStorage.setItem(SEARCH_RESULTS_KEY, JSON.stringify(results));
      return results;
    } else {
      throw new Error(results.error || 'Failed to fetch search results');
    }
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
};

export const getCachedSearchResults = async () => {
  try {
    const cachedResults = await AsyncStorage.getItem(SEARCH_RESULTS_KEY);
    return cachedResults ? JSON.parse(cachedResults) : null;
  } catch (error) {
    console.error('Error getting cached search results:', error);
    return null;
  }
};
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../partials/header';
import { ScrollView } from 'react-native-gesture-handler';
import thumbnail from '../../assets/images/newimg.png';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { BASE_URL } from '@env';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const windowWidth = Dimensions.get('window').width;

const NUM_CARDS_PER_ROW = 3;


const Newspaper = ({searchResults }) => {
  const isSearch = searchResults?.recomended_newspapers
  const navigation = useNavigation();
  const [data, setData] = useState();
  const [mode, setMode] = useState(''); 
  const allNews = () => {
    let apiUrl = BASE_URL + 'api/front/get/all-newspapers';
    if (apiUrl[4] === 's') {
      apiUrl = apiUrl.slice(0, 4) + apiUrl.slice(5); // Remove 's' at the 5th position.
    }

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setData(data?.newspapers);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    allNews();
  }, [])
  const getMode = async () => {
    try {
      const selectedMode = await AsyncStorage.getItem('appMode');
      if (selectedMode === 'light' || selectedMode === 'dark') {
        setMode(selectedMode);
      }
    } catch (error) {
      console.error('Error getting language from AsyncStorage:', error);
    }
  };
  
  useEffect(() => {
    getMode();

    const interval = setInterval(() => {
      getMode();
    }, 2000);

    return () => {
      clearInterval(interval); 
    };
  }, []);
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={[styles.container, mode === 'dark' && styles.darkContainer]}>
          <Header />
          <View style={styles.cardsContainer}>
          {isSearch ? (
              searchResults.recomended_newspapers.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => navigation.navigate('NewsInfo', { id: item?.id })}
                >
                  <View style={styles.card}>
                    <Image source={{ uri: item?.bg_image }} style={styles.thumbnailImg} resizeMode='cover' />
                  </View>
                  <Text style={[styles.cardtxt, mode === 'dark' && styles.darkText]}>
                    {item?.title && item.title.length > 12 ? item.title.slice(0, 11) + '...' : item.title}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              Array.isArray(data) ? (
                data.map((item, index) => (
                  <TouchableOpacity key={index} onPress={() => navigation.navigate('NewsInfo', { id: item?.id })}>
                    <View style={styles.card}>
                      <Image source={{ uri: item?.image }} style={styles.thumbnailImg} resizeMode='cover' />
                    </View>
                    <Text style={[styles.cardtxt, mode === 'dark' && styles.darkText]}>
                      {item?.name && item.name.length > 12 ? item.name.slice(0, 11) + '...' : item.name}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>No data available</Text>
              )
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Newspaper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '5%',
  },
  card: {
    width: (windowWidth - 16) / NUM_CARDS_PER_ROW - 16,
    margin: 8,
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    paddingTop: 10,
    paddingBottom: 10,
  },
  thumbnailImg: {
    width: '100%',
    height: 70,
    objectFit: 'contain',
  },
  cardtxt: {
    fontWeight: '400',
    fontSize: 14,
    marginTop: '2%',
    marginLeft: '10%',
    marginBottom: "5%",
   
  },
  darkContainer: {
    backgroundColor: '#000',
    height:1200,
  },
  darkText: {
    color: '#fff',
  },
});

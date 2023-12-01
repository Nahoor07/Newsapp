import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Bookmark from 'react-native-vector-icons/MaterialCommunityIcons';
import { BASE_URL } from '@env';
import { useNavigation } from '@react-navigation/core';
import { ActivityIndicator } from 'react-native';
import axios from 'axios';



const Featurenews = () => {
  const navigation = useNavigation();
  const [data, setData] = useState(null);

  useEffect(() => {
    const apiUrl = BASE_URL + 'api/featured/news';

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setData(data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Initialize bookmark status for each card to false
  const [isBookmarkedArray, setIsBookmarkedArray] = useState([]);

  const toggleBookmark = async (id, index) => {
    try {
      const response = await axios.get(BASE_URL + `api/favourite/newspaper/${id}`);
      console.log(response)

      if (response.status === 200) {
        const updatedIsBookmarkedArray = [...isBookmarkedArray];
        updatedIsBookmarkedArray[index] = !updatedIsBookmarkedArray[index];
        setIsBookmarkedArray(updatedIsBookmarkedArray);
      } else {
        console.error('API request failed:', response.statusText);
      }
    } catch (error) {
      console.error('API request failed:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.featureheader}>Recommended Newspaper</Text>
      <View style={styles.cardContainer}>
        <View style={styles.rowContainer}>
          {data !== null ? (
            data.map((cardData, index) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Newsdetail', { id: cardData.newspaper_id })}
                style={styles.card}
                key={index}
              >
                <View style={styles.cardHeader}>
                  <Image
                    source={{
                      uri: BASE_URL + 'storage/' + cardData?.image,
                    }}
                    style={styles.cardImg}
                  />
                  <TouchableOpacity onPress={() => toggleBookmark(cardData?.newspaper_id, index)}>
                    <Bookmark
                      name={isBookmarkedArray[index] ? 'bookmark-plus' : 'bookmark-plus-outline'}
                      size={30}
                      color={isBookmarkedArray[index] ? 'blue' : 'black'}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.titleCard}>{cardData?.title}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <ActivityIndicator size="large" color="#407BFF" style={styles.indicator} />
          )}
        </View>
      </View>
    </View>
  );
};

export default Featurenews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
  },
  featureheader: {
    fontSize: 20,
    fontWeight: '600',
  },
  cardContainer: {
    marginTop: '8%',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  card: {
    flexBasis: '48%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    paddingTop: '8%',
    paddingBottom: '10%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleCard: {
    fontWeight: '500',
    fontSize: 17,
    marginTop: '10%',
  },
  cardImg: {
    width: 60,
    height: 50,
    marginTop: -4,

  },
  indicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import profileImg from '../../assets/images/team.jpg'
import { BASE_URL } from '@env';
import { useNavigation } from '@react-navigation/core';
import axios from 'axios';
import ar from '../lang/ar.json'
import en from '../lang/en.json'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Popularwriters({ searchResults }) {
    const isSearch = searchResults?.popular_writers
    const navigation = useNavigation();
    const [data, setData] = useState();
    const [mode, setMode] = useState(''); 
    const writerData = async () => {
        let apiUrl = `${BASE_URL}api/popular-writer`;

        if (apiUrl[4] === 's') {
            apiUrl = apiUrl.slice(0, 4) + apiUrl.slice(4 + 1)
        }

        const config = {
            'Accept': 'application/json'
        }

        try {
            const response = await axios.get(apiUrl, config);
            if (response.status === 200) {
                setData(response?.data?.data);
            } else {
                console.log('Non-200 Status Code:', response.status);
            }
        } catch (error) {
            console.error('Error writer', error.config);
        }

    };
    useEffect(() => {
        writerData()
    }, []);
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
    const [language, setLanguage] = useState(''); 

  const getLanguage = async () => {
    try {
      const selectedLanguage = await AsyncStorage.getItem('appLanguage');
      if (selectedLanguage === 'english' || selectedLanguage === 'arabic') {
        setLanguage(selectedLanguage);
      }
    } catch (error) {
      console.error('Error getting language from AsyncStorage:', error);
    }
  };
  
  useEffect(() => {
    getLanguage(); 
    getMode()

    const interval = setInterval(() => {
      getLanguage(); 
      getMode();
    }, 2000);

    return () => {
      clearInterval(interval); 
    };
  }, []);
  const translations = language === 'english' ? en : ar;

    return (
        <View style={[styles.container, mode === 'dark' && styles.darkContainer]}>
            <View style={styles.latestArticleView}>
                <Text style={[styles.latestArticletxt, mode === 'dark' && styles.darkText]}>{translations.PopularWriter} </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Popular Writer')}>

                    <Text style={styles.seemoretxt}>{translations.SeeMore} </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.writersContainer}>
                {isSearch ? (
                    searchResults.popular_writers.map((item, index) => (
                        <TouchableOpacity onPress={() => navigation.navigate('Writer', { id: item?.id })} style={styles.writerView} key={index}>
                            <Image source={{ uri: item?.image }} style={styles.profileImg} resizeMode='cover' />
                            <Text style={[styles.title, mode === 'dark' && styles.darkText]}>{item?.name}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    data && data.length > 0 && data.slice(0, 3).map((item, index) => (
                        <TouchableOpacity onPress={() => navigation.navigate('Writer', { id: item?.id })} style={styles.writerView} key={index}>
                            <Image source={{ uri: item?.image }} style={styles.profileImg} resizeMode='cover' />
                            <Text style={[styles.title, mode === 'dark' && styles.darkText]}>{item?.name}</Text>
                        </TouchableOpacity>
                    ))
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginRight: "7%",
        marginLeft: "5%",
        marginBottom: '6%',
        marginTop: "5%",
    },
    latestArticleView: {
        flexDirection: "row",
        justifyContent: 'space-between',

    },
    latestArticletxt: {
        fontSize: 18,
        fontWeight: '600',
    },
    seemoretxt: {
        fontSize: 15,
        color: '#407BFF'
    },
    profileImg: {
        width: 80,
        height: 80,
        borderRadius: 50,
        objectFit: 'cover',
    },
    title: {
        fontWeight: '400',
    },
    writersContainer: {
        flexDirection: "row",
        gap: 30,
        marginTop: '4%',
        justifyContent: 'center'

    },
    writerView: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "column",
        gap: 8,
    },
    darkContainer: {
        backgroundColor: '#000',
      },
      darkText: {
        color: '#fff',
      },


})
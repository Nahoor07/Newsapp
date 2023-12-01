import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import thumbnail from '../../assets/images/newimg.png'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '@env';
import ar from '../lang/ar.json'
import en from '../lang/en.json'


export default function Games() {
    const [data, setData] = useState();
    const [mode, setMode] = useState(''); 
    const retrieveNewspaper = async () => {
        try {
            let token = await AsyncStorage.getItem('token');
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            };
            const response = await axios.get(`${BASE_URL}api/followed/publisher`, config);

            if (response.data)
                setData(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        retrieveNewspaper();
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
        <View  style={[styles.container, mode === 'dark' && styles.darkContainer]}>
            <View style={styles.cardsContainer}>

                {Array.isArray(data) && data.length > 0 ? (
                    data.map((item) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Writer', { id: item?.id })}
                            style={styles.writerView}
                            key={item?.id}
                        >
                            <Image source={{ uri: item?.image }} style={styles.profileImg} resizeMode='cover' />
                            <Text style={[styles.title, mode === 'dark' && styles.darkText]}>{item?.name}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noGamesText}>You are not following any publisher.</Text>
                )}

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: "15%"
    },
    cardsContainer: {
        flexDirection:'row',
        flexWrap:'wrap',
        marginLeft:'10%',
        gap:30,
    },
  
    thumbnailImg: {
        width: 100,
        height: 100,
        alignSelf: "center",
        objectFit: "contain"
    },
    cardView: {
        flexDirection: "column",
        gap: 4,
    },

    profileImg: {
        width: 80,
        height: 80,
        borderRadius: 50,
        objectFit: 'cover',
    },
    title: {
        fontWeight: '400',
        textAlign:'center',
        marginTop:3
    },
   
    darkContainer: {
        backgroundColor: '#000',
      },
      darkText: {
        color: '#fff',
      },

})
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import thumbnail from '../../assets/images/newimg.png'
import { BASE_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import ar from '../lang/ar.json'
import en from '../lang/en.json'
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Recommendednewspaper() {
    const navigation = useNavigation();
    const [data, setData] = useState();
    const [mode, setMode] = useState(''); 

    const [language, setLanguage] = useState(''); 
    const sliderData = async () => {
        const apiUrl = `${BASE_URL}api/front/recomended-newspaper`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setData(data?.recomended_newspapers)

        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        sliderData()
    }, []);

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
    getLanguage(); 
    getMode();

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
        <View>
            <View style={styles.latestArticleView}>
                <Text style={[styles.latestArticletxt, mode === 'dark' && styles.darkText]}>{translations.RecommendedNewspaper }</Text>
                <Text style={styles.seemoretxt}>{translations.SeeMore}</Text>

            </View>

            <View style={styles.cardsContainer}>
                {Array.isArray(data) &&
                    data.slice(0, 3).map((item, index) => (
                        <TouchableOpacity style={styles.cardView} key={index} onPress={() => navigation.navigate('NewsInfo', { id: item?.id })}>
                            <View style={styles.card}>
                                <Image source={{ uri: item?.bg_image }} style={styles.thumbnailImg} resizeMode="cover" />
                            </View>
                            <Text style={[styles.cardtxt, mode === 'dark' && styles.darkText]}>
                                {item?.title.length > 10 ? item?.title.slice(0, 8) + '...' : item?.title}
                            </Text>

                        </TouchableOpacity>
                    ))}

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    latestArticleView: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginRight: "7%",
        marginLeft: "5%",
        marginBottom: '6%',
        marginTop: "5%",
    },
    latestArticletxt: {
        fontSize: 18,
        fontWeight: '600',
    },
    seemoretxt: {
        fontSize: 15,
        color: '#407BFF'
    },
    cardsContainer: {
        flexDirection: 'row',
        marginLeft: '4%',
        marginRight: "4%",
        alignItems: 'center',
        gap: 4,
        justifyContent: "center"
    },
    card: {
        flex: 1,
        marginHorizontal: '1%',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
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

    cardtxt: {
        fontWeight: "500",
        fontSize: 15,
        marginTop: '8%',

    },
    darkContainer: {
        backgroundColor: '#000',
      },
      darkText: {
        color: '#fff',
      },
})
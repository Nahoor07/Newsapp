import React, { useEffect, useRef, useState } from 'react';
import Carousel from 'react-native-snap-carousel';
import { View, Text, Image, StyleSheet } from 'react-native';
import Cover from '../../assets/images/newcover.jpeg'
import { BASE_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import { Touchable } from 'react-native';
import { TouchableOpacity } from 'react-native';
import ar from '../lang/ar.json'
import en from '../lang/en.json'
import AsyncStorage from '@react-native-async-storage/async-storage';




const LatestArticle = ({searchResults}) => {
    console.log(searchResults)
    const navigation = useNavigation();
    const [data,setData]=useState([]);
    const [mode, setMode] = useState(''); 

    const _carousel = useRef(null);
    const articleData = async () => {
        const apiUrl = `${BASE_URL}api/latest-article`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setData(data?.data)
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        articleData()
    }, []);
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


    const _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.slide} key={index} onPress={() => navigation.navigate('ArticleDetail', { id: item?.id })}>
                <Image source={{uri:item?.image}} resizeMode='cover' style={styles.image} />
                <Text style={[styles.title, mode === 'dark' && styles.darkText]}>{item?.title}</Text>
            </TouchableOpacity>
        );
    };

  

    const sliderWidth = 400;
    const itemWidth = 300;

    return (


        <View>
            <View style={styles.latestArticleView}>
                <Text style={[styles.latestArticletxt, mode === 'dark' && styles.darkText]}>{translations.LatestArticles}</Text>
                <TouchableOpacity onPress={()=>navigation.navigate('Articles')}>
                <Text style={styles.seemoretxt}>{translations.SeeMore}</Text>
                </TouchableOpacity>
            </View>
           
            <Carousel
                ref={_carousel}
                data={data}
                renderItem={_renderItem}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
            />
         
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: 300,
        height: 200,
        objectFit:'cover'
    },
    latestArticleView: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginRight: "7%",
        marginLeft: "5%",
        marginBottom: '6%',
        marginTop:"5%",
    },
    latestArticletxt: {
        fontSize: 18,
        fontWeight: '600',
    },
    seemoretxt: {
        fontSize: 15,
        color: '#407BFF'
    },
    title: {
        marginTop: '5%',
        fontWeight: '400',
        lineHeight: 24, 
        width:200, 
      },
      darkContainer: {
        backgroundColor: '#000',
      },
      darkText: {
        color: '#fff',
      },
})
export default LatestArticle;

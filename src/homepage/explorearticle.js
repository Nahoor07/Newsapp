import { ScrollView, StyleSheet, Text, View,Image , Platform} from 'react-native'
import React, { useEffect, useState } from 'react'
import team from '../../assets/images/team.jpg'
import { BASE_URL } from '@env';
import ar from '../lang/ar.json'
import en from '../lang/en.json'
import AsyncStorage from '@react-native-async-storage/async-storage';


const Explorearticle = () => {
    const [data, setData] = useState()
    const [mode, setMode] = useState(''); 
    const dataArticles = async () => {
        const apiUrl = `${BASE_URL}api/front/explore/article-by-category`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setData(data?.categories)

        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        dataArticles()
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
    return (
        <View style={[styles.container, mode === 'dark' && styles.darkContainer]}>
            <Text style={[styles.latestArticletxt, mode === 'dark' && styles.darkText]}>{translations.ExploreArticles}</Text>
            <ScrollView  horizontal={true}>
            {data && data.length > 0 && data.map((item,index) => (
                   <View key={index} style={[styles.card, { marginRight: 10, marginBottom:10 }]}>
                   <Image source={{uri:item?.image}}  style={styles.teamimg}/>
                   <Text style={[styles.teamtxt, mode === 'dark' && styles.darkText]}>{item?.name}</Text>
                   </View>
                ))}
                
                
            </ScrollView>
        </View>

    )
}

export default Explorearticle

const styles = StyleSheet.create({
    container: {
        marginRight: "7%",
        marginLeft: "5%",
        marginBottom: '6%',
        marginTop: "5%",
    },
    // scrollContainer:{
    //     flexDirection:"row",
    //     gap:20,
    // },
    latestArticleView: {
        flexDirection: "row",
        justifyContent: 'space-between',

    },
    latestArticletxt: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom:'5%'
    },
    seemoretxt: {
        fontSize: 15,
        color: '#407BFF'
    },
    card:{
        width: 100,
        height: 100,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        borderWidth:1,
        borderColor:'rgba(0, 0, 0, 0.1)',
        ...Platform.select({
          ios: {
            shadowColor: 'rgba(0, 0, 0, 0.8)',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 5,
          },
          android: {
            elevation: 4,
          },
        }),
    },
    teamimg:{
        width:70,
        height:70,
        resizeMode:'cover'
    },
    teamtxt:{
        marginTop:"2%",
        fontSize:14,
        
    },
    darkContainer: {
      backgroundColor: '#000',
    },
    darkText: {
      color: '#fff',
    },
})
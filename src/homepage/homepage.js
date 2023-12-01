import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Button } from 'react-native';
import Header from '../partials/header';
import Featurenews from './featurenews';
import Breakingnews from './breakingnews';
import Latestarticle from './latestarticle';
import { ScrollView } from 'react-native';
import Recommendednewspaper from './recommendednewspaper';
import Articlelist from './articlelist';
import Popularwriters from './popularwriters';
import Explorearticle from './explorearticle';
import { useNavigation } from '@react-navigation/core';
import ar from '../lang/ar.json'
import en from '../lang/en.json'
import AsyncStorage from '@react-native-async-storage/async-storage';





const Homepage = () => {
  const navigation = useNavigation();
  const [language, setLanguage] = useState('');
  const [mode, setMode] = useState('');



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
    <>
      <ScrollView>
        <View style={[styles.container, mode === 'dark' && styles.darkContainer]}>
          <Header />
          <View style={styles.hairline} />
          <Breakingnews />
          <Text style={styles.text}>
          </Text>

          {/* <Featurenews /> */}
          <Latestarticle />
          <Recommendednewspaper />
          <View style={styles.latestArticleView}>
            <Text style={[styles.latestArticletxt, mode === 'dark' && styles.darkText]}>{translations.ArticleList}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Latest Articles')}>
              <Text style={styles.seemoretxt}>{translations.SeeMore}</Text>
            </TouchableOpacity>
          </View>
          <Articlelist />
          <Popularwriters />
          <Explorearticle />
        </View>
      </ScrollView>
    </>
  );
}

export default Homepage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: '10%',
    marginTop: "4%"
  },
  hairline: {
    backgroundColor: '#D3D3D3',
    height: 1,
    width: "100%"
  },
  latestArticleView: {
    flexDirection: "row",
    justifyContent: 'space-between',
    marginLeft: "5%",
    marginTop: '5%',
    marginRight: "10%"

  },
  latestArticletxt: {
    fontSize: 18,
    fontWeight: '600',
  },
  seemoretxt: {
    fontSize: 15,
    color: '#407BFF'
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  darkText: {
    color: '#fff',
  },
});

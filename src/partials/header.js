import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, SafeAreaView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';
import { HeaderLogo } from '../../utils/svgs/header';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function Header() {
  const navigation= useNavigation();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);  
  const [mode, setMode] = useState(''); 
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



  // const searchArticle = async () => {
  //   try {
  //     let token = await AsyncStorage.getItem('token');
  //     const config = {
  //       headers: {
  //         Accept: 'application/json',
  //       },
  //     };
  //     const response = await axios.post(`${BASE_URL}api/search?search=${query}`, config);
  //     setSearchResults(response.data.articles); 
  //     console.log(response.data)
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  useEffect(() => {
  }, []);

  return (
    <View style={[styles.container, mode === 'dark' && styles.darkContainer]}>
      <TouchableOpacity onPress={()=>navigation.navigate("Home")}  style={styles.customHeader}>
        <HeaderLogo />
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search"
          onChangeText={text => setQuery(text)}
          value={query}
       
        />
        <TouchableOpacity style={styles.searchIcon} onPress={()=>navigation.navigate('Search', {query})}>
          <FontAwesome5
            name="search"
            size={24}
            color="#7f7f7f"
          />
        </TouchableOpacity>
        {/* {searchResults.map((result, index) => (
          <View key={index}>
            <Text>{result.title}</Text>
            <Text>{result.description}</Text>
          </View>
        ))} */}


      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  inputContainer: {
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: '#F2F4F5',
    paddingTop: '3%',
    paddingLeft: '7%',
    width: '80%',
    paddingBottom: "3%",
    marginRight: "7%"
  },
  input: {
    marginLeft: '4%',
    width: '80%'
  },
  searchIcon: {
    marginRight: '5%'
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  darkText: {
    color: '#fff',
  },
});

import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Homepage from './src/homepage/homepage';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import Step1 from './src/steps/step1';
import Step2 from './src/steps/step2';
import Step3 from './src/steps/step3';
import Subscribe from './src/subscribe/subscribe';
import Notification from './src/notification/notification';
import Profile from './src/profile/profile';
import Dashboard from './src/dashboard/dashboard';
import Create from './src/createarticle/create';
import Newsdetail from './src/newsdetail/newsdetail';
import UserSignup from './src/signup/usersignup';
import CreaterSignup from './src/signup/creatorSignUp';
import Articledetail from './src/articledetail/articledetail';
import Signin from './src/signin/signin';
import Editprofile from './src/profile/editprofile';
import EditArticle from './src/dashboard/editarticle';
import Newspaper from './src/newspaper/newspaper';
import AllArticles from './src/articles/articles';
import Newarticle from './src/latestarticle/newarticle';
import Famouswriter from './src/popularwriter/famouswriter';
import Writer from './src/popularwriter/writer';
import Myplaylist from './src/myplaylist/myplaylist';
import Games from './src/games/games';
import All from './src/newsdetail/all';
import NewspaperInfo from './src/newspaper/newspaperInfo';
import SavedNewspaper from './src/newspaper/savedNewspaper';
import SavedArticle from './src/articles/saveArticle';
import Search from './src/partials/search';
import ar from './src/lang/ar.json'
import en from './src/lang/en.json'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Publisher from './src/publisher/publisher';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
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
      if (selectedMode === 'dark' || selectedMode === 'light') {
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
    }, 1000);

    return () => {
      clearInterval(interval); 
    };
  }, []);


  const translations = language === 'english' ? en : ar;



  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#407bff',
        tabBarStyle: {
          display: 'flex',
          alignItems:"center",
          paddingBottom:7,
          marginTop: 10,
          height:60,
          backgroundColor: mode === 'dark' ? 'black' : 'white',

        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Homepage}
        options={{
          headerShown:false,
          tabBarLabel: translations.homeTabLabel,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Newspapers"
        component={Newspaper}
        options={{
          headerShown: false,
          tabBarLabel: translations.Newspaper,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="newspaper" color={color} size={30}  />
          ),
        }}
      />
      <Tab.Screen
        name="Articles"
        component={AllArticles}
        options={{
          headerShown: false,
          tabBarLabel: translations.Articles,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="article" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarLabel: translations.Profile,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user-circle-o" color={color} size={30} />
          ),
        }}
      />

    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signin" options={{ headerMode: 'false' }}>
        {/* <Stack.Screen name="Step1" component={Step1} options={{ headerShown: false }} />
        <Stack.Screen name="Step2" component={Step2} options={{ headerShown: false }} />
        <Stack.Screen name="Step3" component={Step3} options={{ headerShown: false }} /> */}
        <Stack.Screen name="Signin" component={Signin} options={{ headerShown: false }} /> 
        <Stack.Screen name="Signup" component={UserSignup} options={{ headerShown: false }} /> 
        <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false, headerTitleStyle: false }} />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false, headerTitleStyle: false }} />
        <Stack.Screen name="Create" component={Create} options={{ headerShown: false, headerTitleStyle: false }} />
        <Stack.Screen name="Newsdetail" component={Newsdetail} options={{ headerShown: false, headerTitleStyle: false }} />
        <Stack.Screen name="UserSignup" component={UserSignup} options={{ headerShown: false }} />
        <Stack.Screen name="CreaterSignup" component={CreaterSignup} options={{ headerShown: false }} />
        <Stack.Screen name="ArticleDetail" component={Articledetail} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" component={Editprofile} />
        <Stack.Screen name="EditArticle" component={EditArticle} />
        <Stack.Screen name="Latest Articles" component={Newarticle} />
        <Stack.Screen name="Popular Writer" component={Famouswriter} />
        <Stack.Screen name="Writer" component={Writer} />
        <Stack.Screen name="Myplaylist" component={Myplaylist} />
        <Stack.Screen name="Games" component={Games} />
        <Stack.Screen name="All" component={All} options={{ headerShown: false }} />
        <Stack.Screen name="NewsInfo" component={NewspaperInfo} options={{ headerShown: false }} />
        <Stack.Screen name="Notifications" component={Notification} options={{ headerShown: false }} />
        <Stack.Screen name="SavedNewspaper" component={SavedNewspaper} />
        <Stack.Screen name="SavedArticle" component={SavedArticle} />
        <Stack.Screen name="Search" component={Search}  options={{ headerShown: false }}/>
        <Stack.Screen name="Publisher" component={Publisher}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

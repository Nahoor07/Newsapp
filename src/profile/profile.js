import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../partials/header'
import ProfileImg from '../../assets/images/profile.jpg'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../theme/themeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from '../../assets/vector/carbon_bookmark-add.png'
import Notifications from '../../assets/vector/notification.png'
import Games from '../../assets/vector/game.png'
import { AntDesign, MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';
import en from '../lang/en.json';
import ar from '../lang/ar.json'

export default function Profile() {
  const navigation = useNavigation();
  const [activeLanguage, setActiveLanguage] = useState('english');
  const [activeMode, setActiveMode] = useState('light');
  const [profileData, setProfileData] = useState();
  const [imageSoruce, setImageSource] = useState();
  const [newActiveMode, setNewmode] = useState();

  const translations = activeLanguage === 'english' ? en : ar;

  const toggleLanguage = async (language) => {
    await AsyncStorage.setItem('appLanguage', language);
    setActiveLanguage(language);
  };

  const toggleDarkMode = async () => {
    const newMode = activeMode === 'light' ? 'dark' : 'light';
    setActiveMode(newMode);
    await AsyncStorage.setItem('appMode', newMode);
  };
  const retrieveData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      const image = await AsyncStorage.getItem('userImage');

      const newData = JSON.parse(data)
      setProfileData(newData);
      setImageSource(image)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    retrieveData();
  }, [])

  const SignOut = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.navigate('Signin');

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={[styles.container, activeMode === 'dark' && styles.darkContainer]}>
        <Header />
        <View style={styles.hairline} />
        <View style={styles.profilecontainer}>
          <Image
            source={profileData?.image ? { uri: profileData?.image } : ProfileImg}
            style={styles.profileImg}
          />
          <Text style={[styles.profileTitle, activeMode === 'dark' && styles.darkText]}>{profileData?.name}</Text>
          <Text style={styles.profileMail}>{profileData?.email}</Text>
          <TouchableOpacity style={styles.editProfileBtn} onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.editProfileTxt}>{translations.EditProfile}</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={styles.viewDashboardBtn}>
            <Text style={[styles.viewDashboardTxt, activeMode === 'dark' && styles.darkText]}>View dashboard</Text>
          </TouchableOpacity> */}
        </View>
        <View style={styles.hairline} />
        <View style={styles.profilecontainer}>
          <View style={styles.languageContainer}>
            <Text style={[styles.languageText, activeMode === 'dark' && styles.darkText]}>{translations.Language}</Text>
            <View style={styles.switchContainer}>
              <View style={activeLanguage === 'english' ? styles.activeIndex : {}}>
                <TouchableOpacity
                  style={[
                    styles.label,
                    activeLanguage === 'english' ? styles.activeLabel : styles.inactiveLabel,
                  ]}
                  onPress={() => toggleLanguage('english')}
                >
                  <Text style={styles.labelText}>{translations.English}</Text>
                </TouchableOpacity>
              </View>
              <View style={activeLanguage === 'arabic' ? styles.activeIndex : {}}>
                <TouchableOpacity
                  style={[
                    styles.label,
                    activeLanguage === 'arabic' ? styles.activeLabel : styles.inactiveLabel,
                  ]}
                  onPress={() => toggleLanguage('arabic')}
                >
                  <Text style={styles.labelText}>{translations.Arabic}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.modeContainer}>
            <Text style={[styles.languageText, activeMode === 'dark' && styles.darkText]}>
              {translations.Mode}
            </Text>
            <View style={styles.switchContainer}>
              <View style={activeMode === 'dark' ? styles.activeIndex : {}}>
                <TouchableOpacity
                  style={[
                    styles.label,
                    activeMode === 'dark' ? styles.activeMode : styles.inactiveMode,
                  ]}
                  onPress={() => {
                    if (activeMode !== 'dark') {
                      toggleDarkMode();
                    }
                  }}
                >
                  <Text style={styles.labelText}>{translations.Dark}</Text>
                </TouchableOpacity>
              </View>
              <View style={activeMode === 'light' ? styles.activeIndex : {}}>
                <TouchableOpacity
                  style={[
                    styles.label,
                    activeMode === 'light' ? styles.activeMode : styles.inactiveMode,
                  ]}
                  onPress={() => {
                    if (activeMode !== 'light') {
                      toggleDarkMode();
                    }
                  }}
                >
                  <Text style={styles.labelText}>{translations.Light}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.hairline} />
          <View style={styles.profileMore}>
            {profileData?.type !== 'user' && (
              <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={styles.moreDetail}>
                <MaterialCommunityIcons name="hoop-house" size={25} color="#407BFF" />
                <Text style={[styles.txtdetail, activeMode === 'dark' && styles.darkText]}>{translations.Dashboard}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => navigation.navigate('SavedArticle')} style={styles.moreDetail} >
              <Image source={Icon} />
              <Text style={[styles.txtdetail, activeMode === 'dark' && styles.darkText]}>{translations.SavedArticles}</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.moreDetail} onPress={() => navigation.navigate("Myplaylist")}>
              <MaterialCommunityIcons name="playlist-plus" size={22} color="#407BFF" />
              <Text style={[styles.txtdetail, activeMode === 'dark' && styles.darkText]}>{translations.MyPlaylists}</Text>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => navigation.navigate('SavedNewspaper')} style={styles.moreDetail} >
              <Image source={Icon} />
              <Text style={[styles.txtdetail, activeMode === 'dark' && styles.darkText]}>{translations.SavedNewspaper}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.moreDetail}  onPress={() => navigation.navigate('Publisher')} >
              <MaterialCommunityIcons name="plus" size={22} color="#407BFF" />
              <Text style={[styles.txtdetail, activeMode === 'dark' && styles.darkText]}>{translations.FollowingPublishers}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.moreDetail} onPress={() => navigation.navigate('Notifications')} >
              <Image source={Notifications} />
              <Text style={[styles.txtdetail, activeMode === 'dark' && styles.darkText]}>{translations.Notifications}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Games')} style={styles.moreDetail} >
              <Image source={Games} />
              <Text style={[styles.txtdetail, activeMode === 'dark' && styles.darkText]}>{translations.Games}</Text>
            </TouchableOpacity >
          </View>
          <View style={styles.hairline} />
          <TouchableOpacity style={styles.signOut} onPress={() => SignOut()}>
            <Text style={[styles.signOuttxt, activeMode === 'dark' && styles.darkText]}>{translations.SignOut}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',

  },
  darkContainer: {
    backgroundColor: '#000',
  },
  darkText: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  hairline: {
    backgroundColor: '#D3D3D3',
    height: 1,
    width: "100%"
  },
  profilecontainer: {
    paddingTop: '10%',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  profileImg: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileTitle: {
    fontWeight: '600',
    marginVertical: "5%",
    fontSize: 18,
  },
  profileMail: {
    color: "#808080",
    fontSize: 16,
    marginBottom: "8%"
  },
  editProfileBtn: {
    paddingTop: '3%',
    paddingBottom: '3%',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#407bff',
    width: '50%',
    marginBottom: "4%"
  },
  editProfileTxt: {
    fontWeight: "500",
    fontSize: 16,
    textAlign: 'center',
    color: '#407bff'
  },
  viewDashboardBtn: {
    borderWidth: 1,
    borderColor: '#407bff',
    paddingTop: '5%',
    paddingBottom: '5%',
    borderRadius: 50,
    marginTop: '5%',
    marginBottom: '10%'
  },
  viewDashboardTxt: {
    fontWeight: "500",
    fontSize: 16,
    textAlign: 'center',
  },
  languageText: {
    fontSize: 16,
    fontWeight: '500'
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
    marginTop: '5%',
    marginLeft: '5%'
  },
  label: {
    flex: 1,
    backgroundColor: '#d9d9d9',
    paddingTop: '5%',
    paddingBottom: '5%',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 50,
    marginLeft: -20,
  },
  activeLabel: {
    backgroundColor: '#407bff',
    position: 'relative',

  },
  inactiveLabel: {
    backgroundColor: '#d9d9d9',
    position: 'relative',
    zIndex: -1
  },
  activeIndex: {
    zIndex: 1
  },
  inActiveIndex: {
    zIndex: -1
  },
  activeMode: {
    backgroundColor: '#407bff',
  },
  inactiveMode: {
    backgroundColor: '#d9d9d9',

  },
  labelText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,

  },
  modeContainer: {
    marginTop: '5%',
    marginBottom: "5%"
  },
  signOut: {
    marginTop: '5%',
    marginBottom: '5%'
  },
  signOuttxt: {
    fontWeight: '500',
    fontSize: 17,
    color: '#407bff'
  },
  profileMore: {
    marginTop: '4%'
  },
  moreDetail: {
    flexDirection: "row",
    alignItems: 'center',
    gap: 10,
    marginBottom: '4%'
  },
  txtdetail: {
    fontSize: 16,
    fontWeight: '500'
  }
})
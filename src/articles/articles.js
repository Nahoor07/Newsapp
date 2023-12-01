import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import thumbnail from '../../assets/images/newimg.png'
import { AntDesign, MaterialCommunityIcons, FontAwesome5, Ionicons } from 'react-native-vector-icons';
import { BASE_URL } from '@env';
import { useNavigation } from '@react-navigation/core';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import Header from '../partials/header';
import { SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';


export default function AllArticles() {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [iconColor, setIconColor] = useState('#c1c1c1');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
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
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);


  const toggleModal = (itemId) => {
    setModalVisible(!isModalVisible);

  };
  const togglePlayPause = async (itemId) => {
    if (currentAudio) {
      if (isPlaying) {
        await currentAudio.pauseAsync();
      } else {
        await currentAudio.playAsync();
      }
      setIsPlaying(!isPlaying);
    } else {
      // Load and play audio if it's not loaded
      handleVoice(itemId);
    }
    console.log('Toggle play/pause for Item ID:', itemId);
  };
  const dataArticles = async () => {
    let apiUrl = `${BASE_URL}api/front/get/all-articles`;
    if (apiUrl[4] === 's') {
      apiUrl = apiUrl.slice(0, 4) + apiUrl.slice(4 + 1);
    }

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setData(data?.articles);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dataArticles()
  }, []);
  const handleVoice = async (itemId) => {
    if (isModalVisible) {
      let apiUrl = `${BASE_URL}api/translate/${itemId}/title`;
      if (apiUrl[4] === 's') {
        apiUrl = apiUrl.slice(0, 4) + apiUrl.slice(4 + 1);
      }

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        if (isModalVisible) {
          setAudioUrl(data?.path);
          setIsPlaying(true); // Ensure audio starts from the beginning.
          setIconColor('#407BFF'); // Set the icon color to playing.
        }
      } catch (error) {
        console.log(error);
      }
    }
  };



  useEffect(() => {
    if (audioUrl) {
      (async () => {
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: isPlaying }
        );

        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
        });

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setCurrentTime(status.positionMillis / 1000);
            setDuration(status.durationMillis / 1000);
          }

          if (status.didJustFinish && !status.isLooping) {
            setIsPlaying(false);
          }
        });

        if (isPlaying) {
          await sound.playAsync();
        } else {
          await sound.pauseAsync();
        }

        setCurrentAudio(sound);
      })();
    }
  }, [audioUrl, isPlaying]);
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };


  useEffect(() => {
    if (audioUrl) {
    }
  }, [audioUrl]);

  useEffect(() => {
  }, [audioUrl])

  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
  const speakText = (text) => {
    Speech.speak(text, {
      language: 'en',
      rate: 0.8,
    });
  };

  return (
    <ScrollView style={[styles.scrollContainer, mode === 'dark' && styles.darkContainer]}>
      <Header />
      <View style={styles.container}>

        {data && data.length > 0 && data.map((item, index) => (
          <View key={index}>
            <View style={styles.articleContainer}>
              <Image source={{ uri: item?.bg_image }} style={styles.articleImg} />
              <View style={styles.articledetails}>
                <TouchableOpacity onPress={() => navigation.navigate('ArticleDetail', { id: item.id })}>
                  <Text style={[styles.typetxt, mode === 'dark' && styles.darkText]}>{item?.newspaper_title}</Text>
                  <Text style={[styles.articletitle, mode === 'dark' && styles.darkText]}>{item?.title}</Text>
                </TouchableOpacity>
                <View style={styles.articleFooter}>

                  <Text style={[styles.timestramp, mode === 'dark' && styles.darkText]}>{formatDate(item?.created_at)}</Text>
                  <View style={styles.latestNewsIcons}>
                    <TouchableOpacity onPress={() => speakText(item.title)}>
                      <AntDesign name="sound" size={25} color="#407BFF" />
                    </TouchableOpacity>

                    <MaterialCommunityIcons name="bookmark-plus-outline" size={25} color="#407BFF" />
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.hairline} />
            <Modal
              animationType="slide"
              transparent={true}
              visible={isModalVisible}
              onRequestClose={toggleModal}
            >
              <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                  <TouchableOpacity onPress={toggleModal}>
                    <MaterialCommunityIcons name="close" size={25} color="#407BFF" />
                  </TouchableOpacity>
                  <View style={styles.audioPlayerContainer}>
                    <Slider
                      style={{ width: '100%', height: 40 }}
                      minimumValue={0}
                      maximumValue={duration}
                      value={currentTime}
                      minimumTrackTintColor="#407BFF"
                      maximumTrackTintColor="#D9D9D9"
                      onSlidingComplete={(value) => setCurrentAudio && setCurrentAudio.setStatusAsync({ positionMillis: value * 1000 })}
                    />
                    <View style={styles.musicController}>
                      <Text style={styles.startTxt}>{formatTime(currentTime)}</Text>
                      <FontAwesome5 name='step-backward' size={20} color='#000' />
                      <TouchableOpacity onPress={() => togglePlayPause(item?.id)}>
                        {isPlaying ? (
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="pause" size={25} color="#000" />
                          </View>
                        ) : (
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome5 name="play" size={25} color="#407BFF" />
                          </View>
                        )}
                      </TouchableOpacity>

                      <FontAwesome5 name='step-forward' size={20} color='#000' />
                      <Text style={styles.endText}>{formatTime(duration)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
          </View>

        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: "3%"
  },
  container: {
    marginRight: "7%",
    marginLeft: "2%",
    marginBottom: '6%',
    marginTop: "1%",
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
  articleContainer: {
    flexDirection: "row",
    marginTop: "5%",
    marginLeft: "4%",
    marginRight: "5%",
    gap: 10,
    alignItems: "center",
    marginBottom: "5%"
  },
  articleImg: {
    width: 100,
    height: 100,
    borderRadius: 10,
    objectFit: "cover"
  },
  articledetails: {
    flexDirection: 'column',
    width: "70%"

  },
  articleFooter: {
    marginTop: "5%",
    flexDirection: "row",
    justifyContent: 'space-between'
  },
  latestNewsIcons: {
    flexDirection: "row",
    gap: 8,
  },
  typetxt: {
    color: "#666666",
    fontWeight: "500",
    fontSize: 14,
  },
  articletitle: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "400"
  }, timestramp: {
    color: '#666666',
    fontSize: 14,
  },
  hairline: {
    backgroundColor: '#D3D3D3',
    height: 1,
    width: '100%',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: "90%",
    marginBottom: "5%"
  },
  audioPlayerContainer: {
    padding: '4%',
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  musicController: {
    marginTop: "4%",
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  endText: {
    color: "#a7a7a7",
    fontSize: 16,
    fontWeight: '500'
  },
  startTxt: {
    color: "#407BFF",
    fontSize: 16,
    fontWeight: '500'
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  darkText: {
    color: '#fff',
  },
})
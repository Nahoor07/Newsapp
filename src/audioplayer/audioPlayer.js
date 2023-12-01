import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { FontAwesome5 } from "@expo/vector-icons"
import { Ionicons } from '@expo/vector-icons';
import { BASE_URL } from '@env';


const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
  
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
  
    return `${formattedMinutes}:${formattedSeconds}`;
  };

const AudioPlayer = ({ id }) => { 
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState('');
    
    const handleVoice = async () => {
      
            
            let apiUrl = `${BASE_URL}api/translate/${id}/description`;

            if (apiUrl[4] === 's') {
                apiUrl = apiUrl.slice(0, 4) + apiUrl.slice(4 + 1);
            }
    
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
    
                
                setAudioUrl(data?.path);
                    // setIsPlaying(true); 
                    // setIconColor('#407BFF');
              
            } catch (error) {
                console.log(error);
            }
      
    };
    useEffect(()=>{
        handleVoice()
    },[])
  
    const playPause = async () => {
        if (sound) {
          if (isPlaying) {
            await sound.pauseAsync();
          } else {
            await sound.playAsync();
          }
          setIsPlaying(!isPlaying);
        }
      };
    
      const skipBackward = async () => {
        if (sound) {
          const newPosition = Math.max(position - 5000, 0);
          await sound.setPositionAsync(newPosition);
          setPosition(newPosition);
        }
      };
    
      const skipForward = async () => {
        if (sound) {
          const newPosition = Math.min(position + 5000, duration);
          await sound.setPositionAsync(newPosition);
          setPosition(newPosition);
        }
      };
    
      useEffect(() => {
        async function loadAudio() {
          const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
          setSound(sound);
    
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.isPlaying) {
              setPosition(status.positionMillis);
            }
          });
    
          const status = await sound.getStatusAsync();
    
          setDuration(status.durationMillis);
        }
    
        loadAudio();
    
        return () => {
          if (sound) {
            sound.unloadAsync();
          }
        };
      }, [audioUrl]);
    
    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <View style={styles.audioPlayerContainer}>
             <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        minimumTrackTintColor="#407BFF"
        maximumTrackTintColor="#D9D9D9"
         onSlidingComplete={skipForward}
      />
            <View style={styles.musicController}>
         <Text style={styles.startTxt}>{formatTime(position)}</Text> 
      <TouchableOpacity onPress={skipBackward}>
          <FontAwesome5 name="step-backward" size={20} color="#000" />
        </TouchableOpacity> 
         <TouchableOpacity onPress={playPause}>
          {isPlaying ? (
            <FontAwesome5 name="pause" size={25} color="#000" />
          ) : (
            <FontAwesome5 name="play" size={25} color="#407BFF" />
          )}
        </TouchableOpacity> 
         <TouchableOpacity onPress={skipForward}>
          <FontAwesome5 name="step-forward" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.endText}>{formatTime(duration)}</Text>
      </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
    }


});

export default AudioPlayer;
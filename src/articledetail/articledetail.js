import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Image } from 'react-native';
import Cover from '../../assets/images/madrid.jpg';
import Profile from '../../assets/images/profile.jpg';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { BASE_URL } from '@env';
import AudioPlayer from '../audioplayer/audioPlayer';
import { Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
let arr = []



export default function Articledetail() {
    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route?.params;
    const [isPlaying, setIsPlaying] = useState(false);
    const [showPlayer, setShowPlayer] = useState()
    const [data, setData] = useState();
    const [toggleReRender, setToggleReRender] = useState();

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
        setShowPlayer(true)
    };
    const articleData = () => {
        const apiUrl = BASE_URL + 'api/front/news-detail/' + id;

        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
            })
            .catch((error) => {
                console.log(error)
            });
    }

    useEffect(() => {
        articleData();
    }, [])
    const shareContent = () => {
        const uniqueLink = data?.title;

        Share.share({
            message: `Check out this awesome content: ${uniqueLink}`,
        })
            .then(result => {
                if (result.action === Share.sharedAction) {
                    // Content shared successfully
                } else if (result.action === Share.dismissedAction) {
                    // Share dialog dismissed
                }
            })
            .catch(error => console.error('Error sharing content:', error));
    };
    const handleBookmark = async (id) => {
        try {
            let token = await AsyncStorage.getItem('token');
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(`${BASE_URL}api/favourite/newspaper/${id}`, config);

            if (response.data.status === 'Success') {
                if (arr.indexOf(id) === -1) {
                    arr.push(id);
                } else {
                    arr.splice(arr.indexOf(id), 1);
                }

                setToggleReRender(Math.random());

            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Image source={{ uri: data?.bg_image }} style={styles.header} resizeMode='cover' />
                    <View style={styles.overlay} />
                    <View style={styles.headerIcons}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
                            <MaterialIcons
                                name="arrow-back"
                                size={24}
                                color="#fff"
                            />
                        </TouchableOpacity>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity onPress={() => handleBookmark(data?.id)}>
                                <MaterialCommunityIcons name={arr.indexOf(data?.id) == -1 ? 'bookmark-plus-outline' : 'bookmark-plus'} size={25} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={shareContent}>
                                <MaterialIcons name="share" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.imageText}>{data?.title}</Text>
                    </View>
                </View>
                <View style={styles.profileContainer}>
                    <Image source={{ uri: data?.image }} style={styles.profileImg} resizeMode="cover" />
                    <View style={styles.dateContainer}>
                        <Text style={styles.profileTxt}>{data?.journalist}</Text>
                        <Text style={styles.timestramp}>9th October 2022</Text>
                    </View>
                    <View style={styles.eyeContainer}>
                        <Ionicons
                            name="eye-outline"
                            size={24}
                            color="#7d7e80"
                        />
                        <Text style={styles.viewTxt}>{data?.views}</Text>
                    </View>
                    <View style={styles.listenContainer}>
                        <TouchableOpacity onPress={togglePlayPause}>
                            {isPlaying ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="pause-circle" size={25} color="#407BFF" />
                                    <Text style={styles.listenTxt}>Playing</Text>
                                </View>
                            ) : (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="play-circle" size={25} color="#407BFF" />
                                    <Text style={styles.listenTxt}>Listen</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={styles.articleTxtContainer}>
                    <Text>{data?.desc}</Text>
                </View>
                {showPlayer && (
                    <View style={styles.articleTxtContainer}>
                        <AudioPlayer id={data?.id} />
                    </View>
                )}

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        width: '100%',
        height: 250,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    headerContainer: {
        position: "relative",
    },
    headerIcons: {
        top: '40%',
        position: 'absolute',
        left: '10%',
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'space-between'
    },
    iconContainer: {
        flexDirection: "row",
        gap: 10,
    },
    textContainer: {
        position: 'absolute',
        bottom: 35,
        left: 20,
        padding: 5,
        borderRadius: 5,
    },
    imageText: {
        color: '#fff',
        fontSize: 16,
    },
    profileContainer: {
        marginLeft: '5%',
        marginRight: '5%',
        marginTop: '6%',
        flexDirection: 'row',
        gap: 7,
    },
    profileImg: {
        width: 50,
        height: 50,
        borderRadius: 40,
    },
    profileTxt: {
        fontSize: 16,
        fontWeight: '500',
    },
    dateContainer: {
        flexDirection: 'column',
        gap: 5,
    },
    timestramp: {
        fontWeight: '400',
        fontSize: 15,
        color: '#7d7e80',
    },
    eyeContainer: {
        flexDirection: 'row',
    },
    viewTxt: {
        fontSize: 15,
        fontWeight: '400',
        color: '#7d7e80',
        marginTop: '5%',
        marginLeft: '5%'
    },
    listenContainer: {
        flexDirection: 'row',
    },
    listenTxt: {
        color: '#407BFF',
        fontSize: 15,
        marginLeft: '5%',
    },
    articleTxtContainer: {
        justifyContent: 'center',
        marginLeft: '5%',
        marginRight: '5%',
        marginTop: '4%'
    }
});

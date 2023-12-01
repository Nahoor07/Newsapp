import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import Swiper from 'react-native-swiper';
import { AntDesign, MaterialCommunityIcons } from 'react-native-vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { BASE_URL } from '@env';
import { FlashList } from "@shopify/flash-list";
import { format } from 'date-fns';
import { parseISO } from 'date-fns';
import { Audio } from 'expo-av';
import axios from 'axios';
import AllHeader from '../newsdetail/allheader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Cover from '../../assets/images/cover.jpg'
import Profile from '../../assets/images/dummy.jpg'
import ArticleNews from './articleNews';

const RenderLatestNews = ({ item }) => {

    const [iconColor, setIconColor] = useState('#c1c1c1');
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioUrl, setAudioUrl] = useState();
    const [sound, setSound] = useState(null);
    const [voices, setVoices] = useState(null);

    // const timestamp = item?.created_at;
    // const parsedTimestamp = parseISO(timestamp);
    // const formattedTimestamp = format(parsedTimestamp, "do MMMM yyyy");

    const handleVoice = async () => {
        const apiUrl = `${BASE_URL}api/translate/${item?.id}/title`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('data =>>>>>>>>>>>>>', data?.path);
            setAudioUrl(data?.path);
            setIsPlaying(!isPlaying);
            setIconColor(iconColor === '#c1c1c1' ? '#407BFF' : '#c1c1c1');
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (audioUrl) {
            (async () => {
                const { sound } = await Audio.Sound.createAsync(
                    { uri: audioUrl },
                    { shouldPlay: true }
                );

                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                })
                sound.playAsync();
            })();
        }
    }, [audioUrl, isPlaying]);

    return (
        <>
            <View style={styles.latestNews}>
                <Image source={{ uri: item?.image }} style={styles.newsImg} />
                <View style={styles.articleTextContainer}>
                    <Text style={styles.articletxt}>
                        {item?.name}
                    </Text>
                    <View style={styles.containerTime}>
                        <Text style={styles.timestramp}>{item?.date}</Text>
                        <View style={styles.latestNewsIcons}>
                            <TouchableOpacity onPress={() => handleVoice()}>
                                <AntDesign name="sound" size={25} color={iconColor} />
                            </TouchableOpacity>
                            <MaterialCommunityIcons name="bookmark-plus-outline" size={25} color="#407BFF" />
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.hairline} />
        </>
    );
}

export default function NewspaperInfo() {
    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route?.params;
    const [data, setData] = useState();
    const [imageIndex, setImageIndex] = useState(0);
    const handleCurrentIndex = (index) => {
        setImageIndex(index)
    }
    const newspaperData = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            let apiUrl = BASE_URL + 'api/front/newspaper/detail/page/' + id;

            if (apiUrl[4] === 's') {
                apiUrl = apiUrl.slice(0, 4) + apiUrl.slice(4 + 1);
            }

            const response = await axios.get(apiUrl, config);
            setData(response.data);
        } catch (error) {
            console.log(error);
            // Handle the error in an appropriate way, e.g., show an error message to the user.
        }
    };


    useEffect(() => {
        newspaperData();
    }, []);



    return (
        <ScrollView style={styles.container}>
            <AllHeader data={data} />
            <View style={styles.breakingNews}>
            </View>

            {useMemo(() => (
                <>
                    {data?.sliders && data.sliders.length > 0 && data.sliders ? (
                        <View style={{ height: 250 }}>
                            <Swiper onIndexChanged={(index) => handleCurrentIndex(index)} showsButtons={false} showsPagination={false}>
                                {data.sliders.map((item, index) => (
                                    <TouchableOpacity activeOpacity={0.7} style={styles.slideContainer} key={index} onPress={() => navigation.navigate('ArticleDetail', { id: item.id })}>
                                        <Image
                                            source={{
                                                uri: item.bg_img
                                            }}
                                            style={styles.sportsImage}
                                            resizeMode="cover"
                                        />
                                        <View style={styles.overlay} />
                                        <Text style={styles.slideText}>{item.title}</Text>
                                    </TouchableOpacity>
                                ))}
                            </Swiper>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.slideContainer}>
                            <Image
                                source={Cover}
                                style={styles.dummysportsImage}
                                resizeMode="cover"
                            />
                            <View style={styles.overlay} />
                            <Text style={styles.slideText}>No slider upload</Text>
                        </TouchableOpacity>
                    )}
                </>
            ), [data?.sliders])}



            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', gap: 15, marginTop: 16 }}>
                {Array(data?.sliders?.length).fill(undefined)?.map((_, index) => (
                    <View style={[styles.sliderDot, imageIndex === index ? { backgroundColor: '#407BFF' } : {}]} key={index} />
                ))}
            </View>
            <ArticleNews data={data} />
            <View style={styles.latestNewsContainer}>
                <View style={styles.newsContainer}>
                    <Text style={styles.breakingHeading}>Article Lists</Text>
                    <Text style={styles.seeMoreTxt}> See More</Text>
                </View>
                {data?.articles_lists && data.articles_lists.length > 0 ? (
                    <View style={{ height: 250 }}>
                        <FlashList
                            data={data.articles_lists}
                            renderItem={({ item }) => <RenderLatestNews item={item} />}
                            estimatedItemSize={200}
                        />
                    </View>
                ) : (
                    <View style={styles.latestNews}>
                        <Image source={Profile} style={styles.dummynewsImg} />
                        <View style={styles.articleTextContainer}>
                            <Text style={styles.articletxt}>
                                No article
                            </Text>
                            <View style={styles.containerTime}>
                                <Text style={styles.timestramp}>date</Text>
                                <View style={styles.latestNewsIcons}>
                                    <TouchableOpacity>
                                        <AntDesign name="sound" size={25} color='#407BFF' />
                                    </TouchableOpacity>
                                    <MaterialCommunityIcons name="bookmark-plus-outline" size={25} color="#407BFF" />
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </View>
            <View style={styles.popularNewsContainer}>
                <View style={styles.newsContainer}>
                    <Text style={styles.breakingHeading}>Popular Writers</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Popular Writer')}>

                        <Text style={styles.seeMoreTxt}>See more </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.writersContainer}>
                    {data?.popular_journalists && data.popular_journalists.length > 0 ? (
                        data.popular_journalists.slice(0, 3).map((item, index) => (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Writer', { id: item?.id })}
                                style={styles.writerView}
                                key={index}
                            >
                                <Image source={{ uri: item?.image }} style={styles.profileImg} resizeMode='cover' />
                                <Text style={styles.title}>{item?.name}</Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.dummytxt}>Popular Writers are coming</Text>
                    )}
                </View>

            </View>
            <View style={styles.latestNewsContainer}>
                <Text style={styles.breakingHeading}>Explore Articles by Categories</Text>
                <ScrollView horizontal={true}>
                    {data?.categories && data.categories.length > 0 ? (
                        data.categories.map((item, index) => (
                            <View key={index} style={[styles.card, { marginRight: 10, marginBottom: 10, marginTop: 10 }]}>
                                <Image source={{ uri: item?.image }} style={styles.teamimg} />
                                <Text style={styles.teamtxt}>{item?.name}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.dummytxt}>No data found</Text>
                    )}

                </ScrollView>
            </View>



        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,


    },
    breakingNews: {
        marginTop: '10%',
        marginLeft: "5%",
        marginRight: "5%"
    },
    breakingHeading: {
        fontWeight: '800',
        fontSize: 18,
    },
    slide1: {
        flex: 1,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    slide2: {
        flex: 1,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
    },
    slide3: {
        flex: 1,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    sliderDot: {
        width: 8,
        height: 8,
        borderRadius: 50,
        backgroundColor: '#D9D9D9',
    },
    latestNewsContainer: {
        marginTop: '15%',
        marginLeft: '5%',
        marginRight: '5%'
    },
    popularNewsContainer: {
        marginLeft: '5%',
        marginRight: '5%'
    },
    latestNews: {
        flexDirection: 'row',
        marginTop: '5%',
        gap: 18,
        marginBottom: "5%"
    },
    newsImg: {
        width: 90,
        height: 70,
        borderRadius: 10,
    },
    dummynewsImg: {
        width: 90,
        height: 70,
        backgroundColor: 'grey'
    },
    articleTextContainer: {
        width: '70%',
    },
    articletxt: {
        fontWeight: '500',
        fontSize: 15,
    },
    timestramp: {
        marginTop: '4%',
        fontWeight: '400',
        color: '#7d7e80',
    },
    containerTime: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    latestNewsIcons: {
        flexDirection: 'row',
        gap: 5,
    },
    hairline: {
        backgroundColor: '#D3D3D3',
        height: 1,
        width: '100%',
    },
    sportContainer: {
        marginTop: '5%'
    },
    newsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    seeMoreTxt: {
        fontSize: 16,
        color: '#407BFF'
    },
    slideContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        height: 200,
        marginLeft: '5%',
        marginRight: "5%"

    },

    slideText: {
        color: '#fff',
        fontSize: 16,
        bottom: 20,
        marginLeft: '8%',
        position: "absolute"
    },
    sportSliderContainer: {
        marginTop: '5%'
    },
    sportsImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    dummysportsImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
    },
    noDataText: {
        textAlign: 'center',
        marginTop: '5%',
        marginBottom: "5%",
        fontWeight: '400'
    },
    writersContainer: {
        flexDirection: "row",
        gap: 30,
        marginTop: '4%',
        justifyContent: 'center'

    },
    writerView: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "column",
        gap: 8,
    },
    dummytxt: {
        fontSize: 15,
        fontWeight: '500'
    },
    card: {
        width: 100,
        height: 100,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
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
    teamimg: {
        width: 70,
        height: 70,
        resizeMode: 'cover'
    },
    teamtxt: {
        marginTop: "2%",
        fontSize: 14,
    }
});

import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import thumbnail from '../../assets/images/newimg.png'
import { BASE_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons"

export default function SavedArticle() {
    const navigation = useNavigation();
    const [data, setData] = useState();
    const [toggleReRender, setToggleReRender] = useState();
let arr=[]
    const retrieveNewspaper = async () => {
        try {
            let token = await AsyncStorage.getItem('token');
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            };
            const response = await axios.get(`${BASE_URL}api/favourite/news`, config);

            if (response.data) {
                setData(response.data);
                console.log('savedresponse ::', response.data)

            } else {
                console.log('Network not ok');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        retrieveNewspaper();
    }, []);

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
            const response = await axios.get(`${BASE_URL}api/favourite/news/${id}`, config);

            if (response.data.status === 'Success') {
                if (arr.indexOf(id) === -1) {
                    arr.push(id);
                } else {
                    arr.splice(arr.indexOf(id), 1);
                }

                setToggleReRender(Math.random());

                console.log('udpated array ========>', arr);
            }
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <View style={styles.container}>
            {data ? (
                data.map((item, index) => (
                    <View key={index}>
                        <View style={styles.latestNews}>
                            <Image source={{ uri: item?.image }} style={styles.newsImg} />
                            <View style={styles.articleTextContainer}>
                                <Text style={styles.articletxt}>{item?.title}</Text>
                                <View style={styles.containerTime}>
                                    <Text style={styles.timestramp}>{item?.date}</Text>
                                    <View style={styles.latestNewsIcons}>
                                        <TouchableOpacity onPress={() => handleVoice(item)}>
                                            <AntDesign name="sound" size={25} color={item.iconColor} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleBookmark(item?.id)}>
                                            <MaterialCommunityIcons name={arr.indexOf(item?.id) == -1 ? 'bookmark-plus-outline' : 'bookmark-plus'} size={25} color="#407BFF" />
                                        </TouchableOpacity>          
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.hairline} />
                    </View>))
            ) : (
                <View>
                    <Text>No data available</Text>
                </View>
            )}


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 4,
        marginTop: "10%"

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
    thumbnailImg: {
        width: 100,
        height: 100,
        borderRadius: 8,
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
});

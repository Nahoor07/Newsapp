import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"
import Thumbnail from '../../assets/images/newimg.png'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '@env';


let arr = []

export default function AllHeader({ data }) {
    console.log('data', data?.newspaper?.newspaper?.id)
    const [toggleReRender, setToggleReRender] = useState();

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

                console.log('udpated array ========>', arr);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backicon} onPress={() => navigation.navigate('Home')}>
                <Feather name='arrow-left' size={25} color='#407BFF' />
            </TouchableOpacity>
            <View style={styles.profileDetail}>
                <Image source={{ uri: data?.newspaper?.newspaper?.image }} style={styles.imgthumbnail} />
                <Text style={styles.title}>
                    {data?.newspaper?.newspaper?.title.length > 10
                        ? data?.newspaper?.newspaper?.title.slice(0, 10) + '...'
                        : data?.newspaper?.newspaper?.title}
                </Text>
            </View>
            <TouchableOpacity onPress={() => handleBookmark(data?.newspaper?.newspaper?.id)}>
                <MaterialCommunityIcons name={arr.indexOf(data?.newspaper?.newspaper?.id) == -1 ? 'bookmark-plus-outline' : 'bookmark-plus'} size={25} color="#407BFF" style={styles.bookmarkicon} />
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {

        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        height: 70,
        alignItems: "center"
    },
    backicon: {
        marginLeft: "5%",

    },
    imgthumbnail: {
        width: 32,
        height: 25,
        borderRadius: 2,

    },
    title: {
        fontSize: 18,
        fontWeight: '800'
    },
    profileDetail: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center"
    },
    bookmarkicon: {
        marginRight: "2%",
    }
})
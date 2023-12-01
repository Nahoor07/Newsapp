import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import thumbnail from '../../assets/images/newimg.png'
import { BASE_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function SavedNewspaper() {
    const navigation = useNavigation();
    const [data, setData] = useState();
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
            const response = await axios.get(`${BASE_URL}api/favourite/newspapers`, config);

            if (response.data && response.data.data && response.data.data.newspapers_favourite) {
                const newspapersFavourite = response.data.data.newspapers_favourite;
                setData(newspapersFavourite);
            } else {
                console.log('Response structure is not as expected:', response);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        retrieveNewspaper();
    }, []);


    return (
        <View style={styles.container}>
            <View style={styles.cardsContainer}>
                {Array.isArray(data) &&
                    data.slice(0, 3).map((item, index) => (
                        <TouchableOpacity style={styles.cardView} key={index} onPress={() => navigation.navigate('NewsInfo', { id: item?.id })}>
                            <View style={styles.card}>
                                <Image
                                    source={{ uri: item?.image }}
                                    style={styles.thumbnailImg}
                                    resizeMode="cover"
                                />
                            </View>
                            <Text style={styles.cardtxt}>
                                {item?.title.length > 10 ? item?.title.slice(0, 8) + '...' : item?.title}
                            </Text>

                        </TouchableOpacity>
                    ))}

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 4,
        marginTop: "10%"

    },
    cardsContainer: {
        flexDirection: 'row',
        marginLeft: '4%',
        marginRight: '4%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    card: {
      
        marginHorizontal: '2%',
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    thumbnailImg: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    cardView: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#fff'
    },
    cardtxt: {
        fontWeight: '500',
        fontSize: 15,
        marginTop: 8,
        textAlign: 'center',
    },
});

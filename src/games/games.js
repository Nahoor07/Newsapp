import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import thumbnail from '../../assets/images/newimg.png'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '@env';


export default function Games() {
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
            const response = await axios.get(`${BASE_URL}api/games`, config);

            if (response == 200)
                setData(response.data);
            console.log('Response ::', response?.data);
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
                {Array.isArray(data) && data.length > 0 ? (
                    data.map((game, index) => (
                        <View style={styles.cardView} key={index}>
                            <View style={styles.card}>
                                <Image source={game.thumbnail} style={styles.thumbnailImg} resizeMode='cover' />
                            </View>
                            <Text style={styles.cardtxt}>{game.name}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noGamesText}>You have no games yet.</Text>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: "15%"
    },
    cardsContainer: {
        flexDirection: 'row',
        marginLeft: '4%',
        marginRight: "4%",
        alignItems: 'center',
        gap: 4,
        justifyContent: "center"
    },
    card: {
        flex: 1,
        marginHorizontal: '1%',
        justifyContent: 'center',
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
        alignSelf: "center",
        objectFit: "contain"
    },
    cardView: {
        flexDirection: "column",
        gap: 4,
    },

    cardtxt: {
        fontWeight: "500",
        fontSize: 15,
        marginTop: '40%',
        marginLeft: "15%"
    },
    noGamesText: {
        flex: 1,
        textAlign: 'center',
        marginTop: '30%',
        fontSize:16,
        fontWeight:'600'
    }

})
import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TechRadar from "../../assets/images/TechRadar.png"
import AsyncStorage from '@react-native-async-storage/async-storage'
import Bloomberg from "../../assets/images/Bloomberg.png"
import axios from 'axios'
import { BASE_URL } from '@env';
import { format, parseISO } from 'date-fns';
import { TouchableOpacity } from 'react-native-gesture-handler'
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'




export default function Notification() {
    const navigation = useNavigation();
    const [data, setData] = useState();
    const [notification, setNotification] = useState();
    const [markRead, setMarkRead] = useState(false);

    const getNotification = async () => {

        try {
            let token = await AsyncStorage.getItem('token');
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            };

            const response = await axios.get(`${BASE_URL}api/notifications`, config);
            setData(response.data?.data);
            console.log('notifications',response.data?.data)


        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getNotification();
    }, [])

    const handleReadNotification = async () => {
        try {
            setMarkRead(true);
            let token = await AsyncStorage.getItem('token');
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            };
            const response = await axios.get(`${BASE_URL}api/notifications/all/read`, config);
            setNotification(response?.data)
          

        } catch (error) {
            console.error(error);
        }

    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.notificationHeader}>
                <View style={styles.notiview}>
                    <TouchableOpacity onPress={()=>navigation.navigate("Home")}>
                    <FontAwesome name='long-arrow-left' size={25} color='#407BFF'/>
                    </TouchableOpacity>                 
                    <Text style={styles.notificationTitle}>Notifications</Text>
                </View>
                <TouchableOpacity onPress={() => handleReadNotification()}><Text style={styles.readMsg}>Mark all as read</Text></TouchableOpacity>
            </View>
            <View style={styles.hairline} />
            {data && data.length > 0 ? (
                data.map((item, index) => (
                    <View key={index}>
                        <View style={[styles.notificationContainer, markRead ? { backgroundColor: '#fff' } : {}]}>
                            <Image source={{uri:item?.image}}  style={styles.img}/>
                            <View style={styles.notificationTxtContainer}>
                                <Text style={styles.notificationTxt}>
                                    {item?.title}
                                </Text>
                                <Text style={styles.timestamp}>
                                    {format(parseISO(item?.created_at), "MMM dd, yyyy 'at' hh:mma")}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.hairline} />
                    </View>
                ))
            ) : (
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center', flex: 1
                }}>
                    <Text style={styles.notificationtxt}>You Have got no notification</Text>
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',

    },
    notificationHeader: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: 10,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: "6%",
        paddingTop: "3%"
    },
    notiview:{
        flexDirection:"row",
        alignItems:'center',
        gap:10,

    },
    notificationTitle: {
        fontWeight: '800',
        fontSize: 20,
        letterSpacing: 1,
    },
    readMsg: {
        textDecorationLine: "underline",
        fontWeight: '500'
    },
    hairline: {
        backgroundColor: '#D3D3D3',
        height: 1,
        width: "100%",
    },
    notificationContainer: {
        padding: "10%",
        paddingBottom: "7%",
        flexDirection: 'row',
        backgroundColor: '#f9fbff'

    },
    notificationTxtContainer: {
        marginLeft: '5%',
        marginRight: '10%',
        flexDirection: "column"
    },
    notificationTxt: {
        fontWeight: '500',
        paddingRight: '10%',
    },
    timestamp: {
        marginTop: "10%",
        fontWeight: '400',
        color: "#7d7e80"
    },
    notificationtxt: {
        fontSize: 17,
        fontWeight: '500',

    },
    img:{
        width:60,
        height:60,
        objectFit:'cover',
    }
})
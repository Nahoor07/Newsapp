import { StyleSheet, Text, View,Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { TouchableOpacity } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Topics from './topics'
import Layout from '../../utils/layout'
import { BASE_URL } from '@env';
import { useNavigation, useRoute } from '@react-navigation/native';


export default function Newsdetail() {
    const navigation = useNavigation();
    const route = useRoute();

    const {id} = route?.params;
    const [data,setData]=useState([]);

    const newsData = () =>{
        const apiUrl = BASE_URL + 'api/newspaper/' + id;

        fetch(apiUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            setData(data.data);
          })
          .catch((error) => {
            console.log(error)
          });
    }

    useEffect(()=>{
        newsData();
    },[])
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.dashboardContainer}>
                <View style={styles.customHeader}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')} >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color="#407BFF"
                        />
                    </TouchableOpacity>
                    <Image
                    source={{
                      uri: BASE_URL + 'storage/' + data?.newspaper_image
                    }}
                    style={styles.cardImg}
                  />   
                  </View>             
                <View style={styles.customHeader}>
                    <FontAwesome5
                        name="search"
                        size={24}
                        color="#407BFF"
                    />
                    <FontAwesome5
                        name="bars"
                        size={24}
                        color="#407BFF"
                    />

                </View>
            </View>
            <View style={styles.hairline} />
            <Topics data={data} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    dashboardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: 'white',
    },
    dashboardTitle: {
        fontWeight: '800',
        fontSize: 20,
        letterSpacing: 1,
        marginLeft: 5,
    },
    customHeader: {
        flexDirection: 'row',
        marginRight: 10,
        gap: 10,
    },
    hairline: {
        backgroundColor: '#D3D3D3',
        height: 1,
        width: "100%",

    },
    cardImg: {
        width: 60,
        height: 40,
      }
})
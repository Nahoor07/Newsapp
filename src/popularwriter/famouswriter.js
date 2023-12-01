import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '@env';
import { AntDesign } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
export default function Famouswriter() {
    const navigation = useNavigation();
    const [data, setData] = useState()
    const writerData = async () => {
        const apiUrl = `${BASE_URL}api/popular-writer`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setData(data?.data)
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        writerData()
    }, []);
    return (
        <SafeAreaView>
            <ScrollView style={styles.containerScroll}>
                <View style={styles.container}>
                    {data && data.length > 0 && data.map((item,index) => (
                        <View key={index}>
                            <TouchableOpacity onPress={()=>navigation.navigate('Writer',{id:item?.id})} style={styles.writerView}>
                                <Image source={{ uri: item?.image }} style={styles.profileImg} resizeMode='cover' />
                                <AntDesign name='pluscircle' color='#407BFF' size={20} style={styles.plusIcon} />                                
                                <Text style={styles.title}>{item?.name}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
   
    container:{
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent:"center",
        gap:10,
        marginTop:"6%",  
    },
    profileImg: {
        width: 80,
        height: 80,
        borderRadius: 50,
        objectFit: 'cover',
        position:"relative"
    },
    title: {
        fontWeight: '400',
    },
    
    writerView: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "column",
        gap: 8,
    },
    plusIcon: {
        position: 'absolute',
        top: 1, 
        right: 2,

    }
})
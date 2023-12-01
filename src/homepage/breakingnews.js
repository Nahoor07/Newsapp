import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native'
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Cover from '../../assets/images/newcover.jpeg'
import Swiper from 'react-native-swiper';
import { TouchableOpacity } from 'react-native';
import { BASE_URL } from '@env';

export default function Breakingnews() {
    const navigation = useNavigation();
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);


    const [imageIndex, setImageIndex] = useState(0);
    const handleCurrentIndex = (index) => {
        setImageIndex(index)
    }
    const sliderData = async () => {
        const apiUrl = `${BASE_URL}api/home-slider`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setData(data?.data);
            setLoading(false);


        } catch (error) {
            console.log(error);
            setLoading(false);

        }
    };
    useEffect(() => {
        sliderData()
    }, []);



    return (
        <View style={styles.breakingNewsContainer}>
            {loading ? (
                <ActivityIndicator size="large" color="#407BFF" style={styles.loader} />
            ) : data && data.length > 0 ? (
                <View style={{ height: 250 }}>
                    <Swiper onIndexChanged={(index) => handleCurrentIndex(index)} showsButtons={false} showsPagination={false}>
                        {data.map((item, index) => (
                            <TouchableOpacity activeOpacity={0.7} style={styles.slideContainer} key={index} onPress={() => navigation.navigate('ArticleDetail', { id: item.id })}>
                                <Image
                                    source={{
                                        uri: item?.bg_image[0]
                                    }}
                                    style={styles.sportsImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.overlay} />
                                <Text style={styles.slideText}>{item?.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </Swiper>
                </View>
            ) : (
                <Text style={styles.noDataText}>No data found.</Text>
            )}

            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', gap: 15, marginTop: 16 }}>
                {Array(data?.length).fill(undefined)?.map((_, index) => (
                    <View style={[styles.sliderDot, imageIndex === index ? { backgroundColor: '#407BFF' } : {}]} key={index} />
                ))}
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    slideContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        height: 200,

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
        position: 'relative'
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
    breakingNewsContainer: {
        paddingLeft: '4%',
        paddingRight: '4%',
        paddingTop: "5%"
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignSelf: 'center',
        marginTop: "10%"
    }
})
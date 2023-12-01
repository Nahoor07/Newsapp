import React, { useEffect, useRef, useState } from 'react';
import Carousel from 'react-native-snap-carousel';
import { View, Text, Image, StyleSheet } from 'react-native';
import Cover from '../../assets/images/newcover.jpeg'
import { BASE_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import { Touchable } from 'react-native';
import { TouchableOpacity } from 'react-native';



const ArticleNews = ({data}) => {
    const newData = data?.latest_articles;
    console.log(newData)
    const navigation = useNavigation();
    const _carousel = useRef(null);
    const _renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={styles.slide}
                key={index}
                onPress={() => navigation.navigate('ArticleDetail', { id: item?.id })}
            >
                <Image source={{ uri: item?.image }} resizeMode='cover' style={styles.image} />
                <Text style={styles.title}>{item?.name}</Text>
            </TouchableOpacity>
        );
    };

    const sliderWidth = 400;
    const itemWidth = 300;
    return (


        <View>
            <View style={styles.latestArticleView}>
                <Text style={styles.latestArticletxt}>Latest Articles</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Articles')}>
                    <Text style={styles.seemoretxt}>See more</Text>
                </TouchableOpacity>
            </View>

            {newData ? (
                <Carousel
                    ref={_carousel}
                    data={newData}
                    renderItem={_renderItem}
                    sliderWidth={sliderWidth}
                    itemWidth={itemWidth}
                />
            ) : (
                <View style={styles.dummylatestArticles}>
                    <Text >No Articles added yet</Text>
                </View>
            )}

        </View>

    );
};

const styles = StyleSheet.create({
    image: {
        width: 300,
        height: 100,
        objectFit: 'cover'
    },
    latestArticleView: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginRight: "7%",
        marginLeft: "5%",
        marginTop: "5%",
    },
    dummylatestArticles: {
        width: '70%',
        height: 100,
        borderWidth: 1,
        justifyContent: "center",
        alignSelf: "center",
        alignItems: "center"
    },
    latestArticletxt: {
        fontSize: 18,
        fontWeight: '600',
    },
    seemoretxt: {
        fontSize: 15,
        color: '#407BFF'
    },
    title: {
        marginTop: '5%',
        fontWeight: '400',
        lineHeight: 24,
        width: 200,
    }
})
export default ArticleNews;

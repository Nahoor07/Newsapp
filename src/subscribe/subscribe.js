import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import NewsImage from '../../assets/images/newimg.png';
import Bookmark from 'react-native-vector-icons/MaterialCommunityIcons';


export default function Subscribe() {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const toggleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };
    return (
        <View style={styles.container}>
            <View style={styles.cardContainer}>
                <View style={styles.rowContainer}>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Image source={NewsImage} />
                            <TouchableOpacity onPress={toggleBookmark}>
                                <Bookmark
                                    name={isBookmarked ? 'bookmark-plus' : 'bookmark-plus-outline'}
                                    size={30}
                                    color={isBookmarked ? 'blue' : 'black'}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.titleCard}>Alintibaha</Text>
                    </View>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Image source={NewsImage} />
                            <TouchableOpacity onPress={toggleBookmark}>
                                <Bookmark
                                    name={isBookmarked ? 'bookmark-plus' : 'bookmark-plus-outline'}
                                    size={30}
                                    color={isBookmarked ? 'blue' : 'black'}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.titleCard}>Alintibaha</Text>
                    </View>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Image source={NewsImage} />
                            <TouchableOpacity onPress={toggleBookmark}>
                                <Bookmark
                                    name={isBookmarked ? 'bookmark-plus' : 'bookmark-plus-outline'}
                                    size={30}
                                    color={isBookmarked ? 'blue' : 'black'}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.titleCard}>Alintibaha</Text>
                    </View>
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Image source={NewsImage} />
                            <TouchableOpacity onPress={toggleBookmark}>
                                <Bookmark
                                    name={isBookmarked ? 'bookmark-plus' : 'bookmark-plus-outline'}
                                    size={30}
                                    color={isBookmarked ? 'blue' : 'black'}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.titleCard}>Alintibaha</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
    },
    cardContainer: {
        marginTop: '8%',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    card: {
        flexBasis: '48%',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#D3D3D3',
        paddingTop: '8%',
        paddingBottom: '10%',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    titleCard: {
        fontWeight: '500',
        fontSize: 17,
        marginTop: '10%',
    },
})
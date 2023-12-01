import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import Vector from '../../assets/images/Vector.png'
import Statistics from './statistics';
import Articles from './articles';


export default function Dashboard() {
    const navigation = useNavigation();
    const [showStatistics, setShowStatistics] = useState(false);
    const [showArticles, setShowArticles] = useState(false);

    const toggleStatistics = () => {
        setShowStatistics(!showStatistics);
        setShowArticles(false);
    };
    const toggleArticles = () => {
        setShowArticles(!showArticles);
        setShowStatistics(false);
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.dashboardContainer}>
                <View style={styles.customHeader}>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')} >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color="#407BFF"
                        />
                    </TouchableOpacity>
                    <Text style={styles.dashboardTitle}>Dashboard</Text>
                </View>
                <View style={styles.customHeader}>
                    <FontAwesome5
                        name="search"
                        size={24}
                        color="#7f7f7f"
                    />
                </View>
            </View>
            <View style={styles.btnContent}>
                <View style={showStatistics ? styles.activeButton : styles.inactiveButton}>
                    <TouchableOpacity style={{ flexDirection: 'row' }} onPress={toggleStatistics} >
                        <Feather
                            name="bar-chart-2"
                            size={24}
                            color={showStatistics ? '#fff' : '#407BFF'} 
                        />
                        <Text
                            style={[
                                styles.stattxt,
                                showStatistics ? styles.activeText : styles.inactiveText,
                            ]}
                        >
                            Statistics
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={showArticles ? styles.activeButton : styles.inactiveButton}>
                    <TouchableOpacity style={{ flexDirection: 'row' }} onPress={toggleArticles} >
                        <Image source={Vector} />
                        <Text
                            style={[
                                styles.arttxt,
                                showArticles ? styles.activeText : styles.inactiveText,
                            ]}
                        >
                            Article
                        </Text>

                    </TouchableOpacity>
                </View>
                <View style={styles.createContainer}>
                    <TouchableOpacity style={styles.createRow} onPress={()=>navigation.navigate("Create")}>
                        <Ionicons
                            name="add-circle-outline"
                            size={24}
                            color="#407BFF"
                        />
                        <Text style={styles.arttxt}>Create</Text>
                    </TouchableOpacity>

                </View>
            </View>
            {showStatistics && <Statistics />}
            {showArticles && <Articles />}

        </SafeAreaView >
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
    },
    hairline: {
        backgroundColor: '#D3D3D3',
        height: 1,
        width: "100%",

    },
    buttonContainer: {
        flexDirection: 'row',
        paddingLeft: '5%',
        paddingRight: '5%',
        paddingTop: '5%',
        gap: 10,
    },
    statistics: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#407BFF',
        paddingTop: '4%',
        paddingBottom: "4%",
        paddingLeft: '2%',
        paddingRight: "2%",
        borderRadius: 15,
        width: '30%',
    },
    articles: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#407BFF',
        paddingTop: '4%',
        paddingBottom: "4%",
        paddingLeft: '2%',
        paddingRight: "2%",
        borderRadius: 15,
        width: '30%',
    },
    stattxt: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500"
    },
    arttxt: {
        color: "#407BFF",
        fontSize: 16,
        fontWeight: "500",
        marginLeft: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        paddingLeft: '5%',
        paddingRight: '5%',
        paddingTop: '5%',
        gap: 10,
    },
    activeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#407BFF',
        paddingTop: '4%',
        paddingBottom: '4%',
        paddingLeft: '2%',
        paddingRight: '2%',
        borderRadius: 15,
        width: '30%',
        color: 'white'
    },
    inactiveButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#407BFF',
        paddingTop: '4%',
        paddingBottom: '4%',
        paddingLeft: '2%',
        paddingRight: '2%',
        borderRadius: 15,
        width: '30%',

    },
    btnContent: {
        flexDirection: 'row',
        gap: 8,
        marginLeft: '5%'
    },
    activeText: {
        color: '#fff', // Text color when the button is active
        fontSize: 16,
        fontWeight: '500',
    },
    inactiveText: {
        color: '#407BFF', // Text color when the button is inactive
        fontSize: 16,
        fontWeight: '500',
    },
    createContainer: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: '#407BFF',
        paddingTop: '4%',
        paddingBottom: "4%",
        paddingLeft: '2%',
        paddingRight: "2%",
        borderRadius: 15,
        width: '30%',
    },
    createRow: {
        justifyContent: 'center',
        flexDirection: "row"
    }
})
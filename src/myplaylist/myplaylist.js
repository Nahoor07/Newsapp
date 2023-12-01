import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons';


export default function Myplaylist() {
    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.btncontainer}>
                    <TouchableOpacity style={styles.sportsbtn}>
                        <Text style={styles.sportstxt}>Sports</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.unselectbtn}>
                        <Text style={styles.unselecttxt}>News</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.unselectbtn}>
                        <Text style={styles.unselecttxt}>Technology</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.unselectbtn}>
                        <Text style={styles.unselecttxt}>Fashion</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.playallcontainer}>
                    <TouchableOpacity style={styles.playall}>
                        <FontAwesome5 name="play" size={20} color='#407BFF' />
                        <Text style={styles.playalltxt}>Play All</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: "4%"
    },
    btncontainer: {
        flexDirection: "row",
        gap: 10,
        justifyContent: 'center'
    },
    sportsbtn: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#407BFF",
        width: '23%',
        borderRadius: 4,

    },
    unselectbtn: {
        paddingTop: 10,
        paddingBottom: 10,
        borderColor: "#407BFF",
        width: '23%',
        borderRadius: 4,
        borderWidth: 1,

    },
    sportstxt: {
        fontWeight: '500',
        fontSize: 14,
        textAlign: 'center',
        color: "#fff"
    },
    unselecttxt: {
        fontWeight: '500',
        fontSize: 14,
        textAlign: 'center',
        color: "#407BFF"
    }, playall: {
        flexDirection: "row",
        gap: 10,
        backgroundColor: "#e2ebff",
        paddingTop: '5%',
        paddingBottom: "5%",
        width: '36%',
        borderRadius:24,
        justifyContent:'center'
    },
    playallcontainer: {
        marginTop: '5%',
        marginLeft: "3%",
    },
    playalltxt:{
        fontSize:14,
        fontWeight:'500'
    }
})
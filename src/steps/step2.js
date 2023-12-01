import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Step2MainImg } from '../../utils/svgs/steps/step2';
import Layout from '../../utils/layout';
import { ScrollView } from 'react-native-gesture-handler';

const Step2 = () => {
    const navigation = useNavigation();

    return (
        <Layout>
            <ScrollView>
                <View style={styles.main}>
                    <View style={{ marginTop: '48%', alignItems: 'center' }}>
                        <Step2MainImg />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.step1Title}>Start an online newspaper</Text>
                        <View style={styles.discView}>
                            <Text style={styles.discText}>Create your own online newspaper and start</Text>
                            <Text style={styles.discText}>publishing contents</Text>
                        </View>
                        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("Step3")}>
                            <Text style={styles.buttonText}>Get Started</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </Layout>
    )
}

export default Step2

const styles = StyleSheet.create({
    main: {
        flex: 1,
        marginBottom: '5%',
    },
    step1Title: {
        marginTop: '19%',
        fontSize: 20,
        fontWeight: '700',
        color: 'black',
    },
    discView: {
        margin: 5,
        marginBottom: '18%',
        padding: 3,
        marginTop: 14,
        alignItems: 'center',
    },
    discText: {
        fontSize: 15,
        fontWeight: '400',
        color: '#808080',
    },
    buttonContainer: {
        backgroundColor: '#407BFF',
        width: '96%',
        borderRadius: 25,
        padding: 13,
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#fff',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
})
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Step3MainImg } from '../../utils/svgs/steps/step3';
import Layout from '../../utils/layout';
import { ScrollView } from 'react-native-gesture-handler';

const Step2 = () => {
    const navigation = useNavigation();

    return (
        <Layout>
            <ScrollView>
                <View style={styles.main}>
                    <View style={{ marginTop: '25%', alignItems: 'center' }}>
                        <Step3MainImg />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.step1Title}>Sign up as</Text>
                        <View style={styles.discView}>
                            <Text style={styles.discText}>Choose how you want to use MaxTree</Text>
                        </View>
                        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("CreaterSignup")}>
                            <Text style={styles.buttonText}>Creater</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.userButtonContainer} onPress={() => navigation.navigate("UserSignup")}>
                            <Text style={styles.userButtonText}>User</Text>
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
        marginTop: '8%',
        fontSize: 20,
        fontWeight: '700',
        color: 'black',
    },
    discView: {
        margin: 5,
        marginBottom: '18%',
        padding: 3,
        marginTop: 12,
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
        marginBottom: '6%',
    },
    userButtonContainer: {
        borderWidth: 2,
        borderColor: '#407BFF',
        width: '96%',
        borderRadius: 25,
        padding: 10,
    },
    userButtonText: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'black',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#fff',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
})
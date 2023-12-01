import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { GoogleImg, OrLineImgSvg } from '../../utils/svgs/steps/SignUp';
import Layout from '../../utils/layout';

const CreaterSignup = () => {
    const [newsPaperName, setNewsPaperName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [selectChoice, setSelectChoice] = useState(true);


    return (
        <Layout>
            <ScrollView>
                <View style={styles.main}>
                    <View style={styles.signUpTitleView}>
                        <Text style={styles.signUpText}>Sign Up</Text>
                    </View>
                    <View style={styles.parentView}>
                        <View style={styles.titleBtnView}>
                            <Text style={styles.btnText}>Newspaper Name</Text>
                            <TextInput placeholder='Enter your newspaper name' placeholderTextColor='#BCBCBC' keyboardType='default' style={styles.inputTextWithoutIcon}
                                value={newsPaperName} onChangeText={(text) => setNewsPaperName(text)} />
                        </View>
                        <View style={styles.titleBtnView}>
                            <Text style={styles.btnText}>Email address</Text>
                            <TextInput placeholder='Enter your email address' placeholderTextColor='#BCBCBC'
                                keyboardType='email-address' caretHidden={false} style={styles.inputTextWithoutIcon}
                                value={email} onChangeText={(text) => setEmail(text)} />
                        </View>
                        <View style={styles.iconBtnView}>
                            <Text style={styles.btnText}>Password</Text>
                            <View style={styles.textInputWithIcon}>
                                <TextInput placeholder='Enter your password' placeholderTextColor='#808080cc' keyboardType='default' style={[styles.responsiveTextInput]}
                                    value={password} onChangeText={(text) => setPassword(text)} secureTextEntry={passwordHidden} />
                                <TouchableOpacity onPress={() => setPasswordHidden(!passwordHidden)} style={styles.iconStyle}>
                                    <Ionicons name={passwordHidden ? "eye-off-outline" : "eye-outline"} size={24} color="#B0B0B0" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.iconBtnView}>
                            <Text style={styles.btnText}>Sign up as</Text>
                            <View style={[styles.textInputWithIcon, { padding: 7 }]}>
                                {selectChoice ? <Text style={styles.dropDownText}>Creator</Text>
                                    : <Text style={[styles.dropDownText, { padding: 7 }]}>User</Text>}
                                <TouchableOpacity onPress={() => setSelectChoice(!selectChoice)} style={[, styles.iconStyle, { marginRight: -6 }]}>
                                    <MaterialIcons name="arrow-drop-down" size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.orLineView}>
                            <OrLineImgSvg />
                            <Text style={styles.orLineText}>OR</Text>
                            <OrLineImgSvg />
                        </View>
                        <TouchableOpacity style={styles.userButtonContainer}>
                            <GoogleImg />
                            <Text style={styles.userButtonText}>Sign up with Google</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonContainer}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>
                        <View style={styles.discTextView}>
                            <Text style={styles.discText}>Already have an account</Text>
                            <TouchableOpacity>
                                <Text style={styles.signInText}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </Layout>
    )
}

export default CreaterSignup

const styles = StyleSheet.create({
    main: {
        flex: 1,
        marginBottom: '5%',
    },
    signUpText: {
        fontSize: 25,
        fontWeight: '700',
        color: 'black',
    },
    signInText: {
        marginHorizontal: 6,
        fontSize: 15,
        fontWeight: '400',
    },
    discTextView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    discText: {
        color: '#9E9E9E',
        fontSize: 15,
        fontWeight: '400',
    },
    dropDownText: {
        flex: 1,
        padding: 5,
        paddingLeft: 10,
        marginRight: 5,
        color: 'black',
        fontSize: 16,
    },
    responsiveTextInput: {
        flex: 1,
        padding: 5,
        marginRight: 5
    },
    iconStyle: {
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: -4
    },
    inputTextIconView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 25,
        paddingHorizontal: 15,
        borderWidth: 2, borderColor: '#b0b0b07a',
        padding: 8,
    },
    orLineView: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        margin: 10,
        padding: 6,
    },
    buttonContainer: {
        backgroundColor: '#407BFF',
        borderRadius: 25,
        padding: 13,
        marginBottom: '6%',
    },
    userButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: '#407BFF',
        borderRadius: 25,
        padding: 10,
        marginBottom: '10%',
    },
    userButtonText: {
        marginHorizontal: 18,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'black',
        fontSize: 16,
        fontWeight: '500',
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#fff',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    signUpTitleView: {
        padding: 5,
        marginTop: '10%',
    },
    parentView: {
        flex: 1,
        marginHorizontal: 8,
        marginTop: '10%'
    },
    titleBtnView: {
        marginBottom: 18,
    },
    iconBtnView: {
        marginBottom: 10,
    },
    btnText: {
        marginBottom: 5,
        fontSize: 16,
        fontWeight: '400',
        color: 'black',
    },
    textInputWithIcon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 25,
        paddingHorizontal: 8,
        borderWidth: 2, borderColor: '#b0b0b07a',
        padding: 4,
    },
    inputTextWithoutIcon: {
        marginTop: 10,
        borderRadius: 25,
        paddingLeft: 15,
        borderWidth: 2, borderColor: '#b0b0b07a',
        padding: 9,
    },
    orLineText: {
        marginHorizontal: 8,
        fontSize: 15,
        fontWeight: '400',
        color: 'grey',
    },
})
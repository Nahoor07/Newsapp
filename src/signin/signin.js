import { StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { GoogleImg, OrLineImgSvg } from '../../utils/svgs/steps/SignUp';
import Layout from '../../utils/layout';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '@env';
import { useNavigation } from '@react-navigation/native';



const SignIn = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [errorMsg, setErrorMsg] = useState();
    const [loading, setLoading] = useState();

    const handleSignIn = async () => {
        try {
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            };

            setLoading(true);
            const response = await axios.post(`${BASE_URL}api/user/login`, { email, password }, config);
            if (response.status === 200) {
                const token = response.data?.data?.token;
                const userData = response.data?.data?.user;
                if (token) {
                    AsyncStorage.setItem("token", token);
                    AsyncStorage.setItem("userData", JSON.stringify(userData));
                    navigation.navigate('HomeTabs');
                    setLoading(false);
                } else {
                    console.error('Unexpected response format:', response.data);
                    setLoading(true);
                }
            } else {
                console.error('API request failed:', response.status, response.statusText);
                setLoading(true);

            }

        } catch (error) {
            console.log('An error occurredf:', error.response.data);
            setErrorMsg(error.response.data.message)
            setLoading(false)
        }
    };
    useEffect(() => {
        checkIfUserIsSignedIn();
    }, []);
    const checkIfUserIsSignedIn = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                navigation.navigate('HomeTabs');
            }
        } catch (error) {
            console.error('Error checking user sign-in status:', error);
        }
    };
    const handleSignInWithGoogle = () => {
        // Define the Google OAuth 2.0 authorization URL
        const googleOAuthUrl = 'https://accounts.google.com/o/oauth2/auth?' +
            'response_type=code' +
            '&client_id=YOUR_CLIENT_ID' + // Replace with your own Google OAuth client ID
            '&redirect_uri=YOUR_REDIRECT_URI' + // Replace with your own redirect URI
            '&scope=email profile openid' + // Specify the desired scopes
            '&state=STATE_PARAMETER'; // Optional state parameter
        Linking.openURL(googleOAuthUrl);
    };


    return (
        <Layout>
            <ScrollView>
                <View style={styles.main}>
                    <View style={styles.signUpTitleView}>
                        <Text style={styles.signUpText}>Sign In</Text>
                    </View>
                    <View style={styles.parentView}>

                        <View style={styles.titleBtnView}>
                            <Text style={styles.btnText}>Email address</Text>
                            <TextInput placeholder='Enter your email address' placeholderTextColor='#BCBCBC' keyboardType='email-address' caretHidden={false} style={styles.inputTextWithoutIcon}
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
                            {errorMsg && <Text style={styles.errortext}>{errorMsg}</Text>}
                        </View>
                        <View style={styles.orLineView}>
                            <OrLineImgSvg />
                            <Text style={styles.orLineText}>OR</Text>
                            <OrLineImgSvg />
                        </View>
                        {/* <TouchableOpacity style={styles.userButtonContainer} onPress={() => handleSignInWithGoogle()}>
                            <GoogleImg />
                            <Text style={styles.userButtonText}>Sign In with Google</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={styles.buttonContainer} onPress={() => handleSignIn()} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={styles.buttonText}>Sign In</Text>
                            )}
                        </TouchableOpacity>
                        <View style={styles.discTextView}>
                            <Text style={styles.discText}>Don’t have an account </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                <Text style={styles.signInText}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </Layout>
    )
}

export default SignIn

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
        marginRight: 5,
        color: 'black',
        fontSize: 16,
        paddingLeft: 10,
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
    errortext: {
        fontSize: 16,
        color: 'red',
        marginTop: 2,
    }
})
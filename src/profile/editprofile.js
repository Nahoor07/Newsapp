import { StyleSheet, Text, View, Image, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import ProfileImg from '../../assets/images/profile.jpg'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios'
import { BASE_URL } from '@env';



export default function Editprofile() {
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [profileData, setProfileData] = useState();
    const [imageSource, setImageSource] = useState(null);
    const [newPassword, setNewPassword] = useState({ password: '', confirm_password: '' });
    const [errorMsg, setErrorMsg] = useState();
    const [imageUri, setImageUri] = useState(null);

    // const saveImage = async (uri) => {
    //     try {
    //         await AsyncStorage.setItem('userImage', uri);
    //     } catch (error) {
    //         console.error('Error saving image:', error);
    //     }
    // };

    // Function to load the image from local storage
    
    const handleToggleChangePassword = () => {
        setShowChangePassword(!showChangePassword);
    };
    const retrieveData = async () => {
        try {
            const data = await AsyncStorage.getItem('userData');
            const newData = JSON.parse(data)
            setProfileData(newData)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        retrieveData();
    }, [])

    const handleSave = async () => {
        try {
          let token = await AsyncStorage.getItem("token");
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data', 
              'Authorization': `Bearer ${token}`,
            },
          };
          const formData = new FormData(); 
      
          formData.append('name', profileData?.name);
          formData.append('email', profileData?.email);

          if (imageUri) {
            formData.append('image', {
              uri: imageUri,
              type: 'image/jpeg',
              name: 'image',
            });
          }
      
          if (profileData?.changePassword) {
            if (newPassword && currentPassword) {
              if (newPassword === confirm_password) {
                formData.append('current_password', currentPassword);
                formData.append('new_password', newPassword);
                formData.append('confirm_password', newPassword);
              } else {
                setErrorMsg("New password and confirm password do not match.")
                return;
              }
            } else {
              setErrorMsg("Please provide both current password and new password.")
              return;
            }
          }
          console.log("formData", formData)
      
          const response = await axios.post(`${BASE_URL}api/profile/edit`, formData, config);
          console.log("edit profile", response.data);
          // alert(response?.data?.message)
      
        } catch (error) {
          console.error(error.response);
        }
      };
      



    // Image Picker Function
    const pickImageFromGallery = async () => {
        try {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
          if (status !== 'granted') {
            console.log('Permission to access gallery was denied');
            return;
          }
      
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
          });
      
          if (result.cancelled) {
            console.log('Image selection was cancelled');
          } else {
            console.log('Selected image URI:', result.uri);
            setImageUri(result.uri);
            setImageSource({ uri: result.uri });
          }
        } catch (error) {
          console.error('Error picking image from gallery:', error);
        }
      };
      
   
    return (
        <SafeAreaView>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.profilecontainer}>
                    <TouchableOpacity onPress={pickImageFromGallery}>
                        {imageSource ? (
                            <Image
                                source={imageSource}
                                style={styles.profileImg}
                            />
                        ) : (
                            <>
                                <Image
                                    source={profileData?.image}
                                    style={[styles.profileImg, { borderWidth: 0.5, borderColor: '#808080' }]}
                                />
                            </>
                        )}
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.nameTxt}>Name:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setProfileData(state => ({ ...state, name: text }))}
                            value={profileData?.name}
                        />
                    </View>
                    <View>
                        <Text style={styles.nameTxt}>Email:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setProfileData(state => ({ ...state, email: text }))}
                            value={profileData?.email}
                        />
                    </View>
                    <TouchableOpacity style={styles.changePassContainer} onPress={handleToggleChangePassword}>
                        <Text style={styles.changePassTxt}>Change Password</Text>
                    </TouchableOpacity>
                    {errorMsg ? <Text style={styles.errortxt}>{errorMsg}</Text> : null}
                    {showChangePassword && (
                        <View style={styles.currentPasswordView}>
                            <Text>Current Password:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter current password"
                                placeholderTextColor='gray'
                                secureTextEntry={true}
                                value={currentPassword}
                                onChangeText={(text) => setCurrentPassword(text)}
                            />
                            <Text style={styles.newPasswordView}>New Password:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter new password"
                                placeholderTextColor='gray'
                                secureTextEntry={true}
                                value={newPassword.password}
                                onChangeText={(text) => setNewPassword({ ...newPassword, password: text })}
                            />
                            <Text style={styles.newPasswordView}>Confirm Password:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm password"
                                placeholderTextColor='gray'
                                secureTextEntry={true}
                                value={newPassword.confirm_password}
                                onChangeText={(text) => setNewPassword({ ...newPassword, confirm_password: text })}
                            />
                        </View>

                    )}
                    <TouchableOpacity style={styles.saveContainer} onPress={() => handleSave()}>
                        <Text style={styles.saveTxt}>Save</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    profilecontainer: {
        marginTop: '8%',
        marginLeft: '6%',
        marginRight: '5%',
    },
    profileImg: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    profileTitle: {
        fontWeight: '600',
        marginVertical: "5%",
        fontSize: 18,
    },
    input: {
        height: 40,
        marginTop: '2%',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    nameTxt: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: '5%',
        marginBottom: "3%"
    },
    changePassContainer: {
        marginTop: '8%'
    },
    changePassTxt: {
        fontSize: 15,
        color: "#407BFF",
        textDecorationLine: 'underline'
    },
    saveTxt: {
        fontSize: 15,
        color: "#FFF",
        fontWeight: '500',
        textAlign: "center"
    },
    saveContainer: {
        backgroundColor: "#407BFF",
        marginTop: '5%',
        width: '30%',
        paddingTop: '3%',
        paddingBottom: '3%',
        borderRadius: 8,
    },
    currentPasswordView: {
        marginTop: '5%',
    },
    newPasswordView: {
        marginTop: '5%',
    },
    errortxt: {
        color: 'red',
        fontSize: 16,
        fontWeight: "500"
    }

})
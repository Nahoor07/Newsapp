import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios'
import { BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native';
import { Audio } from 'expo-av';
import Checkbox from 'expo-checkbox';
import DropDownPicker from 'react-native-dropdown-picker';


export default function Create() {
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const [bgImage, setBgImage] = useState(null);
    const [showIcon, setShowIcon] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [voices, setVoices] = useState(null);
    const [showAddVoiceover, setShowAddVoiceover] = useState(false)
    const [markedVoiceId, setMarkedVoiceId] = useState(null);
    const [sound, setSound] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isCheckedPopular, setCheckedPopular] = useState(false);
    const [isCheckedLatest, setCheckedLatest] = useState(false);
    const [isCheckedBreaking, setCheckedBreaking] = useState(false);
    const [voiceId, setVoiceId] = useState();
    const [type, setType] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [types, setTypes] = useState([]);
    const [selectedJournalist, setSelectedJournalist] = useState(null);
    const [journalists, setJournalists] = useState([]);
    const [writerOpen, setWriterOpen] = useState(false);
    const [message, setMessage] = useState();

    const data = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
    ];


    const toggleIcon = () => {
        setShowIcon(!showIcon);
    };
    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    const togglePlayPause = async (media) => {
        try {
            if (sound) {
                const status = await sound.getStatusAsync();
                if (status.isPlaying) {
                    await sound.pauseAsync();
                    setIsPlaying(!status.isPlaying);
                    return;
                }
            }

            if (sound !== media) {
                const { sound: audioSound } = await Audio.Sound.createAsync(
                    { uri: media },
                    { shouldPlay: true }
                );
                setSound(audioSound);
                setIsPlaying(true);
            }
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
            })
        } catch (error) {
            console.error('Error toggling play/pause:', error);
        }
    };

    // const toggleMark = () => {
    //     if (markedVoiceId === voiceId) {
    //         setMarkedVoiceId(null);
    //     } else {
    //         setMarkedVoiceId(voiceId);
    //     }
    // };
    const handlePress = (voiceDataId) => {
        setMarkedVoiceId(voiceDataId);
    }
    const toggleAddVoice = () => {
        setShowAddVoiceover(!showAddVoiceover);
    };

    // bg_image picker code 

    const backgroundImagePicker = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setBgImage(result.assets[0].uri);
            } else {
                console.log('Image selection was canceled.');
            }
        } catch (error) {
            console.error('Image picker error:', error);
        }
    };

    // image picker code 
    const imagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };
    //api call
    const handlePublish = async () => {
        setIsLoading(true);

        try {
            let token = await AsyncStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            };
            const formData = new FormData();
            if (!title) {
                setMessage("Title is required.");
            } else if (!bgImage) {
                setMessage("Background image is required.");
            } else if (isCheckedPopular && !image) {
                setMessage("Image is required for popular articles.");
            } else if (!selectedJournalist) {
                setMessage("Journalist is required.");
            } else {
                formData.append('title', title);
                formData.append('bg_image', {
                    uri: bgImage,
                    type: 'image/jpeg',
                    name: 'image.jpg',
                });

                if (image)
                    formData.append('image', {
                        uri: image,
                        type: 'image/jpeg',
                        name: 'image.jpg',
                    });

                formData.append('popular', isCheckedPopular ? '1' : '0');
                formData.append('latest', isCheckedLatest ? '1' : '0');
                formData.append('breaking_news', isCheckedBreaking ? '1' : '0');
                formData.append('type', selectedType || '');
                formData.append('journalist_id', selectedJournalist);
                formData.append('description', description || '');

                const response = await axios.post(`${BASE_URL}api/add/article`, formData, config);

                if (response.status === 200) {
                    setMessage("Created Successfully");
                    navigation.navigate("Profile");
                    console.log('hey data:', response.data)
                } else {
                    setMessage("An unexpected error occurred.");
                }
            }

        } catch (error) {
            // console.error("Error:", error.response);
            setMessage(error.message || "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };


    const voiceData = () => {
        const apiUrl = `${BASE_URL}api/get/voices/google`;

        axios.get(apiUrl)
            .then((response) => {
                setVoices(response?.data?.voices)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }
    useEffect(() => {
        voiceData()
        typeData()
        fetchJournalists()
    }, [])
    const typeData = async () => {
        try {
            let token = await AsyncStorage.getItem('token');
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const apiUrl = BASE_URL + 'api/types';

            const response = await fetch(apiUrl, config);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Assuming data is an array of objects with a "title" property
            setType(data.data.map(item => ({ label: item.title, value: item.title })));
            // console.log(data.data.map(item => ({ label: item.title, value: item.title })))

        } catch (error) {
            console.log(error);
        }
    };
    const fetchJournalists = async () => {
        try {
            let token = await AsyncStorage.getItem('token');
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const apiUrl = BASE_URL + 'api/journalists';
            const response = await fetch(apiUrl, config);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setJournalists(data.data);

        } catch (error) {
            console.log(error);
        }
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
                    <Text style={styles.dashboardTitle}>Create Article</Text>
                </View>
                <View style={styles.customHeader}>
                    <FontAwesome5
                        name="search"
                        size={24}
                        color="#7f7f7f"
                    />
                </View>
            </View>
            <ScrollView>
                <View style={styles.coverPhoto}>
                    <TouchableOpacity style={styles.uploadContainer} onPress={backgroundImagePicker}>
                        {bgImage ? (
                            <Image source={{ uri: bgImage }} style={styles.uploadedPhoto} />
                        ) : (
                            <>
                                <Ionicons name="image-outline" size={40} color="#767676" />
                                <Text style={styles.uploadtxt}>Upload a cover image</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
                <View style={styles.profilePhoto} >
                    <TouchableOpacity style={styles.uploadProfileContainer} onPress={imagePicker}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.profileImg} />
                        ) : (
                            <>
                                <Ionicons name="image-outline" size={40} color="#767676" />
                                <Text style={styles.uploadtxt}>Upload a profile image</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
                <View style={styles.typeContainer}>
                    <View style={styles.typeCheck}>
                        <Text>Mark Popular</Text>
                        <Checkbox
                            style={styles.checkbox}
                            value={isCheckedPopular}
                            onValueChange={setCheckedPopular}
                            color={isCheckedPopular ? '#4630EB' : undefined}
                        />
                    </View>
                    <View style={styles.typeCheck}>
                        <Text>Is Latest</Text>
                        <Checkbox
                            style={styles.checkbox}
                            value={isCheckedLatest}
                            onValueChange={setCheckedLatest}
                            color={isCheckedLatest ? '#4630EB' : undefined}
                        />
                    </View>
                    <View style={styles.typeCheck}>
                        <Text>Breaking News</Text>
                        <Checkbox
                            style={styles.checkbox}
                            value={isCheckedBreaking}
                            onValueChange={setCheckedBreaking}
                            color={isCheckedBreaking ? '#4630EB' : undefined}
                        />
                    </View>

                </View>
                <View style={styles.dropdownview}>
                    <View style={{ width: "50%" }}>
                        <Text style={styles.typeTxt}>Type</Text>
                        <DropDownPicker
                            open={isOpen}
                            value={selectedType}
                            items={type}
                            setOpen={setIsOpen}
                            setValue={setSelectedType}
                            setItems={setTypes}
                            placeholder="Select Type"
                        />
                    </View>
                    <View style={{ justifyContent: "center" }}>
                        <Text style={styles.typeTxt}>Journalist</Text>
                        <DropDownPicker
                            open={writerOpen}
                            value={selectedJournalist}
                            items={journalists.map(item => ({ label: item.name, value: item.id }))}
                            setOpen={setWriterOpen}
                            setValue={setSelectedJournalist}
                            setItems={setJournalists}
                            placeholder="Select Journalist"
                            style={{ backgroundColor: '#fff', width: '55%', zIndex: 1 }}

                        />
                    </View>
                </View>

                <View style={styles.headlineContainer}>
                    <Text style={styles.headlineTxt}>Headline</Text>
                    <View style={styles.headlineIcons}>
                        <TouchableOpacity onPress={toggleIcon}>
                            <Ionicons
                                name="close-circle-outline"
                                size={40}
                                color="#767676"
                            />
                        </TouchableOpacity>
                        <TextInput
                            placeholder="title"
                            placeholderTextColor="gray"
                            style={styles.titletxt}
                            value={title}
                            onChangeText={(text) => setTitle(text)}
                        />

                        {showIcon ? (
                            <TouchableOpacity style={styles.iconMic} onPress={toggleAddVoice}>
                                <Ionicons
                                    name="mic-circle-outline"
                                    size={40}
                                    color="#808080"
                                />
                                <Text style={styles.voiceoverTxt}>Voice Over</Text>
                            </TouchableOpacity>
                        ) : null}

                    </View>
                    {showAddVoiceover ? (
                        <View style={styles.voiceContainer}>
                            <TouchableOpacity style={styles.voiceBtn} >
                                <Ionicons
                                    name="add"
                                    size={25}
                                    color="#ffff"
                                />
                                <Text style={styles.addVoicetxt}>Add Voiceover</Text>
                            </TouchableOpacity>
                            <View style={styles.yourVoice}>
                                {voices.map((voiceData, index) => (
                                    <View style={styles.selectVoiceContainer} key={index}>
                                        <TouchableOpacity onPress={() => togglePlayPause(voiceData.media)}>
                                            {isPlaying && sound === voiceData.media ? (
                                                <Ionicons name="pause-circle" size={25} color="#407BFF" />
                                            ) : (
                                                <Ionicons name="play-circle" size={25} color="#407BFF" />
                                            )}
                                        </TouchableOpacity>
                                        <Text>{voiceData.voice_name}</Text>
                                        <TouchableOpacity onPress={() => handlePress(voiceData.id)}>
                                            {markedVoiceId === voiceData.id ? (
                                                <Ionicons name="radio-button-on" size={20} color="#000" />
                                            ) : (
                                                <Entypo name="circle" size={20} color="#000" />
                                            )}
                                        </TouchableOpacity>

                                    </View>
                                ))}
                            </View>

                            <View style={styles.doneContainer}>
                                <TouchableOpacity style={styles.doneButton} onPress={()=>setShowAddVoiceover(!showAddVoiceover)}>
                                    <Text style={styles.publishTxt}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : null

                    }

                </View>

                <View style={styles.headlineContainer}>
                    <Text style={styles.typeTxt}>Description</Text>
                    <TextInput
                        placeholder="Your Description"
                        value={description}
                        onChangeText={(text) => setDescription(text)}
                        placeholderTextColor='gray'
                        style={styles.input}
                        multiline={true}
                        numberOfLines={5}
                    />
                </View>
                {message && <Text style={styles.msgtxt}>{message}</Text>}
                <TouchableOpacity style={styles.publishButton} onPress={() => handlePublish()}>
                    {isLoading ? (
                        <ActivityIndicator color="#ffffff" /> // Show the loader
                    ) : (<Text style={styles.publishTxt}>Publish</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
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
    uploadContainer: {
        width: "85%",
        height: 200,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#000',
        borderRadius: 10,
    },
    uploadtxt: {
        marginTop: '8%'
    },
    coverPhoto: {
        justifyContent: "center",
        alignItems: 'center',
        marginTop: '10%'
    },
    headlineContainer: {
        marginLeft: '10%',
        marginTop: '10%',
        position: 'relative',
        zIndex: -1,
    },
    headlineTxt: {
        fontSize: 18,
        fontWeight: '700',
        marginVertical: 30,
    },
    headlineIcons: {
        flexDirection: 'row',
        gap: 20,
    },
    voiceoverTxt: {
        fontSize: 12,
        color: '#808080'
    },
    publishButton: {
        backgroundColor: '#407BFF',
        marginLeft: '10%',
        marginTop: '24%',
        width: '30%',
        paddingTop: '5%',
        paddingBottom: '5%',
        borderRadius: 10,
    },
    publishTxt: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
    },
    voiceBtn: {
        backgroundColor: '#407BFF',
        width: '50%',
        paddingTop: '5%',
        paddingBottom: "5%",
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    voiceContainer: {
        backgroundColor: 'white',
        width: '90%',
        paddingLeft: '4%',
        paddingTop: '10%',
        borderRadius: 8,
        elevation: 5,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginTop: '4%',
        paddingBottom: "5%",
    },
    addVoicetxt: {
        textAlign: 'center',
        color: '#fff'
    },
    selectVoiceContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        width: '65%',
        justifyContent: 'center',
        paddingTop: '4%',
        paddingBottom: '4%',
        borderRadius: 10,
        borderColor: '#ebebeb',
        alignItems: 'center',
        gap: 4,
    },
    yourVoice: {
        marginTop: '10%',
        flexWrap: 'wrap',
        flexDirection: "row",
        gap: 10,
        marginLeft: "5%"
    },
    checkbox: {
        borderRadius: 10,
    },
    doneContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    doneButton: {
        backgroundColor: '#407BFF',
        width: '50%',
        paddingTop: '5%',
        paddingBottom: "5%",
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '8%',
    },
    titletxt: {
        borderBottomWidth: 1,
        borderBottomColor: '#808080',
        fontSize: 15,
        width: '60%'
    },
    iconMic: {
        position: 'absolute',
        marginLeft: '15%',
        backgroundColor: "white",
        width: "60%",
    },
    profilePhoto: {
        marginTop: '5%',
        marginLeft: '10%'
    },
    profileImg: {
        width: 100,
        height: 100,
        objectFit: 'cover',
        marginLeft: '5%',
        marginBottom: "5%",
        borderRadius: 10,
    },
    uploadProfileContainer: {
        width: 120,
        height: 120,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#000',
        borderRadius: 10,
    },
    typeContainer: {
        flexDirection: 'column',
        gap: 25,
        marginLeft: "7%",
        marginTop: "5%"

    },
    typeCheck: {
        marginLeft: '5%',
        flexDirection: 'row',
        gap: 10,

    },

    typeTxt: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
    },
    typeSelect: {
        marginLeft: "10%",
        marginTop: '5%'
    },
    typeTxt: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
    },
    dropdownview: {
        flexDirection: 'row',
        alignItems: "center",
        width: "80%",
        marginLeft: "5%",
        paddingRight: "5%",
        marginTop: "5%",
        gap: 30,
    }, uploadedPhoto: {
        width: "100%",
        height: 200,
        objectFit: "cover"
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
        marginRight: '10%'
    },
    msgtxt: {
        marginTop: "5%",
        textAlign: "center",
        fontSize: 16,
        fontWeight: '600'
    }
})
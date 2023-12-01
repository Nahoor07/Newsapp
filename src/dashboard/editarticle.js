import { StyleSheet, Text, View, Image, KeyboardAvoidingView, Keyboard, Platform, TextInput, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import Cover from '../../assets/images/madrid.jpg'
import Checkbox from 'expo-checkbox';
import DropDownPicker from 'react-native-dropdown-picker';
import { TouchableOpacity } from 'react-native';
import AudioPlayer from '../audioplayer/audioPlayer';
import { useRoute } from '@react-navigation/native';
import { BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

export default function EditArticle() {
    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route?.params;
    const [selectedValue, setSelectedValue] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [voiceOpen, setVoiceOpen] = useState(false);
    const [writerOpen, setWriterOpen] = useState(false);
    const [article, setArticle] = useState({});
    const [type, setType] = useState([]);
    const [writer, setWriter] = useState([]);
    const [popularChecked, setPopularChecked] = useState(article?.popular);
    const [latestChecked, setLatestChecked] = useState(article?.latest);
    const [breakingNewsChecked, setBreakingNewsChecked] = useState(article?.breaking_news);
    const [image, setImage] = useState(null);
    const [bgImage, setBgImage] = useState(null);
    const [selectedType, setSelectedType] = useState(article?.type);
    const [selectedJournalist, setSelectedJournalist] = useState(article?.journalist_id);
    const [message, setMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const data = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
    ];
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

        } catch (error) {
            console.log(error);
        }
    };
    const writerData = async () => {
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
            setWriter(data.data.map(item => ({ key: item.id, value: item.id, label: item.name })));
        } catch (error) {
            console.log(error);
        }
    };

    const articleData = async () => {
        try {
            let token = await AsyncStorage.getItem('token');
            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            };
            const response = await axios.get(`${BASE_URL}api/article/edit/${id}`, config);

            if (response.status === 200) {
                const responseData = response.data.data;
                setArticle(responseData);
                setPopularChecked(response.data?.data?.popular == 0 ? false : true);
                setLatestChecked(response.data?.data?.latest == 0 ? false : true);
                setBreakingNewsChecked(response.data?.data?.breaking_news == 0 ? false : true);
            } else if (response.status === 404) {
                console.log('Resource not found (404)');
            } else {
                console.log('Unexpected response:', response.status);
            }
        } catch (error) {
            console.error("error s", error);
        }
    };
    const handleDismissKeyboard = () => {
        Keyboard.dismiss(); // This will dismiss the keyboard when you tap outside.
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            let token = await AsyncStorage.getItem('token');

            const config = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            };
            console.log("Article Data:", article);
            const formData = new FormData();
            formData.append('title', article?.title || ''); // Use the title from article or provide an empty string as a default
            formData.append('description', article?.description || ''); // Use the description from article or provide an empty string as a default
            if (bgImage) {
                formData.append('bg_image', {
                    uri: bgImage,
                    type: 'image/jpeg',
                    name: 'image.jpg',
                });
            } else if (article?.bg_image) {
                formData.append('bg_image', article.bg_image);
            }

            if (image) {
                formData.append('image', {
                    uri: image,
                    type: 'image/jpeg',
                    name: 'image.jpg',
                });
            } else if (article?.image) {
                // Use the default image from article?.image
                formData.append('image', article.image);
            }

            formData.append('popular', popularChecked ? '1' : '0');
            formData.append('latest', latestChecked ? '1' : '0');
            formData.append('breaking_news', breakingNewsChecked ? '1' : '0');
            formData.append('journalist_id', selectedJournalist);
            formData.append('type', selectedType || '');
            console.log('formdata mery pass ::', formData)
            const response = await axios.post(`${BASE_URL}api/edit/article/${id}`, formData, config);
            if (response?.data?.status == "Success") {
                setMessage(response.data.message)
                navigation.navigate('Profile')
                setIsSaving(false);
            }
        } catch (error) {
            console.error(error.request);
            setIsSaving(false);
        }
    };
    const pickAudioDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'audio/*',
            });

            if (result.type === 'success') {
                console.log(
                    'Audio file picked:',
                    result.name,
                    result.uri,
                    result.type
                );

                // You can perform further actions with the picked audio file.
            } else {
                console.log('Audio document picking canceled or failed.');
            }
        } catch (error) {
            console.error('Error picking audio document:', error);
        }
    };
    const backgroundImagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setBgImage(result.assets[0].uri);
        }
    };

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
    useEffect(() => {
        articleData();
        typeData();
        writerData()
    }, []);

    return (
        <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
            <ScrollView style={styles.scrollContainer}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                >
                    <View style={styles.container}>
                        <View>
                            <Text style={styles.bgTxt}>Background Image :</Text>
                            <TouchableOpacity onPress={backgroundImagePicker} >
                                {bgImage ? (
                                    <Image source={{ uri: bgImage }} style={styles.bgImg} />
                                ) : (
                                    <Image source={{ uri: article?.bg_image }} style={styles.bgImg} />
                                )}
                            </TouchableOpacity>
                            <Text style={styles.bgTxt}>Image:</Text>
                            <TouchableOpacity onPress={imagePicker}>

                                {image ? (
                                    <Image source={{ uri: image }} style={styles.profileImg} />
                                ) : (
                                    <Image source={{ uri: article?.image }} style={styles.profileImg} />)}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.typeContainer}>
                            <View style={styles.typeCheck}>
                                <Text>Mark Popular</Text>
                                <Checkbox
                                    style={styles.checkbox}
                                    value={popularChecked}
                                    onValueChange={(val) => {
                                        setPopularChecked(val);
                                        setArticle({ ...article, popular: val ? 1 : 0 });
                                    }}
                                    color={popularChecked ? '#4630EB' : undefined}
                                />
                            </View>
                            <View style={styles.typeCheck}>
                                <Text>Is Latest</Text>
                                <Checkbox
                                    style={styles.checkbox}
                                    value={latestChecked}
                                    onValueChange={(val) => {
                                        setLatestChecked(val);
                                        setArticle({ ...article, latest: val ? 1 : 0 });
                                    }}
                                    color={latestChecked ? '#4630EB' : undefined}
                                />

                            </View>
                            <View style={styles.typeCheck}>
                                <Text>Breaking News</Text>
                                <Checkbox
                                    style={styles.checkbox}
                                    value={breakingNewsChecked}
                                    onValueChange={(val) => {
                                        setBreakingNewsChecked(val);
                                        setArticle({ ...article, breaking_news: val ? 1 : 0 });
                                    }}
                                    color={breakingNewsChecked ? '#4630EB' : undefined}
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
                                    setItems={type}
                                    placeholder="Select Type"
                                    style={{ backgroundColor: '#fff', borderColor: '#fff', width: '110%', position: "relative", zIndex: 1 }}
                                />
                            </View>
                            <View style={{}}>
                                <Text style={styles.typeTxt}>Journalist</Text>
                                <DropDownPicker
                                    open={writerOpen}
                                    value={selectedJournalist}
                                    items={writer}
                                    setOpen={setWriterOpen}
                                    setValue={setSelectedJournalist}
                                    setItems={writer}
                                    placeholder="Select Journalist"
                                    style={{ backgroundColor: '#fff', borderColor: '#fff', width: '55%', zIndex: 1 }}
                                />
                            </View>
                        </View>

                        <View style={[styles.typeSelect, { position: "relative", zIndex: -1 }]}>
                            <Text style={styles.typeTxt}>Upload your own audio</Text>
                            <TouchableOpacity onPress={pickAudioDocument}><Text style={styles.chooseTxt}>Chooose File</Text></TouchableOpacity>
                            <View style={styles.audioPlayerContainer}>

                            </View>
                            <View style={styles.headline}>
                                <Text style={styles.typeTxt}>Headline</Text>
                                <TextInput
                                    placeholder="Your Headline"
                                    value={article?.title}
                                    onChangeText={(text) => setArticle({ ...article, title: text })}
                                    placeholderTextColor='gray'
                                    style={styles.input}
                                />


                            </View>
                            <View style={styles.headline}>
                                <Text style={styles.typeTxt}>Description</Text>
                                <TextInput
                                    placeholder="Your Description"
                                    value={article?.description}
                                    onChangeText={(text) => setArticle({ ...article, description: text })}
                                    placeholderTextColor='gray'
                                    style={styles.input}
                                    multiline={true}
                                    numberOfLines={5}
                                />
                            </View>

                        </View>
                        {message && <Text style={styles.msgtxt}>{message}</Text>}
                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                            {isSaving ? (
                                <ActivityIndicator color="#ffffff" /> // Show the loader
                            ) : (
                                <Text style={styles.savetxt}>Save</Text> // Show "Save" button
                            )}
                        </TouchableOpacity>

                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        marginBottom: '5%'
    },
    container: {
        flex: 1,
        paddingTop: 50,

    },
    bgTxt: {
        fontSize: 17,
        marginLeft: '4%',
        fontWeight: '600',
        marginBottom: 20,
    },
    bgImg: {
        width: '92%',
        height: 200,
        objectFit: 'cover',
        marginLeft: '5%',
        marginBottom: "5%"
    },
    profileImg: {
        width: 100,
        height: 100,
        objectFit: 'cover',
        marginLeft: '5%',
        marginBottom: "5%",
        borderRadius: 10,
    },
    typeContainer: {
        flexDirection: 'row',
        gap: 25,

    },
    typeCheck: {
        marginLeft: '5%',
        flexDirection: 'column',
        gap: 10,
        alignItems: 'center'

    },
    typeSelect: {
        marginLeft: "5%",
        marginTop: '5%',
        zIndex: 1,
        position: 'relative'
    },
    typeTxt: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
    },
    chooseTxt: {
        fontSize: 15,
        fontWeight: '600',
        textDecorationLine: 'underline'
    },
    audioPlayerContainer: {
        backgroundColor: "#ebebeb"
    },
    headline: {
        marginTop: '5%',
        position: "relative",
        zIndex: 1
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
    saveBtn: {
        marginLeft: "5%",
        marginTop: "10%",
        backgroundColor: "#407BFF",
        padding: 10,
        width: "30%",
        borderRadius: 4,

    },
    savetxt: {
        color: "#fff",
        textAlign: "center"
    },
    dropdownview: {
        flexDirection: 'row',
        alignItems: "center",
        width: "80%",
        marginLeft: "5%",
        paddingRight: "5%",
        marginTop: "5%",
        gap: 30,
    },
    msgtxt: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: '700',
        marginTop: "5%",
        color: "green"
    }
})
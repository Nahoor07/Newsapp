import React, { useEffect, useState } from 'react';
import { StyleSheet,ScrollView, Text, View, Image, TouchableOpacity, TouchableWithoutFeedback,Alert  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NewsImage from '../../assets/images/ronaldo.jpeg'
import { Entypo } from "@expo/vector-icons"
import { BASE_URL } from '@env';
import { FlashList } from "@shopify/flash-list";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { parseISO } from 'date-fns';
import { useNavigation, useRoute } from '@react-navigation/native';


const RenderLatestNews = ({ item }) => {
  console.log('data', item)
  const navigation = useNavigation();
  const [showOptions, setShowOptions] = useState(false);
  const [deleteData,setDeleteData]= useState();
  const [successMessage, setSuccessMessage] = useState('');

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };
  const timestamp = item?.created_at;

  // Parse the ISO timestamp to a Date object
  const parsedTimestamp = parseISO(timestamp);

  // Format the Date object as desired
  const formattedTimestamp = format(parsedTimestamp, "do MMMM yyyy");

 
  const handleDelete = async (id) => {
    console.log("id::", id);
    try {
      let token = await AsyncStorage.getItem('token');
      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${BASE_URL}api/delete/news/${id}`, config);
      console.log('asd response', response.data);
  
      if (response.data.status === 'Success') {
        window.alert('Success: ' + response.data.data);
        navigation.navigate("Profile")
      } else {
        console.error('Error message:', response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  


  return (
    <>
      <View style={styles.artcileView}>
        <View style={styles.articleCard} >
          <Image source={{ uri: item?.image }} style={styles.newsImg} />
          <View style={styles.articleTextContainer}>
            <Text style={styles.articletxt}>{item?.title}</Text>
            <Text style={styles.timestramp}>{formattedTimestamp}</Text>
          </View>
          <View style={styles.editSection}>
            <TouchableOpacity onPress={toggleOptions}>
              <Entypo name='dots-three-vertical' size={20} color='#000' />
            </TouchableOpacity>
          </View>
        </View>
        {showOptions && (
          <View style={styles.optionsContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('EditArticle', { id: item?.id })}><Text style={styles.edittxt}>Edit</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>handleDelete(item?.id)}><Text style={styles.edittxt}>Delete</Text></TouchableOpacity>
            <Text style={styles.edittxt}>Mark as New</Text>
            <Text style={styles.edittxt}>Mark as Popular</Text>
          </View>
        )}
        <View style={styles.hairline} />
        <View style={styles.articleStatus}>
          <View style={styles.viewsContainer}>
            <Text style={styles.viewNumb}>{item?.views}</Text>
            <Text style={styles.viewTxt}>Views</Text>
          </View>
          <View style={styles.viewsContainer}>
            <Text style={styles.viewNumb}>{item?.reads}</Text>
            <Text style={styles.viewTxt}>Reads</Text>
          </View>
          <View style={styles.viewsContainer}>
            <Text style={styles.viewNumb}>{item?.saveds}</Text>
            <Text style={styles.viewTxt}>Saves</Text>
          </View>
          <View style={styles.viewsContainer}>
            <Text style={styles.viewNumb}>{item?.plays}</Text>
            <Text style={styles.viewTxt}>Played</Text>
          </View>
        </View>
        <View style={styles.hairline} />
       
      </View>
    </>
  );
}




export default function Articles() {
  const [showOptions, setShowOptions] = useState(false);
  const [data, setData] = useState();


  const retrieveArticle = async () => {
    try {
      let token = await AsyncStorage.getItem('token');
      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${BASE_URL}api/dashboard/articles`, config);
      setData(response.data);


    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    retrieveArticle();
  }, [])
  return (
    <TouchableWithoutFeedback onPress={() => setShowOptions(!showOptions)}>
      <SafeAreaView style={styles.container}>
        <View style={styles.scrollContainer}>
          <FlashList
            data={data?.data}
            renderItem={({ item }) => <RenderLatestNews item={item} />}
            estimatedItemSize={200}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  artcileView: {
    marginBottom: "5%"
  },
  articleCard: {
    marginLeft: '1%',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10%',
  },
  newsImg: {
    width: 90,
    height: 70,
    borderRadius: 10,
  },
  articleTextContainer: {
    width: '70%',
  },
  articletxt: {
    fontWeight: '500',
    fontSize: 15,
  },
  timestramp: {
    marginTop: '3%',
    fontWeight: '400',
    color: '#7d7e80',
  },
  hairline: {
    backgroundColor: '#D3D3D3',
    height: 1,
    width: '100%',
  },
  optionsContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 50,
    alignSelf: 'flex-end',
    position: "absolute",
    zIndex: 1,
    width: '50%',
    paddingLeft: '10%',

  },
  edittxt: {
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 50,

  },
  editSection: {
    position: "relative"
  },
  articleStatus: {
    flexDirection: "row",
    justifyContent: 'space-between',
    marginTop: '5%',
    marginBottom: "10%"
  },
  viewsContainer: {
    marginHorizontal: 10,

  },
  viewNumb: {
    fontSize: 17,
    fontWeight: '500',
    marginVertical: 10,
  },
  viewTxt: {
    fontWeight: "400",
    color: '#808080'
  }
});

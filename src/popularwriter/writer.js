import { ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Team from '../../assets/images/team.jpg'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { BASE_URL } from '@env';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'


export default function Writer() {
  const route = useRoute();
  const { id } = route?.params;
  const [data, setData] = useState();
  const [articles, setArticles] = useState();
  const newsData = () => {
    const apiUrl = `${BASE_URL}api/front/writer-has/articles/${id}`;

    axios.get(apiUrl)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        return response.data;
      })
      .then((data) => {
        setData(data?.writer);
        setArticles(data?.articles)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    newsData();
  }, [])

  const handleFollow = async (id) => {
    console.log("writer id ", id)
    try {
        let token = await AsyncStorage.getItem('token');
        const config = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        console.log(`${BASE_URL}api/follow/publisher/${id}`,config)
        const response = await axios.get(`${BASE_URL}api/follow/publisher/${id}`);
        console.log(response)
        

    } catch (error) {
        console.error(error.response);
    }
};

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.writerDetail}>
        <View style={styles.writerView} >
          <Image source={{ uri: data?.image }} style={styles.profileImg} resizeMode='cover' />
          <TouchableOpacity style={styles.plusIcon} onPress={()=>handleFollow(data?.id)} >         
          <AntDesign name='pluscircle' color='#407BFF' size={20}  />
          </TouchableOpacity>
        </View>
        <View style={styles.writerName}>
          <Text style={styles.title}>{data?.name}</Text>
        </View>
      </View>
      <View>
        {Array.isArray(articles) && articles.length > 0 ? (
          articles.map((article, index) => (
            <View style={styles.articleContainer} key={index}>
              <Image source={{ uri: article.image }} style={styles.articleImg} />
              <View style={styles.articledetails}>
                <Text style={styles.typetxt}>{article.newspaper}</Text>
                <Text style={styles.articletitle}>{article.name}</Text>
                <View style={styles.articleFooter}>
                  <Text style={styles.timestramp}>{article.timestamp}</Text>
                  <View style={styles.latestNewsIcons}>
                    <TouchableOpacity>
                      <AntDesign name="sound" size={25} color="#407BFF" />
                    </TouchableOpacity>
                    <MaterialCommunityIcons name="bookmark-plus-outline" size={25} color="#407BFF" />
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.datamsg}>There are no articles against this writer </Text>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: '5%',

  },
  writerDetail: {
    flexDirection: "row",
    alignItems: 'center',
    gap: 10,
  },
  profileImg: {
    width: 80,
    height: 80,
    borderRadius: 50,
    objectFit: 'cover',
    position: "relative"
  },
  title: {
    fontWeight: '400',
    fontSize: 16,

  },
  plusIcon: {
    position: 'absolute',
    top: 1,
    right: 1,
  },
  writerView: {
    flexDirection: "row",
    width: 85,
    alignItems: 'center'
  },
  writerName: {
    flexDirection: 'column',
    gap: 5,
  },
  subtitle: {
    color: '#0D0D0D80'
  },
  articleContainer: {
    flexDirection: "row",
    marginTop: "5%",
    marginLeft: "4%",
    marginRight: "5%",
    gap: 10,
    alignItems: "center",
    marginBottom: "5%"
  },
  articleImg: {
    width: 100,
    height: 100,
    borderRadius: 10,
    objectFit: "cover"
  },
  articledetails: {
    flexDirection: 'column',
    width: "70%"

  },
  articleFooter: {
    marginTop: "5%",
    flexDirection: "row",
    justifyContent: 'space-between'
  },
  latestNewsIcons: {
    flexDirection: "row",
    gap: 8,
  },
  typetxt: {
    color: "#666666",
    fontWeight: "500",
    fontSize: 14,
  },
  articletitle: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "400"
  }, timestramp: {
    color: '#666666',
    fontSize: 14,
  },
  hairline: {
    backgroundColor: '#D3D3D3',
    height: 1,
    width: '100%',
  },
  datamsg: {
    textAlign: 'center',
    marginTop: "15%",
    fontWeight: '600',
    fontSize: 16,
  }
})
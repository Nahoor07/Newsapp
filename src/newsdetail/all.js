import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import Swiper from 'react-native-swiper';
import { AntDesign, MaterialCommunityIcons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { BASE_URL } from '@env';
import { FlashList } from "@shopify/flash-list";
import { format } from 'date-fns';
import { parseISO } from 'date-fns';
import { Audio } from 'expo-av';
import axios from 'axios';





const RenderLatestNews = ({ item }) => {
  const [iconColor, setIconColor] = useState('#c1c1c1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState();
  const [sound, setSound] = useState(null);
  const [voices, setVoices] = useState(null);

  const timestamp = item?.created_at;
  const parsedTimestamp = parseISO(timestamp);
  const formattedTimestamp = format(parsedTimestamp, "do MMMM yyyy");

  const handleVoice = async () => {
    const apiUrl = `${BASE_URL}api/translate/${item?.id}/title`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('data =>>>>>>>>>>>>>', data?.path);
      setAudioUrl(data?.path);
      setIsPlaying(!isPlaying);
      setIconColor(iconColor === '#c1c1c1' ? '#407BFF' : '#c1c1c1');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (audioUrl) {
      (async () => {
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true }
        );

        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
        })
        sound.playAsync();
      })();
    }
  }, [audioUrl, isPlaying]);


  useEffect(() => {
    console.log('in use')
    if (audioUrl) {
      // const { sound } = await Audio.Sound.createAsync(
      //   { uri: audioUrl },
      //   { shouldPlay: false }
      // );

    }
  }, [audioUrl]);

  useEffect(() => {
    console.log('first')
  }, [audioUrl])

  // useEffect(() => {
  //   if (sound && audioUrl) {
  //     (async () => {
  //       if (isPlaying) {
  //         await sound.playAsync();
  //       } else {
  //         await sound.pauseAsync();
  //       }
  //     })();
  //   }
  // }, [sound, isPlaying, audioUrl]);

  return (
    <>
      <View style={styles.latestNews}>
        <Image source={{ uri: item?.image }} style={styles.newsImg} />
        <View style={styles.articleTextContainer}>
          <Text style={styles.articletxt}>
            {item?.title}
          </Text>
          <View style={styles.containerTime}>
            <Text style={styles.timestramp}>{formattedTimestamp}</Text>
            <View style={styles.latestNewsIcons}>
              <TouchableOpacity onPress={() => handleVoice()}>
                <AntDesign name="sound" size={25} color={iconColor} />
              </TouchableOpacity>
              <MaterialCommunityIcons name="bookmark-plus-outline" size={25} color="#407BFF" />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.hairline} />
    </>
  );
}

export default function All({ data }) {
  const navigation = useNavigation();

  const [imageIndex, setImageIndex] = useState(0);
  const handleCurrentIndex = (index) => {
    setImageIndex(index)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.breakingNews}>
        <Text style={styles.breakingHeading}>Breaking News</Text>
      </View>

      {useMemo(() => (
        <>
          {data?.breaking_news &&
            <View style={{ height: 250 }} >
              <Swiper onIndexChanged={(index) => handleCurrentIndex(index)} showsButtons={false} showsPagination={false}>
                {data?.breaking_news?.map((item,index) => {
                  return (
                    <TouchableOpacity activeOpacity={0.7} style={styles.slideContainer} key={index} onPress={() => navigation.navigate('ArticleDetail', { id: item?.id })}>
                      <Image
                        source={{
                          uri: item?.bg_image
                        }}
                        style={styles.sportsImage}
                        resizeMode="cover"

                      />
                      <View style={styles.overlay} />
                      <Text style={styles.slideText}>{item?.title}</Text>

                    </TouchableOpacity>
                  );
                })}
              </Swiper>
            </View>
          }
        </>
      ), [data?.breaking_news])}

      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', gap: 15, marginTop: 16 }}>
        {Array(data?.breaking_news?.length).fill(undefined)?.map((_, index) => (
          <View style={[styles.sliderDot, imageIndex === index ? { backgroundColor: '#407BFF' } : {}]} key={index} />
        ))}
      </View>

      <View style={styles.latestNewsContainer}>
        <View style={styles.newsContainer}>
          <Text style={styles.breakingHeading}>Latest News</Text>
          <Text style={styles.seeMoreTxt}> See More</Text>
        </View>
        {/* flashlist */}
        <View style={{ height: 250 }}>
          <FlashList
            data={data?.latest_news}
            renderItem={({ item }) => <RenderLatestNews item={item} />}
            estimatedItemSize={200}
          />
        </View>
        {/* --------- */}
      </View>

      {/* Sports Section */}
      <View style={styles.sportContainer}>
        <View style={styles.newsContainer}>
          <Text style={styles.breakingHeading}>Sports</Text>
          <Text style={styles.seeMoreTxt}>See More</Text>
        </View>
        {data?.sports?.length ? (
          <View style={styles.sportSliderContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('ArticleDetail')}>
              <Swiper
                height={200}
                autoplay={false}
                showsPagination={false}
              >
                {data?.sports?.map((item,index) => {
                  return (
                    <View style={styles.slideContainer} key={index}>
                      <Image
                        source={{
                          uri: item?.bg_image
                        }}
                        style={styles.sportsImage}
                        resizeMode="cover"
                      />
                      <View style={styles.overlay} />
                      <Text style={styles.slideText}>{item?.title}</Text>
                    </View>
                  );
                })}
              </Swiper>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noDataText}>Currently there is no sports Added</Text>
        )}
      </View>

      {/* Politics Section */}
      <View style={styles.sportContainer}>
        <View style={styles.newsContainer}>
          <Text style={styles.breakingHeading}>Politics</Text>
          <Text style={styles.seeMoreTxt}> See More</Text>
        </View>
        {data?.politics?.length ? (
          <View style={styles.sportSliderContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('ArticleDetail')}>
              <Swiper
                height={200}
                autoplay={false}
                showsPagination={false}
              >
                {data?.politics?.map((item,index) => {
                  return (
                    <View style={styles.slideContainer} key={index}>
                      <Image
                        source={{
                          uri: item?.bg_image
                        }}
                        style={styles.sportsImage}
                        resizeMode="cover"
                      />
                      <View style={styles.overlay} />
                      <Text style={styles.slideText}>{item?.title}</Text>
                    </View>
                  );
                })}
              </Swiper>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noDataText}>Currently there is no politics Added</Text>
        )}
      </View>
      {/* Entertainment Section */}
      <View style={styles.sportContainer}>
        <View style={styles.newsContainer}>
          <Text style={styles.breakingHeading}>Entertainment</Text>
          <Text style={styles.seeMoreTxt}> See More</Text>
        </View>
        {data?.entertainment?.length ? (
          <View style={styles.sportSliderContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('ArticleDetail')}>
              <Swiper
                height={200}
                autoplay={false}
                showsPagination={false}
              >
                {data?.entertainment?.map((item,index) => {
                  return (
                    <View style={styles.slideContainer} key={index}>
                      <Image
                        source={{
                          uri: item?.bg_image
                        }}
                        style={styles.sportsImage}
                        resizeMode="cover"
                      />
                      <View style={styles.overlay} />
                      <Text style={styles.slideText}>{item?.title}</Text>
                    </View>
                  );
                })}
              </Swiper>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noDataText}>Currently there is no entertainment Added</Text>
        )}
      </View>
      {/* Economics Section */}
      <View style={styles.sportContainer}>
        <View style={styles.newsContainer}>
          <Text style={styles.breakingHeading}>Economics</Text>
          <Text style={styles.seeMoreTxt}> See More</Text>
        </View>
        {data?.economics?.length ? (
          <View style={styles.sportSliderContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('ArticleDetail')}>
              <Swiper
                height={200}
                autoplay={false}
                showsPagination={false}
              >
                {data?.economics?.map((item,index) => {
                  return (
                    <View style={styles.slideContainer} key={index}>
                      <Image
                        source={{
                          uri: item?.bg_image
                        }}
                        style={styles.sportsImage}
                        resizeMode="cover"
                      />
                      <View style={styles.overlay} />
                      <Text style={styles.slideText}>{item?.title}</Text>
                    </View>
                  );
                })}
              </Swiper>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noDataText}>Currently there is no economics Added</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: '40%'
  },
  breakingNews: {
    marginTop: '10%',
  },
  breakingHeading: {
    fontWeight: '800',
    fontSize: 18,
  },
  slide1: {
    flex: 1,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  sliderDot: {
    width: 8,
    height: 8,
    borderRadius: 50,
    backgroundColor: '#D9D9D9',
  },
  latestNewsContainer: {
    marginTop: '15%',
  },
  latestNews: {
    flexDirection: 'row',
    marginTop: '5%',
    gap: 18,
    marginBottom: "5%"
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
    marginTop: '4%',
    fontWeight: '400',
    color: '#7d7e80',
  },
  containerTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  latestNewsIcons: {
    flexDirection: 'row',
    gap: 5,
  },
  hairline: {
    backgroundColor: '#D3D3D3',
    height: 1,
    width: '100%',
  },
  sportContainer: {
    marginTop: '5%'
  },
  newsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  seeMoreTxt: {
    fontSize: 16,
    color: '#407BFF'
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    height: 200,

  },

  slideText: {
    color: '#fff',
    fontSize: 16,
    bottom: 20,
    marginLeft: '8%',
    position: "absolute"
  },
  sportSliderContainer: {
    marginTop: '5%'
  },
  sportsImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
  },
  noDataText: {
    textAlign: 'center',
    marginTop: '5%',
    marginBottom: "5%",
    fontWeight: '400'
  }
});

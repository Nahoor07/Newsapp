import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LatestArticle from '../homepage/latestarticle';
import Articlelist from '../homepage/articlelist';
import Newspaper from '../newspaper/newspaper';
import Recommendednewspaper from '../homepage/recommendednewspaper';
import Popularwriters from '../homepage/popularwriters';
import Explorearticle from '../homepage/explorearticle';
import { ScrollView } from 'react-native';


const Search = (props) => {
    const [query, setQuery] = useState(props.route.params.query);
    const [searchResults, setSearchResults] = useState([]);
    const searchArticle = async () => {
        try {
            let token = await AsyncStorage.getItem('token');
            const config = {
                headers: {
                    Accept: 'application/json',
                },
            };
            const response = await axios.post(`${BASE_URL}api/search?search=${query}`, config);
            setSearchResults(response.data);
            console.log(response.data)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        searchArticle()
    }, [])
    return (
        <ScrollView style={styles.container}>
            <Newspaper searchResults={searchResults} />
            <Articlelist searchResults={searchResults} />
            <Popularwriters searchResults={searchResults} />
            <Explorearticle searchResults={searchResults} />

        </ScrollView>
    )
}

export default Search

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
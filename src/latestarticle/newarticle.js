import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import Explorearticle from '../homepage/explorearticle'
import Articlelist from '../homepage/articlelist'

export default function Newarticle() {
  return (
    <ScrollView>
        <View style={styles.container}>
           <Explorearticle/>
           <Articlelist/>
        </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:'3%',
    }
})
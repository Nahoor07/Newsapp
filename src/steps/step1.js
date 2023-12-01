import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Step1MainImg } from '../../utils/svgs/steps/step1'
import Layout from '../../utils/layout'
import { ScrollView } from 'react-native-gesture-handler'

const Step1 = () => {
  const navigation = useNavigation();

  return (
    <Layout>
      <ScrollView>
        <View style={styles.main}>
          <View style={{ marginTop: '48%', alignItems: 'center' }}>
            <Step1MainImg />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.step1Title}>Enjoy unlimited content</Text>
            <View style={styles.discView}>
              <Text style={styles.discText}>Find unlimited contents from different</Text>
              <Text style={styles.discText}>newspapers around the world</Text>
            </View>
            <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate("Step2")}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Layout>
  )
}

export default Step1

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginBottom: '5%',
  },
  step1Title: {
    marginTop: '19%',
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
  },
  discView: {
    margin: 5,
    marginBottom: '18%',
    padding: 3,
    marginTop: 14,
    alignItems: 'center',
  },
  discText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#808080',
  },
  buttonContainer: {
    backgroundColor: '#407BFF',
    width: '96%',
    borderRadius: 25,
    padding: 13,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
})
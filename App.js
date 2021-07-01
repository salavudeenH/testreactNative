import React,{useState} from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert,Image,ScrollView } from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const Separator = () => (
  <View style={styles.separator} />
);

const App = () =>{
  const [photoCamera,setPhotoCamera] = useState(null)
  const [photoLibrary,setPhotoLibrary] = useState(null)
  const [texte,setTexte] = useState('')

  const openCamera =  () =>{
    launchCamera({base64:true,mediaType:'photo',quality:1,includeBase64:true,saveToPhotos:true,cancelButtonTitle: "Annuler",maxWidth:1000,maxHeight:600},(response) => {
      console.log(response.assets[0].base64)
      setPhotoCamera(response.assets[0].uri)
      detectText(response.assets[0].base64)
    })
  }
 
  const openLibrary =  () =>{
    launchImageLibrary({},(response) => {
      console.log(response)
     setPhotoLibrary(response.assets[0].uri)
    })
  }

  const detectText = (base64) => {
    fetch("https://vision.googleapis.com/v1/images:annotate?key=" + "AIzaSyBz4Z44pTS0fHLYyZ7W1_Cs-Lv6zvjB138", {
        method: 'POST',
        body: JSON.stringify({
          "requests": [{
            "image": { "content": base64 },
            "features": [
                { "type": "TEXT_DETECTION" }
            ]}]
      })
    })
    .then(response => { return response.json()})
    .then(jsonRes => {    
      let text = jsonRes.responses[0].fullTextAnnotation.text
      // navigation.navigate('ContactScreen', { text: text })
      console.log(text)
      setTexte(text)
    }).catch(err => {
      console.log('Error', err)
    })
  }

  return (
<ScrollView>
<SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.title}>
            ouvrir camera
          </Text>
          <Button
            title="Press me"
            onPress={() => openCamera()}
          />
        </View>
        <Separator />
        <View>
          <Text style={styles.title}>
            Ouvrir Phototheque
          </Text>
          <Button
            title="Press me"
            color="#f194ff"
            onPress={() => openLibrary()}
          />
        </View>
        <Separator />
        <Text>{texte}</Text>
        <Separator />
    <View>
    <Image source={{uri:photoCamera}} style={{width:480,height:480}}></Image>
    </View>
      </SafeAreaView>      
      </ScrollView>    
  )};
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      marginHorizontal: 16,
    },
    title: {
      textAlign: 'center',
      marginVertical: 8,
    },
    fixToText: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    separator: {
      marginVertical: 8,
      borderBottomColor: '#737373',
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
  });
  

export default App;


// const detectText =(base64) =>{
  //   fetch("https://vision.googleapis.com/v1/images:annotate?key=" + "AIzaSyBz4Z44pTS0fHLYyZ7W1_Cs-Lv6zvjB138", {
  //       method: 'POST',
  //       body: JSON.stringify({
  //         "requests": [{
  //           "image": { "content": base64 },
  //           "features": [
  //               { "type": "TEXT_DETECTION" }
  //           ]}]
  //     })
  //   })
  //   .then(response => { return response.json()})
  //   .then(jsonRes => {
  //     let text = jsonRes.responses[0].fullTextAnnotation.text
  //     this.props.navigation.navigate('ContactScreen', { text: text })
  //   }).catch(err => {
  //     console.log('Error', err)
  //   })
  // }
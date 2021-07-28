import React, {useState} from 'react';
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import TesseractOcr, {LANG_ENGLISH} from 'react-native-tesseract-ocr';

const Separator = () => <View style={styles.separator} />;

const Home = ({navigation}) => {
  const [photoCamera, setPhotoCamera] = useState(null);
  const [photoLibrary, setPhotoLibrary] = useState(null);
  const [texte, setTexte] = useState('');
  // const [lines, setLines] = useState([]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  

  const openCamera = () => {
    launchCamera(
      {
        base64: true,
        mediaType: 'photo',
        quality: 1,
        includeBase64: true,
        saveToPhotos: true,
        cancelButtonTitle: 'Annuler',
        maxWidth: 1000,
        maxHeight: 600,
      },
      response => {
        // console.log(response.assets[0].base64);
        setPhotoCamera(response.assets[0].uri);
        detectText(response.assets[0].base64);
      },
    );
  };

  const openLibrary = () => {
    launchImageLibrary({includeBase64: true}, response => {
      // console.log(response);
      setPhotoLibrary(response.assets[0].uri);
      detectText(response.assets[0].base64);
      // test();
    });
  };

  const detectText = base64 => {
    fetch(
      'https://vision.googleapis.com/v1/images:annotate?key=' +
        'AIzaSyBz4Z44pTS0fHLYyZ7W1_Cs-Lv6zvjB138',
      {
        method: 'POST',
        body: JSON.stringify({
          requests: [
            {
              image: {content: base64},
              features: [
                {type: 'LABEL_DETECTION'},
                // {type: 'LANDMARK_DETECTION'},
                // {type: 'FACE_DETECTION'},
                // {type: 'LOGO_DETECTION'},
                // {type: 'TEXT_DETECTION'},
                // {type: 'DOCUMENT_TEXT_DETECTION'},
                // {type: 'SAFE_SEARCH_DETECTION'},
                // {type: 'IMAGE_PROPERTIES'},
                // {type: 'CROP_HINTS'},
                // {type: 'WEB_DETECTION'},
                {type: 'DOCUMENT_TEXT_DETECTION'},
              ],
            },
          ],
        }),
      },
    )
      .then(response => {
        return response.json();
      })
      .then(jsonRes => {
        // console.log(
        //   'jsonRes--->',
        //   jsonRes.responses[0].fullTextAnnotation.text,
        // );
        // console.log('jsonRes--->', jsonRes);
        // console.log(jsonRes.responses[0].textAnnotations)
        let result = jsonRes.responses[0].fullTextAnnotation.text.toString();
        let resultDescription = jsonRes.responses[0].textAnnotations
        console.log(result)
        // console.log(resultDescription)
        let title = resultDescription[1].description 
        setTitle(title);
        // console.log(resultDescription[1].description)
        // let total = result.lastIndexOf('Total');
        // let position= result.substring(total)
        let regex = /total( ttc)?(.*?)((\d{1,3} )*\d+([\.,]\d{1,2})?)/gis;
        let totalAmount = result.match(regex)
        console.log(totalAmount)
        setTexte(totalAmount);
        let Date = result.match(/\d{2}([\/.-])\d{2}\1\d{4}/g);
        setDate(Date);
        // let iTotalLabel = result.map(x => x.description.toLowerCase() == 'total').lastIndexOf(true)

        // console.log(iTotalLabel)
        // console.log(result[iTotalLabel + 1].description)
        // let total = recoverNextNumber(result,iTotalLabel)
        // console.log(total)

        // setAmount(total);
        // console.log(result[iTotalLabel + 1].description)
        // let totalValue = result.
        // let result = jsonRes.responses[0].fullTextAnnotation.text;
        // setTexte(result);
        // console.log(result)
        // let total = result.lastIndexOf('Total');
        // let total = result.includes('Total');
        // console.log(total);
        // console.log(result.lastIndexOf('Total'))
        // let indexTotal = result.lastIndexOf('Total')
        // // console.log(result.substring(indexTotal) + 5)
        // let position= result.substring(indexTotal) + 5
        // let regex = /\d+(.\d{1,2})?/;
        // let totalPosition = position.match(regex)
        // let amountTotal = totalPosition[0]
        // console.log(amountTotal)
        // let texte2 = text.lastIndexOf('TOTAL TTC')
        // let texte3 = text.lastIndexOf('TOTAL')
        // let Date = text.match(/\d{2}([\/.-])\d{2}\1\d{4}/g);
        // setDate(Date);
        // if(total){
        //   let position = result.substring(texte1)
        //   let regex = /\d+(.\d{1,2})?/;
        //   let totalPosition = position.match(regex)
        //   let amountTotal = totalPosition[0]
        //   console.log(amountTotal)
        //   setAmount(amountTotal);
        // }
        // if(texte2){
        //   let position = text.substring(texte2)
        //   let regex = /\d+(.\d{1,2})?/;
        //   let total = position.match(regex)
        //   let amountTotal = total[0]
        //   console.log(amountTotal)
        //   setAmount(amountTotal);
        // }
        // if(texte3){
        //   let position = text.substring(texte3)
        //   let regex = /\d+(.\d{1,2})?/;
        //   let total = position.match(regex)
        //   let amountTotal = total[0]
        //   console.log(amountTotal)
        //   setAmount(amountTotal);
        // }

        
      })
      .catch(err => {
        console.log('Error', err);
      });
  };
  // function recoverNextNumber(result,iTotalLabel){
  //   console.log(result)
  //   isNumber = false;
  //   index = iTotalLabel + 1 
  //   while(isNumber == false){
  //     let value = result[index].description 
  //     if(isNaN(parseFloat(value)) == false){
  //       isNumber = true;
  //     }
  //     else{
  //       index = index + 1
  //     }
  //   }
  //   return result[index].description
  // }

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.title}>ouvrir camera</Text>
          <Button title="Press me" onPress={() => openCamera()} />
        </View>
        <Separator />
        <View>
          <Text style={styles.title}>Ouvrir Phototheque</Text>
          <Button
            title="Open Library"
            color="#f194ff"
            onPress={() => openLibrary()}
          />
        </View>
        <Separator />
        <Text>{texte}</Text>
        <Separator />
        {/* <View>
          <Image
            source={{uri: photoLibrary}}
            style={{width: 480, height: 480}}></Image>
        </View> */}
          <Separator />
          <Text>Entreprise : {title}</Text>
          <Text>Total Amount : {amount}</Text>
          <Text>Date: {date}</Text>
        <Button
          title="Continuer"
          onPress={() =>
            navigation.navigate('Details', {
              texte,
            })
          }
        />
      </SafeAreaView>
    </ScrollView>
  );
};
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

export default Home;

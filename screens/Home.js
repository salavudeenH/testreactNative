import React, { useState } from 'react';
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  Alert,
  Image,
  ScrollView,
  FlatList
} from 'react-native';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Invoice } from './class/invoice';
// import TesseractOcr, {LANG_ENGLISH} from 'react-native-tesseract-ocr';

const Separator = () => <View style={styles.separator} />;

const Home = ({ navigation }) => {
  const [photoCamera, setPhotoCamera] = useState(null);
  const [photoLibrary, setPhotoLibrary] = useState(null);
  const [texte, setTexte] = useState('');
  // const [lines, setLines] = useState([]);
  // const [amount, setAmount] = useState('');
  // const [date, setDate] = useState('');
  // const [title, setTitle] = useState('');
  const [total, setTotal] = useState('');
  const [percentTVA, setPercentTVA] = useState('');
  const [amountTVA, setAmountTVA] = useState('');
  const [totalHt, setTotalHT] = useState('');


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
    launchImageLibrary({ includeBase64: true }, response => {
      // console.log(response);
      setPhotoLibrary(response.assets[0].uri);
      detectText(response.assets[0].base64);
      // test();
    });
  };

  const detectText = base64 => {
    const totalRegexp = /total( ttc)?(.*?)((\d{1,3} )*\d+([\.,]\d{1,2})?)/gis;
    const totalHTRegexp = /total ht(.*?)((\d{1,3} )*\d+([\.,]\d{1,2})?)/gis;
    const amountRegexp = /((\d{1,3} )*\d+([\.,]\d{1,2})?)/gis;
    const tvaRegexp = /tva ?((\d{1,3} )*\d+([\.,]\d{1,2})?)%(.*?)((\d{1,3} )*\d+([\.,]\d{1,2})?)/gis
    const dateRegexp = /([0,1,2][0-9])[/,-]([0,1][0-9])[/,-]([0-9]{4})/g;

    var invoice = new Invoice();

    fetch(
      'https://vision.googleapis.com/v1/images:annotate?key=' +
      'AIzaSyBz4Z44pTS0fHLYyZ7W1_Cs-Lv6zvjB138',
      {
        method: 'POST',
        body: JSON.stringify({
          requests: [
            {
              image: { content: base64 },
              features: [
                { type: 'LABEL_DETECTION' },
                // {type: 'LANDMARK_DETECTION'},
                // {type: 'FACE_DETECTION'},
                // {type: 'LOGO_DETECTION'},
                // {type: 'TEXT_DETECTION'},
                // {type: 'DOCUMENT_TEXT_DETECTION'},
                // {type: 'SAFE_SEARCH_DETECTION'},
                // {type: 'IMAGE_PROPERTIES'},
                // {type: 'CROP_HINTS'},
                // {type: 'WEB_DETECTION'},
                { type: 'DOCUMENT_TEXT_DETECTION' },
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
        //On récupère le rendu json transformé en texte
        let result = jsonRes.responses[0].fullTextAnnotation.text.toString();

        //On récupère le pourcentage et le montant de la tva
        invoice.tva = FindTVA(result);

        //On récupère le montant total de la facture
        invoice.total = FindTotalAmount(result);

        //On récupère le montant total ht de la facture
        invoice.totalHT = FindTotalHTAmount(result);

        //On récupère les détails de la facture;
        FindDetails(result);

        //let resultDescription = jsonRes.responses[0].textAnnotations
        //invoice.title = resultDescription[1].description 
        //setTitle(invoice.title);

        //let Date = result.match(/\d{2}([\/.-])\d{2}\1\d{4}/g);
        //setDate(Date);

        // console.log(invoice)

        //On assigne les données trouvées
        setTotal(invoice.total);
        setPercentTVA(invoice.tva[0].match(/((\d{1,3} )*\d+([\.,]\d{1,2})?)/gis)[0]);
        setAmountTVA(invoice.tva[1]);
        setTotalHT(invoice.totalHT);

      })
      .catch(err => {
        console.log('Error', err);
      });

    //Méthode permettant de récupérer les données de tva
    function FindTVA(result) {
      //On récupère le texte correspondant à la tva
      let tvaString = result.match(tvaRegexp)[0];
      //On découpe la chaine récupéré et la partie de gauche correspond au pourcentage
      var percentTva = tvaString.split("%")[0].replace(/\r?\n|\r/g, "")
      //On découpe la chaine récupéré et la partie de droite correspond au montant
      var amountTva = tvaString.split("%")[1].replace(/\r?\n|\r/g, "")

      //Si le montant tva possède le symbole '€' en fin de chaine, on l'enlève
      if (amountTva[amountTva.length - 1] == "€")
        amountTva = amountTva.split.pop()

      //On retourne un tableau avec le pourcentage et le montant
      return [percentTva, amountTva];
    }

    //Méthode permettant de récupérer le montant total
    function FindTotalAmount(result) {
      //On récupère la liste des éléments correspondant à la regex
      let totalArray = result.match(totalRegexp);
      //On récupère le dernier élément de la liste
      let lastTotal = totalArray[totalArray.length - 1];
      //On récupère uniquement le montant
      return lastTotal.match(amountRegexp)[0].replace(/\r?\n|\r/g, "");
    }

    //Méthode permettant de récupérer le montant total ht
    function FindTotalHTAmount(result) {
      //On récupère la liste des éléments correspondant à la regex
      let totalArray = result.match(totalHTRegexp);
      //On récupère le dernier élément de la liste
      let lastTotal = totalArray[totalArray.length - 1];
      //On récupère uniquement le montant
      return lastTotal.match(amountRegexp)[0].replace(/\r?\n|\r/g, "");
    }

    //Méthode permettant de récupérer les détails
    function FindDetails(result) {
      let indexHT = result.search(totalHTRegexp);
      let dates = result.match(dateRegexp);
      let lastDate = dates[dates.length - 1];
      let indexLastDate = result.search(lastDate);
      let allDetails = result.substring(indexLastDate, indexHT - 1);

      let arrayDetails = allDetails.split(/\r?\n|\r/g);

      console.log(arrayDetails);
    }

    const dataList = [{ key: '1' }, { key: '2' }, { key: '3' }, { key: '4' }, { key: '5' }];
  }

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
        {/* <Text>Entreprise : {title}</Text> */}
        <Text>Montant HT : {totalHt}€</Text>
        <Text>TVA : {percentTVA}%      Montant TVA : {amountTVA}€</Text>
        <Text>Montant Total : {total}€</Text>
        {/* <Text>Date: {date}</Text> */}
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

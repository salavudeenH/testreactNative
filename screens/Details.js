import React,{useState} from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert,Image,ScrollView } from 'react-native';


const Details = ({navigation,route}) =>{
    return (
        <View>
            <Text>{route.params.texte}</Text>
        </View>
    )
}

export default Details;
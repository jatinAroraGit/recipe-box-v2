import * as React from 'react';
import { useState } from 'react';
import axios from 'axios'
import '../configure/apiKey.json'
import { View, StyleSheet, Platform, Text, Dimensions, Picker, TouchableHighlight, KeyboardAvoidingView } from 'react-native';
import { Button, TextInput, Title, Headline, Subheading, Searchbar, List, RadioButton, Chip,Surface, Card } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import SafeAreaView from 'react-native-safe-area-view';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FlatList } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  defaultRounded: {
    
    margin: 6,
    marginTop: 12,
    borderWidth: 0,
    borderRadius: 10,
    padding: 8,
    height: 'auto',
    width: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    backgroundColor:'#4FC3F7'
  },
  label: {
    color: '#4DB6AC',
    margin: 20,
    marginLeft: 0
  },
  button: {
    marginTop: 40,
    height: 20,
    backgroundColor: '#1DE9B6',
    borderRadius: 4
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 3,
    padding: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    height: 'auto',
    minWidth: 320,
    ...Platform.select({
      ios: {
        width: "auto"
      },
      web: {
        width: ((Dimensions.get('window').width) < 500) ? ((Dimensions.get('window').width) - 50) : 600,
      },
      android: {
        width: "auto"
      },
    })
  },
  input: {
    backgroundColor: '#B2DFDB',
    borderWidth: 0,
    height: 40,
    width: 140,
    padding: 5,
    width: "auto",
    borderRadius: 4,
    alignSelf: "stretch"
  },
  inputIngredient: {
    backgroundColor: '#B2DFDB',
    borderWidth: 0,
    height: 20,
    padding: 5,
    width: 220,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 4,
  },
});

var results = {};

function SearchForm({ props }) {
  

    return (

      <SafeAreaView style={{ flex: 3}}>
       <Title>Discover Recipes</Title>

       <Text>Search Bar Here</Text>
       <Button>Apply Filters</Button>
       <Surface style={styles.defaultRounded}>
         <View style={{backgroundColor:"#FF00FF"}}>
                    <Button  style={{ color: '#ffffff', fontSize: 20 }}>View Top Recipes</Button>
                    </View>
                  </Surface>
                  
                   
                   
                   
                
                  <Surface style={[styles.defaultRounded,{background:"https://picsum.photos/700"}]}>
                    <Button  style={{ color: '#ffffff', fontSize: 20 }}>Discover Vegan Recipes</Button>
                  </Surface>
                  <Surface style={styles.defaultRounded}>
                    <Button  style={{ color: '#ffffff', fontSize: 20 }}>Recently Viewed Recipes</Button>
                  </Surface>
      </SafeAreaView>
    );
  
}
export default SearchForm;

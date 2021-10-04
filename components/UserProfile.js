import * as React from 'react';
import { useState } from 'react';

import { View, StyleSheet, Platform, Text, Dimensions, FlatList } from 'react-native';
import { Button, TextInput, Title, Subheading, Avatar, Card, List, Snackbar, Banner, Divider } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form'
import { TouchableHighlight, ScrollView } from 'react-native-gesture-handler';
import Firebase from '../configure/Firebase';
import SafeAreaView from 'react-native-safe-area-view';

const styles = StyleSheet.create({
  label: {
    color: '#FFFFFF',
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
    //position: "relative",
    paddingTop: 3,
    padding: 8,
    backgroundColor: '#263238',
    borderRadius: 10,
    height: 'auto',
    ...Platform.select({
      ios: {
        width: 420
      },
      web: {
        width: ((Dimensions.get('window').width) < 500) ? ((Dimensions.get('window').width) - 50) : 600,
      },
      android: {
        width: 320
      },
    })
  },
  innerContainer: {
    flex: 1,







    height: 'auto',



    elevation: 8,

  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    height: 30,
    padding: 5,
    borderRadius: 4,
  }
});



function UserProfile({ props, user }) {
  console.log('USER PROFLE: ******')

  const [showSnack, setShowSnack] = useState(false);
  var firstName = 'User';
  var lastName = 'Profile';
  console.log('USER IS ))))))))))) : ')
  console.log(user);

  /*if(params.names) {
    firstName = params.names.firstName;
    lastName = params.names.lastName;
  }*/
  // Fill with data from API call for user saved recipes  
  const savedRecipes = [
    /*{ title: "Recipe 1", source: 'https://picsum.photos/200', key: 'item1' },
    { title: "Recipe 2", source: 'https://picsum.photos/200', key: 'item2' },
    { title: "Recipe 3", source: 'https://picsum.photos/200', key: 'item3' }*/
  ];

  // Fill with data from API call for user cookbooks  
  const savedCookbooks = [
    /*{title: "Cookbook 1", source: 'https://picsum.photos/200', key: 'item1'},
    {title: "Cookbook 2", source: 'https://picsum.photos/200', key: 'item2'},
    {title: "Cookbook 3", source: 'https://picsum.photos/200', key: 'item3'}*/
  ];

  // Adds a space between the cards in the Flatlist
  const seperator = () => { return <View style={{ width: 20, height: 20 }} /> }

  // Returns the cards for saved Recipes
  const showRecipeCard = ({ item: item }) => {

    return (
      <Card key={item.key} style={{ width: 200 }} onPress={() => props.navigate('Recipes')}>
        <Card.Cover source={{ uri: item.source }}></Card.Cover>
        <Card.Content>
          <Title >{item.title}</Title>
        </Card.Content>
      </Card>);

  }

  // Returns the cards for Cookbooks
  const showCookbookCard = ({ item: item }) => {

    return (
      <Card key={item.key} style={{ width: 200 }} onPress={() => props.navigate('Cookbook')}>
        <Card.Cover source={{ uri: item.source }}></Card.Cover>
        <Card.Content>
          <Title >{item.title}</Title>
        </Card.Content>
      </Card>);

  }

  // Renders a button to search Recipes if no saved recipes are found
  const noSavedCookbooks = () => {

    return (
      <Button style={{ marginHorizontal: 10, marginVertical: 20, backgroundColor: '#64B5F6' }} mode="contained" onPress={() => props.navigate('CreateCookbook')}>
        Create a Cookbook
      </Button>
    )

  }

  // Renders a button to create cookbook if no cookbooks are found
  const noSavedRecipes = () => {

    return (
      <View>
        <Button style={{ marginHorizontal: 10, marginVertical: 20, backgroundColor: '#64B5F6' }} mode="contained" onPress={() => props.navigate('Search')}>
          Go to Recipes
      </Button>
        <Button style={{ marginHorizontal: 10, marginVertical: 20, backgroundColor: '#64B5F6' }} mode="contained" onPress={() => setShowSnack(true)}>
          Create A Recipe
      </Button>
      </View>
    )

  }

  return (
    <SafeAreaView style={{ flex: 3 }}>
      <Snackbar
        visible={showSnack}
        onDismiss={() => setShowSnack(false)}

        action={{
          label: 'Undo',
          onPress: () => {
            // Do something
          },
        }}
      >
        Hey there! I'm a Snackbar.
        </Snackbar>
      <Banner
        visible={showSnack}
        style={{ backgroundColor: '#EEEEEE' }}
        actions={[
          {
            label: 'Dismiss',
            onPress: () => { setShowSnack(false) },
          }
        ]}

      >
        Under Development
      </Banner>
      <View style={styles.innerContainer}>

      </View>

      <View style={styles.innerContainer} >

      </View>

      <View style={styles.innerContainer} >
        <List.Section>
          <List.Subheader style={{ fontSize: 18 }}>Account</List.Subheader>
          <View style={{ backgroundColor: "#FFFFFF", padding: 0, margin: 0 }}>
            <List.Item style={{ padding: 0, margin: 0 }} titleStyle={{ color: "#283593", fontSize: 18, fontWeight: "bold" }} title="Change Email" left={() => <List.Icon icon="mail" color="#283593" />} onPress={() => props.navigate('ChangeEmail')} right={() => <List.Icon icon="chevron-right" color="#283593" style={{ fontWeight: "bold" }} />} />
            <Divider style={{ backgroundColor: "#000000" }} />
            <List.Item style={{ padding: 0, margin: 0 }} titleStyle={{ color: "#283593", fontSize: 18, fontWeight: "bold" }} title="Change Password" left={() => <List.Icon icon="key" color="#283593" />} onPress={() => props.navigate('ChangePassword')} right={() => <List.Icon icon="chevron-right" color="#000000" />} />
            <Divider style={{ backgroundColor: "#000000" }} />
            <List.Item style={{ padding: 0, margin: 0 }} titleStyle={{ color: "#283593", fontSize: 18, fontWeight: "bold" }} title="Delete Account" left={() => <List.Icon icon="account-remove" color="#283593" />} onPress={() => props.navigate('DeleteUser')} right={() => <List.Icon icon="chevron-right" color="#000000" />} />
          </View>
        </List.Section>

        <List.Section>
          <List.Subheader style={{ fontSize: 18 }}>Privacy</List.Subheader>
          <View style={{ backgroundColor: "#FFFFFF" }}>
            <List.Item style={{ padding: 0, margin: 0 }} titleStyle={{ color: "#283593", fontSize: 18, fontWeight: "bold" }} title="Sharing" left={() => <List.Icon icon="folder" color=" #283593" />} right={() => <List.Icon icon="chevron-right" color="#283593" />} />
            <Divider style={{ backgroundColor: "#000000" }} />
            <List.Item style={{ padding: 0, margin: 0 }} titleStyle={{ color: "#283593", fontSize: 18, fontWeight: "bold" }} title="Caching" left={() => <List.Icon icon="folder" color="#283593" />} right={() => <List.Icon icon="chevron-right" color="#283593" />} />
          </View>
        </List.Section>

      </View>


    </SafeAreaView>

  );


}
export default UserProfile;
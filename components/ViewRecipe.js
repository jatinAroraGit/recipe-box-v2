import React, { useState, useEffect, Component } from 'react';
import {
  StyleSheet, Text, Picker, View, SafeAreaView, Image, ScrollView, Switch, Platform, Dimensions, KeyboardAvoidingView, TouchableOpacity, Alert, TouchableHighlight,
  TextInput
} from "react-native";
import { FAB, Title, Headline, Subheading, Surface, Provider, Modal, Portal, Card, Button, IconButton } from 'react-native-paper';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { PulseIndicator } from 'react-native-indicators';
import Firebase from '../configure/Firebase.js';
import { FlatList } from 'react-native-gesture-handler';
import TopNavbar from './TopNavbar.js';
import { useForm, Controller } from 'react-hook-form'
import * as Print from 'expo-print';


var sanitizeHtml = require('sanitize-html');
var stripHtml = require('string-strip-html');
let apiKey = require('../configure/apiKey.json');
let bakRecipeInfo;
function ViewRecipe({ navigation, recipeDetail }) {
  recipeDetail = JSON.parse(recipeDetail.props);
  let recipeCompleteDetail = {};
  let htmlMain = ""
  let htmlTitle = "<h1>" + recipeDetail.title + "</h1>";
  let htmlDescrition = "";
  let htmlIngredients = "";
  let htmlSteps = "";
  let htmlInfo = "";
  let htmlExtra = "";
  let htmlImage = "";
  // console.log('navigation in ViewRecipe - start');
  let quantiyForList = 1;
  let unitForList = '';

  const [responseStr, setResponseTxt] = useState("Oops! Something Went Wrong. Try Again Please.");
  const [iconName, setIconName] = useState('playlist-plus');
  const [ingred, setIngred] = useState([]); //setIngred is such a '=' sign to connect ingred and ingredientsArray to pass the ingredientsArray to ingred.
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState([]);
  const [ownsRecipe, setOwnsRecipe] = useState(false);
  let [noSteps, setNoSteps] = useState(false);
  let [isFound, setIsFound] = useState(false);
  const [readyInMinutes, setreadyInMinutes] = useState(0);
  const [cookbooksList, setCookbooksList] = useState(0);
  const [listQuantity, setListQuantity] = useState(0);
  let [listUnit, setListUnit] = useState('');

  const [servings, setservings] = useState(0);
  const [recipeInfo, setRecipeInfo] = useState({});
  const [summary, setsummary] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [cookbookShowModal, setCookbookShowModal] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [listModal, setListModal] = useState(false);
  const [currItem, setCurrItem] = useState({});
  const { control, handleSubmit, errors, setError, reset } = useForm({ mode: 'onChange' });

  const [addToCookbook, setAddToCookbook] = useState(false);
  const [successfulAdd, setSuccessfulAdd] = useState(false);
  const [defImage, setDefImage] = useState(true);

  var ingredientsArray = [];
  var stepArray = [];
  var mapArr = [];
  var noInstruction = true;
  let userId = Firebase.auth().currentUser.uid;
  // let noSteps = false;

  useEffect(() => {


    let recipeId = { "id": recipeDetail.id };

    // axios.get('https://api.spoonacular.com/recipes/495111/information?apiKey=5c0548b90b2f4c1aa183c5b455dea8da')

    //axios.get('https://api.spoonacular.com/recipes/' + recipeId + '/analyzedInstructions?apiKey=' + apiKey.key) //Need to change the id and apiKey
    console.log('Calling API: ' + apiKey.baseURL + 'recipes/detail' + "With Obj: ", recipeId);
    axios.post(apiKey.baseURL + 'recipes/detail', recipeId, {
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      withCredentials: false,
    },
    ).then((res) => {

      if (res.data) {

        setIsFound(true);
        let info = res.data;
        if (res.data.userId == userId) {
          setOwnsRecipe(true);
        }

        //  info.userId = "ok9wULEb9cYUn2JYJSSRpo9vtj13";
        setRecipeInfo(info);
        // recipeCompleteDetail = JSON.stringify(res.data);
        console.log('State Recipe Info', recipeInfo);
        //   console.log("Complete Recipe Info Object: ", recipeCompleteDetail);

        const readyInMin = res.data.readyInMinutes;
        setreadyInMinutes(readyInMin)
        const serves = res.data.servings
        setservings(serves);
        const recSummary = res.data.summary;
        // console.log('LENGTH SUMM' + recSummary.length);
        if (recSummary) {
          var cleanSummary = sanitizeHtml(recSummary);
          let pureTextSummary = stripHtml(cleanSummary);
          htmlDescrition = htmlDescrition + "<div><p>" + pureTextSummary + "</p></div>"
          setsummary(pureTextSummary);
        }
        else {
          setsummary('N/A');
        }
        const ingredients = res.data.includedIngredients;

        extractIngredients(ingredients)

        if (res.data.instructions.length != 0) {
          htmlSteps = "<div><h2>Instructions: </h2><ul>"
          //  const info = res.data.analyzedInstructions[0].steps;
          //extractRecipeInformation(res.data.instructions);
          // console.log('HAS STUFF')


          setStep(res.data.instructions);
          setLoading(false);
        } else {
          setNoSteps(() => {
            noSteps = true;
          });

          setLoading(false);
        }

      }
      else {
        setLoading(false);
        setIsFound(false);
        setResponseTxt("Oops!, Something Went Wrong, Try Again Please.");
        setError("noUser", 'no user', "no account uses this email");
      }
    }).catch(error => {

      setIsFound(false);

      setResponseTxt("Oops!, Something Went Wrong, Try Again Please.");
      setLoading(false);
      console.log(error);
    });
  }, []);


  const map = step.map((step, index) => {
    return (

      <Subheading key={index} style={{ color: '#000000', fontWeight: "400" }}>{"\n"}{index + 1}) {step.description} {"\n"}</Subheading >
    )
  })
  /*
  const mapCook = cookbooksList.map((step, index) => {
    return (
      <View>
        <Subheading key={index} style={{ color: '#000000', fontWeight: "400" }}>{"\n"}{index + 1}) {step.title} {"\n"}</Subheading >
        <Button mode={"contained"} style={{ marginEnd: 5, backgroundColor: "#00BFA5" }} onPress={() => addRecipeToCookbook(item)}>Add In This</Button>
      </View>
    )
  })
*/

  const toggleSwitch = (value) => {
    setSwitchValue(value);
  }

  const extractRecipeInformation = (info) => {

    htmlSteps = "<div><h2>Instructions: </h2><ul>"
    for (let i = 0; i < info.length; i++) {
      stepArray.push(info[i].step);
      htmlSteps = htmlSteps + "<li>" + info[i].step + "</li>";
      // console.log(info[i].step);
    }

    setStep(stepArray);
    htmlSteps = htmlSteps + "</ul></li ></div > "
    console.log("PDF HTML***");

    console.log(htmlTitle + htmlDescrition + htmlSteps);


  };

  const extractIngredients = (ingreds) => {
    console.log('A Ingre');
    console.log(ingreds[0]);

    for (let i = 0; i < ingreds.length; i++) {

      ingredientsArray.push(

        {
          id: ingreds[i].id,
          name: ingreds[i].name,
          amount: ingreds[i].amount,
          unit: ingreds[i].unit,
          count: 1

        }

      );
    }


    ingredientsArray = ingredientsArray.filter((ingredElement, index, self) =>
      index === self.findIndex((t) => (
        t.id === ingredElement.id
      ))
    )

    setIngred(ingredientsArray);


    /*
    ingred - an array of steps. 
    each step is another object, object has an array of ingredients. 
    the ingredients array has many objects that has name as name of ingred. 
    */
  };

  const incrementCountHandler = (incomingIngred) => {

    let ingredsCopy = Array.from(ingred);
    console.log(incomingIngred);
    ingredsCopy.forEach((curr) => {
      if (curr.id === incomingIngred.id) {

        curr.count = curr.count + 0.5;



      }
    })
    setIngred(ingredsCopy);
  }



  const decrementCountHandler = (incomingIngred) => {

    let ingredsCopy = Array.from(ingred);

    ingredsCopy.forEach((curr) => {
      if (curr.id === incomingIngred.id) {
        if (curr.count > 0) {
          curr.count = curr.count - 0.5;
        }


      }
    })
    setIngred(ingredsCopy);
  };



  const addToList = () => {
    setLoading(true);
    var baseURL = apiKey.baseURL;
    let userId = Firebase.auth().currentUser.uid;
    let sendData = {
      userId: userId
    }
    axios.post(baseURL + 'cookbooks/allCookbooksByUserId', sendData, {
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      withCredentials: false,
    },
    ).then((response) => {
      // console.log(response);
      if (response.data) {
        //  console.log(response.data);
        const items = response.data;
        //   console.log(items);
        setCookbooksList(items);
        // setItemCount(items.length);
        setLoading(false);

      }
      else {
        setResponseTxt("Oops!, Something Went Wrong, Try Again Please.");
        setError("noUser", 'no user', "no account uses this email");
      }
    }).catch(error => {
      console.log("AXIOS CAUGHT ERROR ::::::::::::::::::::");
      setResponseTxt("Oops!, Something Went Wrong, Try Again Please.");
      setLoading(false);
      console.log(error);
    });




    setAddToCookbook(true);

    if (iconName == 'bookmark-plus')
      setIconName('bookmark-check');
    else
      setIconName('bookmark-plus');


    // setCookbookShowModal(true);

  }
  const addRecipeToUser = () => {
    setLoading(true);
    recipeInfo.userId = userId;
    console.log("caling api to add to user recipe: " + apiKey.baseURL + 'recipes/addRecipe', recipeInfo);

    axios.post(apiKey.baseURL + 'recipes/addRecipe', recipeInfo, {
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      withCredentials: false,
    },
    ).then((res) => {

      if (res.data) {
        //console.log('Recipe Added To User List');
        //console.log(res);
        // setIsFound(true);
        //setRecipeInfo(res.data);
        // recipeCompleteDetail = res.data;
        //console.log(recipeInfo);
        //console.log("Complete Recipe Info Object: ", recipeCompleteDetail);

        //  const readyInMin = res.data.readyInMinutes;
        //  setreadyInMinutes(readyInMin)
        // const serves = res.data.servings
        // setservings(serves);
        //  const recSummary = res.data.summary;

        // var cleanSummary = sanitizeHtml(recSummary);
        //   let pureTextSummary = stripHtml(cleanSummary);
        //  htmlDescrition = htmlDescrition + "<div><p>" + pureTextSummary + "</p></div>"
        // setsummary(pureTextSummary);
        //  const ingredients = res.data.includedIngredients;

        //console.log(ingredients);
        //  extractIngredients(ingredients)


        //console.log('Hi bro');

        setLoading(false);
      }
      else {
        setLoading(false);
        setIsFound(false);
        setResponseTxt("Oops!, Something Went Wrong, Try Again Please.");
        setError("noUser", 'no user', "no account uses this email");
      }
    }).catch(error => {

      setIsFound(false);
      console.log("AXIOS CAUGHT ERROR ::::::::::::::::::::");
      setResponseTxt("Oops!, Something Went Wrong, Try Again Please.");
      setLoading(false);
      console.log(error);
    });

  }

  const addToShoppingList = async (data) => {
    console.log(listQuantity);
    let ingreds = makeJsontoObject(ingred);
    console.log("Ingreds", ingreds);
  }

  const makeJsontoObject = (JsonObject) => {
    if (JsonObject.length != 0) {
      for (let i = 0; i < JsonObject.length; i++) {
        JsonObject[i] = JSON.stringify(JsonObject[i]);
      }
    } else {
      console.log('Hey you should pick at least one of the ingredients.');
    }

    return JsonObject;


  }
  const addRecipeToCookbook = (cookbook) => {
    recipeInfo.userId = userId;

    let sendData = {
      userId: userId,
      cookbookId: cookbook.cookbookId,
      recipe: recipeInfo
    }

    axios.post(apiKey.baseURL + 'cookbooks/addRecipeToCookbook', sendData, {
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      withCredentials: false,
    },
    ).then((res) => {

      if (res.data) {
        console.log('Recipe Added To User List');
        //console.log(res);
        // setIsFound(true);
        //setRecipeInfo(res.data);

        setSuccessfulAdd(true);

        console.log(recipeInfo);
        console.log("Complete Recipe Info Object: ", recipeCompleteDetail);

        setLoading(false);
      }
      else {
        setLoading(false);
        setIsFound(false);
        setResponseTxt("Oops!, Something Went Wrong, Try Again Please.");
        setError("noUser", 'no user', "no account uses this email");
      }
    }).catch(error => {

      setIsFound(false);
      console.log("AXIOS CAUGHT ERROR ::::::::::::::::::::");
      setResponseTxt("Oops!, Something Went Wrong, Try Again Please.");
      setLoading(false);
      console.log(error);
    });

  }
  const openListScreen = (item) => {
    bakRecipeInfo = recipeInfo;
    console.log('Bak Up Reciep Info ', bakRecipeInfo);
    console.log(item);
    setCurrItem(item);
    setListModal(true);
  }
  const saveRecipe = () => {

    // CHECK IF USER IS LOGGED IN. IF SO SEND TO API AND ADD TO CURRENT USER'S LIST OF SAVED RECIPES

    setShowModal(true);
    console.log('showModal', showModal);
  }
  const unitTypes = ['None', 'Unit', 'Piece(s)', 'Bag', 'Carton', 'Pack', 'Dozen', 'Pack', 'Bunch', 'Cups', 'Packet', 'Grams', 'Pound', 'Kilograms', 'Handful', 'Box', 'Bottle(s)', 'Case', 'Container', 'Package']

  const showUnitPicker = unitTypes.map((c, i) => {

    var key = 'unit' + i.toString();

    return (

      <Picker.Item key={key} label={c} value={c} />

    );

  });

  const goBackToRecipe = () => {

    setAddToCookbook(false);
    setSuccessfulAdd(false);
    console.log('showModal', showModal);

  }


  const onSubmit = async data => {
    if (data.listQuantity < 0.5) {
      setError("quantityShort", 'quantityShort', "Ingredient text is too short.");

    }
    else {
      console.log('before' + data.listUnit);

      console.log('After', data.listUnit);
      if (!data.listUnit) {
        console.log('no trim', data.listUnit);
        data.listUnit = '';
      }
      else if (data.listUnit) {
        console.log('trimmer', data.listUnit);
        data.listUnit = data.listUnit.trim();
      }
      let item = currItem.name.toUpperCase() + '~' + data.listQuantity + '~' + data.listUnit.toUpperCase();

      console.log('Sendign To List: ' + item);
      let sendData = {
        userId: userId,
        listItems: item,
      }
      console.log('SUBMIT');
      axios.post(apiKey.baseURL + 'shoppingList/updateShoppingList', sendData, {
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        withCredentials: false,
      },
      ).then((res) => {

        if (res.data) {
          console.log('Recipe Added To User List');
          //console.log(res);
          setListModal(false);
          setCurrItem();
          // setIsFound(true);
          //setRecipeInfo(res.data);
          if (res.status == 200) {

          }
          console.log(recipeInfo);
          console.log("Complete Recipe Info Object: ");

          setLoading(false);
        }
        else {
          setLoading(false);
          setIsFound(false);
          setListModal(false)
          setResponseTxt("Oops!, Something Went Wrong, Try Again Please.");
          setError("noUser", 'no user', "no account uses this email");
        }
      }).catch(error => {
        setLoading(false);
        setIsFound(false);
        setListModal(false);
        setIsFound(false);
        console.log("AXIOS CAUGHT ERROR ::::::::::::::::::::");
        setResponseTxt("Oops!, Something Went Wrong, Try Again Please.");

        console.log(error);
      });
    }

  }


  const onChange = args => {
    return {
      value: args[0].nativeEvent.text,
    };
  };

  const downloadRecipe = async () => {


    let htmlStepsTitle = "<div><h2>Steps</h2><ul>"
    if (step.length > 0) {
      step.forEach(i => {
        htmlSteps = htmlSteps + "<li>" + i.description + "</li>"
      })
    }
    else {
      htmlSteps = "<li>" + "Not Available" + "</li>"
    }
    htmlSteps = htmlSteps + "</ul></div>"

    let htmlIngredientsTitle = "<div><h2>Ingredients</h2><ul>"
    if (ingred.length > 0) {
      console.log(ingred[0]);
      ingred.forEach(i => {
        htmlIngredients = htmlIngredients + "<li>" + i.name + ' ' + i.amount + " " + i.unit + "" + "</li>"
      })
    }
    else {
      htmlIngredients = "<li>" + "Not Available" + "</li>"
    }
    htmlIngredients = htmlIngredients + "</ul></div>"
    htmlDescrition = "<p>" + summary + "</p>"

    let finalPdfHtml = "<div style='margin:20px'>" + htmlTitle + htmlDescrition + htmlIngredientsTitle + htmlIngredients + htmlStepsTitle + htmlSteps + "</div>";

    const options = { html: finalPdfHtml, base64: false };

    // Put this in an onPress for a button or in a function you want to print from

    Print.printAsync(options).catch((err) => {
      console.log(err);
    });

  };


  const changeQuantity = (q) => {
    quantiyForList = quantiyForList + q;
    console.log('quantiyForList: ', q);

  }

  const resetViewRecipe = () => {
    setLoading(true);

    setRecipeInfo(bakRecipeInfo);
    setListModal(false);
    console.log('Reset Recipe Info', recipeInfo);
    setLoading(false);
    setRecipeInfo(recipeInfo);
  }
  let ingredientsList =

    <FlatList
      scrollEnabled={true}
      initialNumToRender={1}
      style={styles.container}
      extraData={refresh}
      ListEmptyComponent={<Card style={customStyles.nestedCardStyle}><Card.Content><Title style={{ justifyContent: "center" }}>No Ingredients</Title></Card.Content></Card>}
      snapToAlignment={"center"}
      horizontal={((Platform.OS == 'web') ? false : false)}
      data={ingred}
      keyExtractor={(item, index) => index.toString()}
      renderItem={
        ({ item, index }) =>

          <View style={{ flexDirection: "row", width: 'auto', margin: 10, borderRadius: 10 }}>
            <Text style={{ marginTop: 6, color: '#000000', fontSize: 16, marginRight: 10, flexWrap: "wrap" }}>{item.name} ( {item.amount} {item.unit} )</Text>
            <IconButton style={{ backgroundColor: "#D50000" }} onPress={() => openListScreen(item)} icon="cart-plus" size={20} />
          </View>



      }


    />

  let demoCookbookList = <Button mode={"contained"} style={{ marginEnd: 5, backgroundColor: "#00BFA5" }} onPress={() => addRecipeToCookbook(cookbooksList[0])}>Add one This</Button>

  let cookBookFlatList =
    <FlatList
      style={styles.container}

      ListEmptyComponent={<Title style={{ textAlign: "center" }}>No Cookbooks Saved</Title>}
      snapToAlignment={"center"}

      data={cookbooksList}
      keyExtractor={(item, index) => index.toString()}
      renderItem={
        ({ item }) =>

          <View style={{ backgroundColor: "#BBDEFB", margin: 10, borderRadius: 10, padding: 10 }}>
            <Title style={{ textAlign: "left", flexWrap: "wrap" }}>{item.title}</Title>

            <TouchableOpacity style={styles.button} onPress={() => addRecipeToCookbook(item)}><Title>Add To This</Title></TouchableOpacity>

            <Button mode={"contained"} style={{ marginEnd: 5, backgroundColor: "#00BFA5" }} onPress={() => addRecipeToCookbook(item)}>Add In This</Button>
          </View>
      }


    />



  // UI
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 3 }}>


        <PulseIndicator style={{ position: "relative" }} animating={true} size={180} color='#69F0AE' />

      </SafeAreaView>
    )
  }
  else if (listModal) {
    return (

      <SafeAreaView >
        <Title style={{ color: '#B50900' }}>Adding To Shopping List</Title>
        <Subheading style={{ textAlign: "center", fontSize: 20, fontWeight: "500" }}>{currItem.name}</Subheading>
        <KeyboardAvoidingView>

          <View style={{ marginBottom: 10 }}>
            <Subheading style={styles.label}>Quantity</Subheading>
            <Text style={{ color: "#FFC300" }}>Should be atleast 0.5</Text>
            <Controller
              as={<TextInput keyboardType={"number-pad"} maxLength={6} style={customStyles.input} />}
              name="listQuantity"

              control={control}
              onChange={onChange}
              rules={{ min: 0.5, required: true }}

            />
            {errors.quantityShort && <Subheading style={{ color: '#BF360C', fontSize: 15, fontWeight: '300' }}>Value Must be Atleast 0.5
            </Subheading>}
            {errors.listQuantity && <Subheading style={{ color: '#BF360C', fontSize: 15, fontWeight: '300' }}>Value Must be Atleast 0.5
            </Subheading>}
            <Subheading style={styles.label}>Unit Of Quantity</Subheading>
            <Controller
              as={<TextInput maxLength={25} style={customStyles.input} />}
              name="listUnit"

              control={control}
              onChange={onChange}
              rules={{ pattern: /^[a-zA-Z ]*$/ }}

            />
            {errors.listUnit && <Subheading style={{ color: '#BF360C', fontSize: 15, fontWeight: '300' }}> Must be alphabets
 </Subheading>}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
            <Button loading={loading} style={{ marginHorizontal: 10, marginTop: 20, backgroundColor: '#1DE9B6' }} color="#FFFFFF" onPress={handleSubmit(onSubmit)}>
              Add To List

            </Button>
            <Button disabled={loading} style={{ marginHorizontal: 10, marginTop: 20, backgroundColor: '#81D4FA' }} color="#FFFFFF" onPress={() => resetViewRecipe()} >
              Cancel
            </Button>

          </View>
        </KeyboardAvoidingView>

      </SafeAreaView >
    )
  }
  else if (addToCookbook) {
    if (cookbooksList.length > 0) {
      return (

        <SafeAreaView style={{ padding: 10 }} >
          {!successfulAdd ? <View>
            <Title style={{ margin: 5 }}>Choose A Cookbook To Add To</Title>
            <Text style={{ fontSize: 18 }}>Adding It To A Cookbook will also save it the recipe to your account</Text>

            {cookbooksList.map((item, index) => {
              return (
                <Card key={index + 1} style={styles.nestedCardStyle}>
                  <View style={{ flexDirection: 'row', margin: 5 }}>

                    <Title style={{ marginTop: 6, color: '#000000', fontSize: 16, marginRight: 10, flex: 1, flexWrap: "wrap" }}>{item.title}</Title>
                    <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: "center", alignContent: "center" }}>
                      <Button mode={"contained"} style={{ marginEnd: 5, backgroundColor: "#00BFA5" }} onPress={() => addRecipeToCookbook(item)}>Add In This</Button>
                    </View>
                  </View>
                </Card>

              )

            })}

            <Button mode="contained" style={{ backgroundColor: "#D50000" }} onPress={() => setAddToCookbook(false)}>Cancel</Button>
          </View> :
            <View><Title>Added To The Cookbook</Title>
              <Button mode="contained" onPress={() => goBackToRecipe()}> Go Back To The Recipe</Button>
            </View>
          }


        </SafeAreaView>
      )
    }
    else {
      return (
        <SafeAreaView style={{ padding: 10 }} >
          <Title>Looks like you do not have any cookbooks to add this recipe to. You can create one by going to the  Dashboard and Hitting the Your Recipes and Cookbooks Button</Title>
          <View style={{ margin: 10 }}>
            <Button mode="contained" onPress={() => goBackToRecipe()}> Go Back To The Recipe</Button>
          </View>
        </SafeAreaView>
      )
    }
  } else if (!loading) {


    return (



      <SafeAreaView style={styles.container}>
        <ScrollView >
          <View>
            <View style={{ alignSelf: "center" }}>

              <View style={styles.profileImage}>
                {defImage ? <Image source={{ uri: (recipeDetail.image) ? recipeDetail.image : "https://zabas.com/wp-content/uploads/2014/09/Placeholder-food.jpg" }} style={styles.image} onError={(error) => setDefImage(false)} resizeMode="center"></Image> :
                  <Image source={{ uri: "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled-1150x647.png" }} style={styles.image} resizeMode="center"></Image>
                }

              </View>


            </View>




            <View style={styles.infoContainer}>
              <Headline style={{ color: '#000000', fontWeight: "600" }}>{recipeDetail.title}</Headline>
              <Subheading style={{ fontWeight: '600', flexWrap: "wrap" }}>From: {(recipeInfo.author) ? recipeInfo.author : 'Anonymous'}</Subheading>
              {(!ownsRecipe) ? < Button mode="contained" onPress={addRecipeToUser}>Add Recipe To Your Recipes</Button> : <Text>This Recipe Is By You</Text>}
              {(!ownsRecipe) ?
                <Text style={{ fontWeight: "600", textAlign: "center", fontSize: 20, color: "#D81B60" }}>OR</Text>
                : <Text></Text>
              }
              {(!ownsRecipe) ?
                <Button mode="contained" color="#DFD8C8" onPress={addToList} style={{ marginTop: 6, marginLeft: 2 }}>Add To Cookbook </Button>
                : <Text></Text>
              }
              < Button mode="contained" style={{ margin: 10, backgroundColor: "#FF80AB" }} onPress={downloadRecipe}>Print Recipe</Button>
              <View style={styles.statsContainer}>
                <View style={styles.statsBox}>
                  <Text style={[styles.text, { fontSize: 18 }]}>{readyInMinutes}</Text>
                  <Text style={[styles.text, styles.subText]}>Ready In Minutes</Text>
                </View>
                <Text style={{ fontSize: 34, color: '#99ccff' }}> | </Text>
                <View style={styles.statsBox}>
                  <Text style={[styles.text, { fontSize: 20 }]}>{servings}</Text>
                  <Text style={[styles.text, styles.subText]}>Servings</Text>
                </View>
              </View>
              <View style={styles.statsContainer}>
                <View style={styles.statsBox}>
                  <Text style={[styles.text, { fontSize: 18 }]}>{(recipeInfo.cuisine) ? recipeInfo.cuisine : 'N/A'}</Text>
                  <Text style={[styles.text, styles.subText]}>Cuisine</Text>
                </View>
                <Text style={{ fontSize: 34, color: '#99ccff' }}> | </Text>
                <View style={styles.statsBox}>
                  <Text style={[styles.text, { fontSize: 20 }]}>{(recipeInfo.mealType) ? recipeInfo.mealType : 'N/A'}</Text>
                  <Text style={[styles.text, styles.subText]}>Meal Type</Text>
                </View>
              </View>

              <View style={{ marginTop: 32 }}>
                <Subheading style={{ textAlign: "center", fontSize: 18, fontWeight: "600" }}>Description</Subheading>

                <Subheading style={{ textAlign: "center", marginBottom: 15 }}>{summary}</Subheading>

              </View>
            </View>

            <View style={styles.viewBoxStyle}>

              {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}> */}
              <Headline style={{ color: '#FFFFFF', fontWeight: "600" }}>Ingredients</Headline>


              {ingred.map((oneIngred, index) => {
                return (
                  <Card key={index + 1} style={styles.nestedCardStyle}>
                    <View style={{ flexDirection: 'row', margin: 5 }}>

                      <Text style={{ marginTop: 6, color: '#000000', fontSize: 16, marginRight: 10, flex: 1, flexWrap: "wrap" }}>{oneIngred.name} ( {oneIngred.amount} {oneIngred.unit} )</Text>
                      <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: "center", alignContent: "center" }}>
                        <TouchableOpacity style={styles.button} onPress={() => {
                          openListScreen(oneIngred);
                        }}><IconButton icon="cart-plus" size={20} /></TouchableOpacity>
                      </View>
                    </View>
                  </Card>

                )
              })}


              <TouchableOpacity style={styles.button}
                onPress={() => {
                  navigation.navigate('Shopping');
                }}><Text>View Shopping List</Text></TouchableOpacity>
            </View>
            <View style={styles.viewBoxStyle}>
              {/* <View style={styles.viewBoxStyle}> */}
              <Headline style={{ color: '#FFFFFF', fontWeight: "600", alignItems: 'center' }}>Instructions</Headline>

              <View style={{ margin: 10 }}>
                <Text> {map} </Text>

              </View>
            </View>
          </View>




        </ScrollView>


      </SafeAreaView>
    );


  }
  else if (!isFound) {
    return (
      <SafeAreaView>
        <Title>{responseStr}</Title>
      </SafeAreaView>

    );
  }

}

export default ViewRecipe;

const styles = StyleSheet.create({
  modalText: {
    marginBottom: 15,
    textAlign: "left"
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    height: 150,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 200
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  modalStyle: {
    zIndex: 1500,
    position: "relative",
    flex: 1,
    justifyContent: 'center',
    alignContent: "center",
    alignSelf: "center",
    borderRadius: 10,
    padding: 2,
    top: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',

    ...Platform.select({
      ios: {

        width: 'auto',
        height: 'auto'
      },
      web: {
        //  width: (Dimensions.get('window').width - 50),
        //  height: (Dimensions.get('window').height - 50)
      },
      android: {
        width: '100%',
        height: '80%'
      },
    })
  }
  ,
  button: {
    alignItems: "center",
    backgroundColor: "#d2f2fc",
    padding: 10,
    borderRadius: 10,
  },
  instructionStyle: {
    padding: 0,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    margin: 5,
    height: 'auto',
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        width: "auto"
      },
      android: {
        width: "auto"
      },
      web: {
        width: ((Dimensions.get('window').width) < 500) ? ((Dimensions.get('window').width) - 70) : 550,


      }
    })
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 10
  },
  text: {

    color: "rgb(82, 87, 93)",
    textAlign: "center"
  },
  subText: {
    fontSize: 12,
    color: "#rgb(174, 181, 188)",
    textTransform: "uppercase",
    fontWeight: "500"

  },
  image: {
    flex: 1,
    width: "auto",
    height: "auto"
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginHorizontal: 16
  },
  profileImage: {
    width: 200,
    height: 150,
    borderRadius: 0,
    overflow: "visible"
  },
  dm: {
    backgroundColor: "rgb(65,68,75)",
    position: "absolute",
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  active: {
    backgroundColor: "#34FF89",
    position: "absolute",
    bottom: 20,
    left: 10,
    padding: 4,
    height: 20,
    width: 20,
    borderRadius: 10

  },
  add: {
    // backgroundColor: "#41444B",
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center"

  },
  infoContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 16
  },
  statsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 32

  },
  statsBox: {
    alignItems: "center",
    flex: 1

  },
  mediaImageContainer: {
    width: 180,
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 10
  },
  mediaCount: {
    backgroundColor: "#41444B",
    position: "absolute",
    top: "50%",
    marginTop: -50,
    marginLeft: 30,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    shadowColor: "rgba(0, 0 ,0 ,0.38)",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    shadowOpacity: 1

  },
  recent: {
    marginLeft: 78,
    marginTop: 32,
    marginBottom: 6,
    fontSize: 10
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16
  },
  recentItemIndicator: {
    backgroundColor: "#CABFAB",
    padding: 4,
    height: 12,
    width: 12,
    borderRadius: 6,
    marginTop: 12,
    marginRight: 3

  },
  buttonHover: {
    color: "#CABFAB"
  }
  ,
  nestedCardStyle: {
    padding: 0,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    margin: 5,
    height: 'auto',
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        width: "auto"
      },
      android: {
        width: "auto"
      },
      web: {
        width: ((Dimensions.get('window').width) < 500) ? ((Dimensions.get('window').width) - 70) : 550,


      }

    }),
  },
  viewBoxStyle: {
    marginTop: 10,
    backgroundColor: '#99ccff',
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 0,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    height: 'auto',
    ...Platform.select({
      ios: {
        width: "auto"
      },
      android: {
        width: "auto"
      },
      web: {
        width: ((Dimensions.get('window').width) < 500) ? ((Dimensions.get('window').width) - 50) : 600,


      }
    })
  },

  text: {

    color: "rgb(82, 87, 93)",
    textAlign: "center"
  },
  subText: {
    fontSize: 12,
    color: "#rgb(174, 181, 188)",
    textTransform: "uppercase",
    fontWeight: "500"

  },
  image: {
    flex: 1,
    width: "auto",
    height: "auto"
  },
});

const customStyles = StyleSheet.create({
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
    backgroundColor: '#4FC3F7'
  },
  customStyle: {
    borderWidth: 0,
    borderRadius: 10,
    backgroundColor: '#81D4FA',
    margin: 18,
    height: 'auto',
    ...Platform.select({
      ios: {
        width: 400
      },
      android: {
        width: 400
      },
      web: {
        width: ((Dimensions.get('window').width) < 500) ? ((Dimensions.get('window').width) - 50) : 600,


      }
    }),
  },

  nestedCardStyle: {
    padding: 0,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    margin: 5,
    flexWrap: 'wrap',
    alignItems: "flex-start",
    height: 'auto',
    ...Platform.select({
      ios: {
        width: 270
      },
      android: {
        width: 270
      },
      web: {
        width: ((Dimensions.get('window').width) < 500) ? ((Dimensions.get('window').width) - 70) : 550,


      }

    }),
  },
  viewBoxStyle: {
    marginTop: 10,
    backgroundColor: '#81D4FA',
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 0,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    height: 'auto',
    ...Platform.select({
      ios: {
        width: 300
      },
      android: {
        width: 300
      },
      web: {
        width: ((Dimensions.get('window').width) < 500) ? ((Dimensions.get('window').width) - 50) : 600,


      }
    }),
  },
  input: {
    backgroundColor: '#B2DFDB',
    borderWidth: 0,
    height: 40,
    padding: 5,
    width: "auto",
    borderRadius: 4,
    alignSelf: "stretch"
  },
});

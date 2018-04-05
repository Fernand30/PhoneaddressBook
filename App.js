/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
  SafeAreaView,
  ScrollView,
  BackHandler,
  Modal,
  Alert
} from 'react-native';

var Contacts = require('react-native-contacts')

var {height, width} = Dimensions.get('window');
type Props = {};
export default class App extends Component<Props> {

  constructor(props){
    super(props)
    this.state={
      data: [],
      filter:'',
      keys: [],
      contacts:[],
      refreshing: false,
      updated: false,
      deltemodalVisible: false,
      item: {}
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.contactList(this.state.filter)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    return true;
  }

  componentWillReceiveProps(nextProps) {
    this.setState(oldstate => ({
      updated: !oldstate.updated,
    }));
  }

  editContact(item){
     
      Contacts.updateContact(item, (err) => { /*...*/ })
  }

  contactList(filter){
    if(filter == ''){
      Contacts.getAll((err, contacts) => {
        if(err === 'denied'){
          // error
        } else {
          //alert(JSON.stringify(contacts))
          data = contacts
          keys = {"keys": this.state.keys}
          data.push(keys)
          this.setState({
            data: data,
            contacts: contacts
          })
        }
      })
    }else{
      Contacts.getContactsMatchingString(filter, (err, contacts) => {
        if(err === 'denied'){
          // x.x
        } else {
          data = contacts
          keys = {"keys": this.state.keys}
          data.push(keys)
          this.setState({
            data: data,
            contacts: contacts
          })
        }
      })
    }
    
  }

  addContact(){
    var newPerson = {
      emailAddresses: [{
        label: "",
        email: "",
      }],
      familyName: "",
      givenName: "",
    }

    Contacts.openContactForm(newPerson, (err) => { /*...*/ })
    this.contactList(this.state.filter)
  }

  search(text){
    this.setState({filter:text})
    this.contactList(text)
  }

  call(item){
   
  }


  updateNumber(item,items,prenumber){
//alert(JSON.stringify(item))
//alert(JSON.stringify(items))
    phoneNumbers = items.phoneNumbers
    numberKeys = phoneNumbers.length
    for(i=0;i<numberKeys;i++){
      if(item.label==phoneNumbers[i].label){
        number = phoneNumbers[i].number
        jjj = number.replace("+57","")
        kkk = jjj.replace("+34","")
        ttt = kkk.replace("+1","")
        phoneNumbers[i].number = prenumber+ ttt
      } 
    }

      items.phoneNumbers = phoneNumbers
      Contacts.updateContact(items, (err) => { /*...*/ })
      this.contactList(this.state.filter)
  }

  _renderNumber(item, items){
    number = item.number
    return(
      <View style={styles.eachView1}>
        <View style={styles.phoneView}>
          <Text style={styles.nametext2}>{item.label}</Text>
          <Text style={styles.nametext1}>{item.number}</Text>
          
          {(number.indexOf('+1')==-1)?<TouchableOpacity onPress={()=>this.updateNumber(item,items,'+1')}  style={styles.button}>
                                        <Text style={styles.buttontext}>US</Text>
                                      </TouchableOpacity >:
                                      <View  style={styles.button1}>
                                        <Text style={styles.buttontext1}>US</Text>
                                      </View >
          }
          {(number.indexOf('+57')==-1)?<TouchableOpacity onPress={()=>this.updateNumber(item,items,'+57')} style={styles.button}>
                                        <Text style={styles.buttontext}>CO</Text>
                                      </TouchableOpacity >:
                                      <View style={styles.button1}>
                                        <Text style={styles.buttontext1}>CO</Text>
                                      </View >
          }
          {(number.indexOf('+34')==-1)?<TouchableOpacity onPress={()=>this.updateNumber(item,items,'+34')} style={styles.button}>
                                        <Text style={styles.buttontext}>ES</Text>
                                      </TouchableOpacity>:
                                      <View style={styles.button1}>
                                        <Text style={styles.buttontext1}>ES</Text>
                                      </View >
          }
          
          
        </View>
      </View>
      )
  }


  expend(key){
    temdata = []
    contacts = this.state.contacts
    keys = this.state.keys
    if(keys.indexOf(key) ==-1){
     keys.push(key) 
    }else{
     keys.splice(keys.indexOf(key),1)
    }
    temdata = contacts
    temdata.push({"keys":keys})
    this.setState({data: temdata})
    that = this
    setTimeout(function(){
      that.setState({keys:keys })
    }),1000
  }

  onRefresh = () => {
    this.setState({
      isRefreshing: true
    });
   
    this.setState({
      isRefreshing: false
    });
   
  };

  _renderItem({item}){
    if(item.keys) return
    keys = this.state.keys
    items = item
    phoneNumbers = item.phoneNumbers
    return(
      <View style={styles.eachView}>
        <View>
          <TouchableOpacity onPress={()=>this.expend(item.recordID)}>
            <Text style={styles.nametext}>{item.givenName+' '+item.familyName}</Text>
          </TouchableOpacity>
          
          {(keys.indexOf(item.recordID)!=-1)?<FlatList
                      removeClippedSubviews={false}
                      data={phoneNumbers}
                      showsVerticalScrollIndicator={false}
                      keyExtractor={(item, index) => index}
                      renderItem={({item}) => this._renderNumber(item,items)}
                      onRefresh={this.onRefresh.bind(this)}
                      refreshing={this.state.refreshing}
                    />:null}
          
        </View>
      </View>
      )
  }

  contactEdit=(item)=>{

    //  Contacts.getAll( (err, contacts) => {
    //   //update the first record
    //   let someRecord = contacts[0]
    //   someRecord.emailAddresses.push({
    //     label: "junk",
    //     email: "mrniet+junkmail@test.com",
    //   })
    //   Contacts.updateContact(someRecord, (err) => { /*...*/ })

    //   //delete the second record
    //   Contacts.deleteContact(item, (err) => { /*...*/ })
    //   this.contactList(this.state.filter)
    // })

  }

  deleteContact(item){
    flag = 0
    Alert.alert(
      'alert',
      'Are you sure?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => this.realdelete(item)},
      ],
      { cancelable: false }
    )
  }

  realdelete(item){
    Contacts.deleteContact(item, (err) => {  })
    this.search(this.state.filter)
  }
     

  render() {
    data = this.state.data
    keys = this.state.keys

    that = this

    jsonData = data.map(function(items) { 

      if(items.keys) return

      phoneNumbers = items.phoneNumbers

      let i = 0

      subjson = phoneNumbers.map(function(item){
        i++
        return(
          <View key={i}>
            {that._renderNumber(item,items)}
          </View>
        )
      })

      return(
        <View style={styles.eachView} key = {items.recordID}>
          <View>
            <TouchableOpacity onLongPress={()=>that.deleteContact(items)} onPress={()=>that.expend(items.recordID)}>
              <Text style={styles.nametext}>{items.givenName+' '+items.familyName}</Text>
            </TouchableOpacity>
            
            {(keys.indexOf(items.recordID)!=-1)? subjson : null}
            
          </View>
        </View>
      )
    }) 

    deleteModal =
      <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.deltemodalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={{flex:1, alignItems: 'center', justifyContent:'center', backgroundColor:'red'}}>

          </View>
      </Modal>    

    return (
    
      <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Contacts</Text>
        <View style={styles.rowView}>
          <Text style={styles.group} >Group</Text>
          <TextInput underlineColorAndroid='transparent' placeholder= 'search' onChangeText= {(text)=>this.search(text)} style={styles.textinput}/>
          <TouchableOpacity 
            onPress={()=>{this.addContact()}} 
            style={styles.plusbutton}>
            <Text style={styles.plus} >+</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.lineView}/>
        <ScrollView showsVerticalScrollIndicator={false}>
          {jsonData}
        </ScrollView>
      </View>
      {deleteModal}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:20,
    paddingBottom:5
  },
  title:{
    textAlign:'center',
    fontSize:20,
    fontWeight: '700',
  },
  lineView:{
    backgroundColor:'black',
    height:1
  },
  eachView: {
    borderBottomWidth:1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  eachView1: {
    marginVertical:5,
  },
  phoneView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text:{
    fontSize: 16,
    width: width/3,
  },
  button:{
    borderColor:'blue',
    borderWidth:0.5,
    borderRadius:5,
    width: width /10,
    height: 22,
    alignItems: 'center',
    justifyContent:'center'
  },
  button1:{
    borderColor:'blue',
    borderWidth:0.5,
    borderRadius:5,
    width: width /10,
    height: 22,
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: 'blue'
  },
  buttontext:{
    color:'blue',
    fontSize: 14
  },
  buttontext1:{
    color:'white',
    fontSize: 14
  },
  nametext:{
    width: width/2,
    fontSize: 20,
    fontWeight: '600'
  },
  nametext1:{
    width: width/2.7,
  },
  nametext2:{
    width: width/6
  },
  textinput:{
    borderWidth: 1,
    width: width*0.7,
    height: 30,
    alignSelf : 'center',
    marginVertical: 10,
    paddingVertical: 0,
    paddingLeft: 5,
    fontSize: 16
  },
  rowView:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    marginHorizontal: 10
  },
  group:{
    width: 40,
    fontSize:14
  },
  plusbutton:{

  },
  plus:{
    textAlign: 'right',
    width: 40,
    fontSize: 20
  }
});

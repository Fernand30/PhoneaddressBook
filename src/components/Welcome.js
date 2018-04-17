/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
  SafeAreaView,
  ScrollView,
  BackHandler,
  Modal,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import DatePicker from 'react-native-datepicker'
import Swipeout from 'react-native-swipeout';

import styles from './Styles'

import Contacts from 'react-native-contacts'
import Geocoder from 'react-native-geocoder';
import { Container, Header, Content, Button, Text, Icon } from 'native-base';


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
      addmodalVisible: false,
      editmodalVisible: false,
      item: {},
      familyName : '',
      givenName : '',
      buttonarray:[0],
      emailbuttonarray:[0],
      labels:['mobile'],
      numbers:[],
      phonearray:[],
      emailarray:[],
      phoneNumbers:[],
      emaillabels: ['personal'],
      emailnumbers: [],
      emailAddresses:[],
      note:'',
      country:'',
      state:'',
      city:'',
      street:'',
      date: new Date(),
      currentLocation: '',
      asc: true,
    }
  }

  componentDidMount() {
    Geocoder.fallbackToGoogle('AIzaSyBDlXDjhHSBgI6etr234bO23X6Dc1QYJ7I');
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.contactList(this.state.filter)
    this.props.navigation.addListener('didFocus', (status: boolean) => {

    });
    this._interval = 0

    this.watchID = navigator.geolocation.watchPosition((position) => {
      
      longitude = position.coords.longitude
      latitude = position.coords.latitude
      var NY = {
        lat: latitude,
        lng: longitude
      };

      Geocoder.geocodePosition(NY).then(res => {
        currentLocation = res[0]['formattedAddress']
        //alert(JSON.stringify(res[1]))
        this.setState({
          country: res[0].country,
          state: res[0].locality,
          city: '',
          street: res[0].streetName+" "+res[0].streetNumber,
        })
      }).catch(err => alert(err)) 
    });

  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }
  
  handleBackButton() {
    return true;
  }


  contactList(filter){
    if(filter == ''){
      Contacts.getAll((err, contacts) => {
        if(err === 'denied'){
          // error
          alert(err)
        } else {
          //alert(JSON.stringify(contacts[0]))
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

  
  search(text){
    this.setState({filter:text})
    this.contactList(text)
  }


  updateNumber(item,items,prenumber){

    phoneNumbers = items.phoneNumbers
    numberKeys = phoneNumbers.length
    for(i=0;i<numberKeys;i++){
      if(item.label==phoneNumbers[i].label){
        number = phoneNumbers[i].number
        bbb = number.replace('(',"")
        ccc = bbb.replace(')',"")
        jjj = ccc.replace("+57","")
        kkk = jjj.replace("+34","")
        ttt = kkk.replace("+1","")
        qqq = ttt.replace("+01","")
        phoneNumbers[i].number = prenumber+ qqq
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
          
          {(number.indexOf('+01')==-1)?<TouchableOpacity onPress={()=>this.updateNumber(item,items,'+01')}  style={styles.button}>
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

  clear(){
    this.setState({ 
      editmodalVisible: false, 
      addmodalVisible: false, 
      familyName:'', 
      givenName:'', 
      phoneNumbers:[], 
      emailAddresses:[],
      labels:['mobile'],
      numbers:[],
      emaillabels:['personal'], 
      emailnumbers:[],
      emailarray: [],
      buttonarray:[0],
      emailbuttonarray:[0],
      note:''
    })
    this.contactList(this.state.filter)
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

  addContact(){   

    if(this.state.familyName==''||this.state.givenName==''){
      alert('Please fill all fields.')
      return;
    }
    phoneNumbers = this.state.phoneNumbers
    for(i = 0; i<phoneNumbers.length;i++ ){
      if(!phoneNumbers[i]) phoneNumbers.splice(i,1)
      if(phoneNumbers[i].label == '' && phoneNumbers[i].number == '') phoneNumbers.splice(i,1)
    }

    emailAddresses = this.state.emailAddresses
    for(i = 0; i<emailAddresses.length;i++ ){
      if(!emailAddresses[i]) emailAddresses.splice(i,1)
      if(emailAddresses[i].label == '' && emailAddresses[i].email == '') emailAddresses.splice(i,1)
    }
    location = []
    country = this.state.country
    state = this.state.state
    city = this.state.city
    street = this.state.street
    location[0] = {state:state,city:city,postCode:'',label:'',region:'',country:country,street:street}

    date=  this.state.date
    splitDate = date.split('-')

    
    var newPerson = {
      emailAddresses: emailAddresses,
      familyName: this.state.familyName,
      givenName: this.state.givenName,
      phoneNumbers:phoneNumbers,
      jobTitle: this.state.note,
      postalAddresses: location,
      birthday: {day:splitDate[2], month: splitDate[1], year:splitDate[0]}
    }
    //alert(JSON.stringify(this.state.date))
    Contacts.addContact(newPerson, (err)=>{ })
    this.search(this.state.filter)
    this.clear()
  }

  editContact=()=>{
    if(this.state.familyName==''||this.state.givenName==''){
      alert('Please fill all fields.')
      return;
    }

    phoneNumbers = this.state.phoneNumbers

    for(i = 0; i<phoneNumbers.length;i++ ){
      if(!phoneNumbers[i]) phoneNumbers.splice(i,1)
      if(phoneNumbers[i].label == '' && phoneNumbers[i].number == '') phoneNumbers.splice(i,1)
    }

    emailAddresses = this.state.emailAddresses

    for(i = 0; i<emailAddresses.length;i++ ){
      if(!emailAddresses[i]) emailAddresses.splice(i,1)
      if(emailAddresses[i].label == '' && emailAddresses[i].email == '') emailAddresses.splice(i,1)
    }

    location = []
    country = this.state.country
    state = this.state.state
    city = this.state.city
    street = this.state.street
    location[0] = {state:state,city:city,postCode:'',label:'',region:'',country:country,street:street}

    date=  this.state.date
    splitDate = date.split('-')

    item = this.state.item
    item.emailAddresses = emailAddresses
    item.phoneNumbers = phoneNumbers
    item.givenName = this.state.givenName
    item.familyName = this.state.familyName
    item.jobTitle = this.state.note
    item.postalAddresses = location
    item.birthday = {day:splitDate[2], month: splitDate[1], year:splitDate[0]}
    
    Contacts.updateContact(item, (err) => { /*...*/ })
    this.search(this.state.filter)
    this.clear()
  }

  editModal(item){
    //alert(JSON.stringify(item.postalAddresses))
    phoneNumbers = item.phoneNumbers
    numbers=[]
    labels=[]
    for(i = 0;i<phoneNumbers.length;i++){
      numbers.push(phoneNumbers[i].number)
      labels.push(phoneNumbers[i].label)
    }

    emailAddresses = item.emailAddresses
    emailnumbers=[]
    emaillabels=[]
    for(i = 0;i<emailAddresses.length;i++){
      emailnumbers.push(emailAddresses[i].email)
      emaillabels.push(emailAddresses[i].label)
    }

    location = item.postalAddresses
    date = item.birthday
    
    this.setState({
      editmodalVisible: true, 
      item: item,
      phoneNumbers: phoneNumbers,
      emailAddresses: emailAddresses,
      familyName: item.familyName,
      givenName: item.givenName,
      labels: labels,
      numbers: numbers,
      emaillabels: emaillabels,
      emailnumbers: emailnumbers,
      note: item.jobTitle,
      country: location[0].country,
      state: location[0].state,
      city: location[0].city,
      street: location[0].street,
      date: date.year+'-'+date.month+'-'+date.day
    })
  }

  deleteContact(item){
    
    Alert.alert(
      'This contact will be removed.',
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

  openContactForm(item){
    this._interval = setInterval(() => {
      this.search(this.state.filter)
    }, 500);
    Contacts.openContactForm(item,(err, eee)=>{})
  }

  stopReload(){
    clearInterval(this._interval);
  }

  insertButton(){
    labels = this.state.labels
    labels.push('mobile')
    buttonarray = this.state.buttonarray
    buttonarray.push(buttonarray.length)
    this.setState({ buttonarray: buttonarray, labels: labels})
  }

  insertemailButton(){
    emaillabels = this.state.emaillabels
    emaillabels.push('personal')
    emailbuttonarray = this.state.emailbuttonarray
    emailbuttonarray.push(emailbuttonarray.length)
    this.setState({ emailbuttonarray: emailbuttonarray, emaillabels: emaillabels})
  }

  inserteditButton(){
    phoneNumbers = this.state.phoneNumbers
    phoneNumbers.push({label:'mobile', number:''})
    this.setState({ phoneNumbers: phoneNumbers})
  }

  inserteditEmailButton(){
    emailAddresses = this.state.emailAddresses
    emailAddresses.push({label:'personal', email:''})
    this.setState({ emailAddresses: emailAddresses})
  }

  addPhoneNumber(item,text){
    numbers = this.state.numbers
    labels = this.state.labels
    label = 'other'
    if(labels[item]) label = labels[item]
    numbers[item] = text
    phoneNumbers = this.state.phoneNumbers
    phoneNumbers[item] = {label:label,number: text}
    this.setState({phoneNumbers, phoneNumbers, numbers: numbers})
  }

  addPhoneLabel(item,text){
    numbers = this.state.numbers
    labels = this.state.labels
    number = ''
    if(numbers[item]) number = numbers[item]
    labels[item] = text
    phoneNumbers = this.state.phoneNumbers
    phoneNumbers[item] = {label:text,number:number}
    this.setState({phoneNumbers, phoneNumbers, labels: labels})
  }

  addEmailLabel(item,text){
    emailnumbers = this.state.emailnumbers
    emaillabels = this.state.emaillabels
    emailnumber = ''
    if(emailnumbers[item]) emailnumber = emailnumbers[item]
    emaillabels[item] = text
    emailAddresses = this.state.emailAddresses
    emailAddresses[item] = {label:text,email:emailnumber}
    this.setState({emailAddresses, emailAddresses, emaillabels: emaillabels})
  }

  addEmailAddress(item,text){
    emailnumbers = this.state.emailnumbers
    emaillabels = this.state.emaillabels
    emaillabel = 'other'
    if(emaillabels[item]) emaillabel = emaillabels[item]
    emailnumbers[item] = text
    emailAddresses = this.state.emailAddresses
    emailAddresses[item] = {label:emaillabel,email: text}
    this.setState({emailAddresses, emailAddresses, emailnumbers: emailnumbers})
  }

  deletebutton(item,index){
    buttonarray = this.state.buttonarray;
    phoneNumbers = this.state.phoneNumbers
    labels = this.state.labels
    phoneNumbers.splice(index, 1)
    buttonarray.splice(index,1)
    labels.splice(index,1)
    this.setState({ buttonarray: buttonarray, phoneNumbers: phoneNumbers, labels:labels})
  }

  emaildeletebutton(item,index){
    emaillabels = this.state.emaillabels
    emailbuttonarray = this.state.emailbuttonarray;
    emailAddresses = this.state.emailAddresses
    emailAddresses.splice(index, 1)
    emailbuttonarray.splice(index,1)
    emaillabels.splice(index,1)
    this.setState({ emailbuttonarray: emailbuttonarray, emailAddresses: emailAddresses, emaillabels: emaillabels})
  }

  order(){
    data = this.state.data
    if(this.state.asc)
      data.sort(this.compareASC)   
    else
      data.sort(this.compareDESC)
    this.setState(
      {
        asc: !this.state.asc,
        data: data,
      }
    )
  }

  compareASC(a,b) {
    if (a.givenName < b.givenName)
      return -1;
    if (a.givenName > b.givenName)
      return 1;
    return 0;
  }

  compareDESC(a,b) {
    if (a.givenName < b.givenName)
      return 1;
    if (a.givenName > b.givenName)
      return -1;
    return 0;
  }

  copy(o) {
    var output, v, key;
    output = Array.isArray(o) ? [] : {};
    for (key in o) {
        v = o[key];
        output[key] = (typeof v === "object") ? this.copy(v) : v;
    }
    return output;
  }

  groupbyName(_contacts){
    var contacts = this.copy(_contacts)
    var groupedContacts = {}
    contacts.forEach(element => {
      var name = element.givenName + ' ' + element.familyName
      if (groupedContacts[name] == null) {
        groupedContacts[name] = this.copy(element);
        groupedContacts[name].phoneNumbers = [];
      }

      var phoneNumbers = groupedContacts[name].phoneNumbers.concat(element.phoneNumbers);
      groupedContacts[name].phoneNumbers = phoneNumbers;

    });
    return Object.values(groupedContacts)
  }
 //////////////////////////////////////////////////////////////////////
     
  render() {
    data = this.groupbyName(this.state.data)
    keys = this.state.keys
    labels = this.state.labels
    emaillabels = this.state.emaillabels
    buttonarray = this.state.buttonarray
    emailbuttonarray = this.state.emailbuttonarray
    item = this.state.item
    phonearray = item.phoneNumbers
    emailarray = item.emailAddresses
    phonejson  = <View/>
    emailjson  = <View/>
    that = this

    console.log(data)

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
          let swipeoutBtns = [{
            text: 'Delete',
            backgroundColor: 'red',
            onPress: () => { that.deleteContact(items) }
          }];
          return(
            <View style={styles.eachView} key = {items.recordID}>
              <View>
                <View style={styles.deleteView}>
                  <TouchableOpacity onLongPress={()=>that.editModal(items)} onPress={()=>that.expend(items.recordID)}>
                    <Text style={styles.nametext}>{items.givenName+' '+items.familyName}</Text>
                  </TouchableOpacity>
                  <Swipeout right={swipeoutBtns} buttonWidth={50} autoClose={true} style={{backgroundColor:'white'}}>
                    <View style={{width:100,height:20}}>
        
                    </View>
                  </Swipeout>
                </View>
                
                {(keys.indexOf(items.recordID)!=-1)? subjson : null}
                
              </View>
            </View>
          )
    }) 

    

    buttonjson = buttonarray.map(function(item,index){
      return(
        <View style={styles.addRowView} key={item}>
          <TouchableOpacity onPress={()=>that.deletebutton(item,index)} style={styles.delete}>
            <Text style={styles.deleteText}>-</Text>
          </TouchableOpacity>
          <TextInput 
            underlineColorAndroid='transparent' style={styles.labelTextinput}  
            onChangeText={(text)=>that.addPhoneLabel(item,text)} value={labels[item]}/>
          <TextInput keyboardType='numeric' returnKeyType="done" 
            underlineColorAndroid='transparent' style={styles.addTextinput}  
            onChangeText={(text)=>that.addPhoneNumber(item,text)}/>
        </View>
      )
    })

    emailbuttonjson = emailbuttonarray.map(function(item,index){
      return(
        <View style={styles.addRowView} key={item}>
          <TouchableOpacity onPress={()=>that.emaildeletebutton(item,index)} style={styles.delete}>
            <Text style={styles.deleteText}>-</Text>
          </TouchableOpacity>
          <TextInput 
            underlineColorAndroid='transparent' style={styles.labelTextinput}  
            onChangeText={(text)=>that.addEmailLabel(item,text)} value={emaillabels[item]}/>
          <TextInput
            underlineColorAndroid='transparent' style={styles.addTextinput}  
            onChangeText={(text)=>that.addEmailAddress(item,text)}/>
        </View>
      )
    })

    if(phonearray)
      phonejson = phonearray.map(function(item,index){
        labels = [];
        numbers = [];
        labels[index] = item.label
        numbers[index] = item.number
        
        return(
          <View style={styles.addRowView} key={index}>
            <TouchableOpacity onPress={()=>that.deletebutton(item,index)} style={styles.delete}>
              <Text style={styles.deleteText}>-</Text>
            </TouchableOpacity>
            <TextInput 
              underlineColorAndroid='transparent' style={styles.labelTextinput}  
              onChangeText={(text)=>that.addPhoneLabel(index,text)} value={item.label}/>
            <TextInput keyboardType='numeric' returnKeyType="done" 
              underlineColorAndroid='transparent' style={styles.addTextinput}  
              onChangeText={(text)=>that.addPhoneNumber(index,text)} value={item.number}/>
          </View>
        )
      })

    if(emailarray)
      emailjson = emailarray.map(function(item,index){
        emaillabels = [];
        emailnumbers = [];
        emaillabels[index] = item.label
        emailnumbers[index] = item.email
        
        return(
          <View style={styles.addRowView} key={index}>
            <TouchableOpacity onPress={()=>that.emaildeletebutton(item,index)} style={styles.delete}>
              <Text style={styles.deleteText}>-</Text>
            </TouchableOpacity>
            <TextInput 
              underlineColorAndroid='transparent' style={styles.labelTextinput}  
              onChangeText={(text)=>that.addEmailLabel(index,text)} value={item.label}/>
            <TextInput returnKeyType="done" 
              underlineColorAndroid='transparent' style={styles.addTextinput}  
              onChangeText={(text)=>that.addEmailAddress(index,text)} value={item.email}/>
          </View>
        )
      })

    var addModal =
      <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.addmodalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={{flex:1, backgroundColor:'rgba(0,0,0,0.5)', paddingHorizontal: 20, paddingVertical:30}}>
            <View style={{flex:1, backgroundColor:'white', paddingVertical: 20, borderRadius: 5}}>
              <ScrollView showsVerticalScrollIndicator={false} style={{flex:1}}>
                <View style={styles.addRowView}>
                  <Text style={styles.addLabel}>FamilyName:</Text>
                  <TextInput underlineColorAndroid='transparent' 
                    style={styles.addTextinput} onChangeText={(text)=>this.setState({familyName: text})}/>
                </View>
                <View style={styles.addRowView}>
                  <Text style={styles.addLabel}>GivenName:</Text>
                  <TextInput underlineColorAndroid='transparent' 
                    style={styles.addTextinput}  onChangeText={(text)=>this.setState({givenName: text})}/>
                </View>
                <Text style={styles.phonenumbers}>Phone Numbers:</Text>

                {buttonjson}

                <TouchableOpacity onPress={()=>this.insertButton()} style={styles.addbutton}>
                  <View style={styles.circleView}>
                    <Text style={styles.circleText}>+</Text>
                  </View>
                  <Text style={styles.phone}>add phone</Text>
                </TouchableOpacity>
                <Text style={styles.phonenumbers}>Emails:</Text>

                {emailbuttonjson}

                <TouchableOpacity onPress={()=>this.insertemailButton()} style={styles.addbutton}>
                  <View style={styles.circleView}>
                    <Text style={styles.circleText}>+</Text>
                  </View>
                  <Text style={styles.phone}>add email</Text>
                </TouchableOpacity>
                <View style={[styles.addRowView,{marginTop:20}]}>
                  <Text style={styles.addLabel1}>Location:</Text>
                  <View style={{flex:1}}>
                    <View style={styles.locationView}>
                      <Text style={styles.country}>Country:</Text>
                      <TextInput underlineColorAndroid='transparent' 
                                          style={styles.addTextinput}  onChangeText={(text)=>this.setState({country: text})} value={this.state.country}/>
                    </View>
                    <View style={styles.locationView}>
                      <Text style={styles.country}>State:</Text>
                      <TextInput underlineColorAndroid='transparent' 
                                          style={styles.addTextinput}  onChangeText={(text)=>this.setState({state: text})} value={this.state.state}/>
                    </View>
                    <View style={styles.locationView}>
                      <Text style={styles.country}>City:</Text>
                      <TextInput underlineColorAndroid='transparent' 
                                          style={styles.addTextinput}  onChangeText={(text)=>this.setState({city: text})} value={this.state.city}/>
                    </View>
                    <View style={styles.locationView}>
                      <Text style={styles.country}>Street:</Text>
                      <TextInput underlineColorAndroid='transparent' 
                                          style={styles.addTextinput}  onChangeText={(text)=>this.setState({street: text})} value={this.state.street}/>
                    </View>
                  </View>
                </View>
                <View style={styles.rowView}>
                  <Text style={styles.addLabel}>Date:</Text>
                  <DatePicker
                    style={{flex:1}}
                    date={this.state.date}
                    mode="date"
                    placeholder="select date"
                    format="YYYY-MM-DD"
                    minDate="2016-05-01"
                    maxDate="2086-06-01"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        width: 0,
                        height:0
                      },
                      dateInput: {}
                      // ... You can check the source to find the other keys.
                    }}
                    onDateChange={(date) => {this.setState({date: date})}}
                  />
                </View>
                <View style={[styles.addRowView,{marginTop:20}]}>
                  <Text style={styles.addLabel}>Note:</Text>
                  <TextInput underlineColorAndroid='transparent' 
                    style={styles.addTextinput}  onChangeText={(text)=>this.setState({note: text})}/>
                </View>
              </ScrollView>

              <View style={styles.addRowView}>
                <TouchableOpacity onPress={()=>this.clear()} 
                  style={[styles.modalButtonView,{backgroundColor: 'red'}]}>
                  <Text style={styles.modalButton}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.addContact()} 
                  style={[styles.modalButtonView,{backgroundColor: 'green'}]}>
                  <Text style={styles.modalButton}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
      </Modal>   

    var editModal =
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.editmodalVisible}
        onRequestClose={() => {
          alert('Modal has been closed.');
        }}>
        <View style={{flex:1, backgroundColor:'rgba(0,0,0,0.5)', paddingHorizontal: 20, paddingVertical:30}}>
          <View style={{flex:1, backgroundColor:'white', paddingVertical: 20, borderRadius: 5}}>
            <ScrollView showsVerticalScrollIndicator={false} style={{flex:1}}>
              <View style={styles.addRowView}>
                <Text style={styles.addLabel}>FamilyName</Text>
                <TextInput underlineColorAndroid='transparent' style={styles.addTextinput} 
                  onChangeText={(text)=>this.setState({familyName: text})} value={this.state.familyName}/>
              </View>
              <View style={styles.addRowView}>
                <Text style={styles.addLabel}>GivenName</Text>
                <TextInput underlineColorAndroid='transparent' style={styles.addTextinput}  
                  onChangeText={(text)=>this.setState({givenName: text})}  value={this.state.givenName}/>
              </View>
              <Text style={styles.phonenumbers}>Phone Numbers:</Text>

              {phonejson}

              <TouchableOpacity onPress={()=>this.inserteditButton()} style={styles.addbutton}>
                <View style={styles.circleView}>
                  <Text style={styles.circleText}>+</Text>
                </View>
                <Text style={styles.phone}>add phone</Text>
              </TouchableOpacity>
              <Text style={styles.phonenumbers}>Emails:</Text>

              {emailjson}
              <TouchableOpacity onPress={()=>this.inserteditEmailButton()} style={styles.addbutton}>
                <View style={styles.circleView}>
                  <Text style={styles.circleText}>+</Text>
                </View>
                <Text style={styles.phone}>add email</Text>
              </TouchableOpacity>
              <View style={[styles.addRowView,{marginTop:20}]}>
                <Text style={styles.addLabel1}>Location:</Text>
                <View style={{flex:1}}>
                  <View style={styles.locationView}>
                    <Text style={styles.country}>Country:</Text>
                    <TextInput underlineColorAndroid='transparent' 
                                        style={styles.addTextinput}  onChangeText={(text)=>this.setState({country: text})} value={this.state.country}/>
                  </View>
                  <View style={styles.locationView}>
                    <Text style={styles.country}>State:</Text>
                    <TextInput underlineColorAndroid='transparent' 
                                        style={styles.addTextinput}  onChangeText={(text)=>this.setState({state: text})} value={this.state.state}/>
                  </View>
                  <View style={styles.locationView}>
                    <Text style={styles.country}>City:</Text>
                    <TextInput underlineColorAndroid='transparent' 
                                        style={styles.addTextinput}  onChangeText={(text)=>this.setState({city: text})} value={this.state.city}/>
                  </View>
                  <View style={styles.locationView}>
                    <Text style={styles.country}>Street:</Text>
                    <TextInput underlineColorAndroid='transparent' 
                                        style={styles.addTextinput}  onChangeText={(text)=>this.setState({street: text})} value={this.state.street}/>
                  </View>
                </View>
              </View>
              <View style={styles.rowView}>
                <Text style={styles.addLabel}>Date:</Text>
                <DatePicker
                  style={{flex:1}}
                  date={this.state.date}
                  mode="date"
                  placeholder="select date"
                  format="YYYY-MM-DD"
                  minDate="2016-05-01"
                  maxDate="2086-06-01"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      width: 0,
                      height:0
                    },
                    dateInput: {}
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date) => {this.setState({date: date})}}
                />
              </View>
              <View style={[styles.addRowView,{marginTop:20}]}>
                <Text style={styles.addLabel}>Note:</Text>
                <TextInput underlineColorAndroid='transparent' 
                  style={styles.addTextinput}  onChangeText={(text)=>this.setState({note: text})} value={this.state.note}/>
              </View>
            </ScrollView>

            <View style={styles.addRowView}>
              <TouchableOpacity onPress={()=>this.clear()} 
                style={[styles.modalButtonView,{backgroundColor: 'red'}]}>
                <Text style={styles.modalButton}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>this.editContact()} 
                style={[styles.modalButtonView,{backgroundColor: 'green'}]}>
                <Text style={styles.modalButton}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>     

    return (
      <SafeAreaView style={styles.container1}>
        <TouchableOpacity activeOpacity={1} onPress={()=>this.stopReload()} style={styles.container}>
          <Text style={styles.title}>Contacts</Text>
          <View style={styles.rowView}>
            {(this.state.asc)?
            <Button transparent dark
              onPress={this.order.bind(this)} 
            >
              <Icon name='arrow-up'/>
            </Button>
            :
            <Button transparent dark
              onPress={this.order.bind(this)} 
            >
              <Icon name='arrow-down'/>
            </Button>
            }
            <Text style={styles.group} >Group</Text>
            <TextInput 
              underlineColorAndroid='transparent' 
              placeholder='search' 
              onChangeText={(text)=>this.search(text)} 
              style={styles.textinput}/>
            <TouchableOpacity 
              onPress={()=>{this.setState({addmodalVisible:true})}} 
              style={styles.plusbutton}>
              <Text style={styles.plus} >+</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.lineView}/>
          <ScrollView showsVerticalScrollIndicator={false}>
            {jsonData}
          </ScrollView>
        </TouchableOpacity>
        {addModal}
        {editModal}
      </SafeAreaView>
    );
  }
}



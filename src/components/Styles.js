import { StyleSheet,Dimensions } from 'react-native'
var {height, width} = Dimensions.get('window');
import { Metrics } from '../themes/'

export default StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor:'white'
  },
  container: {
    flex: 1,
    paddingTop:20,
    paddingBottom:5,
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
    marginTop :10
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
  },
  deleteView:{
  	flexDirection: 'row',
  	alignItems: 'center',
  	justifyContent:'space-between',
  	paddingHorizontal: 10
  },
  deletebutton:{
  	width: Metrics.unitMargin*17,
  	paddingVertical: Metrics.unitMargin*0.5,
  	backgroundColor: 'red',
  	alignItems:'center',
  	justifyContent:'center',
  	borderRadius: 5
  },
  delete: {
  	fontSize: Metrics.unitFontSize*15,
  	color: 'white',
  	fontWeight: '600'
  },
  addRowView:{
  	flexDirection: 'row',
  	alignItems:'center',
  	justifyContent: 'space-between',
  	paddingHorizontal: Metrics.unitMargin*3,
  	marginBottom: 5	
  },
  addLabel:{
  	fontSize: Metrics.unitFontSize*15,
  	marginRight: 5,
  	width: Metrics.unitMargin*25
  },
  phonenumbers:{
    fontSize: Metrics.unitFontSize*15,
    marginLeft: Metrics.unitMargin*3,
    marginVertical: Metrics.unitMargin
  },
  addTextinput:{
  	flex:1,
  	height: Metrics.unitMargin*6,
  	paddingVertical: 0,
  	fontSize: Metrics.unitFontSize*17,
  	paddingLeft: 5,
  	borderWidth:0.5
  },
  labelTextinput:{
    width:Metrics.unitMargin*15,
    height: Metrics.unitMargin*6,
    paddingVertical: 0,
    fontSize: Metrics.unitFontSize*15,
    paddingLeft: 5,
    borderWidth:0.5,
    marginRight:5
  },
  modalButtonView:{
  	width: Metrics.unitMargin*20,
  	paddingVertical: Metrics.unitMargin*1,
  	
  	alignItems:'center',
  	justifyContent:'center',
  	borderRadius: 5
  },
  modalButton:{
  	fontSize: Metrics.unitFontSize*20,
  	color: 'white',
  	fontWeight: '600'
  },
  addbutton:{
    flexDirection: 'row',
    alignItems:'center',
    marginLeft:Metrics.unitMargin*3
  },
  circleView:{
    width:16,
    height: 16,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'green',
    borderRadius: 8,
    marginRight: 5  
  },
  circleText:{
    fontSize: Metrics.unitFontSize*20,
    fontWeight:'600',
    color: 'white',
    lineHeight: Metrics.unitFontSize*20,
  },
  phone: {
    fontSize: Metrics.unitFontSize*14,
    color: 'blue'
  },
  delete:{
    backgroundColor:'red',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems:'center',
    justifyContent:'center',
    marginRight:5
  },
  deleteText:{
    fontSize: Metrics.unitFontSize*20,
    color: 'white',
    lineHeight: Metrics.unitFontSize*20,
    fontWeight:'600',
  }
})

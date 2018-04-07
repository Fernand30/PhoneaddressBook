import { StackNavigator, TabNavigator } from 'react-navigation'
import Welcome from './components/Welcome'


const WelcomeScreen = StackNavigator({
  WelcomeScreen:{ screen: Welcome}
}, {
  initialRouteName: 'WelcomeScreen',
  headerMode: 'none'
});



export default WelcomeScreen
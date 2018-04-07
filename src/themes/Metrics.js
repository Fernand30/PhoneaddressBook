
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

// Used via Metrics.baseMargin
const metrics = {
  unitMargin: responsiveWidth(1),
  unitFontSize: responsiveFontSize(0.1),
  screenWidth: responsiveWidth(100),
  screenHeight: responsiveHeight(100),
}

export default metrics

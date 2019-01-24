// Arquivos das telas
import PIN from './screens/PIN'
import Login from './screens/Login'
import Logout from './screens/Logout'
import Calendar from './screens/Calendar'
import Appointments from './screens/Appointments'

import { createStackNavigator } from 'react-navigation'
import commonStyles from './assets/styles/commonStyles';

const navigator = createStackNavigator (
  {
    PIN: PIN,
    Login: Login,
    Logout: Logout,
    Calendar: Calendar,
    Appointments: Appointments,
  },
  {
    initialRouteName: 'Login',
    /* The header config from HomeScreen is now here */
    navigationOptions: {      
      headerBackTitle: '',
      headerTruncatedBackTitle: '',
      headerStyle: {
        elevation: 0,
        borderBottomWidth: 0,
        backgroundColor: commonStyles.colors.primary,
      },
      headerTintColor: commonStyles.colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
        textAlign: 'left',
      },
    },
  }
)

export const globalState = {
  
  navBar: {
    firstLink: {
      screen: 'Logout',
      icon: 'power',
      title: 'Sair'
    },
    secondLink: {
      screen: 'Calendar',
      icon: 'person',
      title: 'Calendário'
    },
    navigation: null
  },
    
  dentistInfo: {
    id: 0,
    pin_hash: '',
    nome: ''
  },
  
  appointments: [],
  
  appointmentsDates: [],

  appointmentsOfSelectedDate: [],

  dataSelecionada: '2001-01-01'
}

export default navigator;
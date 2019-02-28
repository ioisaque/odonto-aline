import React, {Component} from 'react'
import PinView from 'react-native-pin-view'
import Icon from 'react-native-vector-icons/FontAwesome'
import { TouchableOpacity, View, Text, AsyncStorage } from 'react-native'

import { globalState } from '../App'
import styles from '../assets/styles/otherStyles'
import commonStyles from '../assets/styles/commonStyles';

export default class PIN extends Component {  
  static navigationOptions = {
    header: null,
    title: 'PIN'
  }

  constructor(props){
    super(props)
    
    this.state = {
      msgFeedBack: '',
      feedBackColor: commonStyles.colors.black
    }
  }

  render () {
    const { navigate } = this.props.navigation
    console.log('#=> Navigated to PIN.')
    
      return(
        <View style={styles.pinContainer}>
          <Text style={styles.PINfeedback} color={this.state.feedBackColor}>{this.state.msgFeedBack}</Text>
            <PinView
              pinLength={5}
              returnType={'string'}
              onComplete={ (val, clear) => {
                this.setState({msgFeedBack: 'Avaliando...', feedBackColor: commonStyles.colors.warning})
                loginOnWebservice(val, clear, this.handleWebserviceResponse)
              } }
            />

            <TouchableOpacity style={styles.loginButton} onPress={() => navigate('Login')}>
              <Icon style={styles.loginButtonIcon} name="sign-in" color="#fff" size={20}/>
              <Text style={styles.loginButtonText}> Entrar com E-mail </Text>
            </TouchableOpacity>
        </View>
      )
  }

  handleWebserviceResponse = (response, clear) => {
    console.log('Webservice response => ', response)
    
    if(!response.id_dentista)
    {
      this.setState({msgFeedBack: 'PIN Incorreto.', feedBackColor: commonStyles.colors.danger})
      return clear()
    }

    this.setState({msgFeedBack: 'Sucesso!', feedBackColor: commonStyles.colors.success})

    globalState.appointments = response.agenda
    globalState.dentistInfo.id = response.id_dentista
    globalState.dentistInfo.nome = response.nome_dentista
    globalState.dentistInfo.pin_hash = response.hash
    
    _storeLoginData('pin_hash', response.hash)
    _storeLoginData('id_dentista', response.id_dentista)
    _storeLoginData('nome_dentista', response.nome_dentista)

    const { navigate } = this.props.navigation
    navigate('Calendar')
  }
}

async function loginOnWebservice( PIN = '00000', clear, callback ) {
  console.log('RUNNING => @loginOnWebservice()', `[${PIN}]`)

  await fetch('http://odontoaline.sige.pro/webservices/app/login.php', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pin: PIN
    }),
  }).then((response) => {        
   return response.json()
  }).then((responseJson) => {
      callback(responseJson, clear)
    })
    .catch((error) => {
      console.error(error)
  });
}

// LOCAL STORAGE
_storeLoginData = async (key, value) => {
  //console.log('RUNNING => @_storeLoginData()', key + ' = ' + value)
  try {
    await AsyncStorage.setItem('alineLogin_'+key, value.toString())
  } catch (error) {
    console.log('Error storing data: ', error)
  }
}
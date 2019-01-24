import React, {Component} from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { AsyncStorage, View, Text, TouchableOpacity, Image, ActivityIndicator, } from 'react-native'

import 'expo'
import { globalState } from '../App'
import styles from '../assets/styles/otherStyles'
import commonStyles from '../assets/styles/commonStyles'

export default class Login extends Component {  
  static navigationOptions = {
    header: null,
    title: 'Login'
  }

  constructor(props){
    super(props)
  }
  
  state = {
    isLoading: true
  };

  render () {
    const { navigate } = this.props.navigation
    console.log('#=> Navigated to Login.')

      if (this.state.isLoading == true) {
        retrieveLoginData(this.handleLocalLoginInfo)
  
        return(
          <View style={styles.perfilContainer}>
            <View style={styles.pageBodyOnLoading} >
              <ActivityIndicator size="large" color={commonStyles.colors.primary}/>
            </View>
          </View>
        )
      }else
        return(
          <View style={styles.loginContainer}>
              <Image style={styles.loginLogo} source={require('../assets/logo-login.png')}></Image>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigate('PIN')}>
                  <Icon style={styles.loginButtonIcon} name="key" color="#fff" size={25}/>
                  <Text style={styles.loginButtonText}> Entrar com o PIN. </Text>
              </TouchableOpacity>
          </View>
        )
  }

  handleLocalLoginInfo = (loginData) => {      
    //console.log('Local login data =>', loginData)
    
    if (loginData.pin_hash != null) {
      globalState.dentistInfo = loginData
      loginOnWebservice(this.handleWebserviceResponse)
    }else{
      this.setState({ isLoading: false })
    }
  }

  handleWebserviceResponse = (response) => {
    console.log('Webservice response => ', response)
    
    if(!response.id_dentista)
    {
      this.setState({ isLoading: false })
      return false
    }

    globalState.appointments = response.agenda
    globalState.dentistInfo.id = response.id_dentista
    globalState.dentistInfo.nome = response.nome_dentista
    globalState.dentistInfo.pin_hash = response.hash
    
    storeLoginData('pin_hash', response.hash)
    storeLoginData('id_dentista', response.id_dentista)
    storeLoginData('nome_dentista', response.nome_dentista)

    const { navigate } = this.props.navigation
    navigate('Calendar')
    
    return true
  }
}

async function loginOnWebservice( callback ) {
  //console.log('RUNNING => @loginOnWebservice()')

  await fetch('http://odontoaline.sige.pro/webservices/app/login.php', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      hash: globalState.dentistInfo.pin_hash
    }),
  }).then((response) => {        
   return response.json()
  }).then((responseJson) => {
      callback(responseJson)
    })
    .catch((error) => {
      console.error(error)
  });
}

// LOCAL STORAGE
retrieveLoginData = async (callback) => {
  //console.log('RUNNING => @retrieveLoginData()')
  try {
    let values = {
        pin_hash:        await AsyncStorage.getItem('alineLogin_pin_hash'),
        id_dentista:     await AsyncStorage.getItem('alineLogin_id_dentista'),
        nome_dentista:   await AsyncStorage.getItem('alineLogin_nome_dentista'),
    }
    if (values !== null) {
      //console.log('Retrived alineLogin_ => ', values)
      callback(values)
    }
   } catch (error) {
     console.log('Error retrieving data: ', error)
     return null
   }
}

storeLoginData = async (key, value) => {
  //console.log('RUNNING => @storeLoginData()', key + ' = ' + value)
  try {
    await AsyncStorage.setItem('alineLogin_'+key, value.toString())
  } catch (error) {
    console.log('Error storing data: ', error)
  }
}
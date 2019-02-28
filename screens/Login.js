import React, {Component} from 'react'
import KeyboardShift from './components/KeyboardShift'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Alert, AsyncStorage, View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native'

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
    email: '',
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
          <KeyboardShift>
          {() => (
            <View style={styles.loginContainer}>
              <Image style={styles.loginLogo} source={require('../assets/logo-login.png')}></Image>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigate('PIN')}>
                  <Icon style={styles.loginButtonIcon} name="key" size={25}/>
                  <Text style={styles.loginButtonText}> Entrar com o PIN. </Text>
              </TouchableOpacity>

              <TextInput style={styles.inputMail} onChangeText={text => this.setState({email: text})} placeholder={'Digite seu E-mail...'} placeholderTextColor={commonStyles.colors.secondary} keyboardType={'email-address'}></TextInput>

              <TouchableOpacity style={styles.loginButton} onPress={this.loginWithEmail}>
                <Icon style={styles.loginButtonIcon} name="sign-in" size={20}/>
                <Text style={styles.loginButtonText}> Login </Text>
              </TouchableOpacity>
            </View>
          )}</KeyboardShift>
        )
  }

  loginWithEmail = () => {      
    console.log('RUNNING => @loginWithEmail()')
    this.setState({ isLoading: true })

    globalState.dentistInfo.email = this.state.email

    if (this.state.email != '') {
      loginOnWebserviceWithMail(this.handleWebserviceResponse)
    }else
      Alert.alert('Informe o seu e-mail antes...')

    this.setState({ isLoading: false })
  }

  handleLocalLoginInfo = (loginData) => {      
    //console.log('Local login data =>', loginData)
    
    if (loginData.pin_hash != null) {
      globalState.dentistInfo = loginData
      loginOnWebservice(this.handleWebserviceResponse)
    }else if (loginData.email != null) {
      globalState.dentistInfo = loginData
      loginOnWebserviceWithMail(this.handleWebserviceResponse)
    }else{
      this.setState({ isLoading: false })
    }
  }

  handleWebserviceResponse = (response) => {
    console.log('Webservice response => ', response)
    
    if(!response.id_dentista)
    {
      this.setState({ isLoading: false })
      Alert.alert('Atualmente você não está cadastrado como um dentista ou paciente em nosso sistema!')
      return false
    }

    globalState.appointments = response.agenda
    globalState.dentistInfo.pin_hash = response.hash
    globalState.dentistInfo.id = response.id_dentista
    globalState.dentistInfo.nome = response.nome_dentista
    globalState.dentistInfo.email = response.email
    
    storeLoginData('pin_hash', response.hash)
    storeLoginData('id_dentista', response.id_dentista)
    storeLoginData('nome_dentista', response.nome_dentista)
    storeLoginData('email', response.email)

    const { navigate } = this.props.navigation
    navigate('Calendar')
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

async function loginOnWebserviceWithMail( callback ) {
  //console.log('RUNNING => @loginOnWebserviceWithMail()')

  await fetch('http://odontoaline.sige.pro/webservices/app/login.php', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: globalState.dentistInfo.email
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
        email:   await AsyncStorage.getItem('alineLogin_email'),
    }
    if (values !== null) {
      console.log('Retrived alineLogin_ => ', values)
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
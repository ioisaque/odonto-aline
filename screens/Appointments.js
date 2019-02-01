import React, {Component} from 'react'
import { View, Image, ScrollView, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

import moment from 'moment'
import 'moment/locale/pt-br'

import {globalState} from '../App'
import Appt from './components/Appt'
import BottomNav from './components/BottomNav'
import styles from '../assets/styles/otherStyles';
import commonStyles from '../assets/styles/commonStyles';

export default class Horas extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      headerLeft: (
        <Image
          source={require('../assets/icon.png')}
          style={styles.headerLOGO}
        />
      ),
      headerTitle: (null),
      headerRight: (
        <Text style={styles.headerRightText}>{moment(params.data).format('dddd, DD [de] MMMM')}</Text>
      )
    };
  };  

  componentDidMount() {
    this.props.navigation.setParams({
      data: globalState.dataSelecionada
    });
  }

  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      isDialogVisible: false,
      dialogCurrentItem: null
    } 

    toggleDetailDialog = this.toggleDetailDialog.bind(this)
  }

  toggleDetailDialog = (appt) => {
    if (appt)
      this.setState({
        dialogHorario:        moment(appt.data_agenda).format('HH:mm'),
        dialogObservacao:     appt.observacao
      })
    else
      this.setState({
        dialogHorario: null,
        dialogObservacao: null
      })

    this.setState({ isDialogVisible: !this.state.isDialogVisible })
  }

  _UpdateAppointmentsList() {
    console.log('RUNNING => @_UpdateAppointmentsList()')
    globalState.appointmentsOfSelectedDate = globalState.appointments.filter((e) => e.data_agenda.split(' ', 1) == globalState.dataSelecionada)

    console.log('UPDATED  appointmentsOfSelectedDate => ', globalState.appointmentsOfSelectedDate)

    this.setState({isLoading : false})
  }
    
    render () {
      if (this.state.isLoading == true) {
        console.log('#=> Navigated to Horários.')
        globalState.navBar.navigation = this.props.navigation
        globalState.navBar.firstLink = {
          screen: 'Calendar',
          icon: 'arrow-round-back',
          title: 'Voltar' 
        }
        delete globalState.navBar.secondLink

        this._UpdateAppointmentsList()

        return(
          <View style={styles.perfilContainer}>
            <View style={styles.pageBodyOnLoading} >
              <ActivityIndicator size="large" color={commonStyles.colors.primary}/>
            </View>
          </View>
        )  
      }else{         
        return(
        <View style={styles.perfilContainer}>

          <ScrollView style={styles.pageBody}>
            <FlatList data={globalState.appointmentsOfSelectedDate}
              inverted={true}
              extraData={this.state}
              keyExtractor={item => `${item.data_agenda}`}
              renderItem={({ item }) => <Appt {...item}/> }/>
          </ScrollView>

          <BottomNav {...globalState.navBar}/>
        </View>
        )
      }
    }
};
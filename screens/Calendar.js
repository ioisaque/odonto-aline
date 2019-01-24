import React, {Component} from 'react'
import { StatusBar, View, Text, Image } from 'react-native';
import Dialog, { DialogTitle, DialogContent, DialogButton } from 'react-native-popup-dialog';
import {LocaleConfig, Calendar} from 'react-native-calendars';

import '../lib/javascript'
import {globalState} from '../App'
import BottomNav from './components/BottomNav'
import styles from '../assets/styles/otherStyles';
import commonStyles from '../assets/styles/commonStyles';

LocaleConfig.locales['br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan.','Fev.','Març.','Abrl.','Maio.','Junh.','Julh.','Ago.','Set.','Out.','Nov.','Dez.'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Do','Seg','Ter','Qua','Qui','Sex','Sab']
};
LocaleConfig.defaultLocale = 'br';

export default class Agendar extends Component{

  static navigationOptions = {
    header: (null),
  }
  constructor(props){
    super(props),

    this.state = {
      date: new Date(),
      
      dialogCurrentItem: null,
      isDialogVisible: false
    }
    _handleLogOut = this._handleLogOut.bind(this)
    updateLocalData = this.updateLocalData.bind(this)
  }

    render () {
      console.log('#=> Navigated to Calendário.')
      globalState.navBar.navigation = this.props.navigation
      globalState.navBar.firstLink = {
        screen: 'Logout',
        icon: 'power',
        title: 'Sair' 
      }
      globalState.navBar.secondLink = {
        screen: 'Refresh',
        icon: 'refresh',
        title: 'Atualizar' 
      }

      let apptGreen = []
      let coloredDates = new Object()

      const appointments = globalState.appointments;
      const hasAppointments = appointments.length > 0;
      const isAppointmentsUndefined = (appointments.length === 1) && (appointments[0] === undefined);
      if (hasAppointments && !isAppointmentsUndefined)
      {
        apptGreen = globalState.appointments
                      ._flatMap(element => (element.data_agenda) ? element.data_agenda.split(' ', 1) : [] )
                      .distinct();

        apptGreen.forEach(element => {
          coloredDates[element] = commonStyles.calendarDayGreen
        })
      }

      return (
        <View style={styles.perfilContainer}>
          <StatusBar barStyle="dark-content" /> 

          <View style={styles.topHeader}>            
            <Image style={styles.headerLogoCenter} source={require('../assets/logoAline.png')}/>

            <Text style={styles.welcomeText}> Bem vindo(a), {globalState.dentistInfo.nome.split(' ', 1)}! </Text>
          </View>     

          <View style={styles.pageBodyCalendar}>
            <Calendar
              style={{
                width: '100%',
                height: 350
              }}
              minDate={this.state.date}
              hideExtraDays={true}
              onDayPress={(day) => this._goToMyAppointments(apptGreen, day.dateString)}
              markedDates={coloredDates}
              markingType={'period'}
              theme={commonStyles.calendar}
            />
          </View>

          <BottomNav {...globalState.navBar}/>

          <Dialog
              dialogTitle={<DialogTitle title={'SAIR'}/>}
              dialogStyle={styles.defaultDialog}
              visible={this.state.isDialogVisible}
              onTouchOutside={ () => {this.setState({ isDialogVisible: false })} }
              actions={[
                <DialogButton text="SIM" style={styles.successBtn} onPress={ () => {this._handleLogOut(1)}} textStyle={{color: commonStyles.colors.white}}/>,
                <DialogButton text="NÃO" style={styles.dangerBtn} onPress={ () => {this.setState({ isDialogVisible: false })}} textStyle={{color: commonStyles.colors.white}}/>
              ]}
              actionsBordered={false}
            >
            <DialogContent>
              <Text style={styles.dialogTitle}>{'Tem certeza que deseja sair?'}</Text>
            </DialogContent>
          </Dialog>
        </View>
        )
      }

    updateLocalData = (result) => {
      //console.log('RUNNING => @updateLocalData()', result)

      this.setState({ isLoading: true })

      if (!result)
        loginOnWebservice(this.updateLocalData)
      else{
        globalState.appointments = result.agenda

        let apptGreen = []
        let coloredDates = new Object()

        const appointments = globalState.appointments;
        const hasAppointments = appointments.length > 0;
        const isAppointmentsUndefined = (appointments.length === 1) && (appointments[0] === undefined);
        if (hasAppointments && !isAppointmentsUndefined)
        {
          console.log('hasAppointments = true, isAppointmentsUndefined')
          apptGreen = globalState.appointments
              ._flatMap(element => (element.data_agenda) ? element.data_agenda.split(' ', 1) : [] )
              .distinct();

          apptGreen.forEach(element => {
            coloredDates[element] = commonStyles.calendarDayGreen
          })
        }

        this.setState({ isLoading: false })
      }
    }

    _getDistinctList = (list) => {
      return list.filter((value, index, self) => self.indexOf(value) === index)
    }

    _goToMyAppointments = (apptGreen, day) => { 
      //console.log('apptGreen => ', apptGreen)
      console.log('RUNNING => @_goToMyAppointments() => ', `[${day}]`)
      if (apptGreen.includes(day))
      {
        const {navigate} = this.props.navigation
        globalState.dataSelecionada = day
        navigate('Appointments') 
      }
    }

    _handleLogOut = (action) => {
      //console.log('RUNNING => @_handleLogOut()')
      if (action) {
        this.setState({ isDialogVisible: false })
        const { navigate } = this.props.navigation
        navigate('Logout')
      }else
        this.setState({ isDialogVisible: true })
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
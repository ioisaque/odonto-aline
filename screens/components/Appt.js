import React from 'react'
import { View, Text } from 'react-native';

import moment from 'moment'
import 'moment/locale/pt-br'

import styles from '../../assets/styles/otherStyles';
import commonStyles from '../../assets/styles/commonStyles';

export default props => {
  if (props.id_paciente == 0)
    return (
        <View>
          <View style={styles.componente} backgroundColor={commonStyles.colors.darkGrey}>
            <View style={styles.paciente}>
              <Text style={{fontSize: 17, marginLeft: 5, color: commonStyles.colors.white}}>Horário Bloqueado</Text>
            </View>
            <View style={styles.horaio}>
              <Text style={{fontSize: 25, marginLeft: 5, color: commonStyles.colors.white}}>{moment(props.data_agenda).format('HH:mm')}</Text>
            </View>
          </View>
          <View style={styles.linha}></View>
        </View>
    )
  else
    return (
        <View>
            <View style={styles.componente}>
                <View style={styles.paciente}>
                    <Text style={styles.info}>{props.nome_paciente}</Text>
                    {props.observacao ? <Text style={styles.info}>Obs: {props.observacao}</Text> : null}
                </View>
                <View style={styles.horaio}>
                    <Text style={styles.modalidade}>{moment(props.data_agenda).format('HH:mm')}</Text>
                </View>
            </View>
            <View style={styles.linha}></View>
        </View>
    )
}
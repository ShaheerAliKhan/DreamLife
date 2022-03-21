import { View, Text, SafeAreaView, Platform, Button, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
const App = () => {
  const [dateTime, setDateTime] = useState(new Date())
  const [alarmArray, setAlarmArray] = useState([])
  const [addAlarm, setAddAlarm] = useState(false)

  const AlarmList = ({ item, index }) => {
    const PRIMARY_COLOR = '#F68D20'

    const removeAlarm = (index) => {
      Alert.alert('Remove Alarm?', 'Are you sure you want to remove alarm?', [
        {
          text: 'Cancel'
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setAlarmArray(alarmArray.filter(function (value, i, arr) {
              return i != index && value;
            }))
          }
        }
      ])
    }

    return (
      <View style={{
        flexDirection: 'row',
        margin: 5,
        backgroundColor: PRIMARY_COLOR,
        padding: 10,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
        <View style={{ flex: 0.5, justifyContent: 'center' }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>{index + 1}. {moment(item).format('DD-MM-YY h:m')}</Text>
        </View>
        <View style={{ flex: 0.5, alignItems: 'flex-end', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => removeAlarm(index)} style={{ backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 200 }}>
            <Text style={{ color: 'red' }}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView>
          <View style={{ flex: 1, backgroundColor: 'white', padding: 10 }}>
            <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Welcome to DreamLife</Text>
            <View style={{ padding: 10 }}>
              {
                !addAlarm &&
                <Button
                  title='Add new alarm'
                  onPress={() => setAddAlarm(!addAlarm)}
                />
              }
            </View>
            {addAlarm && <View style={{ padding: 10, paddingTop: 0 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Select Date and Time</Text>
              <DateTimePicker
                style={{ marginVertical: 10 }}
                mode="datetime"
                value={dateTime}
                // display={Platform.OS == "android" ? "default" : 'spinner'}
                onChange={(event, datetime) => setDateTime(datetime)}
              />
              
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 0.5 }}>
                  <Button
                    title='Set alarm'
                    onPress={() => {
                      setAlarmArray([...alarmArray, dateTime])
                    }}
                  />
                </View>
                <View style={{ flex: 0.5 }}>
                  <Button
                    title='Cancel'
                    color={'red'}
                    onPress={() => setAddAlarm(!addAlarm)}
                  />
                </View>
              </View>
            </View>}
            <View>
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 15 }}>Settled Alarms</Text>
              <FlatList
                extraData={alarmArray}
                data={alarmArray}
                renderItem={({ item, index }) => <AlarmList index={index} item={item} key={index} />}
                ListEmptyComponent={() => <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18, marginTop: 15 }}>No alarms settled</Text>}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default App
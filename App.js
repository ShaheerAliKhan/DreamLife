import { View, Text, SafeAreaView, Platform, Button, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import ReactNativeAN from 'react-native-alarm-notification';
import SimpleToast from 'react-native-simple-toast';
// import Slider from '@react-native-community/slider';
const PRIMARY_COLOR = '#F68D20'

const App = () => {
  const [dateTime, setDateTime] = useState(new Date())
  const [alarmArray, setAlarmArray] = useState([])
  const [addAlarm, setAddAlarm] = useState(false)
  const [sound_name, setSelectedTune] = useState('1.mp3');
  const [count, setCount] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    (async function () {
      setAlarmArray(await ReactNativeAN.getScheduledAlarms())
      console.log(await ReactNativeAN.getScheduledAlarms())
    })();
    ReactNativeAN.requestPermissions({ alert: true, badge: true, sound: true })
  }, [count])

  const removeAlarm = (alarmId) => {
    Alert.alert('Remove Alarm?', 'Are you sure you want to remove alarm?', [
      {
        text: 'Cancel'
      },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          ReactNativeAN.deleteAlarm(alarmId)
          setCount(count + 1)
          // setAlarmArray(alarmArray.filter(function (value, i, arr) {
          //   return i != index && value;
          // }))
        }
      }
    ])
  }

  const addAlarmFunction = async () => {
    // setAlarmArray([...alarmArray, dateTime])
    // const fire_date = ReactNativeAN.parseDate(new Date(Date.now() + 1000));
    const fire_date = moment(dateTime).format('DD-MM-yyyy HH:mm:ss')
    let alarmNotifData = {
      title: "My Notification Title",
      message: "My Notification Message",
      fire_date,
      sound_name,
      // volume: parseFloat(volume)
    };
    await ReactNativeAN.scheduleAlarm({ ...alarmNotifData }).then(() => {
      SimpleToast.show('Alarm has been scheduled.')
      setCount(count + 1)
    }).catch((e) => {
      const str = e.message;
      const str2 = str.charAt(0).toUpperCase() + str.slice(1) + '.';
      SimpleToast.show(str2)
    })
  }

  const AlarmList = ({ item, index }) => {
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
          {/* <Text style={{ color: 'white', fontWeight: 'bold' }}>{index + 1}. {moment(item).format('DD-MM-yyyy HH:mm:ss')}</Text> */}
          <Text style={{ color: 'white', fontWeight: 'bold' }}>{index + 1}. {`${item.day}-${item.month}-${item.year} ${item.hour}:${item.minute}`}</Text>
        </View>
        <View style={{ flex: 0.5, alignItems: 'flex-end', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => removeAlarm(Number(item.id))} style={{ backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 200 }}>
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
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Select Ringtone</Text>
              <Picker
                selectedValue={sound_name}
                onValueChange={(itemValue) => setSelectedTune(itemValue)}>
                <Picker.Item label="Tune 1" value="1.mp3" />
                <Picker.Item label="Tune 2" value="2.mp3" />
                <Picker.Item label="Tune 3" value="3.mp3" />
                <Picker.Item label="Tune 4" value="4.mp3" />
                <Picker.Item label="Tune 5" value="5.mp3" />
                <Picker.Item label="Tune 6" value="6.mp3" />
              </Picker>
              {/* <View>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                  Adjust Alarm Volume
                </Text>
                <Slider
                  minimumValue={0}
                  maximumValue={1}
                  value={volume}
                  step={0.1}
                  minimumTrackTintColor={PRIMARY_COLOR}
                  onValueChange={(value) => {
                    setVolume(parseFloat(value)?.toFixed(1))
                  }}
                />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                  Adjusted Volume: {Math.round(volume * 100)}%
                </Text>
              </View> */}
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 0.5 }}>
                  <Button
                    title='Set alarm'
                    onPress={addAlarmFunction}
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
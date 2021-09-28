/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  Alert,
  Button,
  PermissionsAndroid,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import Sound from 'react-native-sound';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [text, setText] = useState('');
  const [filePath, setFilePath] = useState(null);

  const key = 'c499b0896b5f4a04ab740ec0dbe034c5';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const checkPermissions = async () => {
    const granted = await PermissionsAndroid.check(
      'android.permission.READ_EXTERNAL_STORAGE',
    );
    if (!granted) {
      const response = await PermissionsAndroid.request(
        'android.permission.READ_EXTERNAL_STORAGE',
      );
      if (!response) {
        return;
      }
    }
  };

  const playTrack = () => {
    const track = new Sound(
      `http://api.voicerss.org/?key=${key}&hl=en-us&src=${text}`,
      null,
      e => {
        if (e) {
          console.log('error loading track:', e);
        } else {
          track.play();
          console.log('played');
        }
      },
    );
  };
  const sendConvertReq = async () => {
    console.log(text);
    playTrack();
    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'mp3',
    })
      .fetch(
        'GET',
        `http://api.voicerss.org/?key=${key}&hl=en-us&src=${text}`,
        {
          //some headers ..
        },
      )
      .then(res => {
        console.log('The file saved to ', res.path());
        setFilePath(res.path());
      });
  };

  const shareAudio = async () => {
    if (filePath) {
      Share.open({
        url: 'file://' + filePath,
        type: 'audio/mp3',
      })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      Alert.alert('Alert', 'Download the audio file first', [{text: 'OK'}]);
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <View style={styles.sectionContainer}>
            <Text>Make your own robotic audio messages with this app</Text>
          </View>
          <View style={styles.sectionContainer}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: isDarkMode ? Colors.white : Colors.black,
                },
              ]}>
              Step One
            </Text>
            <TextInput
              placeholder="Enter text which has to be converted to audio"
              autoFocus
              value={text}
              onChangeText={e => {
                setText(e);
              }}
              style={{borderColor: 'black', padding: 20}}
            />
            <Button title=" Download and Play" onPress={sendConvertReq} />
          </View>
          <View style={styles.sectionContainer}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: isDarkMode ? Colors.white : Colors.black,
                  marginBottom: 10,
                },
              ]}>
              Step Two
            </Text>
            <Text style={{marginBottom: 20}}>
              Share your audio with everyone
            </Text>

            <Button title="Share" onPress={shareAudio} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity,Alert,ToastAndroid } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { DataTable } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import * as Clipboard from 'expo-clipboard';
import { Button } from 'react-native-elements';

export default function App() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState(new Date().toLocaleTimeString());
  const [history, setHistory] = useState([]);


  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  };
  
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(text);
    
    ToastAndroid.show('Text is copied', ToastAndroid.SHORT);

  };

  useEffect(() => {
    askForCameraPermission();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data);
    setType(type);
    setDate(new Date().toLocaleTimeString());
    console.log("Type: " + type + "\nData: " + data);

    setHistory([...history, { data: data, date: date, type: type }]);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button
          title="Allow Camera"
          onPress={() => askForCameraPermission()}
        />
      </View>
    );
  }

  return (<>
    <ScrollView>
      {console.log(history)}
      <View style={styles.container}>
        {scanned ? null : (
          <>
            <View style={styles.barcodebox}>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={{ height: 400, width: 400 }}
              />
            </View>

          </>
        )}
        {scanned ? (
          <>
            <Text style={styles.maintext1}>Type: {type}</Text>
            <View style={{ flexDirection: "row" }}>


              <Text style={styles.maintext}>
                Data: {text.split(";").join("\n")}
              </Text>


              <Button buttonStyle={{ backgroundColor: "transparent", marginLeft: 10, marginTop: 10 }} onPress={copyToClipboard}
                icon={{
                  name: "copy",
                  type: "font-awesome",
                  size: 16,
                  color: "#6499e3"
                }}
                size="sm"

                title=""
              />
            </View>

            {scanned && (
              <TouchableOpacity
                style={{
                  padding: 14,
                  backgroundColor: "tomato",
                  borderRadius: 20,
                  marginBottom: 20,
                }}
                onPress={() => setScanned(false)}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>SCAN AGAIN</Text>
              </TouchableOpacity>
            )}

            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Type</DataTable.Title>

                <DataTable.Title>Value</DataTable.Title>
                <DataTable.Title numeric>Time</DataTable.Title>
              </DataTable.Header>
              {history.map((value, index) => {
                return (
                  <>
                    <DataTable.Row >
                      <DataTable.Cell key={index} style={{ fontWeight: "bold" }}>
                        {value.type}
                      </DataTable.Cell>
                      <DataTable.Cell style={{ fontWeight: "bold" }}>
                        {value.data}
                      </DataTable.Cell>
                      <DataTable.Cell numeric>{value.date}</DataTable.Cell>
                    </DataTable.Row>
                  </>
                );
              })}
            </DataTable>
          </>
        ) : null}
      </View>

    </ScrollView>

  </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  maintext1: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "bold",
  },
  maintext: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 50,
    fontWeight: "bold",
  },
  barcodebox: {
    alignItems: "center",
    marginTop: 100,
    justifyContent: "center",
    height: 400,
    width: windowWidth - 93,
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "tomato",
  },
});

import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Alert, Text } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export default function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [excelContent, setExcelContent] = useState("");

  const handleSaveToExcel = async () => {
    try {
      const fileName = "excelData";
      const path = `${FileSystem.documentDirectory}${fileName}.csv`;
      let existingContent;
      if (excelContent) {
        existingContent = await FileSystem.readAsStringAsync(path, {
          encoding: FileSystem.EncodingType.UTF8,
        });
      }
      const csvData = `${
        existingContent ? `${existingContent}\n` : ""
      }${firstName},${lastName}`;
      await FileSystem.writeAsStringAsync(path, csvData, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      Alert.alert("Data saved to Excel successfully!");
      setFirstName("");
      setLastName("");
      // Read and set the updated content
      handleReadExcel();
    } catch (error) {
      console.error("Error saving to Excel:", error);
      Alert.alert("Error", "An error occurred while saving to Excel.");
    }
  };

  const handleReadExcel = async () => {
    try {
      const fileName = "excelData";
      const path = `${FileSystem.documentDirectory}${fileName}.csv`;
      const content = await FileSystem.readAsStringAsync(path, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      setExcelContent(content);
      Alert.alert("Excel file read successfully!");
    } catch (error) {
      console.error("Error reading Excel:", error);
      Alert.alert("Error", "An error occurred while reading Excel.");
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const fileName = "excelData";
      const path = `${FileSystem.documentDirectory}${fileName}.csv`;

      const shareableURL = await Sharing.shareAsync(path, {
        mimeType: "text/csv",
        dialogTitle: "Download Excel",
      });

      if (shareableURL.action === Sharing.sharedAction) {
        console.log("File shared or downloaded successfully.");
      } else {
        console.log("Sharing or download was cancelled.");
      }
    } catch (error) {
      console.error("Error downloading Excel:", error);
      Alert.alert("Error", "An error occurred while downloading Excel.");
    }
  };

  const handleDeleteExcel = async () => {
    try {
      const fileName = "excelData";
      const path = `${FileSystem.documentDirectory}${fileName}.csv`;

      await FileSystem.deleteAsync(path);
      setExcelContent("");
      Alert.alert("Excel file deleted successfully!");
    } catch (error) {
      console.error("Error deleting Excel:", error);
      Alert.alert("Error", "An error occurred while deleting Excel.");
    }
  };

  useEffect(() => {
    // Initial read when the component mounts
    handleReadExcel();
  }, []);

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: "center" }}>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          padding: 10,
        }}
        placeholder="First Name"
        onChangeText={(text) => setFirstName(text)}
        value={firstName}
      />
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          padding: 10,
        }}
        placeholder="Last Name"
        onChangeText={(text) => setLastName(text)}
        value={lastName}
      />
      <View style={{ marginBottom: 0.5, padding: 10 }}>
        <Button title="Save to Excel" onPress={handleSaveToExcel} />
      </View>
      <View style={{ marginBottom: 0.5, padding: 10 }}>
        <Button title="Download file" onPress={handleDownloadExcel} />
      </View>
      <View style={{ marginBottom: 0.5, padding: 10 }}>
        <Button title="Reset file" onPress={handleDeleteExcel} />
      </View>

      {excelContent ? (
        <View style={{ marginTop: 20 }}>
          <Text>CSV Content:</Text>
          <Text>{excelContent}</Text>
        </View>
      ) : null}
    </View>
  );
}

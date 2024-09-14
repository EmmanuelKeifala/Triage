import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import useMessageStore, { Message } from "@/components/Store";
import { fetchApi } from "@/lib/fetchApi";

import { generatePatientId } from "@/lib/generatePatientId";

import getData from "@/lib/getFacilityData";
import uploadFileToArweave from "@/lib/uploadData";
import { supabase } from "@/lib/supabase";

const endpoint = "summary";
const TriageScreen = () => {
  const [activeTab, setActiveTab] = useState("Doctors");
  const [triageData, setTriageData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const { messages, settings, facilityCode, clearMessages } = useMessageStore();
  const [isSaved, setIsSaved] = useState(false);
  const [facilityData, setFacilityData] = useState<any>([]);

  useEffect(() => {
    async function fetchFacilityData() {
      try {
        const data = await getData(facilityCode);
        setFacilityData(data);
      } catch (error) {
        console.error("Error fetching facility data:", error);
      }
    }

    fetchFacilityData();
  }, [facilityCode]);

  useEffect(() => {
    const fetchTriageData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchApi({
          messagesData: messages,
          settings,
          endpoint,
        });
        if (response?.data) {
          setTriageData(response.data);
        } else {
          console.error("Invalid response data", response);
        }
      } catch (error) {
        console.error("Error fetching triage data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTriageData();
  }, [messages, settings]);

  const tabs = [
    "Doctors",
    "Presenting complaint",
    "History of presenting complaint",
    "Systemic review",
    "Pregnancy and delivery history",
    "Past medical history",
    "Drug history",
    "Developmental history",
    "Feeding history",
    "Immunization history",
    "Family history",
    "Social history",
    "Differential Diagnosis",
    "Summary",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await fetchApi({
          messagesData: messages,
          settings,
          endpoint,
        });
        console.log("export response: ", response);
        if (response && response.data) {
          setTriageData(response.data);
        } else {
          console.error("Invalid response data", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // End loading
      }
    };

    fetchData();
  }, [messages, settings, endpoint]);

  const handleTabPress = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  const handleDbSave = async () => {
    const { Biodata } = triageData; // Assuming formData contains the form data

    // Check for required fields
    if (!Biodata["Age"] || !Biodata["Name of patient"] || !Biodata["Sex"]) {
      Alert.alert(
        "Missing Information",
        "Please ensure that Age, Name of patient, and Gender (Sex) are filled."
      );
      return;
    }

    const patientId = generatePatientId();

    try {
      if (!isSaved) {
        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        // const response = await uploadFileToArweave(
        //   uri,
        //   "application/pdf"
        // )
        // // console.log( response.tx)
        await supabase.from("patients").insert({
          patientid: patientId,
        });
        const { error, data } = await supabase.from("messages").insert({
          hash_tx: "hjdagsdh",
          facilitycode: facilityCode,
          patientid: patientId,
        });
        console.log(error);
        Alert.alert("Success", "Data saved to the database");

        setIsSaved(true);
      } else {
        Alert.alert("Error", "Data aleady Saved");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save data to the database");
    }
  };

  const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Patient Report</title>
            <style>
                body {
                    font-family: 'mons-sb';
                    margin: 0;
                    padding: 20px;
                    background-color: #f4f4f9;
                }
                header {
                    background-color: #00996b;
                    padding: 20px;
                    color: white;
                    text-align: center;
                    border-radius: 10px;
                }
                h1 {
                    margin-bottom: 5px;
                }
                .section-title {
                    font-size: 20px;
                    color: #333;
                    border-bottom: 2px solid #00796b;
                    padding-bottom: 5px;
                    margin-top: 20px;
                    font-weight: bold;
                }
                .section {
                    margin-bottom: 20px;
                }
                .section p {
                    margin: 5px 0;
                    color: #555;
                    line-height: 1.6;
                }
                .data-label {
                    font-weight: bold;
                    color: #333;
                }
                .container {
                    margin: 0 auto;
                    padding: 20px;
                    max-width: 800px;
                    background-color: #fff;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                .biodata {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-gap: 10px;
                }
                .biodata div {
                    padding: 5px;
                }
                    .logo {
                width: 100px;
                height: 100px;
                margin-bottom: 10px;
            }
                footer {
                    text-align: center;
                    padding: 10px;
                    background-color: #00796b;
                    color: white;
                    border-radius: 10px;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                <img className="logo" src="https://res.cloudinary.com/dmbixlxfk/image/upload/v1725616809/e7u23azqcqnx7ftwrwxm.png" alt="logo" />
                    <h1>Patient Report</h1>
                    <p>Detailed Medical History</p>
                </header>
                <section class="section biodata">
                    <div>
                       <p><span class="data-label">Name of patient:</span> ${
                         triageData?.Biodata?.["Name of patient"] || "N/A"
                       }</p>
  <p><span class="data-label">Age:</span> ${
    triageData?.Biodata?.["Age"] || "N/A"
  }</p>
  <p><span class="data-label">Sex:</span> ${
    triageData?.Biodata?.["Sex"] || "N/A"
  }</p>
  <p><span class="data-label">Address:</span> ${
    triageData?.Biodata?.["Address"] || "N/A"
  }</p>
  <p><span class="data-label">Date of interview:</span> ${
    triageData?.Biodata?.["Date of interview"] || "N/A"
  }</p>
  <p><span class="data-label">Date of admission:</span> ${
    triageData?.Biodata?.["Date of admission"] || "N/A"
  }</p>
  <p><span class="data-label">Informant:</span> ${
    triageData?.Biodata?.["Informant"] || "N/A"
  }</p>
  <p><span class="data-label">Reliability:</span> ${
    triageData?.Biodata?.["Reliability"] || "N/A"
  }</p>
  <p><span class="data-label">Facility Name:</span> ${
    facilityData[0]?.["facilityname"]
  }</p>
  
                    </div>
                </section>
                <section class="section">
                    <p class="section-title">Presenting Complaint</p>
                    <p><span class="data-label">Complaints:</span> ${
                      triageData["Presenting complaint(s)"] || "N/A"
                    }</p>
                </section>
                <section class="section">
                    <p class="section-title">History of Presenting Complaints</p>
                    <p>${
                      triageData["History of presenting complaint"] || "N/A"
                    }</p>
                </section>
                <section class="section">
                    <p class="section-title">Systemic Inquiry (Review)</p>
                    <p><span class="data-label">General:</span> ${
                      triageData["Systemic inquiry(review)"] || "N/A"
                    }</p>
                    <p><span class="data-label">Respiratory:</span> ${
                      triageData["Respiratory"] || "N/A"
                    }</p>
                    <p><span class="data-label">Cardiovascular:</span> ${
                      triageData["Cardiovascular"] || "N/A"
                    }</p>
                </section>
                <section class="section">
                    <p class="section-title">Pregnancy and Delivery History</p>
                    <p>${
                      triageData["Pregnancy and Delivery History"] || "N/A"
                    }</p>
                </section>
                <section class="section">
                    <p class="section-title">Past Medical History</p>
                    <p>${triageData["Past medical history"] || "N/A"}</p>
                </section>
                <section class="section">
                    <p class="section-title">Drug History</p>
                    <p>${triageData["Drug history"] || "N/A"}</p>
                </section>
                <section class="section">
                    <p class="section-title">Developmental History</p>
                    <p>${triageData["Developmental History"] || "N/A"}</p>
                </section>
                <section class="section">
                    <p class="section-title">Feeding History</p>
                    <p>${triageData["Feeding History"] || "N/A"}</p>
                </section>
                <section class="section">
                    <p class="section-title">Immunization History</p>
                    <p>${triageData["Immunization history"] || "N/A"}</p>
                </section>
                <section class="section">
                    <p class="section-title">Family History</p>
                    <p>${triageData["Family History"] || "N/A"}</p>
                </section>
                <section class="section">
                    <p class="section-title">Social History</p>
                    <p>${triageData["Social History"] || "N/A"}</p>
                </section>
                 <section class="section">
                    <p class="section-title">Differential Diagnosis</p>
                    <p>${triageData["differential diagnosis"] || "N/A"}</p>
                </section>
                <section class="section">
                    <p class="section-title">Summary</p>
                    <p>${triageData["Summary"] || "N/A"}</p>
                </section>
                <footer>
                    <p>End of Report </p>
                </footer>
            </div>
        </body>
        </html>
    `;

  const handlePrint = async () => {
    if (isSaved) {
      await Print.printAsync({ html: htmlContent });
    } else {
      Alert.alert("Error", "Please save the file first");
    }
  };

  const handleSave = async () => {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    handleDbSave();
    console.log("PDF saved to:", uri);
  };

  const handleShare = async () => {
    if (isSaved) {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await shareAsync(uri);
    } else {
      Alert.alert("Error", "Please save the file first");
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#00857E" />;
    }

    const renderCategoryContent = (category: string, data: any) => (
      <ScrollView style={styles.categoryContainer}>
        <Text style={styles.header}>{category}</Text>
        <Text style={styles.contentText}>{data || "No data available"}</Text>
      </ScrollView>
    );

    switch (activeTab) {
      case "Doctors":
        return renderCategoryContent("Doctors", triageData["Doctors"]);

      case "Presenting complaint":
        return renderCategoryContent(
          "Presenting Complaint",
          triageData["Presenting complaint(s)"]
        );

      case "History of presenting complaint":
        return renderCategoryContent(
          "History of Presenting Complaint",
          triageData["History of presenting complaint"]
        );

      case "Systemic review":
        return renderCategoryContent(
          "Systemic Review",
          triageData["Systemic inquiry(review)"]
        );

      case "Pregnancy and delivery history":
        return renderCategoryContent(
          "Pregnancy and Delivery History",
          triageData["Pregnancy and delivery history"]
        );

      case "Past medical history":
        return renderCategoryContent(
          "Past Medical History",
          triageData["Past medical history"]
        );

      case "Drug history":
        return renderCategoryContent(
          "Drug History",
          triageData["Drug history"]
        );

      case "Developmental history":
        return renderCategoryContent(
          "Developmental History",
          triageData["Developmental history"]
        );

      case "Feeding history":
        return renderCategoryContent(
          "Feeding History",
          triageData["Feeding history"]
        );

      case "Immunization history":
        return renderCategoryContent(
          "Immunization History",
          triageData["Immunization history"]
        );

      case "Family history":
        return renderCategoryContent(
          "Family History",
          triageData["Family history"]
        );

      case "Social history":
        return renderCategoryContent(
          "Social History",
          triageData["Social history"]
        );

      case "Differential Diagnosis":
        return renderCategoryContent(
          "Differential Diagnosis",
          triageData["differential diagnosis"]
        );

      case "Summary":
        return renderCategoryContent("Summary", triageData["Summary"]);

      default:
        return <Text>No data available</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Image
          source={require("@/assets/images/triage_logo.png")}
          style={styles.logo}
        />
        <View style={styles.userContainer}>
          <Text style={styles.userText}>
            {facilityData[0]?.["facilityname"]}
          </Text>
        </View>
      </View>

      {/* Tabs Section */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabButton,
              { width: 120, height: 40 },
              activeTab === tab && styles.activeTabButton,
            ]}
            onPress={() => handleTabPress(tab)}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === tab && styles.activeTabButtonText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content Section */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {renderContent()}
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.printButton}
          onPress={handlePrint}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Print</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8f8",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginTop: 10,
  },
  logo: {
    width: 80,
    height: 40,
    resizeMode: "contain",
  },
  userContainer: {
    backgroundColor: "#e0f7fa",
    padding: 8,
    borderRadius: 15,
  },
  userText: {
    fontSize: 14,
    color: "#00796b",
    fontFamily: "mons",
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginTop: 15,
  },
  tabButton: {
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeTabButton: {
    backgroundColor: "#00796b",
  },
  tabButtonText: {
    fontSize: 14,
    color: "#00796b",
    padding: 10,
    fontFamily: "mons-black",
  },
  activeTabButtonText: {
    color: "#ffffff",
  },
  contentContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: "#ffffff",
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categoryContainer: {
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00796b",
    textAlign: "center",
    marginBottom: 10,
  },
  contentText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "mons-sb",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#ffffff",
  },
  saveButton: {
    backgroundColor: "#ff5252",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  shareButton: {
    backgroundColor: "#00796b",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  printButton: {
    backgroundColor: "#424242",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
    fontFamily: "mons-sb",
  },
});

export default TriageScreen;

import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAnalytics } from "../../hooks";

export default function ReferencesModal() {
  const analytics = useAnalytics();

  // Screen tracking
  useFocusEffect(
    useCallback(() => {
      analytics.logScreenView(analytics.SCREEN_NAMES.REFERENCES);
      analytics.logModalEvent('references', 'opened', 'info');
      analytics.logEvent(analytics.ANALYTICS_EVENTS.REFERENCES_VIEWED, {
        context: 'modal_opened',
      });
    }, [analytics])
  );

  const handleClose = () => {
    analytics.logModalEvent('references', 'closed', 'user_action');
    router.dismiss();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row items-center justify-between py-4 border-b border-gray-200 mb-8">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900">References</Text>
            <Text className="text-gray-600 mt-1">
              Data sources and disclaimers
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleClose}
            className="p-2 rounded-full bg-gray-100"
          >
            <Ionicons name="close" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View>
          {/* Main Content */}
          <View className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 mb-8">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-3">
                <Ionicons name="information-circle" size={20} color="white" />
              </View>
              <Text className="text-lg font-semibold text-blue-900">
                Information Sources
              </Text>
            </View>

            <Text className="text-gray-700 leading-6 mb-4">
              The information provided in this application is sourced as
              follows:
            </Text>

            {/* Pricing Data Section */}
            <View className="mb-6">
              <View className="flex-row items-start mb-3">
                <View className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3" />
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900 mb-2">
                    Pricing Data & Product Information
                  </Text>
                  <Text className="text-gray-700 leading-6">
                    Pricing data, active ingredient details, and manufacturer
                    names are derived from the information displayed on the
                    exterior packaging of medicines available at pharmacies.
                  </Text>
                </View>
              </View>
            </View>

            {/* Clinical Information Section */}
            <View className="mb-6">
              <View className="flex-row items-start mb-3">
                <View className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3" />
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900 mb-2">
                    Clinical Information
                  </Text>
                  <Text className="text-gray-700 leading-6">
                    Clinical information is obtained from the official package
                    inserts included within the medication packaging. For
                    further details, users are advised to consult the respective
                    medicine packages.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Disclaimer Section */}
          <View className="bg-amber-50 rounded-2xl p-6 border border-amber-200 mb-8">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 bg-amber-500 rounded-full items-center justify-center mr-3">
                <Ionicons name="warning" size={20} color="white" />
              </View>
              <Text className="text-lg font-semibold text-amber-900">
                Important Disclaimer
              </Text>
            </View>

            <Text className="text-gray-700 leading-6">
              This application is for informational purposes only. Always
              consult with healthcare professionals before making any medical
              decisions. The information provided should not replace
              professional medical advice, diagnosis, or treatment.
            </Text>
          </View>

          {/* Professional Consultation Section */}
          <View className="bg-green-50 rounded-2xl p-6 border border-green-200 mb-8">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 bg-green-500 rounded-full items-center justify-center mr-3">
                <Ionicons name="medical" size={20} color="white" />
              </View>
              <Text className="text-lg font-semibold text-green-900">
                Professional Advice
              </Text>
            </View>

            <Text className="text-gray-700 leading-6">
              For complete prescribing information, contraindications, warnings,
              and precautions, please refer to the complete product information
              provided by the manufacturer or consult your healthcare provider.
            </Text>
          </View>

          {/* Contact Information */}
          <View className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-8">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 bg-gray-500 rounded-full items-center justify-center mr-3">
                <Ionicons name="mail" size={20} color="white" />
              </View>
              <Text className="text-lg font-semibold text-gray-900">
                Questions or Concerns?
              </Text>
            </View>

            <Text className="text-gray-700 leading-6">
              If you have any questions about the information provided or notice
              any discrepancies, please contact us or consult with your
              pharmacist or healthcare provider.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

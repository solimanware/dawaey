import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAnalytics } from "../../hooks";

export default function CommunityScreen() {
  const analytics = useAnalytics();

  // Screen tracking
  useFocusEffect(
    useCallback(() => {
      analytics.logScreenView(analytics.SCREEN_NAMES.COMMUNITY);
    }, [analytics])
  );

  const posts = [
    {
      id: 1,
      author: "Dr. Sarah Johnson",
      authorType: "Doctor",
      time: "2 hours ago",
      content:
        "Remember to take your medications at the same time each day for better effectiveness. Setting up phone reminders can be very helpful!",
      likes: 24,
      comments: 8,
      isLiked: false,
      avatar: "👩‍⚕️",
    },
    {
      id: 2,
      author: "Mike Chen",
      authorType: "Patient",
      time: "4 hours ago",
      content:
        "Just wanted to share that switching to a weekly pill organizer has made such a difference in managing my medications. Highly recommend!",
      likes: 18,
      comments: 12,
      isLiked: true,
      avatar: "👨",
    },
    {
      id: 3,
      author: "HealthTips Daily",
      authorType: "Health Expert",
      time: "6 hours ago",
      content:
        "💡 Tip of the day: Store your medications in a cool, dry place away from direct sunlight. Your bathroom medicine cabinet might not be the best spot due to humidity.",
      likes: 45,
      comments: 6,
      isLiked: false,
      avatar: "💊",
    },
    {
      id: 4,
      author: "Lisa Rodriguez",
      authorType: "Pharmacist",
      time: "8 hours ago",
      content:
        "Always check medication expiration dates! Expired medications can be less effective or even harmful. Bring any expired meds to your pharmacy for safe disposal.",
      likes: 32,
      comments: 15,
      isLiked: true,
      avatar: "👩‍🔬",
    },
  ];

  const categories = ["All", "Questions", "Tips", "Experiences", "Doctors"];

  return (
    <LinearGradient
      colors={[
        "#663399", // Royal Purple
        "#7C3AED", // Violet-600
        "#8B5CF6", // Violet-500
        "#A855F7", // Purple-500
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1">
          {/* Header */}
          <View className="px-6 pt-4 pb-6 bg-white/10 backdrop-blur-lg">
            <View className="flex-row items-center justify-between mb-6">
              <View>
                <Text className="text-2xl font-bold text-white">Community</Text>
                <Text className="text-white/80 mt-1">
                  Connect with healthcare community
                </Text>
              </View>
              <TouchableOpacity className="p-3 bg-white/20 rounded-full">
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View className="flex-row items-center bg-white/90 rounded-xl px-4 py-3 mb-4">
              <Ionicons name="search" size={20} color="#64748b" />
              <TextInput
                placeholder="Search discussions..."
                className="flex-1 ml-3 text-gray-900"
                placeholderTextColor="#64748b"
              />
            </View>

            {/* Categories */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  className={`mr-3 px-4 py-2 rounded-full ${index === 0 ? "bg-white" : "bg-white/30"}`}
                >
                  <Text
                    className={`font-medium ${index === 0 ? "text-purple-600" : "text-white"}`}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Posts */}
          <View className="px-6 mt-4">
            {posts.map((post) => (
              <View
                key={post.id}
                className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
              >
                {/* Post Header */}
                <View className="flex-row items-center mb-3">
                  <View className="w-12 h-12 bg-gray-200 rounded-full items-center justify-center mr-3">
                    <Text className="text-xl">{post.avatar}</Text>
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="font-semibold text-gray-900">
                        {post.author}
                      </Text>
                      {post.authorType === "Doctor" && (
                        <View className="ml-2 bg-blue-100 px-2 py-1 rounded-full">
                          <Text className="text-blue-600 text-xs font-medium">
                            Doctor
                          </Text>
                        </View>
                      )}
                      {post.authorType === "Pharmacist" && (
                        <View className="ml-2 bg-green-100 px-2 py-1 rounded-full">
                          <Text className="text-green-600 text-xs font-medium">
                            Pharmacist
                          </Text>
                        </View>
                      )}
                      {post.authorType === "Health Expert" && (
                        <View className="ml-2 bg-purple-100 px-2 py-1 rounded-full">
                          <Text className="text-purple-600 text-xs font-medium">
                            Expert
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-gray-500 text-sm">{post.time}</Text>
                  </View>
                  <TouchableOpacity>
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={20}
                      color="#64748b"
                    />
                  </TouchableOpacity>
                </View>

                {/* Post Content */}
                <Text className="text-gray-800 mb-4 leading-5">
                  {post.content}
                </Text>

                {/* Post Actions */}
                <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                  <TouchableOpacity 
                    className="flex-row items-center"
                    onPress={() => {
                      analytics.logEvent('community_post_liked', {
                        post_id: post.id,
                        author_type: post.authorType,
                        was_already_liked: post.isLiked,
                      });
                    }}
                  >
                    <Ionicons
                      name={post.isLiked ? "heart" : "heart-outline"}
                      size={20}
                      color={post.isLiked ? "#ef4444" : "#64748b"}
                    />
                    <Text className="ml-2 text-gray-600">{post.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="flex-row items-center"
                    onPress={() => {
                      analytics.logEvent('community_post_comment_opened', {
                        post_id: post.id,
                        author_type: post.authorType,
                        comment_count: post.comments,
                      });
                    }}
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={20}
                      color="#64748b"
                    />
                    <Text className="ml-2 text-gray-600">{post.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="flex-row items-center"
                    onPress={() => {
                      analytics.logEvent('community_post_shared', {
                        post_id: post.id,
                        author_type: post.authorType,
                      });
                    }}
                  >
                    <Ionicons name="share-outline" size={20} color="#64748b" />
                    <Text className="ml-2 text-gray-600">Share</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      analytics.logEvent('community_post_bookmarked', {
                        post_id: post.id,
                        author_type: post.authorType,
                      });
                    }}
                  >
                    <Ionicons
                      name="bookmark-outline"
                      size={20}
                      color="#64748b"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <View className="h-6" />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

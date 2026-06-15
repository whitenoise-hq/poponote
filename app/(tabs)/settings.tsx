import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-semibold text-gray-900">설정</Text>
        <Text className="mt-2 text-sm text-gray-500">
          가족·반려동물·계정·앱 정보를 관리합니다.
        </Text>
      </View>
    </SafeAreaView>
  );
}
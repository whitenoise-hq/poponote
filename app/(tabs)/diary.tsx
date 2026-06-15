import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';

export default function DiaryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-semibold text-gray-900">다이어리</Text>
        <Text className="mt-2 text-sm text-gray-500">
          캘린더/리스트 토글로 기록을 살펴봅니다.
        </Text>
      </View>
    </SafeAreaView>
  );
}
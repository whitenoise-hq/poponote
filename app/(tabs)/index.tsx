import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-semibold text-gray-900">홈</Text>
        <Text className="mt-2 text-sm text-gray-500">
          오늘의 케어와 다이어리 미리보기가 여기에 표시됩니다.
        </Text>
      </View>
    </SafeAreaView>
  );
}
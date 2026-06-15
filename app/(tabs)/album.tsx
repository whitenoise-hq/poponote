import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';

export default function AlbumScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-semibold text-gray-900">일러스트 앨범</Text>
        <Text className="mt-2 text-sm text-gray-500">
          연·월 폴더와 3열 그리드로 일러스트를 모아봅니다.
        </Text>
      </View>
    </SafeAreaView>
  );
}
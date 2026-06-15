import { View } from 'react-native';

import { Button, Card, Screen, Text } from '@/components/ui';

export default function HomeScreen() {
  return (
    <Screen contentClassName="justify-center">
      <Text variant="display" className="text-primary-600">
        포포노트
      </Text>
      <Text variant="caption" className="mt-1">
        오늘의 케어와 다이어리 미리보기가 여기에 표시됩니다.
      </Text>

      <Card className="mt-6">
        <Text variant="subtitle">오늘 케어</Text>
        <View className="mt-3 flex-row gap-2">
          <View className="rounded-xl bg-meal/15 px-3 py-1.5">
            <Text variant="label" className="text-meal">
              밥
            </Text>
          </View>
          <View className="rounded-xl bg-treat/15 px-3 py-1.5">
            <Text variant="label" className="text-treat">
              간식
            </Text>
          </View>
          <View className="rounded-xl bg-walk/15 px-3 py-1.5">
            <Text variant="label" className="text-walk">
              산책
            </Text>
          </View>
        </View>
      </Card>

      <Button label="오늘 일기 남기기" className="mt-6" />
    </Screen>
  );
}

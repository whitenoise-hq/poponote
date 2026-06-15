import { Screen, Text } from '@/components/ui';

export default function DiaryScreen() {
  return (
    <Screen contentClassName="items-center justify-center">
      <Text variant="title">다이어리</Text>
      <Text variant="caption" className="mt-2 text-center">
        캘린더/리스트 토글로 기록을 살펴봅니다.
      </Text>
    </Screen>
  );
}

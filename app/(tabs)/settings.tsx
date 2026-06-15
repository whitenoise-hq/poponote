import { Screen, Text } from '@/components/ui';

export default function SettingsScreen() {
  return (
    <Screen contentClassName="items-center justify-center">
      <Text variant="title">설정</Text>
      <Text variant="caption" className="mt-2 text-center">
        가족·반려동물·계정·앱 정보를 관리합니다.
      </Text>
    </Screen>
  );
}

import { Screen, Text } from '@/components/ui';

export default function AlbumScreen() {
  return (
    <Screen contentClassName="items-center justify-center">
      <Text variant="title">일러스트 앨범</Text>
      <Text variant="caption" className="mt-2 text-center">
        연·월 폴더와 3열 그리드로 일러스트를 모아봅니다.
      </Text>
    </Screen>
  );
}
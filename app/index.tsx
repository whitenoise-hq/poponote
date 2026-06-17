import { View } from 'react-native'
import { colors } from '@/theme/colors'

/**
 * 앱 초기 진입점. AuthGate가 라우팅을 결정할 때까지 빈 화면(크림 배경)을 보여준다.
 * 스플래시가 이 위에 떠 있으므로 사용자에게는 보이지 않음.
 */
export default function IndexScreen() {
  return <View style={{ flex: 1, backgroundColor: colors.cream.DEFAULT }} />
}

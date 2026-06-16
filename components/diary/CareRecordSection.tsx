import {useState} from 'react'
import {View, Pressable, LayoutAnimation, Platform, UIManager} from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import {Text} from '@/components/ui'
import {CARE_CONFIG, CARE_KINDS} from '@/lib/care-config'
import {getMemberNickname} from '@/lib/mock-data'
import type {CareLog, CareKind} from '@/types'

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}

interface CareRecordSectionProps {
    logs: CareLog[]
}

const COLOR_VALUES: Record<CareKind, string> = {
    meal: '#f4846a',
    treat: '#a8c8a0',
    walk: '#7eb8e8',
}

function formatTime(isoStr: string): string {
    const d = new Date(isoStr)
    return d.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    })
}

export function CareRecordSection({logs}: CareRecordSectionProps) {
    const [expanded, setExpanded] = useState(false)

    if (logs.length === 0) return null

    function toggle() {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setExpanded((prev) => !prev)
    }

    return (
        <View style={{
            marginTop: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#ECE1D1',
            paddingBottom: 14
        }}>
            <Pressable
                onPress={toggle}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',

                }}
            >
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                    <Text variant="subtitle" style={{color: '#2B2520'}}>
                        케어 기록
                    </Text>
                    <Text variant="caption" style={{color: '#9e7e76'}}>
                        {logs.length}건
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        // borderRadius: 12,
                        // backgroundColor: '#f5ede8',
                    }}
                >
                    {/*<Text variant="caption" style={{color: '#F2724A'}}>*/}
                    {/*    {expanded ? '닫기' : '확인'}*/}
                    {/*</Text>*/}
                    <Ionicons
                        name={expanded ? 'chevron-up' : 'chevron-down'}
                        size={16}
                        color="#2B2520"
                    />
                </View>
            </Pressable>

            {expanded && (
                <View style={{marginTop: 12}}>
                    {CARE_KINDS.map((kind) => {
                        const kindLogs = logs.filter((l) => l.kind === kind)
                        if (kindLogs.length === 0) return null
                        const config = CARE_CONFIG[kind]
                        const color = COLOR_VALUES[kind]

                        return (
                            <View key={kind} style={{marginBottom: 12}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4}}>
                                    <Ionicons name={config.icon} size={14} color={color}/>
                                    <Text variant="label" style={{color}}>
                                        {config.label}
                                    </Text>
                                </View>
                                {kindLogs.map((log) => (
                                    <View key={log.id} style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 8,
                                        marginLeft: 20,
                                        marginBottom: 2
                                    }}>
                                        <Text variant="caption" style={{color: '#2B2520'}}>
                                            {getMemberNickname(log.author_id)}
                                        </Text>
                                        <Text variant="caption" style={{color: '#9e7e76'}}>
                                            {formatTime(log.logged_at)}
                                        </Text>
                                        {log.memo && (
                                            <Text variant="caption" style={{color: '#9e7e76'}}>
                                                "{log.memo}"
                                            </Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        )
                    })}
                </View>
            )}
        </View>
    )
}

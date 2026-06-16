import type { CareKind } from '@/types'
import type { ComponentProps } from 'react'
import type { Ionicons } from '@expo/vector-icons'

type IoniconsName = ComponentProps<typeof Ionicons>['name']

export interface CareTypeConfig {
  label: string
  icon: IoniconsName
  colorClass: string
  bgClass: string
  textColorClass: string
  borderColorClass: string
}

export const CARE_CONFIG: Record<CareKind, CareTypeConfig> = {
  meal: {
    label: '밥',
    icon: 'restaurant-outline',
    colorClass: 'bg-meal',
    bgClass: 'bg-meal-bg',
    textColorClass: 'text-meal',
    borderColorClass: 'border-meal/20',
  },
  treat: {
    label: '간식',
    icon: 'ice-cream-outline',
    colorClass: 'bg-treat',
    bgClass: 'bg-treat-bg',
    textColorClass: 'text-treat',
    borderColorClass: 'border-treat/20',
  },
  walk: {
    label: '산책',
    icon: 'footsteps-outline',
    colorClass: 'bg-walk',
    bgClass: 'bg-walk-bg',
    textColorClass: 'text-walk',
    borderColorClass: 'border-walk/20',
  },
} as const

export const CARE_KINDS: CareKind[] = ['meal', 'treat', 'walk']
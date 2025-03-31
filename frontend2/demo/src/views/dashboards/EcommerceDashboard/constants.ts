import type { Period } from './types'

export const options: { value: Period; label: string }[] = [
    { value: 'thisMonth', label: 'Tháng' },
    { value: 'thisWeek', label: 'Tuần' },
    { value: 'thisYear', label: 'Năm' },
]

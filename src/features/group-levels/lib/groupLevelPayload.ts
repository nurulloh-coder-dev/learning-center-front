export interface GroupLevelFormInput {
    id?: string
    name: string
    lessonCount: string
    orderNumber: string
    durationInMonths: string
    monthlyFee: string
}

export interface GroupLevelCreatePayload {
    name: string
    lessonCount: number
    orderNumber: number
    durationInMonths: number
    monthlyFee: number
}

/** `PUT /group-level/{id}` tanasi — `orderNumber` bu yerda YO'Q, `name` endi bor. */
export interface GroupLevelUpdatePayload {
    name: string
    lessonCount: number
    durationInMonths: number
    monthlyFee: number
}

function parsePositiveNumber(raw: string): number {
    const sanitized = raw.trim()
    if (sanitized === '') return 0
    const value = Number.parseInt(sanitized, 10)
    return Number.isFinite(value) ? value : 0
}

export function toCreateGroupLevelPayload(values: GroupLevelFormInput): GroupLevelCreatePayload {
    return {
        name: values.name.trim(),
        lessonCount: parsePositiveNumber(values.lessonCount),
        orderNumber: parsePositiveNumber(values.orderNumber),
        durationInMonths: parsePositiveNumber(values.durationInMonths),
        monthlyFee: parsePositiveNumber(values.monthlyFee),
    }
}

export function toUpdateGroupLevelPayload(values: GroupLevelFormInput): GroupLevelUpdatePayload {
    return {
        name: values.name.trim(),
        lessonCount: parsePositiveNumber(values.lessonCount),
        durationInMonths: parsePositiveNumber(values.durationInMonths),
        monthlyFee: parsePositiveNumber(values.monthlyFee),
    }
}

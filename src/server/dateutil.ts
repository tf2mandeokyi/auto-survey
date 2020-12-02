export function date24digit(date: Date) : string {
    return `${(date.getMinutes() + '').padStart(2, '0')}${(date.getSeconds() + '').padStart(2, '0')}`
}
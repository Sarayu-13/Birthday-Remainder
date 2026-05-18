export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

export const AVATAR_EMOJIS = [
  '🧁','🌸','🦋','🌷','🍭','🌈','💖','🦄','🌺','🍬','🎀','💐','🌻','🍓','🦩','🌙'
]

export function getDaysUntil(month, day) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const year = today.getFullYear()
  let next = new Date(year, month - 1, day)
  if (next < today) next = new Date(year + 1, month - 1, day)
  return Math.ceil((next - today) / 86400000)
}

export function getZodiac(month, day) {
  const signs = [
    ['♑ Capricorn',[1,19]],['♒ Aquarius',[2,18]],['♓ Pisces',[3,20]],
    ['♈ Aries',[4,19]],['♉ Taurus',[5,20]],['♊ Gemini',[6,20]],
    ['♋ Cancer',[7,22]],['♌ Leo',[8,22]],['♍ Virgo',[9,22]],
    ['♎ Libra',[10,22]],['♏ Scorpio',[11,21]],['♐ Sagittarius',[12,21]],
    ['♑ Capricorn',[12,31]]
  ]
  for (const [sign, [m, d]] of signs) {
    if (month < m || (month === m && day <= d)) return sign
  }
  return ''
}

export function daysInMonth(month) {
  return new Date(2024, parseInt(month), 0).getDate()
}

export function sortByUpcoming(list) {
  return [...list].sort((a, b) => getDaysUntil(a.month, a.day) - getDaysUntil(b.month, b.day))
}

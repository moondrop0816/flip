export const getDate = (date: Date) => {
  const seconds = 1
  const minute = seconds * 60
  const hour = minute * 60
  const day = hour * 24

  const today = new Date()
  const elapsedTime = Math.trunc((today.getTime() - date.getTime()) / 1000)

  if (elapsedTime < seconds) {
    return '방금 전'
  } else if (elapsedTime < minute) {
    return elapsedTime + '초 전'
  } else if (elapsedTime < hour) {
    return Math.trunc(elapsedTime / minute) + '분 전'
  } else if (elapsedTime < day) {
    return Math.trunc(elapsedTime / hour) + '시간 전'
  } else if (elapsedTime < day * 15) {
    return Math.trunc(elapsedTime / day) + '일 전'
  } else {
    return `${date.getFullYear()}년 ${date.getMonth().toString().padStart(2, '0')} ${date.getDate().toString().padStart(2, '0')}일`
  }
}

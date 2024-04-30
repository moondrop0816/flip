import { Timestamp } from 'firebase/firestore'

export const getDate = (date: Timestamp) => {
  const parseDate = date.toDate()

  const seconds = 1
  const minute = seconds * 60
  const hour = minute * 60
  const day = hour * 24

  const today = new Date()
  const elapsedTime = Math.trunc((today.getTime() - parseDate.getTime()) / 1000)

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
    return `${parseDate.getFullYear()}년 ${parseDate.getMonth().toString().padStart(2, '0')} ${parseDate.getDate().toString().padStart(2, '0')}일`
  }
}

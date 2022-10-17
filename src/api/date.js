function zcm_date(obj) {
  if (obj === undefined || obj === null) return ''
  if (obj.getFullYear === undefined) {
    console.error('not a date')
    return ''
  }
  let mon = obj.getMonth() + 1
  let day = obj.getDate()
  if (mon <= 9) mon = '0' + mon
  if (day <= 9) day = '0' + day
  mon = String(mon)
  day = String(day)
  return String(obj.getFullYear()) + '-' + mon + '-' + day
}
export default zcm_date

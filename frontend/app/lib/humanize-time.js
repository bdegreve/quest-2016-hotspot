export default function (millis) {
  if (millis === null) {
    return '...'
  }
  millis = millis | 0
  let secs = (millis / 1000) | 0
  let mins = (secs / 60) | 0
  let hours = _padded((mins / 60) | 0)
  secs = _padded((secs % 60) | 0)
  mins = _padded((mins % 60) | 0)

  return `${hours}:${mins}:${secs}`
}

function _padded (x) {
  const s = x.toString()
  return s.length === 1 ? `0${s}` : s
}

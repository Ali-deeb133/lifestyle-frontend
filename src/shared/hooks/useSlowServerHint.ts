import { useEffect } from 'react'
import { Toast } from '../utils/toaster'

const HINT_DELAY = 10_000
const HINT_ID = 'server-starting'
const HINT_MESSAGE = 'The server is waking up after being inactive. This can take up to a minute.'

// كم طلب عم يعرض التلميح هلق — التلميح بيختفي بس لما يخلصوا كلهم
let activeHints = 0

// إذا الـ loading طوّل أكتر من 10 ثواني (غالباً السيرفر عم يصحى) → اعرض تلميح
export function useSlowServerHint(loading: boolean): void {
  useEffect(() => {
    if (!loading) return

    let shown = false
    const timer = setTimeout(() => {
      shown = true
      activeHints += 1
      Toast.info(HINT_MESSAGE, { id: HINT_ID, duration: Infinity })
    }, HINT_DELAY)

    return () => {
      clearTimeout(timer)
      if (!shown) return
      activeHints -= 1
      if (activeHints === 0) Toast.dismiss(HINT_ID)
    }
  }, [loading])
}

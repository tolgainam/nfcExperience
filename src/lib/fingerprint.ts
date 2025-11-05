/**
 * Generate a device fingerprint based on browser characteristics
 * This is used to track unique users without requiring authentication
 *
 * Note: Not 100% accurate (cleared on browser data wipe) but acceptable for V1
 */
export async function generateFingerprint(): Promise<string> {
  const components: string[] = []

  // User Agent
  components.push(navigator.userAgent)

  // Screen Resolution
  components.push(`${screen.width}x${screen.height}x${screen.colorDepth}`)

  // Timezone
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone)

  // Language
  components.push(navigator.language)

  // Platform
  components.push(navigator.platform)

  // Hardware Concurrency (CPU cores)
  components.push(String(navigator.hardwareConcurrency || 0))

  // Device Memory (if available)
  if ('deviceMemory' in navigator) {
    components.push(String((navigator as any).deviceMemory))
  }

  // Canvas Fingerprinting (basic)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillStyle = '#f60'
    ctx.fillRect(125, 1, 62, 20)
    ctx.fillStyle = '#069'
    ctx.fillText('NFC Experience', 2, 15)
    components.push(canvas.toDataURL())
  }

  // Combine all components and hash
  const fingerprint = await hashString(components.join('|'))

  // Store in localStorage as backup
  localStorage.setItem('device-fingerprint', fingerprint)

  return fingerprint
}

/**
 * Get existing fingerprint from localStorage or generate new one
 */
export async function getFingerprint(): Promise<string> {
  // Try to get existing fingerprint from localStorage
  const stored = localStorage.getItem('device-fingerprint')
  if (stored) {
    return stored
  }

  // Generate new fingerprint
  return await generateFingerprint()
}

/**
 * Simple hash function using Web Crypto API
 */
async function hashString(str: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

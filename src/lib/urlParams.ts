export interface NFCParams {
  lang: 'en' | 'fr'
  brand: 'IQOS' | 'VEEV' | 'ZYN'
  type: 'd' | 'f' | 'a'
  cc: number
  prd: number
  uid: number
}

export interface ParsedParams {
  lang: 'en' | 'fr'
  brand: string
  type: string | null
  cc: number | null
  prd: number | null
  uid: number | null
  errors: string[]
}

/**
 * Parse and validate URL parameters from NFC tag
 * Expected format: /:lang/product/:brand?type=:type&cc=:cc&prd=:prd&uid=:uid
 */
export function parseNFCParams(
  lang: string | undefined,
  brand: string | undefined,
  searchParams: URLSearchParams
): ParsedParams {
  const errors: string[] = []

  // Parse and validate language
  const parsedLang = lang === 'fr' ? 'fr' : 'en'
  if (lang && lang !== 'en' && lang !== 'fr') {
    errors.push(`Invalid language: ${lang}. Defaulting to English.`)
  }

  // Validate brand
  const validBrands = ['IQOS', 'VEEV', 'ZYN']
  if (!brand || !validBrands.includes(brand)) {
    errors.push(`Invalid or missing brand: ${brand}`)
  }

  // Parse query parameters
  const type = searchParams.get('type')
  const ccParam = searchParams.get('cc')
  const prdParam = searchParams.get('prd')
  const uidParam = searchParams.get('uid')

  // Validate type
  const validTypes = ['d', 'f', 'a']
  if (!type || !validTypes.includes(type)) {
    errors.push(`Invalid or missing type: ${type}`)
  }

  // Parse and validate numerical parameters
  const cc = ccParam ? parseInt(ccParam, 10) : null
  const prd = prdParam ? parseInt(prdParam, 10) : null
  const uid = uidParam ? parseInt(uidParam, 10) : null

  if (!cc || isNaN(cc)) {
    errors.push('Invalid or missing campaign code (cc)')
  }

  if (!prd || isNaN(prd)) {
    errors.push('Invalid or missing product code (prd)')
  }

  if (!uid || isNaN(uid)) {
    errors.push('Invalid or missing unit ID (uid)')
  }

  return {
    lang: parsedLang,
    brand: brand || '',
    type,
    cc,
    prd,
    uid,
    errors,
  }
}

/**
 * Check if parsed parameters are valid
 */
export function areParamsValid(params: ParsedParams): params is ParsedParams & {
  cc: number
  prd: number
  uid: number
  type: string
} {
  return (
    params.errors.length === 0 &&
    params.cc !== null &&
    params.prd !== null &&
    params.uid !== null &&
    params.type !== null
  )
}

/**
 * Generate NFC URL for testing
 */
export function generateNFCUrl(
  lang: 'en' | 'fr',
  brand: 'IQOS' | 'VEEV' | 'ZYN',
  params: {
    type: 'd' | 'f' | 'a'
    cc: number
    prd: number
    uid: number
  }
): string {
  return `/${lang}/product/${brand}?type=${params.type}&cc=${params.cc}&prd=${params.prd}&uid=${params.uid}`
}

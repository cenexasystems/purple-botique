export function normalizePhone(input: string): string | null {
  if (!input) return null

  // Strip everything except digits
  const raw = input.replace(/\D/g, '')
  if (!raw) return null

  let digits = raw

  if (digits.startsWith('60') && (digits.length === 11 || digits.length === 12)) {
    // Already 60XXXXXXXX
  } else if ((digits.length === 9 || digits.length === 10) && digits.startsWith('1')) {
    digits = '60' + digits
  } else if ((digits.length === 10 || digits.length === 11) && digits.startsWith('0')) {
    digits = '60' + digits.slice(1)
  } else {
    return null
  }

  // Malaysian mobile starts with 601
  if (!/^601\d{8,9}$/.test(digits)) return null

  return digits
}

export function isValidPhone(input: string): boolean {
  return normalizePhone(input) !== null
}

export function getSubscriberDigits(input: string): string | null {
  const normalized = normalizePhone(input)
  return normalized ? normalized.slice(2) : null
}

export function normalizePhoneForWhatsApp(input: string): string {
  if (!input) return ''
  const digits = input.replace(/\D/g, '')
  if (!digits) return ''

  if (digits.length >= 11 && (digits.startsWith('60') || digits.startsWith('91'))) {
    return digits
  }
  if (digits.startsWith('0') && (digits.length === 10 || digits.length === 11)) {
    return '60' + digits.slice(1)
  }
  if (digits.length === 10 && /^[6-9]/.test(digits)) {
    return '91' + digits
  }
  if (digits.length >= 9 && digits.length <= 10 && digits.startsWith('1')) {
    return '60' + digits
  }
  return digits
}

export function toWhatsAppUrl(phone: string, text?: string): string {
  const normalized = normalizePhoneForWhatsApp(phone) || normalizePhone(phone)
  const queryParams: string[] = []

  if (normalized) {
    queryParams.push(`phone=${normalized}`)
  }
  if (text) {
    queryParams.push(`text=${encodeURIComponent(text)}`)
  }

  return `https://api.whatsapp.com/send${queryParams.length > 0 ? `?${queryParams.join('&')}` : ''}`
}

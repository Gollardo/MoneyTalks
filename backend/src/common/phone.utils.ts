import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function normalizePhone(phone: string): string | null {
  const parsed = parsePhoneNumberFromString(phone, 'RU');
  if (parsed && parsed.isValid()) {
    return parsed.number; // E.164 формат (+79991234567)
  }
  return null;
}

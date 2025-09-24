import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/**
 * Допускаем:
 * - VIN: 17 символов (без I, O, Q)
 * - Короткий код: латинские буквы/цифры, 4–20 символов
 */
export function vinOrShortIdValidator(): ValidatorFn {
  const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/; // строгий VIN
  const SHORT_PATTERN = /^[A-Z0-9]{4,20}$/; // короткий код

  return (control: AbstractControl): ValidationErrors | null => {
    const raw = (control.value ?? "").toString().trim();
    if (!raw) return { required: true };

    const upper = raw.toUpperCase();
    const isVin = VIN_PATTERN.test(upper);
    const isShort = SHORT_PATTERN.test(upper);

    return isVin || isShort ? null : { vinOrShortId: true };
  };
}

import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

/** Дата в строке формата YYYY-MM-DD + проверка валидности */
export function dateStringValidator(): ValidatorFn {
  const RX = /^\d{4}-\d{2}-\d{2}$/;
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    if (!v) return { required: true };
    if (typeof v !== "string" || !RX.test(v)) return { dateFormat: true };

    const d = new Date(v);
    const [y, m, day] = v.split("-").map(Number);
    const valid =
      d instanceof Date &&
      !isNaN(d.getTime()) &&
      d.getUTCFullYear() === y &&
      d.getUTCMonth() + 1 === m &&
      d.getUTCDate() === day;

    return valid ? null : { invalidDate: true };
  };
}

/** Привести Date | string к YYYY-MM-DD для input[type=date] */
export function toDateInputValue(v?: Date | string): string {
  if (!v) return "";
  const d = typeof v === "string" ? new Date(v) : v;
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

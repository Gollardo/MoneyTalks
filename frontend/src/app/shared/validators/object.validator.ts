import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

/** Требуется непустой объект с полем id (можно переопределить ключ) */
export function objectRequiredValidator(idKey: keyof any = "id"): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    if (!v || typeof v !== "object") return { objectRequired: true };
    if (!(idKey in v) || !v[idKey]) return { objectRequired: true };
    return null;
  };
}

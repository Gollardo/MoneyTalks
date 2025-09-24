import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordsMatchValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const newPassword = control.get("newPassword")?.value;
  const confirmPassword = control.get("confirmPassword")?.value;

  if (newPassword !== confirmPassword) {
    return { passwordsMismatch: true };
  }

  return null;
};

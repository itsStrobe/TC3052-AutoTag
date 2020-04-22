import { FormControl } from '@angular/forms';

export class CustomValidators {
  static validateRequired(c: FormControl) {
    if (c.value.length === 0) {
      return {required: true};
    } else {
      return null;
    }
  }
}
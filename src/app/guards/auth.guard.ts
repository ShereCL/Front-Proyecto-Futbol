import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);

  const { value: token } = await Preferences.get({ key: 'token' });

  if (!token) {
    router.navigateByUrl('/login', { replaceUrl: true });
    return false;
  }

  return true;
};

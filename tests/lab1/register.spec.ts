import { test, expect } from '@playwright/test';
import { user } from './lab1data';
import { regselectors } from './lab1selectors';

test('Заповнення форми реєстрації без сабміту (через CAPTCHA)', async ({ page }) => {
  await page.goto('https://demoqa.com/register');

  // Заповнюємо форму
  await page.fill(regselectors.firstName, user.firstName);
  await page.fill(regselectors.lastName, user.lastName);
  await page.fill(regselectors.userName, user.userName);
  await page.fill(regselectors.password, user.password);

  // Перевіряємо всі поля
  for (const [key, selector] of Object.entries(regselectors)) {
    await expect(page.locator(selector)).toHaveValue(user[key as keyof typeof user]);
  }
});

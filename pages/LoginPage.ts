import { Page, expect } from '@playwright/test';
import { loginSelectors } from './selectors/loginSelectors';

export class LoginPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async login(email: string, password: string) {
    await this.page.goto(loginSelectors.loginUrl);
    await this.page.fill(loginSelectors.emailInput, email);
    await this.page.fill(loginSelectors.passwordInput, password);
    await this.page.click(loginSelectors.submitButton);
    await expect(this.page.locator(loginSelectors.sidebar)).toBeVisible();
  }
}
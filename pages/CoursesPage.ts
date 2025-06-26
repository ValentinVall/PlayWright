import { Page, expect } from '@playwright/test';

export class CoursesPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.getByRole('link', { name: 'Courses' }).click();
  }

  async createCourse(name: string, description: string) {
    await this.page
      .locator('app-general-page div')
      .filter({ hasText: /^Courses$/ })
      .getByRole('button')
      .click();

    await this.page.getByRole('textbox', { name: 'Enter Name' }).fill(name);
    await this.page.getByRole('textbox', { name: 'Enter Description' }).fill(description);
    await this.page.getByPlaceholder('Enter Lecture Hours').fill('10');
    await this.page.getByPlaceholder('Enter Practice Hours').fill('10');
    await this.page.getByPlaceholder('Enter Homework Hours').fill('0');
    await this.page.getByPlaceholder('Enter Credits').fill('2');
    await this.page.getByRole('button', { name: 'Create' }).click();

    await expect(this.page.locator('tbody')).toContainText(name);
  }

  async searchCourse(name: string) {
    await this.navigate();
    await this.page.getByRole('textbox', { name: 'Search...' }).fill(name);
    await expect(this.page.getByRole('row', { name: new RegExp(name) })).toBeVisible();
  }

  async deleteCourse(name: string) {
    const row = this.page.getByRole('row', { name: new RegExp(name) });
    await row.getByRole('button').nth(1).click();
    await this.page.getByRole('button', { name: 'Yes, do it!' }).click();
    await expect(this.page.locator('#swal2-title')).toContainText('Delete successful');
  }
}
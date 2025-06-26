import { Page, expect } from '@playwright/test';

export class ClassroomsPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.getByRole('link', { name: 'Classrooms' }).click();
  }

  async createClassroom() {
    await this.page
      .locator('app-general-page div')
      .filter({ hasText: /^Classrooms$/ })
      .getByRole('button')
      .click();

    // Academic year
    await this.page.getByText('Start year Select items').click();
    await this.page
      .getByRole('menu', { name: 'Select items' })
      .getByPlaceholder('Search...')
      .fill('2025');
    await this.page.getByRole('menu', { name: 'Select items' }).locator('label').click();

    // Semester
    await this.page.getByText('Semester Select items').click();
    await this.page.locator('label').filter({ hasText: '1' }).click();

    // Group
    await this.page.getByText('Groups Select items').click();
    await this.page.locator('label').filter({ hasText: /^e2e group$/ }).click();
    await this.page.getByText('Groups e2e group Select/').click();

    // Manager
    await this.page.getByText('Managers Select items').click();
    await this.page.locator('label').filter({ hasText: 'ValentineS Test Teacher' }).click();
    await this.page.getByText('Managers ValentineS Test').click();

    // Course
    await this.page.getByText('Course Select items').click();
    await this.page.locator('label').filter({ hasText: 'e2e course' }).click();

    await this.page.getByRole('button', { name: 'Create' }).click();
    await expect(this.page.getByText('ACTIVE').first()).toBeVisible();
  }

  async searchClassroom(query: string) {
    await this.navigate();
    await this.page.getByRole('textbox', { name: 'Search...' }).fill(query);
    await expect(this.page.locator('tbody >> tr').first()).toContainText(query);
  }

  async deleteFirstClassroom() {
    const firstRow = this.page.locator('tbody >> tr').first();
    await firstRow.getByRole('button').first().click();
    await this.page.getByRole('button', { name: 'Yes, do it!' }).click();
    await expect(this.page.locator('#swal2-title')).toContainText('Delete successful');
  }
}
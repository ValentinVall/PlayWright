import { test, expect } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env') });

test.describe('Тестування Courses', () => {
  test.beforeEach(async ({ page }) => {
    const email = process.env.YOUR_EMAIL;
    const password = process.env.YOUR_PASSWORD;

    if (!email || !password) {
      throw new Error('❌ Email або пароль не задано у файлі .env');
    }

    await page.goto('https://dash.edu-planner.com/auth/login');
    await page.fill('[formcontrolname="email"]', email);
    await page.fill('[formcontrolname="password"]', password);
    await page.click('button[type="submit"]');

    await expect(page.locator('nav.sidebar')).toBeVisible();
  });

  test('Перевірка залогінення на сторінку', async ({ page }) => {
    await expect(page.locator('nav.sidebar')).toBeVisible();
  });

  test('Створити, знайти та видалити курс', async ({ page }) => {
    const testName = `test_course_${Date.now()}`;

    await test.step('Створення курсу', async () => {
      await page.getByRole('link', { name: 'Courses' }).click();
      await page
        .locator('app-general-page div')
        .filter({ hasText: /^Courses$/ })
        .getByRole('button')
        .click();

      await page.getByRole('textbox', { name: 'Enter Name' }).fill(testName);
      await page.getByRole('textbox', { name: 'Enter Description' }).fill('testing');
      await page.getByPlaceholder('Enter Lecture Hours').fill('10');
      await page.getByPlaceholder('Enter Practice Hours').fill('10');
      await page.getByPlaceholder('Enter Homework Hours').fill('0');
      await page.getByPlaceholder('Enter Credits').fill('2');
      await page.getByRole('button', { name: 'Create' }).click();

      await expect(page.locator('tbody')).toContainText(testName);
    });

    await test.step('Пошук курсу через Search', async () => {
      await page.getByRole('link', { name: 'Courses' }).click();
      await page.getByRole('textbox', { name: 'Search...' }).fill(testName);
      await expect(page.getByRole('row', { name: new RegExp(testName) })).toBeVisible();
    });

    await test.step('Видалення курсу', async () => {
      const row = page.getByRole('row', { name: new RegExp(testName) });
      await row.getByRole('button').nth(1).click();
      await page.getByRole('button', { name: 'Yes, do it!' }).click();
      await expect(page.locator('#swal2-title')).toContainText('Delete successful');
    });
  });
});

test.describe('Тестування Classrooms', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://dash.edu-planner.com/auth/login');
    await page.fill('[formcontrolname="email"]', process.env.YOUR_EMAIL || '');
    await page.fill('[formcontrolname="password"]', process.env.YOUR_PASSWORD || '');
    await page.click('button[type="submit"]');
    await expect(page.locator('nav.sidebar')).toBeVisible();
  });

  test('Створення, пошук і видалення Classroom', async ({ page }) => {
    await test.step('Створення Classroom', async () => {
      await page.getByRole('link', { name: 'Classrooms' }).click();
      await page
        .locator('app-general-page div')
        .filter({ hasText: /^Classrooms$/ })
        .getByRole('button')
        .click();

      // Academic year
      await page.getByText('Start year Select items').click();
      await page
        .getByRole('menu', { name: 'Select items' })
        .getByPlaceholder('Search...')
        .fill('2025');
      await page.getByRole('menu', { name: 'Select items' }).locator('label').click();

      // Semester
      await page.getByText('Semester Select items').click();
      await page.locator('label').filter({ hasText: '1' }).click();

      // Group
      await page.getByText('Groups Select items').click();
      await page
        .locator('label')
        .filter({ hasText: /^e2e group$/ })
        .click();
      await page.getByText('Groups e2e group Select/').click();

      // Manager
      await page.getByText('Managers Select items').click();
      await page.locator('label').filter({ hasText: 'ValentineS Test Teacher' }).click();
      await page.getByText('Managers ValentineS Test').click();

      // Course
      await page.getByText('Course Select items').click();
      await page.locator('label').filter({ hasText: 'e2e course' }).click();

      // Create
      await page.getByRole('button', { name: 'Create' }).click();

      // Перевірка появи створеного класу
      await expect(page.getByText('ACTIVE').first()).toBeVisible();
    });

    await test.step('Пошук останнього створеного Classroom', async () => {
      await page.getByRole('link', { name: 'Classrooms' }).click();
      await page.getByRole('textbox', { name: 'Search...' }).fill('e2e group');

      // Очікуємо, що перший рядок містить "e2e group"
      await expect(page.locator('tbody >> tr').first()).toContainText('e2e group');
    });

    await test.step('Видалення останнього створеного Classroom', async () => {
      // Видалити перший рядок у таблиці (останній створений)
      const firstRow = page.locator('tbody >> tr').first();
      await firstRow.getByRole('button').first().click();
      await page.getByRole('button', { name: 'Yes, do it!' }).click();

      await expect(page.locator('#swal2-title')).toContainText('Delete successful');
    });
  });
});

test.describe('Тестування Settings - Lesson Slots', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://dash.edu-planner.com/auth/login');
    await page.fill('[formcontrolname="email"]', process.env.YOUR_EMAIL || '');
    await page.fill('[formcontrolname="password"]', process.env.YOUR_PASSWORD || '');
    await page.click('button[type="submit"]');
    await expect(page.locator('nav.sidebar')).toBeVisible();
  });
  test('Створення, пошук і видалення Lesson Slots', async ({ page }) => {
    await test.step('Створення Lesson Slots', async () => {
    
    await page.locator('app-general-page div').filter({ hasText: /^Lesson Slots$/ }).getByRole('button').click();
    await page.locator('app-input-text').filter({ hasText: 'Name' }).locator('div').first().click();
    await page.getByRole('textbox', { name: 'Enter Name' }).fill('testName');
    await page.getByText('Start hour Select items').click();
    await page.locator('label').filter({ hasText: '10' }).click();
    await page.locator('#headlessui-menu-button-21').click();
    await page.locator('label').filter({ hasText: /^0$/ }).click();
    await page.locator('#headlessui-menu-button-22').click();
    await page.locator('label').filter({ hasText: '11' }).click();
    await page.getByRole('button', { name: 'Select items' }).click();
    await page.locator('label').filter({ hasText: '20' }).click();
    await page.locator('app-input-text').filter({ hasText: 'Academic hours' }).locator('div').first().click();
    await page.getByPlaceholder('Enter Academic hours').fill('52');
    await page.getByRole('button', { name: 'Create' }).click();
    await page.goto('https://dash.edu-planner.com/lesson-slots');await page.getByRole('link', { name: 'Lesson Slots' }).click();





});

import { test, expect } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env') });

test.describe('Тестування Courses', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://dash.edu-planner.com/auth/login');
    await page.fill('[formcontrolname="email"]', process.env.YOUR_EMAIL);
    await page.fill('[formcontrolname="password"]', process.env.YOUR_PASSWORD);
    await page.click('button[type="submit"]');
  });

  test('Перевірка залогінення на сторінку', async ({ page }) => {
    await expect(page.locator('nav.sidebar')).toBeVisible();
  });

  // test.fixme - це маркер, який вказує на те, що тест ще не завершений або потребує доопрацювання.
  test('Створення курсу', async ({ page }) => {
    await page.getByRole('link', { name: 'Courses' }).click();
    await page
      .locator('app-general-page div')
      .filter({ hasText: /^Courses$/ })
      .getByRole('button')
      .click();

    const testName = `test_course_${new Date().getTime()}`;

    await page.getByRole('textbox', { name: 'Enter Name' }).fill(testName);
    await page.getByRole('textbox', { name: 'Enter Description' }).click();
    await page.getByRole('textbox', { name: 'Enter Description' }).fill('testing');
    await page.getByPlaceholder('Enter Lecture Hours').click();
    await page.getByPlaceholder('Enter Lecture Hours').fill('10');
    await page.getByPlaceholder('Enter Practice Hours').click();
    await page.getByPlaceholder('Enter Practice Hours').fill('10');
    await page.getByPlaceholder('Enter Homework Hours').click();
    await page.getByPlaceholder('Enter Homework Hours').fill('0');
    await page.getByPlaceholder('Enter Credits').click();
    await page.getByPlaceholder('Enter Credits').fill('2');
    await page.getByRole('button', { name: 'Create' }).click();

    await expect(page.locator('tbody')).toContainText(testName);
  });

  test.fixme('Зміна іформації курсу', async ({ page }) => {
    await page.getByRole('link', { name: 'Courses' }).click();
    await page.locator('.ng-star-inserted > .ltr\\:mr-2').first().click();

    await page.getByRole('textbox', { name: 'Enter Name' }).click();
    await page.getByRole('textbox', { name: 'Enter Name' }).fill('test2');
    await page.getByRole('textbox', { name: 'Enter Description' }).click();
    await page.getByRole('textbox', { name: 'Enter Description' }).fill('testing2');
    await page.getByPlaceholder('Enter Lecture Hours').click();
    await page.getByPlaceholder('Enter Lecture Hours').fill('11');
    await page.getByPlaceholder('Enter Practice Hours').click();
    await page.getByPlaceholder('Enter Practice Hours').fill('11');
    await page.getByPlaceholder('Enter Homework Hours').click();
    await page.getByPlaceholder('Enter Homework Hours').fill('01');
    await page.getByPlaceholder('Enter Credits').click();
    await page.getByPlaceholder('Enter Credits').fill('04');
    await page.getByRole('button', { name: 'Update' }).click();

    await expect(page.locator('tbody')).toContainText('test2');
  });

  test.fixme('Видалення курсу', async ({ page }) => {
    await page.getByRole('link', { name: 'Courses' }).click();
    await page
      .getByRole('row', { name: 'test2 testing2 11 11 1' })
      .getByRole('button')
      .nth(1)
      .click();
    await page.getByRole('button', { name: 'Yes, do it!' }).click();

    await expect(page.locator('app-general-page div').nth(3)).toBeVisible();
  });

  test('Пошук курсів через Search', async ({ page }) => {
    await page.getByRole('link', { name: 'Courses' }).click();
    await page.getByRole('textbox', { name: 'Search...' }).click();
    await page.getByRole('textbox', { name: 'Search...' }).fill('e2e');

    await expect(page.getByRole('link', { name: 'e2e course' })).toBeVisible();
  });
});

test.describe('Тестування Classrooms', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://dash.edu-planner.com/auth/login');
    await page.fill('[formcontrolname="email"]', process.env.YOUR_EMAIL);
    await page.fill('[formcontrolname="password"]', process.env.YOUR_PASSWORD);
    await page.click('button[type="submit"]');
  });

  test.fixme('Cтворення Classroom', async ({ page }) => {
    await page.getByRole('link', { name: 'Classrooms' }).click();
    await page
      .locator('app-general-page div')
      .filter({ hasText: /^Classrooms$/ })
      .getByRole('button')
      .click();
    await page.locator('#headlessui-menu-button-65').click();
    await page.getByRole('menu', { name: 'Select items' }).getByPlaceholder('Search...').click();
    await page
      .getByRole('menu', { name: 'Select items' })
      .getByPlaceholder('Search...')
      .fill('2025');
    await page.getByRole('menu', { name: 'Select items' }).locator('label').click();
    await page.locator('#headlessui-menu-button-66').click();
    await page.locator('label').filter({ hasText: '1' }).click();
    await page.locator('#headlessui-menu-button-67').click();
    await page.locator('label').filter({ hasText: 'e2e group 2' }).click();
    await page.getByRole('button', { name: 'e2e group' }).click();
    await page.locator('#headlessui-menu-button-68').click();
    await page.locator('label').filter({ hasText: 'ValentineS Test Teacher' }).click();
    await page.getByRole('button', { name: 'ValentineS Test Teacher' }).click();
    await page.getByRole('button', { name: 'Select items' }).click();
    await page.locator('label').filter({ hasText: '2test' }).click();
    await page.getByRole('button', { name: 'Create' }).click();

    await expect(page.getByText('ACTIVE').first()).toBeVisible();
  });

  test.fixme('Зміна іформації Classroom', async ({ page }) => {
    await page.getByRole('link', { name: 'Classrooms' }).click();

    await page
      .getByRole('row', { name: 'ACTIVE e2e group 2 2test 2025' })
      .getByRole('button')
      .nth(1)
      .click();
    await page.locator('#headlessui-menu-button-98').click();
    await page.locator('label').filter({ hasText: '2' }).click();
    await page.getByRole('button', { name: 'Select items' }).click();
    await page.locator('label').filter({ hasText: 'ValentineS Test Teacher' }).click();
    await page.getByRole('button', { name: 'ValentineS Test Teacher' }).click();
    await page.getByRole('button', { name: 'Update' }).click();

    await expect(page.getByRole('cell', { name: '2', exact: true })).toBeVisible();
  });

  test.fixme('Видалення Classroom', async ({ page }) => {
    await page.getByRole('link', { name: 'Classrooms' }).click();
    await page
      .getByRole('row', { name: 'ACTIVE e2e group 2test 2025' })
      .getByRole('button')
      .first()
      .click();
    await page.getByRole('button', { name: 'Yes, do it!' }).click();

    await expect(page.locator('app-general-page div').nth(3)).toBeVisible();
  });

  test('Пошук Classroom через Search', async ({ page }) => {
    await page.getByRole('link', { name: 'Classrooms' }).click();
    await page.getByRole('textbox', { name: 'Search...' }).click();
    await page.getByRole('textbox', { name: 'Search...' }).fill('e2e group 2');

    await expect(page.getByRole('link', { name: 'e2e group 2' })).toBeVisible();
  });

  test.fixme('Перевірка фільтрації Classroom', async ({ page }) => {
    await page.getByRole('link', { name: 'Classrooms' }).click();
    await page.getByRole('button', { name: 'Filter' }).click();
    await page.getByRole('checkbox', { name: 'ACTIVE' }).check();
    await page.getByRole('button', { name: 'Apply' }).click();

    await expect(page.getByRole('cell', { name: 'ACTIVE' })).toBeVisible();
  });
});

test.describe('Тестування Settings - Lesson slots', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://dash.edu-planner.com/auth/login');
    await page.fill('[formcontrolname="email"]', process.env.YOUR_EMAIL);
    await page.fill('[formcontrolname="password"]', process.env.YOUR_PASSWORD);
    await page.click('button[type="submit"]');
  });

  test.fixme('Cтворення Lesson slots', async ({ page }) => {
    await page.getByRole('link', { name: 'Lesson Slots' }).click();
    await page
      .locator('app-general-page div')
      .filter({ hasText: /^Lesson Slots$/ })
      .getByRole('button')
      .click();
    await page.getByRole('textbox', { name: 'Enter Name' }).click();
    await page.getByRole('textbox', { name: 'Enter Name' }).fill('Третя пара');
    await page.locator('#headlessui-menu-button-125').click();
    await page.locator('label').filter({ hasText: '11' }).click();
    await page.locator('#headlessui-menu-button-126').click();
    await page.getByRole('menu', { name: 'Select items' }).getByPlaceholder('Search...').fill('30');
    await page.getByRole('menu', { name: 'Select items' }).locator('label').click();
    await page.locator('#headlessui-menu-button-127').click();
    await page.getByRole('menu', { name: 'Select items' }).getByPlaceholder('Search...').fill('12');
    await page.getByRole('menu', { name: 'Select items' }).locator('label').click();
    await page.getByRole('button', { name: 'Select items' }).click();
    await page.getByRole('menu', { name: 'Select items' }).getByPlaceholder('Search...').fill('50');
    await page.getByRole('menu', { name: 'Select items' }).locator('label').click();
    await page.getByPlaceholder('Enter Academic hours').click();
    await page.getByPlaceholder('Enter Academic hours').fill('52');
    await page.getByRole('button', { name: 'Create' }).click();

    await expect(page.getByRole('cell', { name: 'Третя пара' })).toBeVisible();
  });
});

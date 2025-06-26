import { test, expect } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';
import { LoginPage } from '../../pages/LoginPage';
import { CoursesPage } from '../../pages/CoursesPage';
import { ClassroomsPage } from '../../pages/ClassroomsPage';

dotenv.config({ path: path.resolve(__dirname, '.env') });

test.describe('Тестування Courses', () => {
  let loginPage: LoginPage;
  let coursesPage: CoursesPage;

  test.beforeEach(async ({ page }) => {
    const email = process.env.YOUR_EMAIL;
    const password = process.env.YOUR_PASSWORD;

    if (!email || !password) {
      throw new Error('❌ Email або пароль не задано у файлі .env');
    }

    loginPage = new LoginPage(page);
    coursesPage = new CoursesPage(page);
    await loginPage.login(email, password);
  });

  test('Перевірка залогінення на сторінку', async ({ page }) => {
    await expect(page.locator('nav.sidebar')).toBeVisible();
  });

  test('Створити, знайти та видалити курс', async () => {
    const testName = `test_course_${Date.now()}`;

    await test.step('Створення курсу', async () => {
      await coursesPage.navigate();
      await coursesPage.createCourse(testName, 'testing');
    });

    await test.step('Пошук курсу через Search', async () => {
      await coursesPage.searchCourse(testName);
    });

    await test.step('Видалення курсу', async () => {
      await coursesPage.deleteCourse(testName);
    });
  });
});

test.describe('Тестування Classrooms', () => {
  let loginPage: LoginPage;
  let classroomsPage: ClassroomsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    classroomsPage = new ClassroomsPage(page);
    
    await loginPage.login(process.env.YOUR_EMAIL || '', process.env.YOUR_PASSWORD || '');
  });

  test('Створення, пошук і видалення Classroom', async () => {
    await test.step('Створення Classroom', async () => {
      await classroomsPage.navigate();
      await classroomsPage.createClassroom();
    });

    await test.step('Пошук останнього створеного Classroom', async () => {
      await classroomsPage.searchClassroom('e2e group');
    });

    await test.step('Видалення останнього створеного Classroom', async () => {
      await classroomsPage.deleteFirstClassroom();
    });
  });
});
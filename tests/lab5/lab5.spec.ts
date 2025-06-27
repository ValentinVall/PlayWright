import { test, expect } from '@playwright/test';

// Дані для кожного запису
const records = [
  {
    firstName: 'Faculty',
    lastName: 'Test',
    email: 'faculty@example.com',
    age: '45',
    salary: '10000',
    department: 'Faculty of Physics',
  },
  {
    firstName: 'Group',
    lastName: 'Test',
    email: 'group@example.com',
    age: '30',
    salary: '5000',
    department: 'Phys-101',
  },
  {
    firstName: 'Teacher',
    lastName: 'Test',
    email: 'teacher@example.com',
    age: '40',
    salary: '8000',
    department: 'Phys-101',
  },
];

test('Create faculty → group → teacher chain', async ({ page }) => {
  await page.goto('https://demoqa.com/webtables');

  // Додаємо записи один за одним
  for (const record of records) {
    await page.click('#addNewRecordButton');
    await page.fill('#firstName', record.firstName);
    await page.fill('#lastName', record.lastName);
    await page.fill('#userEmail', record.email);
    await page.fill('#age', record.age);
    await page.fill('#salary', record.salary);
    await page.fill('#department', record.department);
    await page.click('#submit');
  }

  // Пошук викладача
  await page.fill('#searchBox', 'Teacher');

  const teacherRow = page.locator('.rt-tr-group', { hasText: 'Teacher' });
  await expect(teacherRow).toHaveCount(1);

  const row = teacherRow.first();
  await expect(row).toContainText('Teacher');
  await expect(row).toContainText('teacher@example.com');
  await expect(row).toContainText('Phys-101');
});

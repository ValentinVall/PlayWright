import { test, expect } from '@playwright/test';
import { order } from './lab2data';
import { sortselectors } from './lab2selectors';

test('Сортування елементів через drag-and-drop', async ({ page }) => {
  await page.goto('https://demoqa.com/sortable');

  const items = await page.locator(sortselectors.listItem).allTextContents();
  expect(items).toEqual(order);

  const listItems = page.locator(sortselectors.listItem);
  await listItems.nth(5).dragTo(listItems.nth(0));

  const newItems = await listItems.allTextContents();
  expect(newItems[0]).toBe('Six');
});

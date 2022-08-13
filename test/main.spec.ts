import { test, expect } from '@playwright/test';

test('basic navigation works', async ({ page }) => {

  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/Flamethrower/);

  const about = page.locator('#about');

  await about.click();
  await expect(page).toHaveURL('http://localhost:3000/about/');
  await expect(page).toHaveTitle(/About/);

  await page.goBack();
  await expect(page).toHaveURL('http://localhost:3000/');

});

test('only valid scripts should run', async ({ page }) => {

  await page.goto('http://localhost:3000');
  const about = page.locator('#about');
  await about.click();
  const bodyCheck = page.locator('#bodyCheck');
  await expect(bodyCheck).toContainText('body script works');

  const headCheck = page.locator('#headCheck');
  await expect(headCheck).toContainText('head script works');

  const headCheck2 = page.locator('#headCheck2');
  await expect(headCheck2).toContainText('default text');

});


test('navigate programatically', async ({ page }) => {

  await page.goto('http://localhost:3000');
  const about = page.locator('#about');
  await about.click();

  const go = page.locator('#go');
  await go.click();
  await expect(page).toHaveURL('http://localhost:3000/');


});

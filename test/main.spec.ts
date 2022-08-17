import { expect, test } from '@playwright/test';

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

test('navigate programmatically', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const about = page.locator('#about');
  await about.click();

  const go = page.locator('#go');
  await go.click();
  await expect(page).toHaveURL('http://localhost:3000/');
});

test('meta tags are added and removed', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const about = page.locator('#about');
  await about.click();

  const desc = page.locator('[name="description"]');
  await expect(desc).toHaveAttribute('content', 'The About Page');

  const extra = page.locator('[name="extra"]');
  await expect(extra).toHaveAttribute('content', 'test');

  const back = page.locator('#back');
  await back.click();

  const descHome = page.locator('[name="description"]');
  await expect(descHome).toHaveAttribute('content', 'The Home Page');

  const extraHome = page.locator('[name="extra"]');
  await expect(extraHome).toHaveCount(0);
});

test('prefetching works', async ({ page }) => {
  await page.goto('http://localhost:3000');
  let preAbout = page.locator('link[href="/about"]');
  await expect(preAbout).toHaveCount(1);

  const about = page.locator('#about');
  await about.click();

  const homePre = page.locator('link[href="/"]');
  await expect(homePre).toHaveCount(1);

  let testPre = page.locator('link[href="/test"]');
  await expect(testPre).toHaveCount(0);

  // Validate intersection observer works
  const heading = page.locator('#chapter');
  await heading.click();

  testPre = page.locator('link[href="/test"]');
  await expect(testPre).toHaveCount(1);

  // ensure no duplicates
  preAbout = page.locator('link[href="/about"]');
  await expect(preAbout).toHaveCount(1);
});

test('page change announcer works', async ({ page }) => {
  await page.goto('http://localhost:3000');

  const announcerHome = page.locator('#flamethrower-announcer');
  await expect(announcerHome).toHaveText('Flamethrower');

  const about = page.locator('#about');
  await about.click();

  const announcerAbout = page.locator('#flamethrower-announcer');
  await expect(announcerAbout).toHaveText('About');
});

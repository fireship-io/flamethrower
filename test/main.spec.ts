import { expect, test } from '@playwright/test';

test('basic navigation works', async ({ page }) => {

  await page.goto('/');
  await expect(page).toHaveTitle(/Flamethrower/);

  const about = page.locator('#about');

  await about.click();
  await expect(page).toHaveURL('/about/');
  await expect(page).toHaveTitle(/About/);

  await page.goBack();
  await expect(page).toHaveURL('/');

});

test('only valid scripts should run', async ({ page }) => {

  await page.goto('/');
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

  await page.goto('/');
  const about = page.locator('#about');
  await about.click();

  const go = page.locator('#go');
  await go.click();
  await expect(page).toHaveURL('/');


});


test('meta tags are added and removed', async ({ page }) => {

  await page.goto('/');
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

  await page.goto('/');
  let preAbout = page.locator('link[href="/about"]');
  await expect(preAbout).toHaveCount(1)

  const about = page.locator('#about');
  await about.click();

  const homePre = page.locator('link[href="/"]');
  await expect(homePre).toHaveCount(1)

  let testPre = page.locator('link[href="/test"]');
  await expect(testPre).toHaveCount(0)

  // Validate intersection observer works
  const heading = page.locator('#chapter');
  await heading.click();

  testPre = page.locator('link[href="/test"]');
  await expect(testPre).toHaveCount(1)

  // ensure no duplicates
  preAbout = page.locator('link[href="/about"]');
  await expect(preAbout).toHaveCount(1)


});

test('single route subscription works', async ({ page }) => {

  await page.goto('/');
  const about = page.locator('#about');
  await about.click();

  const subsCheck = page.locator('#subscriberCheck');

  await expect(subsCheck).toContainText('single route subscription works');
})

test('multi route subscription works', async ({ page }) => {

  await page.goto('/');

  const about = page.locator('#about');
  await about.click();

  const subsCheck = page.locator('.multi-route');
  await expect(subsCheck).toContainText('multi route subscription works');

  await page.goto('/test/');
  const subsCheck2 = page.locator('.multi-route');
  await expect(subsCheck2).toContainText('multi route subscription works');
})

test('subscribed functions called on page load', async ({ page }) => {
  await page.goto('/about/');

  const subsCheck = page.locator('#subscriberCheck');
  await expect(subsCheck).toContainText('single route subscription works');

  const subsCheck2 = page.locator('.multi-route');
  await expect(subsCheck2).toContainText('multi route subscription works');
})

test('can unsubscribe', async ({ page }) => {
  await page.goto('/');

  const unsubcheck = page.locator('#unsub-check');
  await expect(unsubcheck).toContainText("go to about, come back, and I'll be gone. Don't worry, I'll come back on reload");

  const about = page.locator('#about');
  await about.click();

  const home = page.locator('#go');
  await home.click();

  await expect(unsubcheck).toContainText("");
})

test('wizardry works', async ({ page }) => {

  await page.goto('/');
  const unsubcheck = page.locator('#global-check');
  await expect(unsubcheck).toContainText("hi mom");

  await page.goto('/about/');
  const unsubcheck2 = page.locator('#global-check');
  await expect(unsubcheck2).toContainText("hi son");

  await page.goto('/test/');
  const unsubcheck3 = page.locator('#global-check');
  await expect(unsubcheck3).toContainText("how's my little computer scientist today?");
})


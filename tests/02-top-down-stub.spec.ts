import { test, expect } from '@playwright/test';

test('Top-Down STUB: Login REAL -> Inventory STUB', async ({ page }) => {

  // =====================================================
  // REAL A : Login จริง
  // =====================================================
  await page.goto('/');

  await page.locator('#user-name')
    .fill('standard_user');

  await page.locator('#password')
    .fill('secret_sauce');

  await Promise.all([
    page.waitForURL(/inventory\.html/),
    page.locator('#login-button').click(),
  ]);

  console.log('Current URL:', page.url());

  // =====================================================
  // STUB B : Inventory
  // saucedemo.com is an SPA — inventory content is rendered
  // by client-side JS (no HTTP request to /inventory.html).
  // Replace the SPA-rendered DOM with our stub HTML.
  // =====================================================
  await page.setContent(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Stub Cart</title>
        </head>
        <body>
          <h1>Your Cart</h1>
          <div class="cart_list" data-test="stub-cart">
            Fake Cart from Stub
            <div class="cart_item" data-test="student-name">Yumi Nakano</div>
          </div>
        </body>
      </html>
 `);

  // =====================================================
  // Assert : REAL A -> STUB B
  // =====================================================

  await expect(page.locator('[data-test="stub-cart"]')).toBeVisible();

  await expect(page.locator('[data-test="student-name"]')).toContainText('Yumi Nakano');
});
import {
  test,
  expect,
  BrowserContext,
  Page,
} from '@playwright/test';


async function driverOpenShoppingCart(
  context: BrowserContext
): Promise<Page> {

  await context.addCookies([
    {
      name: 'session-username',
      value: 'standard_user',
      domain: 'www.saucedemo.com',
      path: '/',
    },
  ]);

  const page = await context.newPage();
  
  await page.goto('https://www.saucedemo.com/cart.html');

  return page;
}

test('Sandwich: Top-Down STUB + Bottom-Up DRIVER', async ({ browser }) => {

  const topContext = await browser.newContext();
  const bottomContext = await browser.newContext();

  const topPage = await topContext.newPage();

  try {
    await Promise.all([

      (async () => {
        await topPage.goto('https://www.saucedemo.com/');

        await topPage.locator('#user-name').fill('standard_user');
        await topPage.locator('#password').fill('secret_sauce');
        await topPage.locator('#login-button').click();

        await topPage.waitForURL(/inventory\.html/);

 
        await topPage.setContent(`
          <!doctype html>
          <html>
            <head>
              <meta charset="utf-8" />
              <title>Stub Shopping Cart</title>
            </head>
            <body>
              <h1>Your Cart (Stub)</h1>
              <div class="cart_list" data-test="stub-cart">
                <div class="cart_item">
                  <span class="inventory_item_name">Sauce Labs Backpack</span>
                  <div class="student-owner" data-test="student-name">
                    Yumi Nakano
                  </div>
                </div>
              </div>
            </body>
          </html>
        `);

        await expect(topPage.locator('[data-test="stub-cart"]'))
          .toBeVisible();
        await expect(topPage.locator('[data-test="student-name"]'))
          .toContainText('Yumi Nakano');
      })(),

      (async () => {
        await driverOpenShoppingCart(bottomContext);
      })(),
    ]);

  } finally {
    await Promise.all([
      topContext.close(),
      bottomContext.close(),
    ]);
  }
});
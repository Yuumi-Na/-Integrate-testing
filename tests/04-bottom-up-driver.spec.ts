import {
  test,
  expect,
  BrowserContext,
  Page,
} from '@playwright/test';

// =====================================================
// DRIVER A
// ทำหน้าที่แทน Login Layer ด้านบน
// ไม่กรอก username/password ผ่านหน้า Login
// =====================================================
async function driverOpenCart(
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

  await expect(page.locator('.cart_list')).toBeVisible();

  return page;
}

test('Bottom-Up DRIVER: Driver -> F Cart', async ({ browser }) => {

  const context = await browser.newContext();

  try {
    // ===================================================
    // ใช้ Driver เพื่อเข้าหน้า Cart โดยตรง
    // ===================================================
    const page = await driverOpenCart(context);

    // ===================================================
    // ทดสอบการทำงานในหน้า Cart (Cart จริง)
    // ===================================================
    
    // เช่น ตรวจสอบว่ามีปุ่ม Checkout แสดงอยู่หรือไม่
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
    
    // หรือตรวจสอบปุ่ม Continue Shopping
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();

  } finally {
    await context.close();
  }
});

// npx playwright test tests/04-bottom-up-driver.spec.ts --headed

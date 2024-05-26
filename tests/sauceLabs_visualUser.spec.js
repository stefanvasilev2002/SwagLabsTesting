// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Swag Labs Automated Testing - Visual User', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('input[data-test="username"]', 'visual_user');
    await page.fill('input[data-test="password"]', 'secret_sauce');
    await page.click('input[data-test="login-button"]');

  });


    test('Login with valid credentials', async ({ page }) => {
      await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    });


    test('Add three items to the cart and verify cart count', async ({ page }) => {
      await page.click('button[id="add-to-cart-sauce-labs-backpack"]');
      await page.click('button[id="add-to-cart-sauce-labs-bike-light"]');
      await page.click('button[id="add-to-cart-sauce-labs-onesie"]');

      const cartCount = await page.textContent('.shopping_cart_badge');
      expect(cartCount).toBe('3');
    });



  test('Verify correct items in the cart', async ({ page }) => {
    await page.click('button[id="add-to-cart-sauce-labs-backpack"]');
    await page.click('button[id="add-to-cart-sauce-labs-bike-light"]');
    await page.click('button[id="add-to-cart-sauce-labs-onesie"]');

    await page.click('.shopping_cart_link');

    const items = await page.$$('div[class="inventory_item_name"]');
    await expect(await items[0].innerText()).toBe('Sauce Labs Backpack');
    await expect(await items[1].innerText()).toBe('Sauce Labs Bike Light');
    await expect(await items[2].innerText()).toBe('Sauce Labs Onesie');
  });


  test('Check user cannot continue with empty checkout form', async ({ page }) => {
    await page.click('.shopping_cart_link');
    await page.click('button[data-test="checkout"]');
    await page.click('input[data-test="continue"]');

    const errorText = await page.textContent('h3[data-test="error"]');
    expect(errorText).toContain('Error: First Name is required');
  });


  test('Fill the form and verify total price', async ({ page }) => {
    await page.click('button[id="add-to-cart-sauce-labs-backpack"]');
    await page.click('button[id="add-to-cart-sauce-labs-bike-light"]');
    await page.click('button[id="add-to-cart-sauce-labs-onesie"]');

    await page.click('.shopping_cart_link');
    await page.click('button[data-test="checkout"]');

    await page.fill('input[data-test="firstName"]', 'Sandra');
    await page.fill('input[data-test="lastName"]', 'Georgiev');
    await page.fill('input[data-test="postalCode"]', '1000');

    await page.click('input[data-test="continue"]');

    const totalPrice = await page.textContent('.summary_total_label');
    expect(totalPrice).toContain('Total: $51.81');
  });



  test('Verify order completed', async ({ page }) => {

    await page.click('button[id="add-to-cart-sauce-labs-backpack"]');
    await page.click('.shopping_cart_link');
    await page.click('button[data-test="checkout"]');

    await page.fill('input[data-test="firstName"]', 'Sandra');
    await page.fill('input[data-test="lastName"]', 'Georgiev');
    await page.fill('input[data-test="postalCode"]', '1000');

    await page.click('input[data-test="continue"]');
    await page.click('button[data-test="finish"]');

    const completionMessage = await page.locator('h2[data-test="complete-header"]').innerText();
    expect(completionMessage).toContain('Thank you for your order!');
  });


})




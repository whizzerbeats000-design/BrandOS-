import { test, expect } from "@playwright/test";

const routes = [
  { path: "/", name: "Homepage" },
  { path: "/shop", name: "Shop" },
  { path: "/collections", name: "Collections" },
  { path: "/about", name: "About" },
  { path: "/cart", name: "Cart" },
  { path: "/checkout", name: "Checkout" },
];

for (const route of routes) {
  test(`${route.name} loads (${route.path})`, async ({ page }) => {
    const response = await page.goto(route.path);
    expect(response?.status(), `${route.path} should return 200`).toBe(200);
    const title = await page.title();
    expect(title.length, "page should have a title").toBeGreaterThan(0);
  });
}

test("product page loads", async ({ page }) => {
  const response = await page.goto("/shop");
  expect(response?.status()).toBe(200);
  const firstProduct = page.locator('a[href^="/product/"]').first();
  const hasProducts = await firstProduct.count();
  if (hasProducts > 0) {
    await firstProduct.waitFor({ state: "visible", timeout: 10_000 });
    const href = await firstProduct.getAttribute("href");
    expect(href).toBeTruthy();
    const productResponse = await page.goto(href!);
    expect(productResponse?.status()).toBe(200);
  } else {
    await expect(page.locator("text=No pieces found.")).toBeVisible();
  }
});

test("404 page renders for unknown route", async ({ page }) => {
  const response = await page.goto("/nonexistent-page");
  expect(response?.status()).toBe(404);
  await expect(page.locator("text=Page not found")).toBeVisible();
});

test("navigation links are visible on homepage", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('a[href="/shop"]').first()).toBeVisible();
  await expect(page.locator('a[href="/about"]').first()).toBeVisible();
});

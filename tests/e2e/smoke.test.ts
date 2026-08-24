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

test("unknown product slug returns 404", async ({ page }) => {
  const response = await page.goto("/product/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.locator("text=Page not found")).toBeVisible();
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

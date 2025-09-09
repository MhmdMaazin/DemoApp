import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  // Auth context auto-logs in a broker on mount, so no login steps needed
  await expect(page.getByText('DemoApp')).toBeVisible()
})

test('borrower selection updates the center pane', async ({ page }) => {
  await page.getByText('Borrower Pipeline').waitFor()

  // Ensure a known borrower exists in mock data
  const targetBorrower = 'Alan Matthews'

  // Navigate to the In Review tab where Alan appears
  await page.getByRole('tab', { name: /In Review/i }).click()
  await page.getByText(targetBorrower, { exact: true }).click()

  // Verify details panel shows the selected borrower name
  await expect(page.getByRole('heading', { name: targetBorrower })).toBeVisible()
})

test('AI Explainability accordion expands and collapses', async ({ page }) => {
  // Navigate to In Review tab to select Alan Matthews (who has AI flags)
  await page.getByRole('tab', { name: /In Review/i }).click()
  await page.getByText('Alan Matthews', { exact: true }).click()

  // Wait for borrower details to load
  await expect(page.getByRole('heading', { name: 'Alan Matthews' })).toBeVisible()

  // The accordion is default open in implementation, ensure we can toggle
  const accordionTrigger = page.getByText('AI Explainability')

  // First verify the flag text is visible when accordion is open
  const flagText = 'High Debt-to-Income Ratio'
  await expect(page.getByText(flagText)).toBeVisible()

  // Click to collapse the accordion
  await accordionTrigger.click()

  // After collapsing, flag text should not be visible
  await expect(page.getByText(flagText)).toBeHidden()

  // Click to expand again
  await accordionTrigger.click()
  await expect(page.getByText(flagText)).toBeVisible()
})

test('action buttons trigger mocked behavior', async ({ page }) => {
  // Navigate to In Review tab to select Alan Matthews (who has AI flags)
  await page.getByRole('tab', { name: /In Review/i }).click()
  await page.getByText('Alan Matthews', { exact: true }).click()

  // Wait for borrower details to load
  await expect(page.getByRole('heading', { name: 'Alan Matthews' })).toBeVisible()

  // Ensure AI Explainability accordion is open (it should be by default)
  const accordionContent = page.locator('[data-state="open"]').first()
  await expect(accordionContent).toBeVisible()

  // Request Documents → wait for status update to stabilize DOM
  await accordionContent.getByRole('button', { name: /Request Documents/i }).click()
  await expect(page.getByText(/Documents Requested|Property valuation in progress|Approved/)).toBeVisible()

  // Send to Valuer
  await accordionContent.getByRole('button', { name: /Send to Valuer/i }).click()
  await expect(page.getByText('With Valuer')).toBeVisible()

  // Approve (may change status and move borrower between tabs)
  await accordionContent.getByRole('button', { name: /^Approve$/i }).click()

  // Wait for status change to reflect to avoid racing detachment
  await expect(page.getByText('Approved')).toBeVisible()

  // Escalate button may be disabled based on logic; just assert it exists
  await expect(page.getByRole('button', { name: /Escalate to Credit Committee/i })).toBeVisible()
})



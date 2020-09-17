import { $, $$, browser, ExpectedConditions } from 'protractor';

describe('When: Use the search feature', () => {
  beforeEach(async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
  });

  it('Then: I should be able to search books by title', async () => {
    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();

    const items = await $$('[data-testing="book-item"]');
    expect(items.length).toBeGreaterThan(1);
  });

  it('Then: I should see search results as I am typing', async () => {
    const form = await $('form');
    const input = await $('input[type="search"]');

    const parts = ['Java', 'Script'];

    for (const [index, part] of parts.entries()) {
      await input.sendKeys(part);
      await form.submit();
      await browser.sleep(500);

      const titles = await $$('.book--title');
      expect(titles[index].getText()).toContain(
        parts.slice(0, index + 1).join('')
      );
    }
  });
});

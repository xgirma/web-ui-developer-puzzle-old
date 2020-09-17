import { $, $$, browser, by, element, ExpectedConditions } from 'protractor';

describe('When: I use the search feature', () => {
  beforeEach(async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
  });

  it('Then: I should add books to reading list', async () => {
    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();

    const buttons = await element.all(by.cssContainingText('span',' Want to Read '));
    buttons[0].click();

    const count = await $('[id^="mat-badge-content-"]');
    expect(count.getText()).toBeGreaterThan(0);
  });
});

describe('When: I use the reading list feature', () => {
  beforeEach(async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
  });

  it('Then: I should see my reading list', async () => {
    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
  });
});

describe('When: I use the undo feature', () => {
  beforeEach(async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
  });

  it('Then: I should undo a removed book from reading list', async () => {
    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    const removeLocator = '.reading-list-item > div:nth-child(3)';

    // remove
    const removeButtons = await $$(removeLocator);
    expect(removeButtons.length).toBeGreaterThan(0);
    removeButtons[0].click();

    // undo
    const undoLink = await element.all(by.cssContainingText('span','Undo'));
    undoLink[0].click();
    const removeButtonsAfterUndo = await $$(removeLocator);
    expect(removeButtonsAfterUndo.length).toBeGreaterThan(0);
  });
});

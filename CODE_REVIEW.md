# Code Review

## Review specific to `libs/books`

- add `collectCoverage`: `true` to Jest config
- change coverage path from `overageDirectory: '../../../coverage/libs/shop/feature',` to `overageDirectory: '../../../coverage/libs/books/feature',`
- improve test coverage for `books.reducer.ts`, `reading-list.effects.ts`, `reading-list.reducer.ts`, and `book-search.component.ts`
- renaming `confirmedAddToReadingList` and `confirmedRemoveFromReadingList` to `addToReadingListSuccess` and `removeFromReadingListSuccess` would be consistent with other Action names used in the `books.actions`.
- renaming `failedRemoveFromReadingList` and `failedAddToReadingList` to `removeFromReadingListFailed` and `addToReadingListFailed` would be consistent with other Action names used in the `books.actions`.
- reading-list-action without corresponding reducer `failedAddToReadingList`, `confirmedAddToReadingList`, `failedRemoveFromReadingList` and `confirmedRemoveFromReadingList`.
- `clearSearch` action does not clear `searchTerm` field. For example if we search for `JavaScript" and clear the search-term in the search-bar state will still contain`search tearm`
```json
{
  "books": {
    "ids": [],
    "entities": {},
    "loaded": true,
    "searchTerm": "JavaScript",
    "error": null
  },
  "readingList": {
    "ids": [],
    "entities": {},
    "loaded": true,
    "error": null
  }
}
```
- searching for `sdfsdf` for example return a book that breaks a style for `Want to read` button.

## Other improvements

- `npm run build` script is failed to run.

## Accessibility found and fixed outside of lighthouse

- `app-component.html` add aria-label for Close icon
- `book-search.component.html/scss` 
    - add arial-label for `img` tag, for book cover images
    - change font-color for disabled `Want to Read` buttons to fix contrast issue
    - changed the search helper text-color to fix contrast issue
- `reading-list.component.html` add arial for `img` tag, for book cover images

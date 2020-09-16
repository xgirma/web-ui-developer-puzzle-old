import { initialState, reducer, State } from './books.reducer';
import * as BooksActions from './books.actions';
import { createBook } from '@tmo/shared/testing';

describe('Books Reducer', () => {
  describe('valid Books actions', () => {
    const books = [createBook('A'), createBook('B'), createBook('C')];

    it('searchBooks should pass search-term, reset loaded to false and error to null', () => {
      const term = "JavaScript";
      const action = BooksActions.searchBooks({ term });

      const result: State = reducer(initialState, action);

      expect(result.searchTerm).toBe(term);
      expect(result.loaded).toBe(false);
      expect(result.error).toBe(null);
    });

    it('loadBooksSuccess should return set the list of known Books', () => {

      const action = BooksActions.searchBooksSuccess({ books });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(3);
    });

    it('clearSearch should not return list of Books', () => {
      const searchAction = BooksActions.searchBooksSuccess({ books });

      const searchResult: State = reducer(initialState, searchAction);

      expect(searchResult.loaded).toBe(true);
      expect(searchResult.ids.length).toBe(3);

      const clearAction = BooksActions.clearSearch();
      const clearResult: State = reducer(initialState, clearAction);

      expect(clearResult.ids.length).toBe(0);
    });

    it('searchBooksFailure should clear ids and search term', () => {
      const error = "Unknown error";
      const action = BooksActions.searchBooksFailure({ error });

      const result: State = reducer(initialState, action);

      expect(result.searchTerm).not.toBeDefined();
      expect(result.loaded).toBe(false);
      expect(result.error).toBe(error);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});

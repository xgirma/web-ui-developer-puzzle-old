import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import {
  startWith,
  debounceTime,
  distinctUntilChanged,
  tap,
  takeUntil,
} from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  getSearchTerm,
  ReadingListBook,
  searchBooks,
} from '@tmo/books/data-access';
import { Book } from '@tmo/shared/models';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
})
export class BookSearchComponent implements OnInit, OnDestroy {
  books: ReadingListBook[];
  searchTerm$: Observable<string> = this.store.select(getSearchTerm);
  private unsubscribe$ = new Subject<void>();

  searchForm = this.fb.group({
    term: '',
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.searchForm
      .get('term')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(500),
        distinctUntilChanged(),
        tap((term) => this.searchBooks(term)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();
    this.store.select(getAllBooks).subscribe((books) => {
      this.books = books;
    });
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample(searchTerm: string) {
    this.searchBooks(searchTerm);
  }

  searchBooks(searchTerm: string) {
    if (searchTerm) {
      this.store.dispatch(searchBooks({ term: searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

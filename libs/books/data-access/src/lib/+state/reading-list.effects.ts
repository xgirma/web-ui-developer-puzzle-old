import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map } from 'rxjs/operators';
import { ReadingListItem, Book } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';
import { optimisticUpdate } from '@nrwl/angular';
import { Action } from '@ngrx/store';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http
          .get<ReadingListItem[]>('/api/reading-list')
          .pipe(
            map(data =>
              ReadingListActions.loadReadingListSuccess({ list: data })
            )
          )
      ),
      catchError(error =>
        of(ReadingListActions.loadReadingListError({ error }))
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book }) =>
        this.http.post('/api/reading-list', book).pipe(
          map(() => ReadingListActions.confirmedAddToReadingList({ book })),
          catchError(() =>
            of(ReadingListActions.failedAddToReadingList({ book }))
          )
        )
      )
    )
  );

  undoAddBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.undoAddToReadingList),
      optimisticUpdate({
        run: ({ book }) => {
          const item: ReadingListItem = { bookId: book.id, ...book };
          return this.http
            .delete(`/api/reading-list/${book.id}`)
            .pipe(
              map(() =>
                ReadingListActions.confirmedRemoveFromReadingList({ item })
              )
            );
        },
        undoAction({ book }): Observable<Action> | Action {
          const item: ReadingListItem = { bookId: book.id, ...book };
          return ReadingListActions.failedRemoveFromReadingList({ item });
        },
      })
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item }) =>
        this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          map(() =>
            ReadingListActions.confirmedRemoveFromReadingList({ item })
          ),
          catchError(() =>
            of(ReadingListActions.failedRemoveFromReadingList({ item }))
          )
        )
      )
    )
  );

  undoRemoveBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.undoRemoveFromReadingList),
      optimisticUpdate({
        run: ({ item }) => {
          const book: Book = { id: item.bookId, ...item };
          console.log(book);
          return this.http
            .post(`/api/reading-list`, book)
            .pipe(
              map(() => ReadingListActions.confirmedAddToReadingList({ book }))
            );
        },
        undoAction({ item }): Observable<Action> | Action {
          const book: Book = { id: item.bookId, ...item };
          return ReadingListActions.failedAddToReadingList({ book });
        },
      })
    )
  );

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(private actions$: Actions, private http: HttpClient) {}
}

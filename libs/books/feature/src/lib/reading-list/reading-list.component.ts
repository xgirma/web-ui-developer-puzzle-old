import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import {
  getReadingList,
  removeFromReadingList,
  undoRemoveFromReadingList,
} from '@tmo/books/data-access';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss'],
})
export class ReadingListComponent {
  readingList$ = this.store.select(getReadingList);

  constructor(private readonly store: Store, private snackBar: MatSnackBar) {}

  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));
    const message = `Removed: ${item.title}.`;
    const snackbarRef = this.snackBar.open(message, 'Undo', { duration: 4000 });
    snackbarRef
      .onAction()
      .pipe(take(1))
      .subscribe(() =>
        this.store.dispatch(undoRemoveFromReadingList({ item }))
      );
  }
}

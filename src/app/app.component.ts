import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public form: FormGroup;
  public sizeField: number = 10;
  public arr = [];
  public selectedPlayer: number = 1;

  public isWin: boolean = false;

  ngOnInit() {
    this.form = new FormGroup({
      sizeField: new FormControl( 10, [Validators.required, Validators.min(3)]),
      countPlayer: new FormControl( 2, [Validators.required, Validators.min(2)]),
      winLength: new FormControl( 3, [Validators.required, Validators.min(3)]),
    });
  }

  play() {
    this.arr = Array(+this.form.get('sizeField').value).fill(null).map(() => Array(+this.form.get('sizeField').value).fill(null));
  }

  public selectCell(i, j): void {
    if (this.arr[i][j]) {
      return;
    }
    this.arr[i][j] = this.selectedPlayer;
    this.isWin = this.checkWin(i, j);
    if (this.isWin) {
      return;
    }
    this.selectedPlayer++;
    if (this.selectedPlayer >  +this.form.get('countPlayer').value) {
      this.selectedPlayer = 1;
    }
  }

  checkWin(i, j) {
    const checkRows = this.checkSeq(this.arr[i]);

    const checkColumns = this.checkSeq(this.arr.map((row) => row[j]));
    let y = [];
    for (let ii = -i; ii < this.arr.length - i; ii++) {
      const i1 = i + ii;
      const j1 = j + ii;
      if (i1 >= 0 && j1 >= 0 && i1 < this.arr.length && j1 < this.arr.length) {
        y.push(this.arr[i1][j1]);
      }
    }
    const checkMainDiag = this.checkSeq(y);


    let o = [];
    for (let ii = -i; ii < this.arr.length - i; ii++) {
      const i1 = i + ii;
      const j1 = j - ii;
      if (i1 >= 0 && j1 >= 0 && i1 < this.arr.length && j1 < this.arr.length) {
        o.push(this.arr[i1][j1]);
      }
    }
    const checkSubDiag = this.checkSeq(o);
    return checkRows || checkColumns || checkMainDiag || checkSubDiag;
  }

  checkSeq(row): boolean {
    const index = row.indexOf(this.selectedPlayer);
    if (index === -1 || index + (+this.form.get('winLength').value) > row.length) {
      return false;
    }
    const subRow = row.slice(index, index + (+this.form.get('winLength').value));
    return subRow.every((item) => item === this.selectedPlayer);
  }
}

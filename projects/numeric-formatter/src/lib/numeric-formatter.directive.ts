import { Directive, OnInit, Input, Output, EventEmitter, ElementRef, HostListener, OnChanges, AfterViewChecked } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Directive({
  selector: '[numericformatter]'
})
export class NumericFormatterDirective implements OnInit, OnChanges, AfterViewChecked {

  @Input() maxNumLength: number;
  @Input() decimalPoints: number = 0;
  @Input() decimalPointer: string = ".";
  @Input() minDecimals: number = -1;
  @Input() ngModel: any;
  @Output() ngModelChange = new EventEmitter();
  private integerCount: number;
  private el: any;
  private onType: boolean = false;

  private navigationKeys = [
    "Backspace",
    "Delete",
    "Tab",
    "Escape",
    "Enter",
    "Home",
    "End",
    "ArrowLeft",
    "ArrowRight",
    "Clear",
    "Copy",
    "Paste"
  ];

  constructor(private elementRef: ElementRef, private decimalPipe: DecimalPipe) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit(): void {
    if (this.decimalPoints > 0) {
      this.integerCount = this.maxNumLength - this.decimalPoints - 1;
    } else {
      this.integerCount = this.maxNumLength
    }
    if (this.minDecimals == -1) {
      this.minDecimals = this.decimalPoints;
    }
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (changes.ngModel) {
      if (changes.ngModel.currentValue && this.decimalPoints > 0) {
        //this.isFirstChange = true;
        // let pipe = "1." + this.decimalPoints + "-" + this.decimalPoints;
        // this.el.value = this.decimalPipe.transform(this.ngModel, pipe);
        // this.ngModelChange.emit(Number(changes.ngModel.currentValue).toFixed(this.decimalPoints));
      }
    }
  }

  ngAfterViewChecked(): void {
    if (!this.onType) {
      //this.isFirstChange = false;
      // this.ngModelChange.emit(Number(changes.ngModel.currentValue).toFixed(this.decimalPoints));
      let pipe = "1." + this.minDecimals + "-" + this.decimalPoints;
      this.el.value = this.decimalPipe.transform(this.ngModel, pipe);
    }
  }

  @HostListener("blur")
  onBlur() {
    let pipe: string = "1." + this.minDecimals + "-" + this.decimalPoints;
    this.el.value = this.decimalPipe.transform(this.el.value, pipe);
    this.onType = false;
  }

  @HostListener("focus")
  onFocus() {
    this.onType = true;
    this.el.value = this.el.value.replace(new RegExp(",", "g"), '');
  }

  private insertString(index: number, value: string, char: string): string {
    return value.slice(0, index) + char + value.slice(index, value.length);
  }

  private getPointerIndex(value: string, pointer: string): number {
    return value.indexOf(pointer);
  }

  @HostListener("keydown", ["$event"])
  onKeyDown(e: KeyboardEvent) {
    if (!isNaN(Number(e.key))) {
      if (this.decimalPoints > 0) {
        if (this.el.value.length <= this.maxNumLength) {
          this.preventType(e);
        } else {
          e.preventDefault();
        }
      } else {
        if (this.el.value.length >= this.maxNumLength) {
          e.preventDefault();
        }
      }
    } else if (this.navigationKeys.indexOf(e.key) > -1 || // Allow: navigation keys: backspace, delete, arrows etc.
      (e.key === "a" && e.ctrlKey === true) || // Allow: Ctrl+A
      (e.key === "c" && e.ctrlKey === true) || // Allow: Ctrl+C
      (e.key === "v" && e.ctrlKey === true) || // Allow: Ctrl+V
      (e.key === "x" && e.ctrlKey === true) || // Allow: Ctrl+X
      (e.key === "a" && e.metaKey === true) || // Allow: Cmd+A (Mac)
      (e.key === "c" && e.metaKey === true) || // Allow: Cmd+C (Mac)
      (e.key === "v" && e.metaKey === true) || // Allow: Cmd+V (Mac)
      (e.key === "x" && e.metaKey === true)  // Allow: Cmd+X (Mac)
    ) {
      return;
    } else if (e.key === this.decimalPointer && this.decimalPoints > 0) {
      let pIndex: number = this.getPointerIndex(this.el.value, this.decimalPointer);
      if (pIndex > 0) {
        e.preventDefault();
      }
    }
    else {
      e.preventDefault();
    }
  }

  private preventType(e: KeyboardEvent): void {
    let pIndex: number = this.getPointerIndex(this.el.value, this.decimalPointer);
    if (pIndex > 0) {
      if (this.el.selectionStart <= pIndex) {
        if (this.el.value.split(this.decimalPointer)[0].length >= this.integerCount) {
          e.preventDefault();
        }
      } else {
        if (this.el.value.split(this.decimalPointer)[1].length >= this.decimalPoints) {
          e.preventDefault();
        }
      }
    }
  }

  @HostListener("keyup", ["$event"])
  onKeyUp(e: KeyboardEvent) {
    let value = this.el.value;
    if (this.el.value.length > this.integerCount && this.decimalPoints > 0 &&
      this.getPointerIndex(value, this.decimalPointer) < 0) {
      value = this.insertString(this.integerCount, this.el.value, this.decimalPointer);
      this.ngModelChange.emit(value);
    }
    this.ngModelChange.emit(value);
  }

  @HostListener("paste", ["$event"])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedInput: string = event.clipboardData.getData("text/plain");
    let value = this.spliceSlice(this.el.value, this.el.selectionStart, this.el.selectionEnd - this.el.selectionStart, pastedInput);
    value = value.replace(",", "");
    if (this.checkValidNumber(value)) { //!this.decimal
      this.ngModelChange.emit(value);
      // document.execCommand(
      //     "insertText",
      //     false,
      //     pastedInput.replace(",", "")
      // );
    }
  }

  @HostListener("drop", ["$event"])
  onDrop(event: DragEvent) {
    event.preventDefault();
    const textData = event.dataTransfer.getData("text");
    this.el.focus();
    let value = this.spliceSlice(this.el.value, this.el.selectionStart, this.el.selectionEnd - this.el.selectionStart, textData);
    value = value.replace(",", "");

    if (this.checkValidNumber(value)) { //!this.decimal
      this.ngModelChange.emit(value);
      // document.execCommand(
      //     "insertText",
      //     false,
      //     textData.replace(",", "")
      // );
    }
  }

  private checkValidNumber(value: string): boolean {
    let pIndex: number = this.getPointerIndex(value, this.decimalPointer);
    if (isNaN(Number(value))) {
      return false;
    } else if (pIndex > 0 && value.split(this.decimalPointer)[0].length > this.integerCount) {
      return false;

    } else if (pIndex > 0 && value.split(this.decimalPointer)[1].length > this.decimalPoints) {
      return false;
    } else if (pIndex < 0 && value.length > this.integerCount) {
      return false;
    }
    return true;
  }

  private spliceSlice(str: string, index: number, count: number, add: string): string {
    if (index < 0) {
      index = str.length + index;
      if (index < 0) {
        index = 0;
      }
    }
    return str.slice(0, index) + (add || "") + str.slice(index + count);
  }
}
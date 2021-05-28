import { Directive, OnInit, Input, Output, EventEmitter, ElementRef, HostListener, AfterViewChecked, OnChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Directive({
  providers: [DecimalPipe],
  selector: '[numericformatter]'
})
export class NumericFormatterDirective implements OnInit, AfterViewChecked {

  @Input() maxValue: number = null;
  @Input() minValue: number = null;
  @Input() maxNumLength: number = 100;
  @Input() maxDecimals: number = 100;
  @Input() minDecimals: number = 0;
  @Input() displaySeperator: boolean = false;
  @Input() allowNegative: boolean = false;
  @Input() ngModel: any;
  @Output() ngModelChange = new EventEmitter();
  private decimalPointer: string = ".";
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
    this.init();
  }

  private init(): void {
    if (this.minDecimals > this.maxDecimals) {
      this.minDecimals = this.maxDecimals;
    }
    if (this.minDecimals > 0) {
      if (this.maxDecimals == 0) {
        this.maxDecimals = this.minDecimals;
      }
      this.integerCount = this.maxNumLength - this.minDecimals - 1;
    } else {
      this.integerCount = this.maxNumLength
    }
  }

  ngAfterViewChecked(): void {
    if (!this.onType && this.ngModel) {
      if (this.displaySeperator) {
        let pipe: string = "1." + this.minDecimals + "-" + this.maxDecimals;
        this.el.value = this.decimalPipe.transform(this.ngModel, pipe);
      } else {
        if (this.minDecimals > 0) {
          let index = this.getPointerIndex(this.ngModel, this.decimalPointer);
          if (index >= this.el.value.length - this.minDecimals) {
            this.ngModelChange.emit(Number(this.ngModel).toFixed(this.minDecimals));
          } else if (index < 0) {
            this.ngModelChange.emit(Number(this.ngModel).toFixed(this.minDecimals));
          }
        }
      }
    }
  }

  @HostListener("blur")
  onBlur() {
    if (this.displaySeperator) {
      let pipe: string = "1." + this.minDecimals + "-" + this.maxDecimals;
      this.el.value = this.decimalPipe.transform(this.ngModel, pipe);
    } else {
      if (this.minDecimals > 0) {
        let index = this.getPointerIndex(this.ngModel, this.decimalPointer);
        if (index >= this.el.value.length - this.minDecimals) {
          this.ngModelChange.emit(Number(this.ngModel).toFixed(this.minDecimals));
        } else if (index < 0) {
          this.ngModelChange.emit(Number(this.ngModel).toFixed(this.minDecimals));
        }
      }
    }
    if (this.minValue && this.ngModel) {
      if (this.ngModel < this.minValue) {
        this.ngModelChange.emit(Number(this.minValue).toFixed(this.minDecimals));
      }
    }
    this.onType = false;
  }

  @HostListener("focus")
  onFocus() {
    let selectionStart = this.el.selectionStart;
    let selectionEnd = this.el.selectionEnd;
    this.onType = true;
    this.el.value = this.el.value.replace(new RegExp(",", "g"), '');
    this.el.selectionStart = selectionStart;
    this.el.selectionEnd = selectionEnd;
  }

  private insertString(index: number, value: string, char: string): string {
    return value.slice(0, index) + char + value.slice(index, value.length);
  }

  private getPointerIndex(value: string, pointer: string): number {
    return value.indexOf(pointer);
  }

  private selectionUpdate(){
    if (this.el.selectionStart > 0 || this.el.selectionEnd > 0) {
      this.el.value = this.el.value.replace(this.el.value.slice(this.el.selectionStart, this.el.selectionEnd), '');
      if (this.el.selectionEnd < this.el.selectionStart) {
        this.el.selectionStart = this.el.selectionEnd;
      }
    }
  }

  @HostListener("keydown", ["$event"])
  onKeyDown(e: KeyboardEvent) {
    if (!isNaN(Number(e.key)) && e.key != " ") {
      this.selectionUpdate();
      if (this.maxDecimals > 0) {
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
      if (this.maxValue != null) {
        this.maxValueValidation(e);
      }
    } else if (this.navigationKeys.indexOf(e.key) > -1 || // Allow: navigation keys: backspace, delete, arrows etc.
      (e.key === "a" && e.ctrlKey === true) || // Allow: Ctrl+A
      (e.key === "c" && e.ctrlKey === true) || // Allow: Ctrl+C
      (e.key === "v" && e.ctrlKey === true) || // Allow: Ctrl+V
      (e.key === "x" && e.ctrlKey === true) || // Allow: Ctrl+X
      (e.key === "a" && e.metaKey === true) || // Allow: Cmd+A (Mac)
      (e.key === "c" && e.metaKey === true) || // Allow: Cmd+C (Mac)
      (e.key === "v" && e.metaKey === true) || // Allow: Cmd+V (Mac)
      (e.key === "x" && e.metaKey === true) || // Allow: Cmd+X (Mac)
      this.validNegative(e.key)
    ) {
      return;
    } else if (e.key === this.decimalPointer && this.maxDecimals > 0) {
      this.selectionUpdate();
      let pIndex: number = this.getPointerIndex(this.el.value, this.decimalPointer);
      if (pIndex > 0 || this.el.value.length >= this.maxNumLength || this.el.selectionStart == 0 || this.el.selectionStart >= this.maxNumLength - 1) {
        e.preventDefault();
      } else if (this.el.selectionStart < this.el.value.length - this.maxDecimals) {
        e.preventDefault();
      } else if (this.el.value.length >= this.maxNumLength) {
        e.preventDefault();
      }
    }
    else {
      e.preventDefault();
    }
  }

  private validNegative(key): boolean {
    if (this.allowNegative && key == '-') {
      if (this.getPointerIndex(this.el.value, '-') >= 0) {
        return false;
      } else if (this.el.selectionStart > 0) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  private preventType(e: KeyboardEvent): void {
    let pIndex: number = this.getPointerIndex(this.el.value, this.decimalPointer);
    if (pIndex > 0) {
      if (this.el.selectionStart <= pIndex) {
        if (this.el.value.split(this.decimalPointer)[0].length >= this.integerCount || this.el.value.length >= this.maxNumLength) {
          e.preventDefault();
        }
      } else {
        if (this.el.value.split(this.decimalPointer)[1].length >= this.maxDecimals || this.el.value.length >= this.maxNumLength) {
          e.preventDefault();
        }
      }
    } else {
      if (this.el.value.split(this.decimalPointer)[0].length >= this.integerCount) {
        if (this.minDecimals < 1 || this.el.value.length >= this.maxNumLength) {
          e.preventDefault();
        }
        else if (this.el.value.length >= this.maxNumLength - 1) {
          e.preventDefault();
        }
      }
    }
  }

  private maxValueValidation(e: KeyboardEvent): void {
    let value: number = Number(this.spliceSlice(this.el.value, this.el.selectionStart, this.el.selectionEnd - this.el.selectionStart, e.key));
    if (value > this.maxValue) {
      e.preventDefault();
    }
  }

  @HostListener("keyup", ["$event"])
  onKeyUp(e: KeyboardEvent) {
    if (this.el.value.length > this.integerCount && this.minDecimals > 0 &&
      this.getPointerIndex(this.el.value, this.decimalPointer) < 0) {
      this.el.value = this.insertString(this.integerCount, this.el.value, this.decimalPointer);
      this.ngModelChange.emit(this.el.value);
    }
  }

  @HostListener("paste", ["$event"])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    let pastedInput: string = event.clipboardData.getData("text/plain");
    pastedInput = pastedInput.trimLeft();
    pastedInput = pastedInput.trimRight();
    let value = this.spliceSlice(this.el.value, this.el.selectionStart, this.el.selectionEnd - this.el.selectionStart, pastedInput);
    value = value.replace(",", "");
    if (!isNaN(Number(value)) && this.checkValidNumber(value)) { //!this.decimal
      this.ngModelChange.emit(value);
    }
  }

  @HostListener("drop", ["$event"])
  onDrop(event: DragEvent) {
    event.preventDefault();
    let textData = event.dataTransfer.getData("text");
    textData = textData.trimLeft();
    textData = textData.trimRight();
    this.el.focus();
    let value = this.spliceSlice(this.el.value, this.el.selectionStart, this.el.selectionEnd - this.el.selectionStart, textData);
    value = value.replace(",", "");

    if (!isNaN(Number(value)) && this.checkValidNumber(value)) { //!this.decimal
      this.ngModelChange.emit(value);
    }
  }

  private checkValidNumber(value: string): boolean {
    let pIndex: number = this.getPointerIndex(value, this.decimalPointer);
    if (isNaN(Number(value))) {
      return false;
    } else if (pIndex > 0 && value.split(this.decimalPointer)[0].length > this.integerCount) {
      return false;
    } else if (pIndex > 0 && value.split(this.decimalPointer)[1].length > this.maxDecimals) {
      return false;
    } else if (pIndex < 0 && value.length > this.integerCount) {
      return false;
    } else if (this.maxValue != null && Number(value) > this.maxValue) {
      return false;
    } else if (this.minValue != null && Number(value) < this.minValue) {
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
Set character lengths for html numeric inputs. Unlike using regex pattern with html input type text this will validate user inputs on type..

----
### Features

- Set character lengths for html numeric inputs;
- Set maximum and minimum decimal points counts;
- Mask numbers with thousands seperators without changing the original value;
- Validations will be happening on user input;
- More features to add.;


`$ npm install numeric-formatter`

*** Required : Angular two way binding for the input***

####AppModule

```javascript
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NumericFormatterModule } from 'numeric-formatter';
 
 @NgModule({
  imports: [ FormsModule, NumericFormatterModule]
})
```
####HTML

```html
<input numericformatter [(ngModel)]="value" [maxNumLength]="10" 
			[minDecimals]="3" [maxDecimals]="4" [displaySeperator]="true"/>
```
                    
####Properties
                    

| Name  | Type | Default | Description |
| ------------- | ------------- |  ------------- |  ------------- |
| maxNumLength  | number  | 100  | Fix the character length that can be type (Including decimal seperator, excluding thousand seperator)
| minDecimals  | number  | 0 | Minimum decimal points for the input |
| maxDecimals  | number  | 100 | Maximum decimal points that can be typed |
| displaySeperator  | boolean  | false | Show thousand seperators for the input value (will not change the original value) |
| maxValue  | number  | null | Defines the maximum numeric value that can be typed |
| minValue  | number  | null | Defines the minimum numeric value that can be typed (will be default to minimum value on validation) |
| allowNegative  | boolean  | false | Negative numbers will be allowed to type |

-------------
Changelog
-------------

**1.2.4**
- Fixed an issue with decimal pipe is not being applied when value is zero;

**1.2.3**
- Fixed an issue with unable to overwrite text by selecting all when max length is reached;

**1.2.2**
- Fixed an issue with decimal pipe provider for angular version 7;

**1.2.1**
- Fixed an issue with not pasting numbers with new line at the end;

**1.2.0**
- Adding minValue property for minimum numeric value validation;

**1.1.1**
- Fixed an issue with negative numbers are allowed in allowNegative false state;

**1.1.0**
- Added support for negative numbers;

**1.0.7**
- Fixed an issue with module not found;

**1.0.6**
- Fixed an issue with not getting selected on tab focus;

**1.0.5**
- Adding maxValue property for maximum numeric value validation;

**1.0.4**
- Fixed an issue with exceeding character limit on long key press;
- Fixed an issue with enabled space key;

**1.0.3**
- Changed decimal points property name to max decimals;
- Fixed an issue with displaying bound values;

**1.0.2**
- Fixed an issue with exceeding character limit when decimal points property not defined;

**1.0.1**
- Added a input property to show/ hide thousand seperator;

**1.0.0**
- Initial release;
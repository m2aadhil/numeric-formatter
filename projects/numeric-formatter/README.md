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

-------------
Changelog
-------------

**1.0.3**
- Changed decimal points property name to max decimals;
- Fixed an issue with displaying bound values;

**1.0.2**
- Fixed an issue with exceeding character limit when decimal points property not defined;

**1.0.1**
- Added a input property to show/ hide thousand seperator;

**1.0.0**
- Initial release;
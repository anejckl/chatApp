import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskKey',
})
export class MaskKeyPipe implements PipeTransform {
  transform(value: string, visibleChars = 4): string {
    
    const firstPart = value.substring(0, visibleChars);
    const lastPart = value.substring(value.length - visibleChars);
    
    return `${firstPart}...${lastPart}`;
  }
}
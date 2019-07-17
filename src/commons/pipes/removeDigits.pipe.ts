import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeDigits'
})
export class RemoveDigitsPipe implements PipeTransform {

    transform(value: string, codeDecimal = '.'): string {
        try{
          const indexDecimal = value.indexOf(codeDecimal);
          return value.substring(0, indexDecimal);
        }catch (e){

        }        
    }
}
import { Pipe, PipeTransform, PLATFORM_ID } from '@angular/core';

@Pipe({
  name: 'customCurrency',
  standalone: true
})
export class CustomCurrencyPipe implements PipeTransform {

  transform(value:string, currencyCode: string, displaySymbol: boolean = true): string {

    var lang:string = ""

    if ( typeof localStorage !== 'undefined' ) {


      let lang = localStorage.getItem("lang")!;

      console.log("yes!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

      if (lang === "ar"){
        
        return displaySymbol ? `${value} جنيه مصري` : `${value}`;
      }else{
        
        return displaySymbol ? `${value} ${currencyCode} ` : `${value}`;
      }


    }else {
      return displaySymbol ? `${value} ${currencyCode} ` : `${value}`;
    }
    
  }

}

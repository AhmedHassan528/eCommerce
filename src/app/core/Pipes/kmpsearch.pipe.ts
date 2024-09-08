import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kMPSearch',
  standalone: true
})
export class KMPSearchPipe implements PipeTransform {

  transform(items: any[], searchTerm:string ): any[] {

    if (!items || !searchTerm) {
      return items;
    }

    const kmp = new KMPAlgorithm(searchTerm.toLowerCase());

    return items.filter(item => {
      const title = item.title?.toLowerCase() || '';
      return kmp.search(title);
    });
  }
}


class KMPAlgorithm {
  private lps: number[];

  constructor(private pattern: string) {
    this.lps = this.computeLPSArray();
  }

  private computeLPSArray(): number[] {
    const lps = new Array(this.pattern.length).fill(0);
    let length = 0;
    let i = 1;

    while (i < this.pattern.length) {
      if (this.pattern[i] === this.pattern[length]) {
        length++;
        lps[i] = length;
        i++;
      } else {
        if (length !== 0) {
          length = lps[length - 1];
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }
    return lps;
  }

  public search(text: string): boolean {
    let i = 0;
    let j = 0;

    while (i < text.length) {
      if (this.pattern[j] === text[i]) {
        i++;
        j++;
      }

      if (j === this.pattern.length) {
        return true;
      } else if (i < text.length && this.pattern[j] !== text[i]) {
        if (j !== 0) {
          j = this.lps[j - 1];
        } else {
          i++;
        }
      }
    }

    return false;
  }
}

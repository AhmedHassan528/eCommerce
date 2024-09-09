import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, RendererFactory2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { get } from 'http';
import { platform } from 'os';

@Injectable({
  providedIn: 'root'
})
export class MyTranslateService {
  private readonly _translateService = inject(TranslateService);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID)
private readonly _rendererFactory2 = inject(RendererFactory2).createRenderer(null , null);

  constructor() {

    if (isPlatformBrowser(this._PLATFORM_ID)) {
      // if there is no saved language, set the default language to English
      this._translateService.setDefaultLang('en');

      this.setLang()

    }


  }

  setLang(): void {
    if (typeof localStorage !== 'undefined' && isPlatformBrowser(this._PLATFORM_ID)) {

      let savedLang = localStorage.getItem('lang'!);

      if (savedLang !== null) {
        this._translateService.use(savedLang!);
      }

      if (savedLang === 'en') {

        this._rendererFactory2.setAttribute(document.documentElement, 'dir', 'ltr');
      } else {
        this._rendererFactory2.setAttribute(document.documentElement, 'dir', 'rtl');
      }
    }

  }


  changeLang(lang: string): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {

      localStorage.setItem('lang', lang);


      this.setLang()
    }
  }


  getLang(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('lang');
    }
    return null;
  }
}

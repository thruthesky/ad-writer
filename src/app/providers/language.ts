import { Injectable } from '@angular/core';
import { TEXT } from './../etc/text';

const LANGUAGE_KEY = 'language';

@Injectable()
export class LanguageService {

    constructor() { }
    
    /**
     * Returns web browser language.
     * @return 2 lettters of language code like 'en', 'ko'.
     */
    getBrowserLanguage() {
        const ln = navigator['languages'] && navigator['languages'][0] ||
            navigator['language'] ||
            navigator['userLanguage'];
        if (!ln) {
            return 'en';
        }
        if (typeof ln !== 'string') {
            return 'en';
        }
        return ln.substring(0, 2);
    }

    /**
     * Returns
     *      - user language ( that user has already chosen )
     *      - or browser language ( if no user language );
     */
    getLanguage(): string {
        const lc = localStorage.getItem(LANGUAGE_KEY);
        if (lc) {
            return lc;
        }
        else {
            return this.getBrowserLanguage();
        }
    }
    /**
     * Save user language on localStorage and sync to backend.
     * @param ln - user language like 'en', 'ko'
     */
    setLanguage(ln: string) {
        localStorage.setItem(LANGUAGE_KEY, ln);
    }

    /**
 *
 * @note default language is 'en'.
 * @param code
 * @param args
 */
    text(code, args?) {
        let ln;
        if (args && args['ln']) ln = args['ln'];
        else ln = this.getLanguage();

        if (TEXT[code] === void 0) return code; // no code?
        if (TEXT[code][ln] === void 0) { // no code for that language ?
            // try 'en' for default language.
            if (TEXT[code]['en'] === void 0) return code;
            else ln = 'en';
        }

        let str = TEXT[code][ln];

        if (args) {
            let json = false;
            if (typeof str === 'object') { str = JSON.stringify(str); json = true; }
            for (const i in args) {
                str = str.replace('#' + i, args[i]);
            }
            if (json) str = JSON.parse(str);
        }
        return str;
    }


}

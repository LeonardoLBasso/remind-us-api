'use strict'

import path from 'path';
import I18n from 'i18n-nodejs';

/**
 * @class LocaleService
 * @classdesc Classe responsável pela internacionalização das mensagens de retorno da API
 */
class LocaleService {
	/**
     * @param {String} named
     * @param {lang} [lang=pt]
     * @param {object} [params={}]
     * @return {String}
     */
	translate(named, lang = 'pt-BR', params = {}) {
		const translator = new I18n(lang, path.join(__dirname, 'json/locale.json'));
		return translator.__(named, params)
	}
}

export default new LocaleService();

'use strict'

import sendgrid from '@sendgrid/mail'

/**
 * @param {Object} args
 * @description Método para efetuar disparo de email 
 */
exports.send = async (data) => {
    console.log(data)
    // Carregando a chave de API
    sendgrid.setApiKey(env.get('SENDGRID_KEY'));

	return await sendgrid.send(data);
}
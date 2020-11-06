'use strict'

import AbstractController from './AbstractController';

/**
 * @class ReminderController
 * @classdesc Classe responsável pelas ações de alteração, inserção e manipulação de dados de lembretes
 * @extends {AbstractController}
 */
class ReminderController extends AbstractController {
	/**
      *Creates an instance of ReminderController.
     * @memberof ReminderController
     */
	constructor() {
		super('Reminder');
	}
}

export default new ReminderController();

'use strict'

import AbstractController from './AbstractController';

/**
 * @class CategoryController
 * @classdesc Classe responsável pelas ações de alteração, inserção e manipulação de dados de categorias
 * @extends {AbstractController}
 */
class CategoryController extends AbstractController {
	/**
     * Creates an instance of CategoryController.
     * @memberof CategoryController
     */
	constructor() {
		super('Category');
	}
}

export default new CategoryController();

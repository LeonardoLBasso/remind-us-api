'use strict'

import {Schema, model} from 'mongoose';
import Paginate from 'mongoose-paginate-v2';
import AutoPopulate from 'mongoose-autopopulate';
import SoftDelete from 'mongoose-delete';

import {timezone} from '../functions/timezone';

/**
 * @export
 * @class ModelConstructor
 */
export default class ModelConstructor {
	/**
	 * @param {String} entityName
	 * @param {Object} props
	 * @memberof ModelConstructor
	 */
	constructor(entityName, props) {
		this.entityName = entityName;
		this.customPlugins = [];
		this.customOperators = [];
		this.props = {
			...props,
			createdAt: {
				type: Date,
			},
			updatedAt: {
				type: Date,
			},
		};
	}

	/**
	 * @return {Schema}
	 * @memberof ModelConstructor
	 */
	init() {
		const schema = this.plugins(new Schema(this.props))

		// Definindo data e hora ao salvar
		schema.pre('save', function(next) {
			if (this.isNew) {
				this.createdAt = timezone()
			}
			this.updatedAt = timezone()
			next()
		})

		schema.set('toJSON', {
			transform: (doc, ret) => {
				// quando o mongoose for retornar ele
				delete ret.password
				return ret
			},
		})

		// Definindo métodos estáticos dos schemas
		this.staticsMethods(schema)

		return model(this.entityName, schema)
	}

	/**
	 * @param {Schema} schema
	 * @return {Schema}
	 * @memberof ModelConstructor
	 */
	plugins(schema) {
		schema.plugin(Paginate);
		schema.plugin(AutoPopulate);
		schema.plugin(SoftDelete, {deletedAt: true});

		// Carregando plugins importados pelo próprio usuário
		this.loadCustomPlugins()

		return schema
	}

	/**
	 * @param {Object} mongoosePlugin
	 * @description Adicionando a pilha de plugins um novo plugin importado pelo usuário
	 * @memberof ModelConstructor
	 */
	addPlugin(mongoosePlugin) {
		this.customPlugins.push(mongoosePlugin)
	}

	/**
	 * @description Método para carregar plugins importados pelo usuário
	 * @memberof ModelConstructor
	 */
	loadCustomPlugins() {
		// Adicionando plugins customizados do usuário ao schema
		for (const plugin of this.customPlugins) {
			schema.plugin(plugin)
		}
	}

	/**
	 * @param {String} operatorName
	 * @param {Function} operatorFunction
	 * @description Método para adicionar operadores estáticos
	 */
	addOperator(operatorName, operatorFunction) {
		this.customOperators.push({
			operatorName,
			operatorFunction,
		})
	}

	/**
	 * @description Método para carregar os operadores personalizados do schema
	 * @param {Schema} schema
	 */
	loadCustomOperators(schema) {
		// Adicionado operadores personalizados
		this.customOperators.forEach((currentOperator) => {
			schema.statics[currentOperator.operatorName] = currentOperator.operatorFunction
		})
	}

	/**
	 * @param {Schema} schema
	 * @desc Método para definir funções estáticas ao Schema
	 * @memberof ModelConstructor
	 */
	staticsMethods(schema) {
		schema.statics.findOrCreate = function findOrCreate(condition, data, cb) {
			const self = this
			self.findOne(condition, (err, result) => {
				if (!result) {
					self.create(data, (err, data) => cb(data, err))
				} else {
					cb(result, err)
				}
			})
		}

		// Chamando operadores personalizados
		this.loadCustomOperators(schema)
	}
}

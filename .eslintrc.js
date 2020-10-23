module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	extends: [
		'google',
		// "plugin:security/recommended"
	],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parserOptions: {
		ecmaVersion: 2019,
		sourceType: 'module',
	},
	plugins: ['security'],
	rules: {
		'semi': 0,
		'no-tabs': 0,
		'new-cap': 0,
        'no-invalid-this': 0,
        'max-len': 0,
		'secure/detect-non-literal-require': 0,
		'secure/detect-non-literal-fs-filename': 0,
		'prefer-promise-reject-errors': 0,
		'no-mixed-spaces-and-tabs': 0,
		'indent': ['error', 'tab',{SwitchCase: 1}],
		'array-element-newline': ['error', {'minItems': 3}],
		'no-multiple-empty-lines': ['error', {'max': 1}],
	},
}
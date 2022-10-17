/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description babel.config
 */
module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				'useBuiltIns': 'entry',
				'corejs': 3
			}
		],
		'@vue/cli-plugin-babel/preset'
	],
	plugins: ['@babel/plugin-transform-runtime'],
}

/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const assert = require('assert');

const extractChunks = require('./lib/extract-chunks');
const insertLinksIntoHtml = require('./lib/insert-links-into-html');

class AutoInjectPlugin {
	constructor(option) {
		let defalutOption = {
			//总自动注入
			allInJectchunks: [],
			//分别设置各自页面的注入，高于总的
			inJectchunksByOutputName: {

			},
			//暂未实现
			cdn: {
				css: [],
				js: []
			},
		}
		//console.log('AutoInjectPlugin constructor', option.inJectchunksByOutputName)
		option = Object.assign(defalutOption, option)
		this.option = option
		//console.log('AutoInjectPlugin constructor', option.inJectchunksByOutputName)
	}
	addLinks(compilation, htmlPluginData) {

		const extractedChunks = extractChunks({
			compilation,
			optionsInclude: Object.keys(htmlPluginData.assets.chunks),
		});
		//console.log('AutoInjectPlugin compilation',compilation)
		//console.log('AutoInjectPlugin extractedChunks',extractedChunks)
		//console.log('AutoInjectPlugin htmlPluginData', htmlPluginData)
		//console.log('AutoInjectPlugin htmlPluginData.outputName', htmlPluginData.outputName)
		let chunks = ''
		let outputName = ''
		if (htmlPluginData.assets && htmlPluginData.assets.chunks) {
			chunks = htmlPluginData.assets.chunks
			//console.log('AutoInjectPlugin htmlPluginData.assets.chunks', chunks)
		}
		if (htmlPluginData.outputName) {
			outputName = htmlPluginData.outputName
		}
		let inJectchunksByOutputName = ''
		if (this.option.inJectchunksByOutputName) {
			inJectchunksByOutputName = this.option.inJectchunksByOutputName[outputName]
		}
		//console.log('inJectchunksByOutputName', inJectchunksByOutputName)
		// Flatten the list of files.
		const allFiles = extractedChunks.reduce((accumulated, chunk) => {
			return accumulated.concat(chunk.files);
		}, []);
		const uniqueFiles = new Set(allFiles);
		const filteredFiles = [...uniqueFiles]

		const sortedFilteredFiles = filteredFiles.sort();

		const links = [];
		const publicPath = compilation.outputOptions.publicPath || '';
		//console.log('AutoInjectPlugin sortedFilteredFiles', sortedFilteredFiles);
		if (this.option.allInJectchunks && this.option.allInJectchunks.length > 0) {
			let allInJectchunks = this.option.allInJectchunks
			let length = allInJectchunks.length
			let item = undefined
			for (const file of sortedFilteredFiles) {
				let flag = false
				let isFind = false
				if (inJectchunksByOutputName) {
					for (let key in inJectchunksByOutputName) {
						if (file.indexOf(key) >= 0) {
							//console.log('inJectchunksByOutputName',outputName, file)
							isFind = true
							let js = true;
							let css = true;
							if (typeof inJectchunksByOutputName[key].js != 'undefined') {
								js = inJectchunksByOutputName[key].js
							}
							if (typeof inJectchunksByOutputName[key].css != 'undefined') {
								css = inJectchunksByOutputName[key].css
							}
							if (file.indexOf('.js') >= 0) {
								if (js) {
									flag = true
								}
							} else {
								if (css) {
									flag = true
								}
							}
							break
						}
					}

				}
				if (!isFind) {
					for (let i = 0; i < length; i++) {
						let item = allInJectchunks[i]
						if (!item) {
							continue
						}
						if (file.indexOf(item) >= 0) {
							//console.log('allInJectchunks',outputName, file)
							flag = true
						}
						if (flag) {
							break
						}

					}
				}

				if (!flag) {
					continue
				}
				//console.log(outputName, file)
				const href = `${publicPath}${file}`;
				links.push(href);
			}
		} else {
			for (const file of sortedFilteredFiles) {
				const href = `${publicPath}${file}`;
				links.push(href);
			}
		}
		//注入cdn
		if (this.option.cdn) {

			let cdn = this.option.cdn
			let length = undefined
			let item = undefined
			if (cdn.css) {
				//console.log('开始注入cdn css')
				let css = cdn.css
				length = css.length
				item = undefined
				for (let i = 0; i < length; i++) {
					item = css[i]
					if (!item) {
						continue
					}
					links.push(item);
				}
			}
			if (cdn.js) {
				//console.log('开始注入cdn js')
				let js = cdn.js
				length = js.length
				item = undefined
				for (let i = 0; i < length; i++) {
					item = js[i]
					if (!item) {
						continue
					}
					links.push(item);
				}
			}
		}
		htmlPluginData.html = insertLinksIntoHtml({
			links,
			html: htmlPluginData.html,
		});

		return htmlPluginData;
	}

	apply(compiler) {
		compiler.hooks.compilation.tap(
			this.constructor.name,
			compilation => {
				// This is set in html-webpack-plugin pre-v4.
				let hook = compilation.hooks.htmlWebpackPluginAfterHtmlProcessing;

				if (!hook) {
					const [HtmlWebpackPlugin] = compiler.options.plugins.filter(
						(plugin) => plugin.constructor.name === 'HtmlWebpackPlugin');
					assert(HtmlWebpackPlugin, 'Unable to find an instance of ' +
						'HtmlWebpackPlugin in the current compilation.');
					hook = HtmlWebpackPlugin.constructor.getHooks(compilation).beforeEmit;
				}

				hook.tapAsync(
					this.constructor.name,
					(htmlPluginData, callback) => {
						try {
							callback(null, this.addLinks(compilation, htmlPluginData));
						} catch (error) {
							callback(error);
						}
					}
				);
			}
		);
	}
}

module.exports = AutoInjectPlugin;

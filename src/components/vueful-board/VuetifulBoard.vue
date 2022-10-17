<template>
	<div class="vuetiful-board" style="margin-top: -5px;margin-left: -5px;">
		<grid-layout :layout.sync="gridInfos" :col-num="colNum" :row-height="rowHeight" :is-draggable="layoutEditable"
			:is-resizable="layoutEditable" :responsive="responsive" :breakpoints="breakpoints" :cols="cols"
			:margin="[5, 5]" @layout-ready="layoutReady = true">
			<grid-item v-for="(item, index) in gridInfos" :key="item.id" :x="item.x" :y="item.y" :w="item.w" :h="item.h"
				:i="item.i" :static="item.static" :id="myGrid+item.id">

				<div :id="myChart+item.id" :style="{width: width, height: height}"></div>
			</grid-item>
		</grid-layout>
	</div>
</template>

<script>
	import palette from './../../assets/palette.json';
	import {
		doEdit,
		ExecSql,
		QueryExec
	} from '@/api/table'
	import {
		mapActions,
		mapGetters
	} from 'vuex'

	export default {
		props: {
			theme: {
				type: [String, Array],
				required: false,
				default () {
					return undefined;
				},
			},
			monochrome: {
				type: Object,
				required: false,
				default () {
					return {
						enabled: false,
						color: '#255aee',
						shadeIntensity: 0.65,
					};
				},
			},
			darkMode: {
				type: Boolean,
				default: false,
			},
			colNum: {
				type: Number,
				required: true,
				default: 12,
			},
			rowHeight: {
				type: Number,
				required: true,
				default: 30,
			},
			layoutEditable: {
				type: Boolean,
				required: true,
				default: true,
			},
			responsive: {
				type: Boolean,
				required: false,
				default: false,
			},
			breakpoints: {
				type: Object,
				required: false,
				default () {
					return {
						lg: 1200,
						md: 996,
						sm: 768,
						xs: 480,
						xxs: 0,
					};
				},
			},
			cols: {
				type: Object,
				required: false,
				default () {
					return {
						lg: 12,
						md: 10,
						sm: 6,
						xs: 4,
						xxs: 2,
					};
				},
			},
			datasets: {
				type: Array,
				required: true,
				default: function() {
					return [{
						id: this.$uuid.v4(),
						chartInfo: {
							id: this.$uuid.v4(),
							series: [],
							options: {
								chart: {
									type: null,
								},
								colors: palette[0].colors,
								theme: {
									mode: 'light',
									monochrome: {
										enabled: false,
										shadeTo: 'light',
										shadeIntensity: 0.9,
									},
								},
							},
						},
						gridInfo: {
							id: this.$uuid.v4(),
							x: this.colNum,
							y: Math.round(this.colNum / 3),
							w: Math.round(this.colNum / 2),
							h: this.colNum,
							i: '',
							static: false,
						},
					}, ];
				},
			},
		},
		data() {
			return {
				gridInfos: [],
				palette,
				myChart: 'myChart',
				myGrid: 'myGrid',
				height: '415px',
				width: '742px',
				layoutReady: false,
				isFirstMount: true,
				darkModeColorOptions: {
					background: 'transparent',
					foreColor: '#fff',
				},
				lightModeColorOptions: {
					background: '#fff',
					foreColor: '#232323',
				},
				previousThemeColors: [],
			};
		},
		computed: {
			chartInfos: function() {
				if (!this.layoutReady) return [];

				document.documentElement.dataset.theme = this.isDarkMode();

				const chartInfos = this.datasets.map(item => item.chartInfo);

				return chartInfos.map(chartInfo => {
					const _chartInfo = {
						...chartInfo,
						id: this.$uuid.v4(),
						options: {
							...chartInfo.options,
							theme: {
								mode: this.isDarkMode(),
								monochrome: {
									...(chartInfo.options.theme?.monochrome || this.monochrome),
								},
							},
							chart: this.darkMode ?
								{
									...chartInfo.options.chart,
									...this.darkModeColorOptions
								} :
								{
									...this.lightModeColorOptions,
									...chartInfo.options.chart,
								},
						},
					};

					if (this.themeToUse) {
						_chartInfo.options.colors = this.themeToUse;
					}

					_chartInfo.options.chart = {
						..._chartInfo.options.chart,
						events: {
							mounted: (chartContext, config) => {
								this.$emit('mounted', chartContext, config);
							},
							updated: (chartContext, config) => {
								this.$emit('updated', chartContext, config);
							},
						},
					};

					return _chartInfo;
				});
			},
			themeToUse() {
				if (this.theme === null) return undefined;

				if (Array.isArray(this.theme)) {
					return this.theme;
				}

				if (this.theme === undefined) {
					return palette.find(_theme => _theme.name === 'classic')?.colors;
				}

				return palette.filter(theme => this.theme === theme.name)?. [0]?.colors;
			},
			...mapGetters({
				current_org: 'org/current_org',
			}),
		},
		watch: {
			datasets(newValue, oldValue) {
				// const oldColors = oldValue[0].chartInfo.options.colors;
				// this.savePreviousThemeColors(oldColors);
			},
			// darkMode() {
			//   this.darkMode
			//     ? this.setDarkMode(this.previousThemeColors)
			//     : this.setLightMode(this.previousThemeColors);
			// },
		},
		created() {
			// this.validateProps();
			this.bindGridInfos();
		},
		mounted() {
			// this.addUniqueId();
			this.drawLine();
		},
		methods: {
			async drawLine() {
				let index = setInterval(async () => {
					if (this.datasets.length > 0 && document.getElementById('myChart0') !== null) {
						clearInterval(index)
						// 基于准备好的dom，初始化echarts实例
						for (let i = 0; i < this.datasets.length; i++) {
							console.log(this.datasets)
							let sData = '[Q]' + this.datasets[i].chartInfo.sqlval + '{' + this.datasets[i]
								.chartInfo['0'] + '}|^SYS'
							const res = await QueryExec(sData)
							console.log(sData, res)
							let xdata = [],
								ydata = [],
								data1 = [],
								data2 = [],
								temparr=[],
								source=[]
							res.data.forEach((item, index) => {
								temparr=[]
								xdata.push(item.xAxis)
								ydata.push(item.yAxis)
								data1.push(item.data1)
								data2.push(item.data2)
								if(item.source1!==undefined){
									
									temparr.push(item.source1)
									temparr.push(item.source2)
									source.push(temparr)
									console.log(source)
								}
							})
							
							let myChart = this.$echarts.init(document.getElementById('myChart' + i
								.toString()))
							// 绘制图表 柱图
							if (this.datasets[i].chartInfo.charttype === '0') {
								myChart.setOption({
									title: {
										text: this.datasets[i].chartInfo.chartname
									},
									tooltip: this.datasets[i].chartInfo.tooltip,
									legend: this.datasets[i].chartInfo.legend,
									xAxis: {
										data: xdata
									},
									yAxis: this.datasets[i].chartInfo.yAxis,
									// yAxis: this.datasets[i].chartInfo.minInterval===undefined?{}:{minInterval:this.datasets[i].chartInfo.minInterval},
									series: [{
										name: this.datasets[i].chartInfo.barname,
										type: 'bar',
										data: ydata,
										// itemStyle: { 
										// 　　normal: { 
										// 　　　　color: function(params) { 
										// 　　　　　//首先定义一个数组 
										// 　　　　　var colorList = [ 
										// 　　　　　　'#C33531','#EFE42A','#64BD3D','#EE9201','#29AAE3', 
										// 　　　　　　'#B74AE5','#0AAF9F','#E89589' 
										// 　　　　　]; 
										// 　　　　　return colorList[params.dataIndex] 
										// 　　　　}, 
										// 　　　　　//以下为是否显示 
										// 　　　　
										// 　　}
										// },
										label:{
											show:true,
											position:'top'
										}
									}],
									dataZoom:[{
										type:'inside'
									}]
								});
							}
							//饼图
							else if (this.datasets[i].chartInfo.charttype === '1') {
								myChart.setOption({
									title: {
										text: this.datasets[i].chartInfo.chartname
									},
									tooltip: this.datasets[i].chartInfo.tooltip,
									legend: this.datasets[i].chartInfo.legend,
									color: this.datasets[i].chartInfo.color,
									// xAxis: {
									//     // data: xdata
									// },
									// yAxis: {},
									series: [{
										// name: 'Access From',
										type: 'pie',
										radius: ['40%', '70%'],
										avoidLabelOverlap: false,
										itemStyle: {
											borderRadius: 10,
											borderColor: '#fff',
											borderWidth: 2,
											
										},
										label: {
											show: false,
											position: 'center'
										},
										emphasis: {
											label: {
												show: true,
												fontSize: '40',
												fontWeight: 'bold'
											}
										},
										labelLine: {
											show: false
										},
										data: res.data
									}]
								});
							} else if (this.datasets[i].chartInfo.charttype === '2') {

								var emphasisStyle = {
									itemStyle: {
										shadowBlur: 10,
										shadowColor: 'rgba(0,0,0,0.3)'
									}
								};
								myChart.setOption({
									title: {
										text: this.datasets[i].chartInfo.chartname
									},
									tooltip: this.datasets[i].chartInfo.tooltip,
									legend: this.datasets[i].chartInfo.legend,
									toolbox: {
										feature: {
											magicType: {
												type: ['stack']
											},
											dataView: {}
										}
									},
									xAxis: {
										data: xdata,
										name: 'X Axis',
										axisLine: {
											onZero: true
										},
										splitLine: {
											show: false
										},
										splitArea: {
											show: false
										}
									},
									yAxis: {
										minInterval:1
									},
									dataZoom:[{
										type:'inside'
									}],
									grid: {
										bottom: 100
									},
									series: [{
											name: this.datasets[i].chartInfo.bar1name,
											type: 'bar',
											stack: this.datasets[i].chartInfo.bar1stack,
											emphasis: emphasisStyle,
											data: data1
										},
										{
											name: this.datasets[i].chartInfo.bar2name,
											type: 'bar',
											stack: this.datasets[i].chartInfo.bar2stack,
											emphasis: emphasisStyle,
											data: data2
										}
									]
								})

							}
							else if (this.datasets[i].chartInfo.charttype === '3'){
								myChart.setOption({
									title: {
										text: this.datasets[i].chartInfo.chartname
									},
									tooltip: this.datasets[i].chartInfo.tooltip,
									legend: this.datasets[i].chartInfo.legend,
									dataset:{
										source:source
									},
									xAxis: { type: 'category' },
									yAxis: this.datasets[i].chartInfo.yAxis,
									series: [{
										name: 'name',
										type: 'bar',
									}],
									dataZoom:[{
										type:'inside'
									}]
								})
							}
						}
					}
				}, 300)


			},
			isType(element) {
				return Object.prototype.toString
					.call(element)
					.slice(8, -1)
					.toLowerCase();
			},
			validateProps() {
				for (const data of this.datasets) {
					const {
						chartInfo,
						gridInfo
					} = data || {};
					const {
						series,
						options
					} = chartInfo || {};
					const {
						chart
					} = options || {};

					// TODO: 에러 메시지의 에러 항목 안내를 자동화 (i.e. The type of A prop must be B.)
					if (!(this.isType(data) === 'object')) {
						return console.error(
							'[vuetiful-board warn]: Invalid datasets prop: Please check the type or structure of datasets prop. The type of element in datasets must be an object.',
						);
					}

					if (
						!(this.isType(chartInfo) === 'object') ||
						!(this.isType(options) === 'object') ||
						!(this.isType(chart) === 'object') ||
						!(this.isType(gridInfo) === 'object')
					) {
						return console.error(
							'[vuetiful-board warn]: Invalid datasets prop: Please check the type or structure of datasets prop. The type of prop, such as chartInfo, chartInfo.options, chartInfo.options.chart, gridInfo, must be an object.',
						);
					}

					if (!(this.isType(series) === 'array')) {
						return console.error(
							'[vuetiful-board warn] Invalid prop: Please check the type or structure of chartInfo.series prop. The type of prop must be an array.',
						);
					}

					if (
						!(!chart.type || this.isType(chart.type) === 'string') ||
						!(this.isType(gridInfo.i) === 'string')
					) {
						return console.error(
							'[vuetiful-board warn] Invalid prop: Please check the type or structure of chartInfo.options.chart.type and gridInfo.i prop. The type of prop must be a string.',
						);
					}

					if (
						!(this.isType(gridInfo.x) === 'number') ||
						!(this.isType(gridInfo.y) === 'number') ||
						!(this.isType(gridInfo.w) === 'number') ||
						!(this.isType(gridInfo.h) === 'number')
					) {
						return console.error(
							'[vuetiful-board warn] Invalid prop: Please check the type or structure of gridInfo.x, gridInfo.y, gridInfo.w, gridInfo.h prop. The type of prop must be a number.',
						);
					}

					if (!(this.isType(gridInfo.static) === 'boolean')) {
						return console.error(
							'[vuetiful-board warn] Invalid prop: Please check the type or structure of gridInfo.static prop. The type of prop must be a boolean.',
						);
					}
				}
			},
			bindGridInfos() {
				this.gridInfos = this.datasets.map(item => item.gridInfo);
			},
			addUniqueId() {
				return this.datasets.forEach(item => {
					item.id = item.id ?? this.$uuid.v4();
					item.chartInfo.id = item.chartInfo.id ?? this.$uuid.v4();
					item.gridInfo.id = item.gridInfo.id ?? this.$uuid.v4();

					return item;
				});
			},
			isDarkMode() {
				return this.darkMode ? 'dark' : 'light';
			},
			savePreviousThemeColors(oldColors) {
				return (this.previousThemeColors = oldColors);
			},
			setDarkMode(oldColors) {
				// TODO: 기존에 존재하는 옵션을 바탕으로 (살린 채로) 테마 관련 옵션을 추가해주어야 하는 로직 수정 필요

				const currentThemeOptions = {
					mode: this.isDarkMode(),
					monochrome: {
						...this.monochrome
					},
				};

				this.datasets.forEach(item => {
					item.chartInfo.options.colors = oldColors;
					item.chartInfo.options.theme = currentThemeOptions;
					item.chartInfo.options.chart = {
						...item.chartInfo.options.chart,
						...this.darkModeColorOptions,
					};

					return item;
				});

				return this.addUniqueId();
			},
			setLightMode(oldColors) {
				// TODO: 기존에 존재하는 옵션을 바탕으로 (살린 채로) 테마 관련 옵션을 추가해주어야 하는 로직 수정 필요

				const currentThemeOptions = {
					mode: this.isDarkMode(),
					monochrome: {
						...this.monochrome
					},
				};

				this.datasets.forEach(item => {
					item.chartInfo.options.colors = oldColors;
					item.chartInfo.options.theme = currentThemeOptions;
					item.chartInfo.options.chart = {
						...item.chartInfo.options.chart,
						...this.lightModeColorOptions,
					};

					return item;
				});

				return this.addUniqueId();
			},
		},
	};
</script>

<style lang="scss">
	.vue-grid-item {
		padding: 20px;
		touch-action: none;
		background-color: #ffffff;

		&:not(.vue-grid-placeholder) {
			border-radius: 5px;
			box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
			border: 1px solid #dbe0e6;
		}

		@media screen and (max-width: 768px) {
			// 모바일 환경을 고려한 설정
			padding: 5px;
		}
	}

	.apexcharts-svg {
		border-radius: 13px;
	}
</style>

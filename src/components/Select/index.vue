<template>
	<div class="select-tree-template">
		<el-select v-model="selectKey" :clearable="clearable" :collapse-tags="selectType == 'multiple'" :multiple="selectType == 'multiple'"
		 class="vab-tree-select" value-key="id" @remove-tag="removeTag" @change="change($event)">
			<el-option v-for="(item,index) in selectData" :key="item.value" :label="item.label" :value="item.value">

			</el-option>
		</el-select>
	</div>
</template>

<script>
	export default {
		name: 'SelectTreeTemplate',
		props: {
			value: {
				type: Object,
				default () {
					return {
						title: '',
						desc: '',
						type: '',
						img_url: ''
					}
				}
			},
			sType: {
				type: String,
				default: () => {
					return '0'
				},
			},
			sSqlCode: {
				type: String,
				default: () => {
					return '-1'
				},
			},
			oList: {
				type: Array,
				default: () => {
					return []
				},
			},
			field: {
				type: Object,
				default: () => {
					return {}
				},
			},
			sData: {
				type: String,
				default: () => {
					return ''
				},
			},
			/* 单选/多选 */
			selectType: {
				type: String,
				default: () => {
					return 'single'
				},
			},
			/* 初始选中值key */
			selectedKey: {
				type: String,
				default: () => {
					return ''
				},
			},
			/* 初始选中值name */
			selectedValue: {
				type: String,
				default: () => {
					return ''
				},
			},
			/* 可清空选项 */
			clearable: {
				type: Boolean,
				default: () => {
					return true
				},
			},
		},
		data() {
			return {
				defaultProps: {
					children: 'children',
					label: 'name',
				},

				selectValue: this.selectType == 'multiple' ?
					this.selectedValue.split(',') : this.selectedValue, //下拉框选中值label
				selectKey: this.selectType == 'multiple' ?
					this.selectedKey.split(',') : this.selectedKey, //下拉框选中值value
				selectData: [],
				rules: {

				}
			}
		},
		mounted() {
			const that = this
			that.GetData()
		},
		methods: {
			async GetData() {
				try {
					let that = this
					let sData = '';
					console.log(that.sType);
					switch (Number(that.sType)) {
						case 0:
							sData = that.sData;
							break
						case 1:
							sData = that.sql_helper.splicing_fob(1, that.sSqlCode, that.oList, that.field).sql;
							break
						default:
							sData = that.sData;
							break
					}
					if (!sData) {
						return [];
					}
					const {
						data
					} = await that.QueryExec_fobEx(sData);
					console.log(data);
					this.selectData = data
				} catch (e) {
					console.log(e);
					return []
				}

			},
			change(event) {

			},
			// 初始化树的值
			initTree() {

			},
			// 清除选中
			clearHandle() {

			},
			/* 清空选中样式 */
			clearSelected() {

			},
			// select多选时移除某项操作
			removeTag(val) {
				//this.$refs.treeOption.setCheckedKeys([])
			}

		},
	}
</script>

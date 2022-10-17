<template>
	<div>

		<el-alert title="提示" description="选择标准规范前请确认该参数是否已经绑定对应的标准规范" type="info" :closable="false" center show-icon>
		</el-alert>
		<el-cascader v-model="cascaderValue" :options="options" :props="props" @change="handleChange"
			style="width: 100%" clearable filterable>
		</el-cascader>
	</div>

</template>

<script>
	import {
		TreeDataDealExGetData,
		TreeDataDealEx,
		TreeDataSecondary
	} from '@/global/tree_deal'
	import {
		mapGetters
	} from 'vuex'
	import {
		format_fob,
		pickerOptions,
		getToday,
		dateFormat,
		getdayEx
	} from '@/utils/dateHelp'
	import {
		GetGroupData,
		GetGroupDataEx,
		GetGroupDataCustomEx
	} from '@/utils/htmlDataGroup'
	import {
		isNumEx,
		isTel,
		isPhone
	} from '@/utils/validate'
	export default {
		name: 'paramStandardForm',
		components: {

		},
		model: {
			prop: 'value',
			event: 'on-change'
		},
		props: {
			//.sync同步
			value: {
				type: Array,
				default: function() {
					return []
				}
			},
			param_id: {
				type: String,
				default: ''
			},
			isMultiple: {
				type: Boolean,
				default: false
			},
			AddOrEdit: {
				type: String,
				default: 'add'
			}
		},
		computed: {
			...mapGetters({
				org_id: 'user/org_id',
				current_org_id: 'org/current_org',
				person_id: 'user/person_id',
				username: 'user/username'
			}),
		},
		mounted() {

		},
		watch: {
			//参数主键发生变化重新加载级联数据
			param_id(newVal, oldVal) {
				this.LoadData(newVal)
			},
			isMultiple(newVal, oldVal) {
				this.UpdateMultiple(newVal)
			},
			AddOrEdit(newVal, oldVal) {
				this.AddOrEditIsUpdate(newVal)
			},
			value(newVal, oldVal) {
				if (this.cascaderValue != newVal) {
					this.UpdateCascaderData(newVal)
				}

			}
		},
		data() {
			let that = this
			return {
				options: [],
				props: {
					multiple: false,
					checkStrictly: true
				},
				cascaderValue: []
			}
		},
		created() {
			this.init()
		},
		methods: {
			async init() {
				this.AddOrEditIsUpdate()
			},
			getDealedData() {
				let multiple = this.props.multiple
				let tpl_single_set = new Set()
				let tpl_hasChildren_set = new Set();
				let tpl_hasChildren_list = [];
				let std_list = []
				let data = this.cascaderValue
				let length = data.length

				if (multiple) {
					for (let i = 0; i < length; i++) {
						let item = data[i]
						let lenght2 = item.length
						for (let j = 0; j < lenght2; j++) {
							if (j == 0) {
								if (lenght2 == 1) {
									tpl_single_set.add(item[j])
								} else {

									tpl_hasChildren_set.add(item[j])
									tpl_hasChildren_list.push(item[j])
								}
							} else {
								let std = item[j].split('-')
								if (std.length < 2) {} else {
									std_list.push(std[1])
								}
							}

						}
					}
				} else {
					for (let i = 0; i < length; i++) {
						let item = data[i]
						if (i == 0) {
							if (length == 1) {
								tpl_single_set.add(item)
							} else {
								tpl_hasChildren_set.add(item)
								tpl_hasChildren_list.push(item)
							}
						} else {
							let std = item.split('-')
							if (std.length < 2) {} else {
								std_list.push(std[1])
							}
						}
					}
				}
				let temp_list = Array.from(tpl_single_set)
				length = temp_list.length
				for (let i = 0; i < length; i++) {
					let item = temp_list[i]
					if (!tpl_hasChildren_set.has(item)) {
						tpl_hasChildren_list.push(item)
						tpl_hasChildren_set.add(item)
					}
				}
				let aReturn = {
					tpl_id: {

					},
					std_id: {

					}
				}
				if (tpl_hasChildren_list.length == 0) {
					aReturn.tpl_id.value = ''
				} else if (tpl_hasChildren_list.length == 1) {
					aReturn.tpl_id.value = tpl_hasChildren_list[0]
				} else {
					aReturn.tpl_id.value = tpl_hasChildren_list.join(',')
				}
				if (std_list.length == 0) {
					aReturn.std_id.value = ''
				} else if (std_list.length == 1) {
					aReturn.std_id.value = std_list[0]
				} else {
					aReturn.std_id.value = std_list.join(',')
				}
				return aReturn
			},
			AddOrEditIsUpdate(AddOrEdit) {
				if (!AddOrEdit) {
					AddOrEdit = this.AddOrEdit
				}
				switch (AddOrEdit) {
					case 'add':
						this.props.multiple = true
						this.$emit('update:isMultiple', true);
						break
					case 'edit':
						this.props.multiple = false
						this.$emit('update:isMultiple', false);
						break
					case 'manual':
					default:
						this.UpdateMultiple()
						break
				}
			},
			UpdateMultiple(multiple) {
				if (typeof multiple == 'undefined') {
					multiple = this.isMultiple
				}
				this.props.multiple = multiple
			},
			UpdateCascaderData(cascaderValue) {
				if (!cascaderValue) {
					cascaderValue = this.value
				}
				this.$set(this, 'cascaderValue', cascaderValue)
			},
			handleChange(value) {
				this.UpdateValue(value)
			},
			UpdateValue(value) {
				if (!value) {
					value = this.cascaderValue
				}
				console.log(value)
				console.log(this.getDealedData())
				this.$emit('on-change', value);
			},
			async LoadData(param_id) {
				if (!param_id) {
					param_id = this.param_id
				}
				let that = this
				let list = [{
					field: "param_id",
					type: 3,
					level: 1
				}]
				let form = {
					param_id: param_id,
				}
				const data = await TreeDataDealExGetData(432, list, form, 0, 'value', 'parent_id')

				this.options = this.deleteEmptyChildren(data)
			},
			deleteEmptyChildren(node, ndeep) {
				let that = this
				if (!ndeep) {
					ndeep = 0
				}
				if (ndeep > 1000) {
					return node
				}
				let length = node.length
				let item = {}
				for (let i = 0; i < length; i++) {
					item = node[i]
					if (!item.children) {
						continue
					}
					if (item.children.length == 0) {
						delete item.children
						continue
					}
					item.children = that.deleteEmptyChildren(item.children, ndeep + 1, )
				}
				return node
			}
		},
	}
</script>

<style>

</style>

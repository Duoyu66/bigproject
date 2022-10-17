<template>
	<div class="personelDivisionForm">
		<el-form ref="form" :model="formData2" :rules="rules" v-loading="loading" :element-loading-text="loadingText">
			<el-row class="" style="margin-top: 5px">
				<el-col :span="span">
					<el-form-item label="参数" :label-width="formLabelWidth" prop="paramIds">
						<el-select v-model="formData2.paramIds" style="width: 100%" :multiple="true" clearable
							filterable remote :remote-method="stdIdremoteMethod">
							<el-option v-for="data in selectData.param_id" :key="data.id" :label="data.label"
								:value="data.id">
								<el-popover v-if="data.label.length >= 30" placement="top-start" width="400"
									trigger="hover">
									<p>{{ data.label }}</p>
									<span slot="reference">{{ data.label.slice(0,27) + '...' }}</span>
								</el-popover>
								<span v-else>{{ data.label }}</span>
								<!-- <span
									style="float: left">{{ data.label.length>10?data.label.substring(0,10)+'...': data.label}}</span> -->
							</el-option>
						</el-select>
						<!-- <treeTransfer :title="title" :from_data='transferData' :to_data='formData2.toData'
							:defaultProps="{label:'label'}" @add-btn='add' @remove-btn='remove' :mode='mode'
							height="31.25rem" filter openAll>
						</treeTransfer> -->
					</el-form-item>
				</el-col>
				<el-col :span="span">
					<el-form-item label="生效日期" :label-width="formLabelWidth" prop="effective_date">
						<el-date-picker v-model="formData2.effective_date" align="left" type="date"
							:placeholder="isReadOnly('选择日期')" placeholder="选择日期" :picker-options="pickerOptions"
							style="width: 100%" :format='dateFormat' :value-format="dateFormat" :readonly="readonly">
						</el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>


</template>

<script>
	import {
		GetGroupData,
		GetGroupDataEx,
		GetGroupDataCustomEx
	} from '@/utils/htmlDataGroup'
	import {
		format_fob,
		pickerOptionsrange,
		getToday,
		dateFormat,
	} from '@/utils/dateHelp'
	import {
		TreeDataDealExGetData
	} from '@/global/tree_deal'

	import treeTransfer from 'el-tree-transfer' // 引入

	export default {
		model: {
			prop: 'formData',
			event: 'on-change'
		},
		props: {
			//.sync同步
			formData: {
				type: Object,
				default: function() {
					return {}
				}
			},
			type: {
				type: Number,
				default: 0 //0 正常表单 1 详情表单
			}
		},
		watch: {
			formData(newVal, oldVal) {
				if (newVal) {
					this.updataFrom(newVal)
				}
			},
		},
		data() {
			return {
				selectData: {
					param_id: []
				},

				pickerOptions: pickerOptionsrange(),
				dateFormat: dateFormat(),
				formLabelWidth: '120px',
				readonly: false,
				span: 24,
				title: ['未分配的试验参数', '所选参数'],
				mode: "transfer",
				//查询数据的数据
				loading: false,
				loadingText: '提交表单中....',
				form: {
					person_id: -1,
					tpl: '',
					label: '',
					parent_id: '',
				},
				//提交的表单
				formData2: {
					paramIds: [],
					effective_date: getToday(),
					toData: []
				},
				rules: {
					effective_date: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择日期'
					}],
					paramIds: [{
						required: true,
						trigger: ["blur", "change"],
						message: '请选择所需进行的试验参数'
					}]
				},
				//* 注意transferData数据格式，必须完全一样，如果不一样，需要进行对应的更改*
				transferData: [],

			}
		},
		created() {
			this.init()
			//this.loadData()
		},
		methods: {
			stdIdremoteMethod(query) {
				console.log('stdIdremoteMethod', query)
				this.GetParamId(query)
			},
			async GetParamId(searchKey) {
				let person_id = this.form.person_id

				let list = [{
					field: "person_id",
					type: 3,
					level: 1
				}, {
					field: "searchKey",
					type: 2,
					level: 4
				}];
				let form = {
					person_id: person_id,
					searchKey: searchKey
				}
				let customList = [{
					data: 'param_id',
					sqlcode: 710,
					list: list,
					form: form
				}]
				await GetGroupDataCustomEx(this, customList);
				console.log(new Date(), this.selectData)
			},


			init() {
				this.formdefalut = JSON.parse(JSON.stringify(this.form))
				this.formData2defalut = JSON.parse(JSON.stringify(this.formData2))
				if (this.formData) {
					this.form = Object.assign(this.form, this.formData)
				}
				this.GetParamId()
			},
			isReadOnly(text) {
				if (this.readonly) {
					return ''
				}
				return text
			},
			// 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList
			changeMode() {
				if (this.mode == "transfer") {
					this.mode = "addressList";
				} else {
					this.mode = "transfer";
				}
			},
			// 监听穿梭框组件添加
			add(fromData, toData, obj) {
				// 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
				// 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
				// console.log("fromData:", fromData);
				// console.log("toData:", toData);
				// console.log("obj:", obj);
			},
			// 监听穿梭框组件移除
			remove(fromData, toData, obj) {
				// 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
				// 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
				// console.log("fromData:", fromData);
				// console.log("toData:", toData);
				// console.log("obj:", obj);
			},
			deleteLeaf(node) {
				//删除叶子节点不是参数的节点
				function findLeaf(node, deep) {
					if (!deep) {
						deep = 0
					}
					if (deep > 500) {
						return []
					}
					const length = node.length
					let item = {}
					let leafList = [];
					for (let i = 0; i < length; i++) {
						item = node[i]
						if (item.children && item.children.length > 0) {
							const list = findLeaf(item.children, ++deep)
							if (list && list.length > 0) {
								item.children = list
								leafList.push(item)
							} else if (item.type === '2') {
								leafList.push(item)
							}
						} else if (item.type === '2') {
							leafList.push(item)
						}
					}
					return leafList
				}
				if (Array.isArray(node)) {
					return findLeaf(node)
				} else {
					return findLeaf([node])
				}
			},
			getLeaf(node) {
				function findLeaf(node, deep) {
					if (!deep) {
						deep = 0
					}
					if (deep > 500) {
						return []
					}
					let length = node.length
					let item = {}
					let leafList = [];
					while (--length > -1) {
						item = node[length]
						console.log(item)
						if (item.children && item.children.length > 0) {
							console.log(item.label, 'has children')
							const list = findLeaf(item.children, +deep)
							if (list && list.length > 0) {
								leafList.push.apply(leafList, list)
							}
						} else {
							console.log(item.label)
							leafList.push(item)
						}
					}
					return leafList
				}

				//IE9+、 Firefox 4+、Safari 5+、Opera 10.5+和Chrome都实现了这个方法。但是在IE8之前的版本是不支持的
				if (Array.isArray(node)) {
					let leafList = findLeaf(node)
					return leafList
				} else {
					let leafList = findLeaf([node])
					return leafList
				}
			},
			updataFrom(newVal) {
				this.formData2 = JSON.parse(JSON.stringify(this.formData2defalut))
				this.form = JSON.parse(JSON.stringify(this.formdefalut))
				this.form = Object.assign(this.form, newVal)
				//this.loadData()
			},
			close() {
				this.formData2 = JSON.parse(JSON.stringify(this.formData2defalut))
				this.form = JSON.parse(JSON.stringify(this.formdefalut))
				this.transferData = []
				this.toData = []
			},
			async loadData() {
				const that = this
				let form = JSON.parse(JSON.stringify(that.form))
				let list = [{
						field: 'parent_id',
						type: 3,
						level: 1,
					},
					{
						field: 'tpl',
						type: 3,
						level: 2,
					},
					{
						field: 'label',
						type: 3,
						level: 3,
					},
					{
						field: 'person_id',
						type: 3,
						level: 4,
					},
				]
				const data = await TreeDataDealExGetData(145, list, form, '0-0', 'id', 'pid')
				console.log(data)
				if (data && data.length > 0) {
					for (let i = 0; i < data.length; i++) {
						data[i].pid = 0
					}
					that.transferData = that.deleteLeaf(data)
					if (that.transferData.length == 0) {
						that.$baseMessage('无可添加数据', 'error')
					}
				} else {
					that.$baseMessage('无可添加数据', 'error')
				}

			},
			save(callback) {
				let that = this
				that.$refs['form'].validate((valid) => {
					if (valid) {
						that.$baseConfirm('确定提交？', null, async () => {
							that.loading = true
							let object_list = []
							let param_list = []
							let item = {}
							let temp = []
							let length = that.formData2.paramIds.length
							console.log(that.formData2.paramIds)
							while (--length > -1) {
								item = that.formData2.paramIds[length];
								console.log(item)
								temp = item.split('-')
								if (temp.length < 2) {
									continue
								}
								param_list.push(temp[0])
								object_list.push(temp[1])
							}
							if (object_list.length == 0) {
								that.$baseMessage('无参数需要提交', 'error')
								return false
							}
							let data = JSON.parse(JSON.stringify(that.formData2));
							data.person_id = that.form.person_id
							let list = [{
									field: "person_id",
									level: 1
								},
								{
									field: "object_list",
									level: 2
								},
								{
									field: "param_list",
									level: 3
								},
								{
									field: "effective_date",
									level: 4
								}
							]
							let sqlcode = 148;
							let msg = '添加'
							if (object_list.length >= 2) {
								data.object_list = object_list.join(',')
								data.param_list = param_list.join(',')
							} else {
								data.object_list = object_list[0]
								data.param_list = param_list[0]
							}
							const {
								code,
								influence
							} = await that.insert_fob(list, data, sqlcode)
							that.loading = false
							if (code != 200) {
								that.$baseMessage(msg + '失败', 'error')
								return false
							}
							if (typeof influence == 'number' && influence > 0) {
								that.$baseMessage(msg + '成功', 'success')
								that.close()
								callback(true)
								return true
							} else if (typeof influence == 'number') {
								that.$baseMessage(msg + '失败', 'error')
								return false
							} else if (typeof influence == 'string') {
								that.$baseMessage(influence, 'error')
								return false
							}
						})

					} else {
						return false
					}
				})
			}
		},

		components: {
			treeTransfer
		},
	}
</script>


<style>
	.transfer-title {
		margin-top: 0px;
		margin-bottom: 0px;
	}

	
</style>

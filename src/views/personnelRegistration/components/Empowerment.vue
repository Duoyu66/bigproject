<!--
 * @Author: Mortar
 * @Date: 2021-03-03 14:19:18
 * @LastEditors: Mortar
 * @LastEditTime: 2021-03-05 20:21:29
 * @Description: 
 * @FilePath: \母体实验室\src\views\personnelRegistration\components\Empowerment.vue
-->
<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" :destroy-on-close="destroy" @close="close" top="5vh">
		<div style="width:100%">
			<div style="width:100%">
				<div style="float: left;">
					<el-button type="primary" plain @click="switchStrictly">
						上下级权限选择联动{{ this.strictly?'关闭':'启用' }}
					</el-button>
				</div>
				<div style="float: right;">
					<el-button type="primary" plain @click="save">保存</el-button>
				</div>
			</div>
			<div style="max-height: calc(100vh - 260px); overflow-y: auto;width: 100%;">
				<el-tree ref="tree" v-loading="loading" :props="props" :data="treeData" show-checkbox
					node-key="permission_id" :check-strictly="strictly" accordion
					:default-checked-keys="defaultCheckedKeys" @check="handleChoise" :render-content="renderContent">
				</el-tree>
			</div>
		</div>



	</el-dialog>
</template>

<script>
	import {
		TreeDataDealExGetData
	} from '@/global/tree_deal'
	import {
		contact,
		deleteFromList
	} from '@/global/number'
	export default {
		data() {
			return {
				span: 12,
				span2: 24,
				loading: false,
				title: '人员赋权',
				dialogFormVisible: false,
				strictly: true,
				destroy: true,
				props: {
					label: 'name',
					children: 'children',
					isLeaf: 'leaf',
				},
				person: {
					person_id: -1,
				},
				expandedNodes: [],
				meaningExpandedNum: 0,
				defaultExpandedNodes: [],
				defaultCheckedKeys: [],
				treeData: [],
			}
		},
		methods: {
			close() {
				//this.$refs['form'].resetFields()
				//this.form = this.$options.data().form
				this.dialogFormVisible = false
				//this.$emit('fetch-data')
			},
			nodeClick(data, node, node_) {
				console.log('node', data, node, node_)
			},
			checkChange(data, checked, indeterminate) {
				console.log('checkChange', data, checked, indeterminate)
			},
			check(data, tree) {
				console.log('check', data, tree)
			},
			//切换严格模式
			switchStrictly() {
				this.strictly = !this.strictly
			},
			//获取选中值
			getCheckedKeys() {
				return this.$refs.tree.getCheckedKeys()
			},
			getHalfCheckedNodes() {
				return this.$refs.tree.getHalfCheckedNodes()
			},
			//设置选中值
			setCheckedKeys(array) {
				this.$refs.tree.setCheckedKeys(array)
			},
			setDefaultCheckedKeys(array) {
				this.defaultCheckedKeys = array
			},
			async save() {
				//this.switchStrictly();
				const that = this
				const person_id = this.person.person_id
				const check = that.getCheckedKeys()
				const checkHalf = that.getHalfCheckedNodes();

				
				let str = ''
				let msg = '人员赋权'
				// if (check.length == 0) {
				// 	that.close()
				// 	that.$baseMessage(msg + '成功', 'success')
				// 	return
				// }
				this.londing();
				let idSet = new Set();
				if (check.length > 1) {
					for (let i = 0; i < check.length; i++) {
						idSet.add(check[i]);
					}
					//str = check.join(',')
				} else if (check.length == 0) {
					idSet.add(check[0]);
				} else {
					//str = '';
				}
				if (checkHalf.length > 0) {
					for (let i = 0; i < checkHalf.length; i++) {
						idSet.add(checkHalf[i].permission_id);
					}
					//str = str + ',' + checkHalf.join(',')
				}
				str = Array.from(idSet).join(',');
				const list = [{
						field: 'permisson_id',
						type: 3,
						level: 1,
					},
					{
						field: 'person_id',
						type: 3,
						level: 2,
					},
				]
				const filed = {
					permisson_id: str,
					person_id: person_id,
				}
				const {
					code,
					influence
				} = await this.update_fob(list, filed, 57)

				this.londing()
				if (code != 200) {
					that.$baseMessage(msg + '失败', 'error')
					return false
				}
				if (influence > 0) {
					that.$baseMessage(msg + '成功,刷新后生效', 'success');

					that.close()
				} else {
					that.$baseMessage(msg + '失败', 'error')
				}

			},
			//获取已经赋值的权限
			async handleGetRight() {
				const that = this
				const person_id = that.person.person_id
				const list = [{
					field: 'person_id',
					type: 3,
					level: 2,
				}, ]
				const {
					data
				} = await that.QueryExec_fob(56, list, {
					person_id: person_id,
				})
				//将json中的权限id转为数组
				const arrnew = data.map((item, index) => {
					return item.permission_id
				})
				that.setDefaultCheckedKeys(arrnew)
			},
			close() {
				let that = this
				//that.$refs['form'].resetFields()
				that.person = {
					person_id: -1,
				};
				that.expandedNodes = [];
				that.meaningExpandedNum = 0;
				that.defaultExpandedNodes = [];
				that.defaultCheckedKeys = [];
				that.treeData = [];
				//that.$emit('fetch-data')
				//that.form = that.$options.data().form
				that.dialogFormVisible = false
			},
			//目前使用 设置选中节点
			handleChoise(node, treeStatus) {
				if (!this.strictly) {
					return
				}
				let that = this
				that.londing()
				try {
					const permission_id = node.permission_id
					const checkedKeys = treeStatus.checkedKeys
					//当前节点是否为选中 并且启用严格模式
					if (checkedKeys.indexOf(permission_id) < 0) {
						if (!that.strictly) {
							return [permission_id]
						}
						that.handleDiableChoise(node, treeStatus)
						that.londing()
						return [permission_id]
					}
					//处理要选中的节点
					function deal(array, permission_id, deep) {
						if (!deep) {
							deep = 0
						}
						//避免递归深度超过限制
						if (deep > 500) {
							return []
						}
						let length = array.length
						for (let i = 0; i < length; i++) {
							let item = array[i]
							if (item.permission_id == permission_id) {
								return [item.permission_id]
							}
							let children = []
							if (item.hasOwnProperty('children') && item.children.length > 0) {
								children = deal(item.children, permission_id, ++deep)
							}
							if (
								children.length > 0 &&
								checkedKeys.indexOf(item.permission_id) < 0
							) {
								children.push(item.permission_id)
								return children
							} else if (children.length > 0) {
								return children
							}

						}
						return []
					}
					//获取需要选中的节点
					let list = deal(that.treeData, permission_id)
					//获取选中的节点
					let checkedList = that.getCheckedKeys()
					//合并数组
					list = contact(list, checkedList, true)
					//设置选中节点
					that.setCheckedKeys(list)
					that.londing()
					// let str = ''
					// if (list.length > 0) {
					//   if (list.length > 1) {
					//     str = "'" + list.join("','") + "'"
					//   } else {
					//     str = list[0]
					//   }
					// }
				} catch (e) {
					console.log(e)
					that.londing()
				}
			},
			//目前使用 取消选择
			handleDiableChoise(node, treeStatus) {
				const permission_id = node.permission_id
				const checkedKeys = treeStatus.checkedKeys
				const that = this
				//子节点中主键数组和当前主键
				let permission_list = []
				//取消子节点的选中
				try {
					//查找当前节点所在位置
					function find(array, permission_id, deep) {
						if (!deep) {
							deep = 0
						}
						//避免递归深度超过限制
						if (deep > 500) {
							return []
						}
						let length = array.length
						for (let i = 0; i < length; i++) {
							const item = array[i]
							if (item.permission_id == permission_id) {
								return [item]
							}
							if (item.hasOwnProperty('children') && item.children.length > 0) {
								const children = deal(item.children, permission_id, ++deep)
								if (children.length > 0) {
									return children
								}
							}
						}
						return []
					}
					//获取子节点中主键数组
					function getChilren(array, deep) {
						if (!deep) {
							deep = 0
						}
						//避免递归深度超过限制
						if (deep > 500) {
							return []
						}
						let length = array.length
						for (let i = 0; i < length; i++) {
							const item = array[i]
							permission_list.push(item.permission_id)
							if (item.hasOwnProperty('children') && item.children.length > 0) {
								getChilren(item.children, ++deep)
							}
						}
					}
					//const item = find(that.treeData, permission_id)
					getChilren([node])
					let checkedList = that.getCheckedKeys()
					let list = deleteFromList(checkedList, permission_list)
					//设置选中节点
					that.setCheckedKeys(list)
				} catch (e) {
					console.log(e)
				}
			},
			londing(status) {
				if (status) {
					this.loading = status
				} else {
					this.loading = !this.loading
				}
			},
			async showEdit(row) {
				let isNeedSwitch = false;
				if (this.strictly == false) {
					isNeedSwitch = true;
					this.switchStrictly();
				}
				this.person = {};
				if (row === undefined) {
					this.$message({
						message: '请先选择节点',
						type: 'warning',
					})
					return
				}
				this.londing()
				this.person = Object.assign({}, row)
				await this.handleGetRight()
				await this.loadTreeData()
				this.londing()
				this.dialogFormVisible = true;
				if (isNeedSwitch) {
					this.$nextTick(() => {
						this.switchStrictly();
					})
				}

			},
			//目前采用加载方式
			async loadTreeData() {
				let that = this
				const list = [{
						field: 'person_id',
						type: 3,
						level: 2,
					},
					{
						field: 'parent_id',
						type: 3,
						level: 3,
					},
				]
				const sqlcode = 55
				const data = await TreeDataDealExGetData(
					sqlcode,
					list, {
						person_id: that.person.person_id,
					},
					0,
					'permission_id',
					'parent_id'
				)
				that.treeData = data
			},

			//暂时未使用 懒加载
			async loadNode(node, resolve) {
				console.log(node)
				let that = this
				const list = [{
						field: 'person_id',
						type: 3,
						level: 2,
					},
					{
						field: 'parent_id',
						type: 3,
						level: 3,
					},
				]
				const sqlcode = 55
				if (node.level === 0) {
					// const { data } = await this.QueryExec_fob(sqlcode, list, {
					//   person_id: that.person.person_id,
					//   parent_id: 0,
					// })
					const data = await TreeDataDealExGetData(
						sqlcode,
						list, {
							person_id: that.person.person_id,
							parent_id: 0,
						},
						0,
						'permission_id',
						'parent_id',
						'hasChildren'
					)
					console.log(data)
					//this.$refs.tree.setCheckedKeys([16, 18], false)
					return resolve(data)
				}
				// if (node.level > 1) {

				// }
				// const { data } = await this.QueryExec_fob(55, list, {
				//   person_id: that.person.person_id,
				//   parent_id: node.data.permission_id,
				// })
				const data = await TreeDataDealExGetData(
					sqlcode,
					list, {
						person_id: that.person.person_id,
						parent_id: node.data.permission_id,
					},
					0,
					'permission_id',
					'parent_id',
					'hasChildren'
				)
				console.log(data)
				this.$refs.tree.setCheckedKeys([16, 17], true)
				return resolve(data)
			},
			renderContent(h, {
				node,
				data,
				store
			}) {
				let label = node.label
				let desc = ''
				if (node && node.data && node.data.desc) {
					desc = '描述:' + node.data.desc
				}
				if (node.data.title) {
					label = node.data.title
				}
				if (node.data.icon) {
					return ( < span class = "custom-tree-node" >
						<
						span > < i class = {
							node.data.icon
						} > < /i> </span >
						<
						span > {
							label
						} < /span> <
						span > {
							desc
						} < /span> < /
						span > );
				}
				return ( < span class = "custom-tree-node" >
					<
					span > {
						label
					} < /span>  <
					span > {
						desc
					} < /span> < /
					span > );

			},
		},
	}
</script>

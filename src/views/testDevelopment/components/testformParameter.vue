<template>
	<el-dialog width="1000px" :visible.sync="dialogFormVisible">
		<tree-transfer ref="wl-tree-transfer" filter draggable high-light check-strictly :mode="mode" :title="treeTransfertitle"
			:to_data="toData" :from_data="fromData" :filterNode="filterNode" :defaultProps="defaultProps"
			:defaultCheckedKeys="defaultCheckedKeys" :defaultExpandedKeys="[]" @right-check-change="rightCheckChange"
			@left-check-change="leftCheckChange" @remove-btn="remove" @add-btn="add" node_key="id" :pagination="true">
		</tree-transfer>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="dialogFormVisible = false" style="width:200px;margin-left:200px">确 定
			</el-button>
			<el-button @click="dialogFormVisible = false" style="width:200px;margin-left:200px">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import {
		doEdit
	} from '@/api/table'

	import treeTransfer from "@/components/TreeTransfer/transfer-extend";
	export default {
		name: 'ComprehensiveTable',
		components: {
			treeTransfer
		},
		computed: {
			treeTransfertitle() {
				if (this.mode == "transfer") {
					return ["源列表", "目标列表"];
				} else {
					return ["通讯录", "收件人", "抄送人", "密送人"];
				}
			},
		},
		data() {
			return {
				mode: "transfer", // transfer addressList
				defaultProps: {
					label: "name",
					children: "children",
					/* disabled(data) {
					  return data.id === 2;
					}, */
				},
				fromData: [],
				toData: [],
				defaultCheckedKeys: [], // 左侧默认选中数据

				layout: 'total, sizes, prev, pager, next, jumper',
				total: 0,
				background: true,
				elementLoadingText: '正在加载...',
				queryForm: {
					pageNo: 1,
					pageSize: 20,
					title: '',
				},
				tabPosition: 'left',
				dialogFormVisible: false,
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: '',
					number: ''
				},
				formLabelWidth: '120px',

			}
		},
		created() {
			this.fetchData()
		},

		methods: {
			showEdit(row) {
				if (!row) {
					this.title = '添加'
				} else {
					this.title = '编辑'
					this.form = Object.assign({}, row)
				}
				this.dialogFormVisible = true
			},
			// 左侧源数据选中事件
			leftCheckChange(nodeObj, treeObj, checkAll) {
				console.log(nodeObj);
				console.log(treeObj);
				console.log(checkAll);
			},
			// 右侧目标数据选中事件
			rightCheckChange(nodeObj, treeObj, checkAll) {
				console.log(nodeObj);
				console.log(treeObj);
				console.log(checkAll);
			},
			// 添加按钮
			add(fromData, toData, obj) {
				// 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
				// 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
				console.log("fromData:", fromData);
				console.log("toData:", toData);
				console.log("obj:", obj);
			},
			// 移除按钮
			remove(fromData, toData, obj) {
				// 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
				// 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
				console.log("fromData:", fromData);
				console.log("toData:", toData);
				console.log("obj:", obj);
			},
			// 自定义筛选函数
			filterNode(value, data, where) {
				console.log(value, data, where);
				if (!value) return true;
				return data[this.defaultProps.label].indexOf(value) !== -1;
			},
			async fetchData() {
				
				
			},

		},
	}
</script>

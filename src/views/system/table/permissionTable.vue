<template>
	<div>
		<el-table ref="table" v-if="tableData.length > 0" :data="tableData" row-key="permission_id" border
			:tree-props="{ children: 'children', hasChildren: 'hasChildren' }" lazy :load="fetchData" :height="height"
			highlight-current-row @selection-change="handleSelectionChange" @select="handleSelectionChange"
			:header-cell-style="{ background: '#e8f0ff' }">
			<el-table-column v-if="hideColFob('selection')" type="selection" width="40" fixed="left">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="permission_name" label="权限名称" min-width="200px" fixed="left">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="title" label="标题" min-width="140px"></el-table-column>
			<el-table-column show-overflow-tooltip prop="path" label="path" min-width="300px"></el-table-column>
			<el-table-column show-overflow-tooltip prop="name" label="name" min-width="150px"></el-table-column>

			<el-table-column show-overflow-tooltip prop="component" label="component" min-width="300px">
			</el-table-column>
			<el-table-column show-overflow-tooltip prop="redirect" label="redirect" min-width="120px"></el-table-column>
			<el-table-column show-overflow-tooltip label="隐藏" width="50px">
				<template #default="{ row }">
					<el-tag type="warning" v-if="row.Ishide == '1'"> 是 </el-tag>
					<el-tag v-else> 否 </el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="图标" width="50px">
				<template #default="{ row }">
					<span v-if="row.icon">
						<vab-icon v-if="row.icon"
							:icon="['fas',row.icon.replace('el-icon', '').replace('-s-', '').replace('fa fa-', '')]">
						</vab-icon>
						<!-- <i :class="row.icon"></i> -->
					</span>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="固定" width="50px">
				<template #default="{ row }">
					<el-tag type="warning" v-if="row.affix == 'true'"> 是 </el-tag>
					<el-tag v-else> 否 </el-tag>
				</template>
			</el-table-column>
			<el-table-column show-overflow-tooltip label="缓存" width="50px">
				<template #default="{ row }">
					<el-tag type="warning" v-if="row.noKeepAlive == 'false'"> 无 </el-tag>
					<el-tag v-else> 有 </el-tag>
				</template>
			</el-table-column>

			<el-table-column show-overflow-tooltip label="操作" width="60px" align="center" fixed="right">
				<template #default="scope">
					<el-dropdown trigger="click" placement="left-start">
						<el-button icon="el-icon-s-fold" class="el-dropdown-link" type="primary"></el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item icon="el-icon-s-order"
								@click.native="handleCommand('view', scope.$index, scope.row)">
								详情
							</el-dropdown-item>
							<el-dropdown-item icon="el-icon-edit-outline" divided
								@click.native="handleCommand('edit', scope.$index, scope.row)"
								v-if="ishasPermission('edit')">
								编辑
							</el-dropdown-item>
							<el-dropdown-item icon="el-icon-plus"
								@click.native="handleCommand('add', scope.$index, scope.row)"
								v-if="ishasPermission('add')">
								添加同级
							</el-dropdown-item>
							<el-dropdown-item icon="el-icon-circle-plus"
								@click.native="handleCommand('addchildren', scope.$index, scope.row)"
								v-if="ishasPermission('add')">
								添加子级
							</el-dropdown-item>
							<el-dropdown-item icon="el-icon-delete" divided
								@click.native="handleCommand('delete', scope.$index, scope.row)"
								v-if="ishasPermission('delete')">
								删除
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		<el-empty v-else :description="emptyConfigDescript()"></el-empty>
		<!-- 		<el-pagination :background="background" :current-page="queryForm.pageNo" :layout="layout"
			:page-size="queryForm.pageSize" :total="total" @current-change="handleCurrentChange"
			@size-change="handleSizeChange"></el-pagination> -->
		<permissionFrom ref="permissionFrom" :is-up-data.sync="main_dialog"></permissionFrom>
	</div>
</template>

<script>
	import {
		mapGetters
	} from "vuex";
	import {
		hasPermission
	} from "@/utils/permission";

	import {
		TreeDataDealExGetData,
		TreeDataDealEx,
		TreeDataSecondary,
	} from "@/global/tree_deal";

	import permissionFrom from "./../components/permissionFrom";
	export default {
		name: "permissionTable",
		components: {
			permissionFrom,
		},
		provide() {
			return {
				reload: this.fetchData,
			};
		},
		props: {
			type: {
				type: Number,
				default: 0,
			},
			primary_key: {
				type: Number,
				default: 0,
			},
			permission: {
				type: Object,
				default: function() {
					return {};
				},
			},
		},
		computed: {
			...mapGetters({
				username: "user/username",
				org_id: "user/org_id",
				current_org_id: "org/current_org",
				person_id: "user/person_id",
			}),
		},
		watch: {
			primary_key(newVal, oldVal) {
				this.fetchData({
					reload: 1,
				});
			},
			main_dialog(newVal, oldVal) {
				this.fetchData();
			},
			current_org_id(newVal, oldVal) {
				this.fetchData();
			},
			tableData(newVal, oldVal) {
				if (this.height != "auto") {
					return;
				}
				switch (this.type) {
					case 0:
						this.height = "calc(100vh - 260px)";
						break;
					case 1:
						this.height = "calc(100vh - 260px)";
						break;
					case 2:
						this.height = "calc(90%)";
						break;
					case 20:
						this.height = "calc(100%)";
						break;
				}
			},
		},
		data() {
			return {
				height: "auto",
				checkedCities: "",
				form: {
					account: "",
					title: "",
				},
				getDataRelation: {
					sqlcode: 24,
					select_list: [{
							field: "parent_id",
							type: 3,
							level: 1,
						},
						{
							field: "title",
							type: 2,
							level: 2,
						},
					],
				},
				getDataRelationConfig: {
					main: {
						sqlcode: 24,
						select_list: [{
								field: "parent_id",
								type: 3,
								level: 1,
							},
							{
								field: "title",
								type: 2,
								level: 2,
							},
						],
					},
					orgType: {
						type_id: -1,
						sqlcode: 948,
						select_list: [{
								field: "type_id",
								type: 3,
								level: 1,
							},
							{
								field: "parent_id",
								type: 3,
								level: 2,
							},
							{
								field: "title",
								type: 2,
								level: 3,
							},
							{
								field: "permission_name",
								type: 2,
								level: 4,
							},
						],
					},
					roleRelation: {
						role_id: -1,
						sqlcode: 398,
						select_list: [{
								field: "role_id",
								type: 3,
								level: 1,
							},
							{
								field: "parent_id",
								type: 3,
								level: 2,
							},
							{
								field: "title",
								type: 2,
								level: 3,
							},
							{
								field: "permission_name",
								type: 2,
								level: 4,
							},
						],
					},
				},
				load: {
					status: {
						allComplete: false,
					},
				},
				nSqlcode: 24,
				sqlcode: {
					main: 24,
					roleRelation: 398,
				},
				tableData: [],
				tableDataCurrent: [],
				tableDataTemp: [],
				selectionRows: [],
				res: [],
				resolve: undefined,
				main_dialog: false,
				emptyConfig: {
					description: "无数据,请刷新重试",
				},
			};
		},
		created() {
			this.init();
		},
		methods: {
			GetHeight() {},
			async init() {
				this.role_max = await this.$store.dispatch("user/getRoleMax");
				switch (this.type) {
					case 0:
						this.columnHideList = ["selection"];
						this.layout = "total, sizes, prev, pager, next, jumper";
						break;
					case 1:
						this.columnHideList = ["selection"];
						this.layout = "total, sizes, prev, pager, next, jumper";
						break;
					case 2:
						this.columnHideList = [];
						this.layout = "total, prev,pager, next";
						break;
					case 20:
						this.columnHideList = [];
						this.emptyConfig.description = "请先选择角色";
						break;
					case 21:
						this.columnHideList = [];
						this.emptyConfig.description = "请先选择机构类型";
						break;
				}
			},
			//判断是否隐藏列，ture为不隐藏，false为隐藏
			hideColFob(col_name) {
				try {
					let that = this;
					if (!col_name) {
						return true;
					}
					if (that.columnHideList.indexOf(col_name) < 0) {
						return true;
					}
					return false;
				} catch (e) {
					console.log(e);
					return false;
				}
			},
			//数组为空的描述
			emptyConfigDescript() {
				switch (this.type) {
					case 20:
						if (this.primary_key <= 0) {
							this.emptyConfig.description = "请先选择角色";
						} else if (this.tableData.length == 0) {
							this.emptyConfig.description = "无数据请刷新重试";
						}
						break;
					case 21:
						if (this.primary_key <= 0) {
							this.emptyConfig.description = "请先选择机构类型";
						} else if (this.tableData.length == 0) {
							this.emptyConfig.description = "无数据请刷新重试";
						}
						break;
				}
				return this.emptyConfig.description;
			},
			//权限判断
			ishasPermission(name, row) {
				let permission_name = "";
				switch (name) {
					case "add":
						permission_name = "permissionManageAdd";
						break;
					case "edit":
						permission_name = "permissionManageEdit";
						break;
					case "delete":
						permission_name = "permissionManageDelete";
						break;
					default:
						permission_name = name;
						break;
				}
				//console.log(this.permission, permission_name);
				let flag = hasPermission(this.permission, permission_name);
				let role_max = this.role_max;
				if (role_max == "super_admin") {
					//flag = true
					//return flag
				}
				switch (name) {
					default:
						flag = flag;
						break;
				}
				return flag;
			},
			async ManualSaveSelection(data) {
				let that = this;

				async function exec() {
					let deep = 0;
					let length = that.selectionRows.length;
					let permission_id_list = [];
					for (let i = 0; i < length; i++) {
						let item = that.selectionRows[i];
						if (item.nDeep && deep < Number(item.nDeep)) {
							deep = Number(item.nDeep);
						}
						permission_id_list.push(item.permission_id);
					}
					let permission_id = permission_id_list.join(",");
					console.log(
						permission_id,
						deep,
						that.primary_key,
						that.getDataRelationConfig.roleRelation.role_id
					);
					let sqlcode = 401;
					let list = [{
							field: "role_id",
							type: 3,
							level: 1,
						},
						{
							field: "permission_id",
							type: 3,
							level: 2,
						},
						{
							field: "deep",
							type: 3,
							level: 3,
						},
						{
							field: "title",
							type: 2,
							level: 4,
						},
						{
							field: "permission_name",
							type: 2,
							level: 5,
						},
					];
					let form = {
						role_id: that.getDataRelationConfig.roleRelation.role_id,
						deep: deep,
						permission_id: permission_id,
					};
					switch (that.type) {
						case 20:
							sqlcode = 401;
							list = [{
									field: "role_id",
									type: 3,
									level: 1,
								},
								{
									field: "permission_id",
									type: 3,
									level: 2,
								},
								{
									field: "deep",
									type: 3,
									level: 3,
								},
								{
									field: "title",
									type: 2,
									level: 4,
								},
								{
									field: "permission_name",
									type: 2,
									level: 5,
								},
							];
							form = {
								role_id: that.getDataRelationConfig.roleRelation.role_id,
								deep: deep,
								permission_id: permission_id,
							};
							break;
						case 21:
							sqlcode = 951;
							list = [{
									field: "type_id",
									type: 3,
									level: 1,
								},
								{
									field: "permission_id",
									type: 3,
									level: 2,
								},
								{
									field: "deep",
									type: 3,
									level: 3,
								},
								{
									field: "title",
									type: 2,
									level: 4,
								},
								{
									field: "permission_name",
									type: 2,
									level: 5,
								},
							];
							form = {
								type_id: that.getDataRelationConfig.orgType.type_id,
								deep: deep,
								permission_id: permission_id,
							};
							break;
					}

					form = Object.assign(form, data);
					let info = await that.roleRelationChange(sqlcode, list, form);
					that.SelectionChangeNotify(info[0], info[1]);
				}
				exec();
			},
			handleSelectionChange(val, row) {
				this.selectionRows = val;
				if (row && this.load.status.allComplete) {
					let selected = val.length && val.indexOf(row) !== -1;
					console.log(selected); // true就是选中，0或者false是取消选中
					let flag = false;
					if (selected == true) {
						flag = true;
					} else if (selected == false || selected == 0) {
						flag = false;
					} else {
						flag = false;
					}
					let opertion_type = 0;
					if (flag) {
						opertion_type = 0;
					} else {
						opertion_type = 1;
					}
					this.SelectionChangeDataBase(row, opertion_type);
				}
			},
			async SelectionChangeDataBase(row, opertion_type) {
				//opertion_type 0 选中【添加】 1 取消选中【删除】
				let sqlcode = 400;
				let list = [{
						field: "opertion_type",
						type: 3,
						level: 1,
					},
					{
						field: "role_id",
						type: 3,
						level: 2,
					},
					{
						field: "permission_id",
						type: 3,
						level: 3,
					},
				];
				let form = {
					role_id: this.getDataRelationConfig.roleRelation.role_id,
					opertion_type: opertion_type,
					permission_id: row.permission_id,
				};
				switch (this.type) {
					case 20:
						sqlcode = 400;
						list = [{
								field: "opertion_type",
								type: 3,
								level: 1,
							},
							{
								field: "role_id",
								type: 3,
								level: 2,
							},
							{
								field: "permission_id",
								type: 3,
								level: 3,
							},
						];
						form = {
							role_id: this.getDataRelationConfig.roleRelation.role_id,
							opertion_type: opertion_type,
							permission_id: row.permission_id,
						};
						break;
					case 21:
						sqlcode = 950;
						list = [{
								field: "opertion_type",
								type: 3,
								level: 1,
							},
							{
								field: "type_id",
								type: 3,
								level: 2,
							},
							{
								field: "permission_id",
								type: 3,
								level: 3,
							},
						];
						form = {
							type_id: this.getDataRelationConfig.orgType.type_id,
							opertion_type: opertion_type,
							permission_id: row.permission_id,
						};
						break;
				}
				let info = await this.roleRelationChange(sqlcode, list, form);
				this.SelectionChangeNotify(info[0], info[1]);
			},
			async roleRelationChange(sqlcode, list, form) {
				let msg = "更新";
				const {
					code,
					influence,
					data
				} = await this.QueryExec_fob(sqlcode, list, form);
				console.log(code, influence, data);
				if (code != 200) {
					falg = false;
				}
				if (!data || data.length == 0) {
					return [false, msg + "失败"];
				}
				let json = JSON.parse(data[0].info);

				if (json.code > 0) {
					switch (json.code) {
						case 1:
							return [true, json.msg];
							break;
						case 2:
							msg = json.msg;
							break;
						default:
							msg = json.msg;
							break;
					}
					return [false, msg];
				} else {
					msg = json.msg;
					return [false, msg];
				}
			},
			SelectionChangeNotify(isSuccess, msg) {
				if (!msg) {
					if (isSuccess) {
						msg = "更新成功";
					} else {
						msg = "更新失败,请刷新重试";
					}
				}

				if (isSuccess) {
					this.$notify({
						title: "成功",
						message: msg,
						type: "success",
					});
				} else {
					this.$notify.error({
						title: "错误",
						message: msg,
					});
				}
			},
			handleCheckedChange(value) {
				console.log(value);
			},
			handleQuery() {
				this.fetchData();
			},
			handleCommand(command, index, row) {
				let that = this;
				switch (command) {
					//查看
					case "view":
						that.handleView(row);
						break;
						//编辑
					case "edit":
						that.handleEdit(row);
						break;
						//添加同级
					case "add":
						that.handleAdd({
							parent_id: Object.assign({}, row).parent_id,
						}, {
							title: "添加" + row.permission_name + "的同级",
						});
						break;
						//添加子集
					case "addchildren":
						that.handleAdd({
							parent_id: Object.assign({}, row).permission_id,
							double_parent_id: Object.assign({}, row).parent_id,
						}, {
							title: "添加" + row.permission_name + "的子级",
						});
						break;
						//删除
					case "delete":
						that.handleDelete(row);
						break;
				}
			},
			AddRoot() {
				this.handleshowDialog(
					undefined,
					false, {
						parent_id: 0,
					}, {
						title: "添加根节点权限",
					}
				);
			},
			handleView(row) {
				this.handleshowDialog(row, true);
			},
			handleEdit(row) {
				this.handleshowDialog(row);
			},
			handleAdd(person_info, option) {
				this.handleshowDialog(undefined, false, person_info, option);
			},
			handleshowDialog(row, disable, person_info, option) {
				//console.log(this.$refs['permissionFrom'])
				this.$refs["permissionFrom"].showEdit(row, disable, person_info, option);
			},
			handleDelete(row) {
				console.log(row);
				console.log(this.tableDataCurrent, this.tableData);
				if (row.hasChildren) {
					// this.$message({
					// 	showClose: true,
					// 	message: '为避免误删，请先删除子节点后刷新在删除',
					// 	type: 'error',
					// })
					// return -1
				}
				let that = this;
				that.delete_from_fob(
					that,
					row,
					31, {
						///fetchData: 'fetchData', //加载数据
						main_key: "permission_id", //主键
						failMsg: "删除失败，请刷新重试",
						confirmMsg: "将同时删除下级所有权限，是否确定删除？",
					},
					async function() {
						await that.fetchData({
							permission_id: row.parent_id,
							type: "重载",
						});
					}
				);
			},
			toggleSelection(rows) {
				if (!rows) {
					return;
				}
				let that = this;
				rows.forEach((row) => {
					that.$nextTick(() => {
						that.$refs.table.toggleRowSelection(row);
					});
				});
			},
			//从数据中获取与当前选中角色相关的权限并选中
			roleRelationSelect() {
				let data = this.tableDataCurrent;
				let length = data.length;
				let selectList = [];
				for (let i = 0; i < length; i++) {
					try {
						let item = data[i];
						if (!item.roleHasNum) {
							continue;
						}
						let roleHasNum = Number(item.roleHasNum);
						if (roleHasNum <= 0) {
							continue;
						}
						selectList.push(item);
					} catch (e) {
						console.log(e);
					}
				}
				this.toggleSelection(selectList);
				this.load.status.allComplete = true;
			},
			search(data) {
				if (data && data.role_id) {
					this.getDataRelationConfig.roleRelation.role_id = data.role_id;
				}
				if (data && data.type_id) {
					this.getDataRelationConfig.orgType.type_id = data.type_id;
				}
				this.form = Object.assign(this.form, data);
				this.fetchData();
			},
			async fetchData(pageInfo, treeNode, resolve) {
				// console.log('fetchData begin')
				let that = this;
				this.load.status.allComplete = false;
				if (pageInfo && pageInfo.pageNo && pageInfo.pageNo > 0) {
					this.form.pageNo = pageInfo.pageNo;
				} else if (pageInfo) {
					this.form.pageNo = 1;
				} else {}
				// console.log('fetchData', pageInfo, treeNode, resolve)
				// console.log('fetchData', that)
				switch (that.type) {
					case 20:
						this.updateDataRelation("roleRelation");
						await that.fetchDataMain(pageInfo, treeNode, resolve);
						that.roleRelationSelect();
						break;
					case 1:
						this.updateDataRelation("main");
						await that.fetchDataMain(pageInfo, treeNode, resolve);
						break;
					case 21:
						this.updateDataRelation("orgType");
						await that.fetchDataMain(pageInfo, treeNode, resolve);
						that.roleRelationSelect();
						break;
				}
				// console.log('fetchData end')
			},
			updateDataRelation(key) {
				if (!this.getDataRelationConfig[key]) {
					return -1;
				}
				let config = this.getDataRelationConfig[key];
				for (let key in config) {
					if (!config[key]) {
						continue;
					}
					let type = typeof config[key];
					switch (type.toLowerCase()) {
						case "object":
							this.getDataRelation[key] = JSON.parse(JSON.stringify(config[key]));
							break;
						default:
							this.getDataRelation[key] = config[key];
							break;
					}
				}
			},
			async fetchDataMain(row, treeNode, resolve) {
				let that = this;
				let form = Object.assign({}, this.form);
				let nSqlcode = this.getDataRelation.sqlcode;
				let select_list = this.getDataRelation.select_list;
				if (row) {
					form.parent_id = row.permission_id;
				} else {
					form.parent_id = 0;
				}
				if (resolve && (!this.resolve || !this.resolve[form.parent_id])) {
					if (!this.resolve) {
						this.resolve = {};
					}
					this.resolve[form.parent_id] = resolve;
				}
				//person_info
				if (resolve) {} else if (this.resolve && this.resolve[form.parent_id]) {} else if (row && row
					.person_info && row.person_info.double_parent_id) {
					form.parent_id = row.person_info.double_parent_id;
				}

				// [{
				// 		field: 'parent_id',
				// 		type: 3,
				// 		level: 1,
				// 	},
				// 	{
				// 		field: 'title',
				// 		type: 2,
				// 		level: 2,
				// 	},
				// ]

				if (row) {
					const {
						data
					} = await this.QueryExec_fob(nSqlcode, select_list, form);
					let flag = true;
					for (let i = 0; i < data.length; i++) {
						if (Number(data[i].hasChildren) > 0) {
							data[i].hasChildren = true;
						} else {
							data[i].hasChildren = false;
						}
					}
					that.$set(that, "tableDataCurrent", data);
					if (form.parent_id == 0) {
						this.tableData = data;
						//this.tableDataTemp = JSON.parse(JSON.stringify(data))
						console.log("this.tableData");
						//return
					}
					if (resolve) {
						console.log("resolve");

						resolve(data);
					} else if (this.resolve && this.resolve[form.parent_id]) {
						console.log("this.resolve");
						this.$set(this.$refs.table.store.states.lazyTreeNodeMap, form.parent_id, []);

						this.resolve[form.parent_id](data);
					} else {
						that.$set(that, "tableData", data);
						//this.tableData = data
						console.log(3);
						return;
					}
				} else {
					const data = await TreeDataDealExGetData(
						nSqlcode,
						select_list,
						form,
						0,
						"permission_id",
						"parent_id",
						"hasChildren"
					);
					that.$set(that, "tableDataCurrent", data);
					that.$set(that, "tableData", data);
				}
			},
		},
	};
</script>

<style></style>

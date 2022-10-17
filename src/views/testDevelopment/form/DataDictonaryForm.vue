<template>
	<span class="purchasefrom">
		<el-form ref="dictionaryform" :model="dictionaryform" :rules="rules" :label-width="formLabelWidth" v-loading="formloading">
			<el-form-item label="字典名称" prop="item_name" maxlength="32" :label-width="formLabelWidth">
				<el-input v-model="dictionaryform.item_name" style="width: 100%;"></el-input>
			</el-form-item>
			<el-form-item label="字典分组" prop="item_class" :label-width="formLabelWidth">
				<el-select v-model="dictionaryform.item_class" style="width: 100%;" filterable placeholder="请选择"
					@change="maxid_change">
					<el-option v-for="item in item_options" :key="item.item_name" :label="item.item_name"
						:value="item.item_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="字典id" prop="item_id" :label-width="formLabelWidth">
				<el-input v-model="dictionaryform.item_id" style="width: 100%;" readonly></el-input>
			</el-form-item>
			<el-form-item label="字典描述" prop="item_desc" maxlength="32" :label-width="formLabelWidth">
				<el-input v-model="dictionaryform.item_desc" style="width: 100%;" type="textarea"></el-input>
			</el-form-item>
		</el-form>
	</span>
</template>
<script>
	import {
		doEdit,
		ExecSql,
		QueryExec
	} from '@/api/table'
	import {
		mapActions,
		mapGetters
	} from 'vuex'
	import {
		ViewfileUrl,
		UploadFileNameUrl
	} from '@/utils/servicefile'
	import {
		TreeDataDeal,
		TreeDataDealEx
	} from '@/global/tree_deal'
	export default {
		name: 'TableEdit',
		props: { //props列表
			father: {
				type: Object,
				required: false
			}
		},
		data() {
			return {
				dictionaryform: {
					item_name: '',
					item_id: '',
					item_class: '',
					item_desc: '',
				},
				formloading: true,
				item_options: [],
				formLabelWidth: '85px',
				title: '',
				rules: {
          item_class: [{ required: true, trigger: 'change', message: '请选择数据分组' }],
          item_id: [{  }],
				}
			}
		},
		created() {
			if (this.father) {
				this.dictionaryform = Object.assign({}, this.father)
			}
			this.fetchData()
		},
		methods: {
			display(row) {
				this.formloading = true
        console.log(row)
				this.dictionaryform = row
				setTimeout(() => {
					this.formloading = false
				}, 500)
			},
			async maxid_change(row) {
				this.formloading = true
				let sData;
				sData = '[Q]272{' + this.dictionaryform.item_class + '}|^SYS'
				const res = await QueryExec(sData)
				console.log(res)
				if (res.data.length > 0) {
					this.dictionaryform.item_id = (Number(res.data[0].maxid) + 1).toString()
				} else {
					this.dictionaryform.item_id = (Number(this.dictionaryform.item_class) * 1000).toString()
				}
				setTimeout(() => {
					this.formloading = false
				}, 500)
			},
			async fetchData() {
				this.formloading = true
				try {
					let sData;
					sData = '[Q]268{0}|^SYS'
					const res = await QueryExec(sData)
					const data = res.data
					this.item_options = res.data
					this.item_options.push({
						"item_id": "0",
						"item_name": "分组根节点"
					})
				} catch (e) {
					console.log(e)
				}
				setTimeout(() => {
					this.formloading = false
				}, 500)
			},
			save() {
				let that = this
				console.log(that.dictionaryform)
				this.$refs['dictionaryform'].validate(async (valid) => {
					if (valid) {
						let sData = '[Q]271{' + that.dictionaryform.item_id + '$`' + that.dictionaryform.item_class + '$`' + that
							.dictionaryform.item_name + '$`' + that.dictionaryform.item_desc + '}|^1|^SYS'
						console.log(sData)
						const res = await ExecSql(sData)
						if (res > 0) {
							that.$baseMessage('字典添加成功', 'success')
							that.$refs['dictionaryform'].resetFields()
							that.$emit('close_comp')
              that.fetchData()
						} else {
							that.$baseMessage('字典添加失败', 'error')
						}
					} else {
						return false
					}
				})
			},
      editsave() {
      	let that = this
      	console.log(that.dictionaryform)
      	this.$refs['dictionaryform'].validate(async (valid) => {
      		if (valid) {
      			let sData = '[Q]608{' + that.dictionaryform.item_name + '$`' + that.dictionaryform.item_id + '}|^1|^SYS'
      			console.log(sData)
      			const res = await ExecSql(sData)
      			if (res > 0) {
      				that.$baseMessage('字典修改成功', 'success')
      				that.$refs['dictionaryform'].resetFields()
      				that.$emit('close_comp')
              that.fetchData()
      			} else {
      				that.$baseMessage('字典修改失败', 'error')
      			}
      		} else {
      			return false
      		}
      	})
      }
		},
	}
</script>

<template>
	<span class="purchasefrom">
		<el-form ref="form" :model="form" :rules="rules" :label-width="formLabelWidth" v-loading="formloading">
			<el-form-item label="步骤标识" prop="stage_id" :label-width="formLabelWidth">
				<el-input v-model="form.stage_id" style="width: 100%;"></el-input>
			</el-form-item>
      <el-form-item label="单元格" prop="cell" :label-width="formLabelWidth">
      	<el-input v-model="form.cell" style="width: 100%;"></el-input>
      </el-form-item>
			<el-form-item label="字段名(中)" prop="field_name" :label-width="formLabelWidth">
				<el-input v-model="form.field_name" style="width: 100%;" ></el-input>
			</el-form-item>
      <el-form-item label="字段名(英)" prop="field_title" :label-width="formLabelWidth">
      	<el-input v-model="form.field_title" style="width: 100%;" ></el-input>
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
  import {
  	ZlibHelper
  } from '@/global/zlibHelper'
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
				form: {
					stage_id: '',
					cell: '',
					field_name: '',
					field_title: '',
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
				this.form = Object.assign({}, this.father)
			}
		},
		methods: {
			display(row) {
				this.formloading = true
        console.log(row)
				this.form = row
				setTimeout(() => {
					this.formloading = false
				}, 500)
			},
      displayadd(row) {
      	this.formloading = true
      	this.form.stage_id = row.stage_id
      	setTimeout(() => {
      		this.formloading = false
      	}, 500)
      },
			save() {
				let that = this
				console.log(that.form)
				this.$refs['form'].validate(async (valid) => {
					if (valid) {
						let sData = '[Q]700{' + that.form.stage_id + '$`' + that.form.cell + '$`' + that.form.field_name + '$`'
            + that.form.field_title + '}|^2|^SYS'
						console.log(sData)
						const res = await ExecSql(sData)
						if (res > 0) {
							that.$baseMessage('参数添加成功', 'success')
							that.$refs['form'].resetFields()
							that.$emit('close_comp')
						} else {
							that.$baseMessage('参数添加失败', 'error')
						}
					} else {
						return false
					}
				})
			},
      editsave() {
      	let that = this
      	console.log(that.form)
      	this.$refs['form'].validate(async (valid) => {
      		if (valid) {
      			let sData = '[Q]851{' + that.form.cell + '$`' + that.form.field_name + '$`'
            + that.form.field_title + '$`' + that.form.map_id + '}|^1|^SYS'
      			console.log(sData)
      			const res = await ExecSql(sData)
      			if (res > 0) {
      				that.$baseMessage('字典修改成功', 'success')
      				that.$refs['form'].resetFields()
      				that.$emit('close_comp')
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

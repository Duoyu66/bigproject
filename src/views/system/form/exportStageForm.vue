<template>
	<span class="purchasefrom">
		<el-form ref="form" :model="form" :rules="rules" :label-width="formLabelWidth" v-loading="formloading">
			<el-form-item label="模板名称" prop="template_name" :label-width="formLabelWidth">
				<el-input v-model="form.template_name" style="width: 100%;"></el-input>
			</el-form-item>
      <el-form-item label="所在页" prop="sheet_id" :label-width="formLabelWidth">
      	<el-input v-model="form.sheet_id" style="width: 100%;"></el-input>
      </el-form-item>
			<el-form-item label="表格类型" prop="isTable" :label-width="formLabelWidth">
        <el-select v-model="form.isTable" placeholder="请选择" style="width: 100%;">
          <el-option label="多行" value="1"></el-option>
          <el-option label="单行" value="0"></el-option>
          <el-option label="多行只显示单行" value="2"></el-option>
        </el-select>
			</el-form-item>
			<el-form-item label="最大行数" prop="max_nums" :label-width="formLabelWidth">
				<el-input v-model="form.max_nums" style="width: 100%;" ></el-input>
			</el-form-item>
      <el-form-item label="页数" prop="page_nums" :label-width="formLabelWidth">
      	<el-input v-model="form.page_nums" style="width: 100%;" ></el-input>
      </el-form-item>
      <el-form-item label="每页行数" prop="each_page_nums" :label-width="formLabelWidth">
      	<el-input v-model="form.each_page_nums" style="width: 100%;" ></el-input>
      </el-form-item>
			<el-form-item label="sql语句" prop="sql_val" :label-width="formLabelWidth">
				<el-input v-model="form.sql_val" style="width: 100%;" :rows="4" type="textarea"></el-input>
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
					sql_val: '',
					each_page_nums: '',
					page_nums: '',
					max_nums: '',
          isTable: '',
          template_name: '',
          template_id: '',
          sheet_id: ''
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
        row.sql_val = ZlibHelper.DeCompressInterData_fob(row.sql_val)
				this.form = row
				setTimeout(() => {
					this.formloading = false
				}, 500)
			},
      displayadd(row) {
      	this.formloading = true
      	this.form.template_id = row.template_id
        this.form.template_name = row.template_name
      	setTimeout(() => {
      		this.formloading = false
      	}, 500)
      },
			save() {
				let that = this
				console.log(that.form)
				this.$refs['form'].validate(async (valid) => {
					if (valid) {
            console.log(that.form.sql_val)
            that.form.sql_val = ZlibHelper.String2EncrbytesBase64_fob(that.form.sql_val)
            console.log(that.form.sql_val)
						let sData = '[Q]699{' + that.form.sheet_id + '$`' + that.form.isTable + '$`' + that.form.sql_val + '$`'
            + that.form.max_nums + '$`' + that.form.page_nums + '$`' + that.form.each_page_nums + '$`' + that.form.template_id+ '}|^2|^SYS'
						console.log(sData)
						const res = await ExecSql(sData)
						if (res > 0) {
							that.$baseMessage('步骤添加成功', 'success')
							that.$refs['form'].resetFields()
							that.$emit('close_comp')
						} else {
							that.$baseMessage('步骤添加失败', 'error')
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
            that.form.sql_val = ZlibHelper.String2EncrbytesBase64_fob(that.form.sql_val)
      			let sData = '[Q]702{' + that.form.sheet_id + '$`' + that.form.isTable + '$`' + that.form.sql_val + '$`'
      			+ that.form.max_nums + '$`' + that.form.page_nums + '$`' + that.form.each_page_nums + '$`' + that.form.stage_id+ '}|^1|^SYS'
      			console.log(sData)
      			const res = await ExecSql(sData)
      			if (res > 0) {
      				that.$baseMessage('步骤修改成功', 'success')
      				that.$refs['form'].resetFields()
      				that.$emit('close_comp')
      			} else {
      				that.$baseMessage('步骤修改失败', 'error')
      			}
      		} else {
      			return false
      		}
      	})
      }
		},
	}
</script>

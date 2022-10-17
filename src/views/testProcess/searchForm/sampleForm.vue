<template>
	<span class="purchasefrom">
		<el-form ref="form" :model="form" :rules="rules" :label-width="formLabelWidth" v-loading="formloading">
      <el-row>
        <el-col :span="8">
          <el-form-item label="合同编号" prop="contract_no" :label-width="formLabelWidth">
          	<el-input v-model="form.contract_no" style="width: 100%;" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="试验名称" prop="object_name" :label-width="formLabelWidth">
          	<el-input v-model="form.object_name" style="width: 100%;" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="委托编号" prop="order_id" :label-width="formLabelWidth">
          	<el-input v-model="form.order_id" style="width: 100%;" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-divider></el-divider>
        </el-col>
        <el-col :span="12">
          <el-form-item label="样品编号" prop="sample_no" :label-width="formLabelWidth">
          	<el-input v-model="form.sample_no" style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="样品名称" prop="sample_name" :label-width="formLabelWidth">
          	<el-input v-model="form.sample_name" style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="送样人" prop="sender" :label-width="formLabelWidth">
          	<el-input v-model="form.sender" style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="送样时间" prop="send_time" :label-width="formLabelWidth">
          	<el-date-picker
          	  v-model="form.send_time"
          	  style="width: 100%;"
          	  type="datetime"
          	  placeholder="选择日期和时间"
          	  format="yyyy 年 MM 月 dd 日 hh 时 mm分 ss秒"
          	  value-format="yyyy-MM-dd hh:mm:ss">
          	</el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入库方式" prop="entry_type" :label-width="formLabelWidth">
          	<el-input v-model="form.entry_type" style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入库位置" prop="location" :label-width="formLabelWidth">
          	<el-input v-model="form.location" style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入库时间" prop="entry_time" :label-width="formLabelWidth">
          	<el-date-picker
          	  v-model="form.entry_time"
          	  style="width: 100%;"
          	  type="datetime"
          	  placeholder="选择日期和时间"
          	  format="yyyy 年 MM 月 dd 日 hh 时 mm分 ss秒"
          	  value-format="yyyy-MM-dd hh:mm:ss">
          	</el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入库人" prop="checkIn" :label-width="formLabelWidth">
          	<el-input v-model="form.checkIn" style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="样品数量" prop="quantity" :label-width="formLabelWidth">
          	<el-input v-model="form.quantity" style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
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
    computed: {
      ...mapGetters({
      	org_pid: 'user/org_pid',
      	org_id: 'user/org_id',
      	current_org_id: 'org/current_org',
      	current_and_chrilren_org: 'org/current_and_chrilren_org',
      	person_id: 'user/person_id',
      }),
    },
		data() {
			return {
				form: {
					contract_no: '',
					object_name: '',
					order_id: '',
					item_desc: '',
          sample_no: '',

          sample_name: '',
          sender: '',
          send_time: '',
          entry_type: '',
          location: '',
          entry_time: '',
          checkIn: '',
          quantity: '',
          entrust_id: '',
          data_id: ''
				},
				formloading: true,
				item_options: [],
        contract_no_options: [],
				formLabelWidth: '85px',
				title: '',
				rules: {
          item_class: [{ required: true, trigger: 'change', message: '请选择数据分组' }],
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
				this.form.contract_no = row.contract_no
        this.form.contract_id = row.contract_id
        this.form.object_name = row.object_name
        this.form.order_id = row.order_id
        this.form.sample_no = row.sample_id
        this.form.sample_name = row.sample_name
        this.form.sender = row.sample_send_person
        this.form.quantity = row.sample_quantity
        this.form.entrust_id = row.entrust_id
        this.form.data_id = row.data_id
				setTimeout(() => {
					this.formloading = false
				}, 500)
			},
			async maxid_change(row) {
				this.formloading = true
				let sData;
				sData = '[Q]272{' + this.form.item_class + '}|^SYS'
				const res = await QueryExec(sData)
				console.log(res)
				if (res.data.length > 0) {
					this.form.item_id = (Number(res.data[0].maxid) + 1).toString()
				} else {
					this.form.item_id = Number(this.form.item_class) * 10000
				}
				setTimeout(() => {
					this.formloading = false
				}, 500)
			},
			save() {
				let that = this
				console.log(that.form)
				this.$refs['form'].validate(async (valid) => {
					if (valid) {
						let sData = '[Q]719{' + that.form.sample_no + '$`' + that.form.sample_name + '$`' +  that.form.sender + '$`' +
            that.form.send_time + '$`' + that.form.entry_type + '$`' +  that.form.location + '$`' +
            that.form.entry_time + '$`' + that.form.checkIn + '$`' +  that.form.quantity + '$`' +
            that.current_org_id + '$`' + that.form.data_id + '$`' +  '待检' + '$`' +
            that.form.entrust_id + '}|^2|^SYS'
						console.log(sData)
						const res = await ExecSql(sData)
						if (res > 0) {
              let sData1 = '[Q]723{'+'1'+ '$`' + that.form.data_id +'}|^1|^SYS'
              const res1 = await ExecSql(sData1)
              console.log(sData1)
              if(res1>0)
              {
                that.$baseMessage('收样成功', 'success')
                that.$refs['form'].resetFields()
                that.$emit('close_comp')
              }
						} else {
							that.$baseMessage('收样失败', 'error')
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
      			let sData = '[Q]608{' + that.form.item_name + '$`' + that.form.id + '}|^1|^SYS'
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

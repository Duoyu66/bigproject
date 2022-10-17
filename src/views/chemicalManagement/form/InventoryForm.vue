<template>
	<span class="purchasefrom">
      <el-form :model="form">
        <el-form-item label="盘点日期" :label-width="formLabelWidth">
           <el-date-picker style="width: 100%;"
                 v-model="form.value1"
                 type="date"
                 placeholder="选择日期">
               </el-date-picker>
        </el-form-item>
        <el-form-item label="账务库存" :label-width="formLabelWidth">
          <el-input v-model="form.number" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="实际库存" :label-width="formLabelWidth">
           <el-input v-model="form.number1" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
           <el-select v-model="form.number2" style="width: 100%;">
             <el-option label="盘亏" value="0"></el-option>
             <el-option label="盘盈" value="1"></el-option>
             <el-option label="正常" value="2"></el-option>
           </el-select>
        </el-form-item>
        <el-form-item label="结果" :label-width="formLabelWidth">
           <el-input v-model="form.number3" style="width: 100%;"></el-input>
        </el-form-item>
        <el-form-item label="盘点人" :label-width="formLabelWidth">
           <el-input v-model="form.number4" style="width: 100%;"></el-input>
        </el-form-item>
      </el-form>
    </span>


</template>
<script>
	import {
		doEdit
	} from '@/api/table'
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
					name: 'a',
					norms: 'a',
          name1:'a',
          name2:'a',
          name3:'a',
          number2:'2',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: '',
					number: '',
					mill:'',
          value1:''
				},
				formLabelWidth: '85px',
				title: '',
			}
		},
		created() {
			if (this.father) {
				this.form = Object.assign({}, this.father)
			}
		},
		methods: {

		},
	}
</script>

<template>
	<span class="purchasefrom">
    <el-form :model="form">
      <el-form-item label="参数标识" :label-width="formLabelWidth">
        <el-input v-model="form.number" style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="参数名称" :label-width="formLabelWidth">
        <el-input v-model="form.number1" style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="参数版本" :label-width="formLabelWidth">
      	<el-select v-model="form.name" style="width: 100%;">
      		<el-option label="选择参数版本" value="a"></el-option>
      	</el-select>
      </el-form-item>
      <el-form-item label="是否启用" :label-width="formLabelWidth">
         <el-radio-group v-model="form.resource" style="width: 100%;">
              <el-radio label="是"></el-radio>
              <el-radio label="否"></el-radio>
            </el-radio-group>
      </el-form-item>
      <el-form-item label="参数名称" :label-width="formLabelWidth">
       <el-date-picker
             v-model="form.value1"
             type="date"
             placeholder="选择日期"
             style="width: 100%;">
           </el-date-picker>
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
					norms: 'rygz',
          name1:'a',
          name2:'a',
          name3:'a',
          name4:'a',
          name5:'a',
          name6:'a',
          name7:'a',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '是',
          resource1:'是',
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

<template>
	<span class="purchasefrom">
    <el-form :model="form">
      <el-form-item label="参数名称" :label-width="formLabelWidth">
        <el-input v-model="form.number" style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="参数版本" :label-width="formLabelWidth">
        <el-input v-model="form.number1" style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-radio-group v-model="form.resource">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item>
      <el-form-item label="试验标准" :label-width="formLabelWidth">
        <el-select v-model="form.name" style="width: 100%;">
          <el-option label="请选择" value="a"></el-option>
          <el-option label="收样" value="shouyang"></el-option>
          <el-option label="试验" value="shiyan"></el-option>
          <el-option label="复核" value="fuhe"></el-option>
          <el-option label="审批" value="shenpi"></el-option>
        </el-select>
      </el-form-item>

     <el-form-item label="龄期" :label-width="formLabelWidth">
         <el-checkbox-group v-model="form.type">
           <el-checkbox name="type"></el-checkbox>
         </el-checkbox-group>
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
					region: '是',
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

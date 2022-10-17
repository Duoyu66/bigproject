<template>
  <span class="purchasefrom">
    <el-form :model="form">
      <el-form-item label="作废日期" :label-width="formLabelWidth">
        <el-date-picker
          style="width: 100%"
          v-model="form.value1"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="作废量" :label-width="formLabelWidth">
        <el-input v-model="form.number" style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item label="作废原因" :label-width="formLabelWidth">
        <el-input
          v-model="form.number1"
          style="width: 100%"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="处置人" :label-width="formLabelWidth">
        <el-input v-model="form.number2" style="width: 100%"></el-input>
      </el-form-item>
    </el-form>
  </span>
</template>
// <script>
// 	import {
// 		doEdit
// 	} from '@/api/table'
// 	export default {
// 		name: 'TableEdit',
// 		props: { //props列表
// 			father: {
// 				type: Object,
// 				required: false
// 			}
// 		},
// 		data() {
// 			return {
// 				form: {
// 					name: 'a',
// 					norms: 'a',
//           name1:'a',
//           name2:'a',
//           name3:'a',
//           number2:'',
// 					region: '',
// 					date1: '',
// 					date2: '',
// 					delivery: false,
// 					type: [],
// 					resource: '',
// 					desc: '',
// 					number: '',
// 					mill:'',
//           value1:''
// 				},
// 				formLabelWidth: '85px',
// 				title: '',
// 			}
// 		},
// 		created() {
// 			if (this.father) {
// 				this.form = Object.assign({}, this.father)
// 			}
// 		},
// 		methods: {

// 		},
// 	}
// </script>

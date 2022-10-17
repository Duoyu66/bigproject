<template>
	<el-form ref="form" :model="form1" :label-width="formLabelWidth" :rules="rules" v-loading="loading"
		:element-loading-text="loadingText">
		<el-row v-show="form1.type_id > -1 || form1.person_id" class="" style="margin-top: 5px">
			<el-col :span="span2">
				<el-form-item label="提示">
					从业时间：第一次从事本行业的时间。
					入职时间：入职时间应按照员工第一天上班的时间确定。
					参加工作时间：以最初缴纳社保人社局记录为准。
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="form1.name" style="width: 100%" maxlength="8"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span3">
				<el-form-item label="出生年月" prop="birthday">
					<el-date-picker v-model="form1.birthday" align="right" type="date" placeholder="选择日期"
						:picker-options="pickerOptionsDisable.before" style="width: 100%" :format="dateFormat"
						:value-format="dateFormat">
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span3">
				<el-form-item label="性别" prop="sex">
					<el-radio-group v-model="form1.sex">
						<el-radio label="男"></el-radio>
						<el-radio label="女"></el-radio>
					</el-radio-group>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="所属机构" prop="org_name">
					<el-input v-model="form1.org_name" style="width: 100%" :disabled="true" maxlength="16"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="登录账户" prop="user_name">
					<el-input v-model="form1.user_name" style="width: 100%"
						:disabled="form1.person_id && form1.person_id > 0 ? true : false" maxlength="16"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="人员状态" prop="work_status">
					<el-select v-model="form1.work_status" style="width: 100%">
						<el-option v-for="data in selectData.work_status" :key="data.item_name" :label="data.item_name"
							:value="data.item_name">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="身份证件类型" prop="id_type">
					<el-select v-model="form1.id_type" style="width: 100%">
						<el-option v-for="data in selectData.id_type" :key="data.item_name" :label="data.item_name"
							:value="data.item_name">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="证件号码" prop="id_no">
					<el-input v-model="form1.id_no" style="width: 100%" maxlength="20"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="政治面貌" prop="politics">
					<el-select v-model="form1.politics" style="width: 100%">
						<el-option v-for="data in selectData.politics" :key="data.item_name" :label="data.item_name"
							:value="data.item_name">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<!-- 新疆维吾尔自治区伊犁哈萨克自治州塔城地区和布库什喀尔博依纳克克塞尔蒙古族自治县教育学院买依墩卡萨克能科特奈分校 -->
			<el-col :span="span2">
				<el-form-item label="毕业学校" prop="school">
					<el-input v-model="form1.school" style="width: 100%" maxlength="56"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="最后专业" prop="major">
					<el-input v-model="form1.major" style="width: 100%" maxlength="16"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span3">
				<el-form-item label="最高学历" prop="education">
					<el-select v-model="form1.education" style="width: 100%">
						<el-option v-for="data in selectData.education" :key="data.item_name" :label="data.item_name"
							:value="data.item_name">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span3">
				<el-form-item label="毕业时间" prop="graduate_date">
					<el-date-picker v-model="form1.graduate_date" align="right" type="date" placeholder="选择日期"
						:picker-options="pickerOptions" style="width: 100%" :format="dateFormat"
						:value-format="dateFormat">
					</el-date-picker>
				</el-form-item>
			</el-col>

			<el-col :span="span">
				<el-form-item label="岗位" prop="department">
					<el-select v-model="form1.department" style="width: 100%" clearable filterable>
						<el-option v-for="data in selectData.department" :key="data.item_name" :label="data.item_name"
							:value="data.item_name">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="职务" prop="duty">
					<el-select v-model="form1.duty" style="width: 100%" clearable filterable>
						<el-option v-for="data in selectData.duty" :key="data.item_name" :label="data.item_name"
							:value="data.item_name">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="职称" prop="title">
					<el-select v-model="form1.title" style="width: 100%" clearable filterable>
						<el-option v-for="data in selectData.title" :key="data.item_name" :label="data.item_name"
							:value="data.item_name">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="工作关系" prop="work_relation">
					<el-select v-model="form1.work_relation" style="width: 100%">
						<el-option v-for="data in selectData.work_relation" :key="data.item_name"
							:label="data.item_name" :value="data.item_name">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span3">
				<el-form-item label="入职时间" prop="entry_date">
					<el-row>
						<el-col :span="2">
							<el-tooltip class="item" effect="dark" content="入职时间应按照员工第一天上班的时间确定" placement="top-start">
								<i class="el-icon-info"></i>
							</el-tooltip>
						</el-col>
						<el-col :span="22">
							<el-date-picker v-model="form1.entry_date" align="right" type="date" placeholder="选择日期"
								:picker-options="pickerOptions" style="width: 100%" :format="dateFormat"
								:value-format="dateFormat">
							</el-date-picker>
						</el-col>
					</el-row>
				</el-form-item>
			</el-col>
			<el-col :span="span3">
				<el-form-item label="参加工作时间">
					<el-row>
						<el-col :span="2">
							<el-tooltip class="item" effect="dark" content="以最初缴纳社保人社局记录为准" placement="top-start">
								<i class="el-icon-info"></i>
							</el-tooltip>
						</el-col>
						<el-col :span="22">
							<el-date-picker v-model="form1.work_date" align="right" type="date" placeholder="选择日期"
								:picker-options="pickerOptions" style="width: 100%" :format="dateFormat"
								:value-format="dateFormat">
							</el-date-picker>
						</el-col>
					</el-row>
				</el-form-item>
			</el-col>
			<el-col :span="span3">
				<el-form-item label="从业时间" prop="start_date">
					<el-row>
						<el-col :span="2">
							<el-tooltip class="item" effect="dark" content="第一次从事本行业的时间" placement="top-start">
								<i class="el-icon-info"></i>
							</el-tooltip>
						</el-col>
						<el-col :span="22">
							<el-date-picker v-model="form1.start_date" align="right" type="date" placeholder="选择日期"
								:picker-options="pickerOptions" style="width: 100%" :format="dateFormat"
								:value-format="dateFormat">
							</el-date-picker>
						</el-col>
					</el-row>
				</el-form-item>
			</el-col>

			<el-col :span="span3">
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model="form1.mobile" style="width: 100%" maxlength="16"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span3">
				<el-form-item label="固定电话" prop="telephone">
					<el-input v-model="form1.telephone" style="width: 100%" maxlength="26"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span3">
				<el-form-item label="微信号">
					<el-input v-model="form1.wechat" style="width: 100%" maxlength="16"></el-input>
				</el-form-item>
			</el-col>

			<el-col :span="span3">
				<el-form-item label="QQ号" prop="qq">
					<el-input v-model.number="form1.qq" style="width: 100%" maxlength="10"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span3">
				<el-form-item label="电子邮箱" prop="e_mail">
					<el-input v-model="form1.e_mail" style="width: 100%" maxlength="25"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span3">
				<el-form-item label="婚姻状况" style="height: 51px">
					<el-select v-model="form1.marital_state" style="width: 100%" maxlength="100">
						<el-option v-for="data in selectData.marital_state" :key="data.item_name"
							:label="data.item_name" :value="data.item_name">
						</el-option>
					</el-select>
					<!-- 	<el-radio-group v-model="form1.marital_state">
						<el-radio v-for="data in selectData.marital_state" :key="data.item_name"
							:label="data.item_name"></el-radio>

					</el-radio-group> -->
				</el-form-item>
			</el-col>
			<el-col :span="span3">
				<el-form-item label="合同到期日期">
					<el-date-picker v-model="form1.contract_endTime" align="right" type="date" placeholder="选择日期"
						:picker-options="pickerOptions" style="width: 100%" :format="dateFormat"
						:value-format="dateFormat">
					</el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="span2">
				<el-form-item label="合同编号">
					<el-input v-model="form1.contract_no" style="width: 100%" maxlength="25"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span2">
				<el-form-item label="注册类证书" prop="regist_cert">
					<el-select v-model="form1.regist_cert" style="width: 100%" maxlength="100" multiple
						@change="registCertselectedChange" clearable filterable>
						<el-option v-for="data in selectData.regist_cert" :key="data.item_name" :label="data.item_name"
							:value="data.item_name">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="span3">
				<el-form-item label="家庭联系人" prop="family_contact">
					<el-input v-model="form1.family_contact" style="width: 100%" maxlength="5"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span3">
				<el-form-item label="家庭联系人关系" prop="family_relation">
					<el-input v-model="form1.family_relation" style="width: 100%" maxlength="8"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span3">
				<el-form-item label="家庭联系人手机" prop="family_mobile">
					<el-input v-model="form1.family_mobile" style="width: 100%" maxlength="16"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span3">
				<el-form-item label="本人籍贯">
					<el-input v-model="form1.native_place" style="width: 100%" maxlength="32"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span2">
				<el-form-item label="家庭住址" prop="address">
					<el-input v-model="form1.address" style="width: 100%" maxlength="50"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span3">
				<el-form-item label="紧急联系人" prop="emergency_contact">
					<el-input v-model="form1.emergency_contact" style="width: 100%" maxlength="5"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span3">
				<el-form-item label="紧急联系人关系" prop="emergency_relation">
					<el-input v-model="form1.emergency_relation" style="width: 100%" maxlength="8"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span3">
				<el-form-item label="紧急联系人手机" prop="emergency_mobile">
					<el-input v-model="form1.emergency_mobile" style="width: 100%" maxlength="16"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span2">
				<el-form-item label="工号或者卷宗号">
					<el-input v-model="form1.user_id" style="width: 100%" maxlength="32"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="昵称">
					<el-input v-model="form1.nick_name" style="width: 100%" maxlength="18"></el-input>
				</el-form-item>
			</el-col>

			<el-col :span="span">
				<el-form-item label="工作性质">
					<el-select v-model="form1.job_category" style="width: 100%" maxlength="100">
						<el-option v-for="data in selectData.job_category" :key="data.item_name" :label="data.item_name"
							:value="data.item_name">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>

			<el-col :span="span2">
				<el-form-item label="检测范围">
					<el-input v-model="form1.check_range" style="width: 100%" maxlength="100"></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span2">
				<el-form-item label="备注">
					<el-input v-model="form1.description" style="width: 100%" type="textarea" maxlength="100"
						show-word-limit></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="span2">
				<el-form-item label="提示:">
					<span>只能上传{{ this.upload.type_str }}文件，且不超过{{
              this.upload.file_size + this.upload.size_unit
            }}</span>
				</el-form-item>
			</el-col>

			<el-col :span="span">
				<el-form-item label="头像">
					<headconupload ref="head_con" :tip_show="upload.tip_show" :upload_type="upload.upload_type.head_con"
						:original_name="upload.original_name.head_con" :type_str="upload.type_str"
						:type_array="upload.type_array" :success_status.sync="upload.success.head_con"
						v-model="form1.head_con" :delte_service="upload.delte_service"
						:old_delete.sync="upload.old_delete.head_con">
					</headconupload>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="近照">
					<photoupload ref="photo" :tip_show="upload.tip_show" :upload_type="upload.upload_type.photo"
						:original_name="upload.original_name.photo" :type_str="upload.type_str"
						:type_array="upload.type_array" :success_status.sync="upload.success.photo"
						:value.sync="form1.photo" :delte_service="upload.delte_service"
						:old_delete.sync="upload.old_delete.photo">
					</photoupload>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="承诺书">
					<commitmentimgupload ref="commitment_img" :tip_show="upload.tip_show"
						:upload_type="upload.upload_type.commitment_img"
						:original_name="upload.original_name.commitment_img" :type_str="upload.type_str"
						:type_array="upload.type_array" :success_status.sync="upload.success.commitment_img"
						v-model="form1.commitment_img" :delte_service="upload.delte_service"
						:old_delete.sync="upload.old_delete.commitment_img">
					</commitmentimgupload>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="职称扫描件">
					<titleimageupload ref="title_image" :tip_show="upload.tip_show"
						:upload_type="upload.upload_type.title_image" :original_name="upload.original_name.title_image"
						:type_str="upload.type_str" :type_array="upload.type_array"
						:success_status.sync="upload.success.title_image" v-model="form1.title_image"
						:delte_service="upload.delte_service" :old_delete.sync="upload.old_delete.title_image">
					</titleimageupload>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="合同扫描件">
					<contractimageupload ref="contract_image" :tip_show="upload.tip_show"
						:upload_type="upload.upload_type.contract_image"
						:original_name="upload.original_name.contract_image" :type_str="upload.type_str"
						:type_array="upload.type_array" :success_status.sync="upload.success.contract_image"
						v-model="form1.contract_image" :delte_service="upload.delte_service"
						:old_delete.sync="upload.old_delete.contract_image">
					</contractimageupload>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="资格能力确认表">
					<abilityimgupload ref="ability_img" :tip_show="upload.tip_show"
						:upload_type="upload.upload_type.ability_img" :original_name="upload.original_name.ability_img"
						:type_str="upload.type_str" :type_array="upload.type_array"
						:success_status.sync="upload.success.ability_img" v-model="form1.ability_img"
						:delte_service="upload.delte_service" :old_delete.sync="upload.old_delete.ability_img">
					</abilityimgupload>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="身份证[人像]">
					<cardimageupload ref="card_image_pos" :tip_show="upload.tip_show"
						:upload_type="upload.upload_type.card_image_pos"
						:original_name="upload.original_name.card_image_pos" :type_str="upload.type_str"
						:type_array="upload.type_array" :success_status.sync="upload.success.card_image_pos"
						v-model="form1.card_image_pos" :delte_service="upload.delte_service"
						:old_delete.sync="upload.old_delete.card_image_pos">
					</cardimageupload>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="身份证[国徽]">
					<cardimageupload ref="card_image_other" :tip_show="upload.tip_show"
						:upload_type="upload.upload_type.card_image_other"
						:original_name="upload.original_name.card_image_other" :type_str="upload.type_str"
						:type_array="upload.type_array" :success_status.sync="upload.success.card_image_other"
						v-model="form1.card_image_other" :delte_service="upload.delte_service"
						:old_delete.sync="upload.old_delete.card_image_other">
					</cardimageupload>
				</el-form-item>
			</el-col>
			<el-col :span="span">
				<el-form-item label="任命授权书">
					<authcertupload ref="auth_cert" :tip_show="upload.tip_show"
						:upload_type="upload.upload_type.auth_cert" :original_name="upload.original_name.auth_cert"
						:type_str="upload.type_str" :type_array="upload.type_array"
						:success_status.sync="upload.success.auth_cert" v-model="form1.auth_cert"
						:delte_service="upload.delte_service" :old_delete.sync="upload.old_delete.auth_cert">
					</authcertupload>
				</el-form-item>
			</el-col>
		</el-row>
		<el-row v-show="form1.type_id <= -1 && !form1.person_id" class="" style="margin-top: 5px">
			<el-form-item label="提示:">
				<span>无法为上级机构添加人员</span>
			</el-form-item>
		</el-row>
	</el-form>
</template>

<script>
	import {
		mapGetters
	} from "vuex";
	import {
		isTel,
		isPhone,
		isNumber
	} from "@/utils/validate";
	//头像
	import headconupload from "@/components/Upload/upload";
	//近照
	import photoupload from "@/components/Upload/upload";
	//承诺书
	import commitmentimgupload from "@/components/Upload/upload";
	//职称扫描件
	import titleimageupload from "@/components/Upload/upload";
	//合同扫描件
	import contractimageupload from "@/components/Upload/upload";
	//资格能力确认表
	import abilityimgupload from "@/components/Upload/upload";
	//身份证扫描件
	import cardimageupload from "@/components/Upload/upload";
	//任命授权书
	import authcertupload from "@/components/Upload/upload";

	import {
		format_fob,
		pickerOptions,
		getToday,
		dateFormat
	} from "@/utils/dateHelp";
	import {
		GetGroupData,
		GetGroupDataEx
	} from "@/utils/htmlDataGroup";
	import {
		async
	} from "q";
	export default {
		name: "personnelFrom",
		components: {
			titleimageupload,
			headconupload,
			photoupload,
			commitmentimgupload,
			contractimageupload,
			abilityimgupload,
			authcertupload,
			cardimageupload,
		},
		computed: {
			...mapGetters({
				org_id: "user/org_id",
				org_pid: "user/org_pid",
				current_org_id: "org/current_org",
			}),
		},
		model: {
			prop: "formData",
			event: "on-change",
		},
		props: {
			//.sync同步
			formData: {
				type: Object,
				default: function() {
					return undefined;
				},
				//required: true,
			},
		},
		watch: {
			formData(newVal, oldVal) {
				if (this.formData) {
					this.upload = JSON.parse(JSON.stringify(this.uploadDeault));

					this.form1 = Object.assign(this.form1, newVal);
					this.init();
					this.file_default();
				}
			},
			screenWidth(newVal, oldVal) {
				// 为了避免频繁触发resize函数导致页面卡顿，使用定时器
				if (!this.timer) {
					// 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
					let that = this;
					that.screenWidth = newVal;
					that.timer = true;
					setTimeout(function() {
						// 打印screenWidth变化的值
						that.setSpan();
						that.timer = false;
					}, 400);
				}
			},
		},
		data() {
			let that = this;
			//入职时间
			function entryDateAndBirthday(entry_date, birthday, type) {
				try {
					let result = '';
					if (!entry_date) {
						entry_date = that.form1.entry_date;
					}
					if (!birthday) {
						birthday = that.form1.birthday;
					}
					if (entry_date && birthday && new Date(birthday) > new Date(entry_date)) {
						switch (type) {
							case 1:
								result = '出生时间晚于入职时间';
								break;
							case 2:
								result = '入职时间早于出生时间';
								break;
						}
					}
					return result;
				} catch (e) {
					console.log(e);
					return '';
				}

			}
			//毕业时间
			function graduateDateAndBirthday(graduate_date, birthday, type) {
				try {
					let result = '';
					if (!graduate_date) {
						graduate_date = that.form1.graduate_date;
					}
					if (!birthday) {
						birthday = that.form1.birthday;
					}
					if (graduate_date && birthday && new Date(birthday) > new Date(graduate_date)) {
						switch (type) {
							case 1:
								result = '出生时间晚于毕业时间';
								break;
							case 2:
								result = '毕业时间早于出生时间';
								break;
						}
					}
					return result;
				} catch (e) {
					console.log(e);
					return '';
				}

			}
			//参加工作时间
			function workDateAndBirthday(workDate, birthday, type) {
				try {
					let result = '';
					if (!workDate) {
						workDate = that.form1.work_date;
					}
					if (!birthday) {
						birthday = that.form1.birthday;
					}
					if (birthday && workDate && new Date(birthday) > new Date(workDate)) {
						switch (type) {
							case 1:
								result = '出生时间晚于参加工作时间';
								break;
							case 2:
								result = '参加工作时间早于出生时间';
								break;
						}
					}
					return result;
				} catch (ex) {
					console.log(ex);
					return '';
				}
			}
			//从业时间
			function startDateAndBirthday(startDate, birthday, type) {
				try {
					let result = '';
					if (new Date(birthday) > new Date(startDate)) {
						switch (type) {
							case 1:
								result = '出生时间晚于从业时间';
								break;
							case 2:
								result = '从业时间早于出生时间';
								break;
						}
					}
					return result;
				} catch (ex) {
					console.log(ex);
				}
			}
			return {
				//type: 0,//0 添加 1 编辑
				dateFormat: "yyyy-MM-dd",
				loading: false,
				loadingText: "上传文件中",
				span: 12,
				span2: 24,
				span3: 6,
				screenWidth: document.body.clientWidth,
				formLabelWidth: "120px",
				selectData: {
					marital_state: [],
					department: [],
					duty: [],
					title: [],
					work_relation: [],
					regist_cert: [],
					work_status: [],
					id_type: [],
					education: [],
					politics: [],
					job_category: [],
				},
				formDefault: {},
				form1: {
					type_id: 2,
					org_id: "",
					org_name: "",
					head_con: "",
					photo: "",
					commitment_img: "",
					title_image: "",
					contract_image: "",
					ability_img: "",
					card_image_pos: "",
					card_image_other: "",
					auth_cert: "",
					person_id: undefined,
					name: "",
					education: "本科",
					graduate_date: getToday(),
					marital_state: "未婚",
					entry_date: getToday(),
					contract_no: "",
					user_name: "",
					mobile: "",
					wechat: "",
					sex: "男",
					major: "",
					politics: "群众",
					native_place: "",
					work_date: getToday(),
					user_id: "",
					nick_name: "",
					e_mail: "",
					job_category: "",
					birthday: getToday(),
					school: "",
					title: "",
					id_no: "",
					id_type: "居民身份证",
					work_date: getToday(),
					start_date: getToday(),
					qq: "",
					check_range: "",
					department: "",
					description: "",
					duty: "",
					contract_endTime: getToday(),
					family_contact: "",
					family_relation: "",
					family_mobile: "",
					telephone: "",
					address: "",
					emergency_contact: "",
					emergency_relation: "",
					emergency_mobile: "",
					work_status: "在岗",
					regist_cert: "",
					work_relation: "",
				},
				upload: {
					tip_show: false,
					delte_service: false,
					upload_type: {
						head_con: 15,
						photo: 15,
						commitment_img: 14,
						title_image: 11,
						contract_image: 12,
						ability_img: 11,
						card_image_pos: 14,
						card_image_other: 14,
						auth_cert: 12,
					},
					type_str: "jpg/pdf/jpeg",
					type_array: ["image/jpeg", "application/pdf"], //'image/png',
					file_size: "4",
					size_unit: "MB",
					original_name: {
						head_con: {},
						photo: {},
						commitment_img: {},
						title_image: {},
						contract_image: {},
						ability_img: {},
						card_image_pos: {},
						card_image_other: {},
						auth_cert: {},
					},
					success: {
						commitment_img: false,
						title_image: false,
						contract_image: false,
						ability_img: false,
						card_image_pos: false,
						card_image_other: false,
						auth_cert: false,
					},
					old_delete: {
						commitment_img: false,
						title_image: false,
						contract_image: false,
						ability_img: false,
						card_image_pos: false,
						card_image_other: false,
						auth_cert: false,
					},
				},
				rules: {
					name: [{
						required: true,
						trigger: ["blur", "change"],
						message: "请输入姓名",
					}, ],
					birthday: [{
						required: true,
						trigger: ["blur", "change"],
						message: "请选择生日",
					}, {
						trigger: "blur",
						validator: async function(rule, value, callback) {
							if (value === "") {
								callback();
							}
							let result = workDateAndBirthday(undefined, value, 1);
							if (result) {
								callback(new Error(result));
								return;
							}
							result = entryDateAndBirthday(undefined, value, 1);
							if (result) {
								callback(new Error(result));
								return;
							}
							result = graduateDateAndBirthday(undefined, value, 1);
							if (result) {
								callback(new Error(result));
								return;
							}
							result = startDateAndBirthday(undefined, value, 1);
							if (result) {
								callback(new Error(result));
								return;
							}
							callback();

						},
					}],
					e_mail: [{
						trigger: "blur",
						validator: async function(rule, value, callback) {
							if (value === "") {
								callback();
							}
							let reg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
							if (reg.test(value)) {
								callback();
							} else {
								callback(new Error("请输入正确的电子邮箱"));
							}
						},
					}, ],
					school: [{
						required: true,
						trigger: ["blur", "change"],
						message: "请输入学校",
					}, ],
					education: [{
						required: true,
						trigger: ["blur", "change"],
						message: "请选择学历",
					}, ],
					department: [{
						required: true,
						trigger: ["blur", "change"],
						message: "请输入岗位",
					}, ],
					duty: [{
						required: true,
						trigger: ["blur", "change"],
						message: "请输入职务",
					}, ],
					title: [{
						required: true,
						trigger: ["blur", "change"],
						message: "请输入职称",
					}, ],
					major: [{
						required: true,
						trigger: ["blur", "change"],
						message: "请输入专业",
					}, ],
					politics: [{
						required: true,
						trigger: ["blur", "change"],
						message: "请选择政治面貌",
					}, ],
					work_date: [{
						required: true,
						trigger: ["blur", "change"],
						message: "请选择从业时间",
					}, {
						trigger: "blur",
						validator: async function(rule, value, callback) {
							if (value === "") {
								callback();
							}
							let result = workDateAndBirthday(value, undefined, 2);
							if (result) {
								callback(new Error(result));
								return;
							}
							callback();

						},
					}],
					sex: [{
						required: true,
						trigger: ["blur", "change"],
						message: "请选择性别",
					}, ],
					graduate_date: [{
						required: true,
						trigger: ["blur", "change"],
						message: "请输入毕业日期",
					}, {
						trigger: "blur",
						validator: async function(rule, value, callback) {
							if (value === "") {
								callback();
							}
							let result = graduateDateAndBirthday(value, undefined, 2);
							if (result) {
								callback(new Error(result));
								return;
							}
							callback();

						},
					}],
					entry_date: [{
						required: true,
						trigger: ["blur", "change"],
						message: "请输入入职日期",
					}, {
						trigger: "blur",
						validator: async function(rule, value, callback) {
							if (value === "") {
								callback();
							}
							let result = entryDateAndBirthday(value, undefined, 2);
							if (result) {
								callback(new Error(result));
								return;
							}
							callback();

						},
					}],
					start_date: [{
						required: true,
						trigger: ["blur", "change"],
						message: "请输入从业日期",
					}, {
						trigger: "blur",
						validator: async function(rule, value, callback) {
							if (value === "") {
								callback();
							}
							let result = startDateAndBirthday(value, undefined, 2);
							if (result) {
								callback(new Error(result));
								return;
							}
							callback();

						},
					}],
					user_name: [{
							required: true,
							trigger: ["blur", "change"],
							message: "请输入登陆账户",
						},
						{
							trigger: "blur",
							validator: async function(rule, value, callback) {
								let reg = /^[a-zA-Z]([-_a-zA-Z0-9]{3,16})$/;
								if (!reg.test(value)) {
									callback(new Error("字母开头，4-16位,只允许英文、数字、下划线和减号"));
									return;
								}
								let form = {};
								let list = [{
									field: "user_name",
									type: 3,
									level: 1,
								}, ];
								form.user_name = value;
								const {
									code,
									data
								} = await that.QueryExec_fob(70, list, form);
								if (code == 200) {
									let length = data.length;
									if (!that.form1.person_id && length > 0) {
										callback(new Error("已存在该登陆名"));
										return;
									}
									let flag = false;
									while (--length > -1) {
										if (data[length].person_id != that.form1.person_id) {
											flag = true;
											break;
										}
									}
									if (flag) {
										callback(new Error("已存在该登陆名"));
									} else {
										callback();
									}
								} else {
									callback(new Error("查询数据库异常，请刷新重试"));
								}
							},
						},
					],
					id_type: [{
							required: true,
							trigger: ["blur", "change"],
							message: "请输入证件类型",
						},
						{
							trigger: ["blur", "change"],
							validator: async function(rule, value, callback) {
								switch (value) {
									case "户口本":
									case "居民身份证":
										let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
										if (reg.test(that.form1.id_no) === false) {
											callback(new Error("身份证号输入有误"));
										}
										break;
								}
								callback();
							},
						},
					],
					id_no: [{
							required: true,
							trigger: ["blur", "change"],
							message: "请输入证件号码",
						},
						{
							trigger: ["blur"],
							validator: async function(rule, value, callback) {
								if (!value) {
									callback();
								}
								switch (that.form1.id_type) {
									case "户口本":
									case "居民身份证":
										let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
										if (reg.test(value) === false) {
											callback(new Error("身份证号输入有误"));
										}
										break;
								}
								callback();
							},
						},
					],
					mobile: [{
							required: true,
							trigger: ["blur", "change"],
							message: "请输入手机号",
						},
						{
							trigger: ["blur"],
							validator: async function(rule, value, callback) {
								if (!value) {
									callback();
								}
								let mobile = isPhone(value);
								if (mobile) {
									callback();
									return;
								}
								callback(new Error("请输入正确的手机号"));
							},
						},
					],
					telephone: [{
						trigger: ["blur"],
						validator: async function(rule, value, callback) {
							console.log(value)
							if (!value) {
								console.log(1)
								callback();
								return
							}
							let telphone = isTel(value);
							if (telphone) {
								console.log(2)
								callback();
								return;
							}
							console.log(3)
							callback(new Error("请输入正确的固定电话"));
						},
					}, ],
					qq: [{
						trigger: ["blur"],
						validator: async function(rule, value, callback) {
							if (!value) {
								callback();
							}
							let qqtext = isNumber(value);
							if (!qqtext) {
								callback(new Error("请输入正确的qq账号"));
							} else {
								callback();
							}
						},
					}, ],
					family_contact: [{
						required: false,
						trigger: ["blur", "change"],
						message: "请输入家庭联系人",
					}, ],
					family_relation: [{
						required: false,
						trigger: ["blur", "change"],
						message: "请输入与家庭联系人的关系",
					}, ],
					family_mobile: [{
							required: false,
							trigger: ["blur", "change"],
							message: "请输入家庭联系人手机",
						},
						{
							trigger: ["blur"],
							validator: async function(rule, value, callback) {
								if (!value) {
									callback();
								}
								let mobile = isPhone(value);
								if (mobile) {
									callback();
									return;
								}
								callback(new Error("请输入正确的手机号"));
							},
						},
					],
					address: [{
						required: true,
						trigger: ["blur", "change"],
						message: "请输入家庭地址",
					}, ],
					emergency_contact: [{
						required: true,
						trigger: ["blur", "change"],
						message: "请输入紧急联系人",
					}, ],
					emergency_relation: [{
						required: true,
						trigger: ["blur", "change"],
						message: "请输入与紧急联系人的关系",
					}, ],
					emergency_mobile: [{
							required: true,
							trigger: ["blur", "change"],
							message: "请输入紧急联系人手机",
						},
						{
							trigger: ["blur"],
							validator: async function(rule, value, callback) {
								if (!value) {
									callback();
								}
								let mobile = isPhone(value);
								if (mobile) {
									callback();
									return;
								}
								callback(new Error("请输入正确的手机号"));
							},
						},
					],
					work_status: [{
						required: true,
						trigger: ["blur", "change"],
						message: "请选择人员状态",
					}, ],
					regist_cert: [{
						required: true,
						trigger: ["blur", "change"],
						message: "请选择证书",
					}, ],
					work_relation: [{
						required: true,
						trigger: ["blur", "change"],
						message: "请选择工作关系",
					}, ],
				},
				title: "",
				dialogFormVisible: false,
				pickerOptions: pickerOptions(),
				pickerOptionsDisable: {
					before: pickerOptions({
						disabledDate: true,
						type_disable: 2
					}),
					after: pickerOptions({
						disabledDate: true,
						type_disable: 3,
						shortcuts_type: 'after'
					}),
				}

			};
		},
		created() {
			//获取下拉框数据
			this.init();
		},
		mounted() {
			const that = this;
			window.onresize = () => {
				return (() => {
					window.screenWidth = document.body.clientWidth;
					that.screenWidth = window.screenWidth;
				})();
			};
		},
		methods: {
			init() {
				this.setSpan();
				this.GetGroup();
				this.orgSetting();
				//保存默认值
				this.formDefault = JSON.parse(JSON.stringify(this.form1));
				this.uploadDeault = JSON.parse(JSON.stringify(this.upload));
				if (this.formData) {
					if (this.formData.regist_cert) {
						this.formData.regist_cert = this.formData.regist_cert.split(",");
					}
					this.form1 = Object.assign(this.form1, this.formData);
					this.file_default();
				}
				this.$nextTick(() => {
					this.clearValidate();
				});
			},
			clearValidate(object_id) {
				if (this.$refs["form"]) {
					this.$refs["form"].clearValidate();
				}
			},
			registCertselectedChange(val) {
				let length = val.length;
				let index = val.indexOf("无");
				//判断是否勾选无
				if (index < 0) {
					return;
				}
				//是否只有一个选项
				if (length == 1) {
					return;
				}
				if (index == length - 1) {
					this.$set(this.form1, "regist_cert", ["无"]);
					return;
				}
				val.splice(
					val.findIndex((e) => e == "无"),
					1
				); // 将删除id等于1的选项
			},
			setSpan() {
				let width = this.screenWidth;
				if (width > 1000) {
					this.span = 12;
					this.span2 = 24;
					this.span3 = 6;
				} else if (width > 600) {
					this.span = 12;
					this.span2 = 24;
					this.span3 = 12;
				} else {
					this.span = 24;
					this.span2 = 24;
					this.span3 = 24;
				}
			},
			file_default() {
				const form = JSON.parse(JSON.stringify(this.form1));
				let that = this;
				that.upload.original_name.head_con[form.head_con] = "头像";
				that.upload.original_name.photo[form.photo] = "近照";
				that.upload.original_name.commitment_img[form.commitment_img] = "承诺书";
				that.upload.original_name.title_image[form.title_image] = "职称扫描件";
				that.upload.original_name.contract_image[form.contract_image] = "合同扫描件";
				that.upload.original_name.ability_img[form.ability_img] = "资格能力确认表";
				that.upload.original_name.card_image_pos[form.card_image_pos] =
					"身份证扫描件[正面]";
				that.upload.original_name.card_image_other[form.card_image_other] =
					"身份证扫描件[反面]";
				that.upload.original_name.auth_cert[form.auth_cert] = "任命授权书";
			},
			async getOrgNameByselect() {
				//this.$nextTick(async () => {
				let index = setInterval(async () => {
					let org_name = await this.getOrgName(this.form1.org_id);
					if (org_name.trim()) {
						this.$set(this.form1, "org_name", org_name);
						clearInterval(index);
						//this.$set(this.load.status.orgName, 'isShow', true)
					}
				}, 500);
			},
			async getOrgName(value) {
				let orgName = await this.$store.dispatch("org/GetOrgNameByOrgId", value);
				return orgName;
			},
			orgSetting() {
				let that = this;
				if (that.form1.person_id) {
					that.form1.type_id = 3;
					return true;
				}
				if (that.current_org_id < 1) {
					that.form1.org_id = that.org_pid;
				} else {
					that.form1.org_id = that.current_org_id;
				}
				if (that.org_id.toString().length <= 2) {
					//添加系统管理员
					that.form1.type_id = 0;
				} else if (that.form1.org_id == that.org_pid) {
					console.log("111");
					//添加普通用户
					that.form1.type_id = 2;
					// if (that.org_id.toString().length <= 2) {
					// 	//添加系统管理员
					// 	that.form1.type_id = 0
					// }
				} else if (that.form1.org_id.toString().length >= that.org_pid.toString().length) {
					console.log("222");
					//为下级机构添加管理员
					that.form1.type_id = 1;
				} else if (that.form1.org_id.toString().length < that.org_pid.toString().length) {
					console.log("333");
					//不允许给上级机构添加人员
					that.form1.type_id = -1;
				}
				console.log(that.form1.type_id);
				that.getOrgNameByselect();
				return true;
			},
			dateformt() {
				return format_fob(new Date());
			},
			async GetGroup() {
				let list = [{
						data: "education",
						group_id: 1000,
					},
					{
						data: "politics",
						group_id: 1001,
					},
					{
						data: "id_type",
						group_id: 1002,
					},
					{
						data: "job_category",
						group_id: 1003,
					},
					{
						data: "work_status",
						group_id: 1021,
					},
					{
						data: "regist_cert",
						group_id: 1022,
					},
					{
						data: "work_relation",
						group_id: 1023,
					},
					{
						data: "department",
						group_id: 1026,
					},
					{
						data: "duty",
						group_id: 1027,
					},
					{
						data: "title",
						group_id: 1025,
					}, {
						data: "marital_state",
						group_id: 1040,
					}
				];
				await GetGroupDataEx(this, list);
			},
			async GetGroupData(group_id) {
				try {
					let form = {};
					let list = [{
						field: "group_id",
						type: 3,
						level: 1,
					}, ];
					form.group_id = group_id;
					const {
						code,
						data
					} = await this.QueryExec_fob(71, list, form);
					return data;
				} catch (e) {
					console.log(e);
					return [];
				}
			},
			resetForm() {
				this.$nextTick(() => {
					this.$refs["form"].resetFields();
					const refs = this.fileUploadRefs();
					const length = refs.length;
					for (let i = 0; i < length; i++) {
						try {
							this.$refs[refs[i]].clear();
						} catch (e) {
							console.log(e);
						}
					}
				});
			},
			close() {
				const refs = this.fileUploadRefs();
				const length = refs.length;
				let that = this;
				for (let i = 0; i < length; i++) {
					try {
						that.$refs[refs[i]].clear();
					} catch (e) {
						console.log(e);
					}
				}
				that.$refs["form"].resetFields();
				that.details = that.$options.data().details;
				this.form1 = JSON.parse(JSON.stringify(this.formDefault));
				this.upload = JSON.parse(JSON.stringify(this.uploadDeault));
			},
			fileUploadRefs() {
				return [
					"head_con",
					"photo",
					"commitment_img",
					"title_image",
					"contract_image",
					"ability_img",
					"card_image_pos",
					"auth_cert",
					"card_image_other",
				];
			},
			fileUpload(callback) {
				try {
					let that = this;
					const refs = that.fileUploadRefs();
					let check_list = [];
					const length = refs.length;
					that.loading = true;
					that.loadingText = "上传文件中";
					for (let i = 0; i < length; i++) {
						try {
							if (that.$refs[refs[i]].submitUpload() === 1) {
								check_list.push(refs[i]);
							}
						} catch (e) {
							console.log(e);
						}
					}
					let index = setInterval(function() {
						let flag = true;
						let length = check_list.length;
						while (--length > -1) {
							if (
								!that.upload.success[check_list[length]] &&
								!that.$refs[check_list[length]].error
							) {
								flag = false;
								break;
							}
						}
						if (flag) {
							clearInterval(index);
							exce();
						}
					}, 500);

					function exce() {
						let flag = true;
						let length = check_list.length;
						while (--length > -1) {
							if (that.$refs[check_list[length]].error) {
								flag = false;
							}
						}
						if (flag) {
							that.upload.delte_service = true;
						} else {
							that.$baseMessage("文件上传失败", "error");
						}
						that.loading = false;
						callback(flag);
					}
				} catch (e) {
					console.log(e);
				}
			},
			async QueryExec_fob_custom(list, form, sqlcode) {
				return await this.QueryExec_fob(sqlcode, list, form);
			},
			async save(callback) {
				let that = this;
				that.orgSetting();
				async function submit(form, callback) {
					that.loading = true;
					that.loadingText = "提交表单中...";
					let list = [{
							field: "org_id",
							type: 3,
							level: 1,
						},
						{
							field: "name",
							type: 3,
							level: 2,
						},
						{
							field: "sex",
							type: 3,
							level: 3,
						},
						{
							field: "birthday",
							type: 3,
							level: 4,
						},
						{
							field: "education",
							type: 3,
							level: 5,
						},
						{
							field: "major",
							type: 3,
							level: 6,
						},
						{
							field: "school",
							type: 3,
							level: 7,
						},
						{
							field: "graduate_date",
							type: 3,
							level: 8,
						},
						{
							field: "politics",
							type: 3,
							level: 9,
						},
						{
							field: "title",
							type: 3,
							level: 10,
						},
						{
							field: "title_image",
							type: 3,
							level: 11,
						},
						{
							field: "marital_state",
							type: 3,
							level: 12,
						},
						{
							field: "native_place",
							type: 3,
							level: 13,
						},
						{
							field: "id_no",
							type: 3,
							level: 14,
						},
						{
							field: "card_image_pos",
							type: 3,
							level: 15,
						},
						{
							field: "photo",
							type: 3,
							level: 16,
						},
						{
							field: "contract_no",
							type: 3,
							level: 17,
						},
						{
							field: "contract_image",
							type: 3,
							level: 18,
						},
						{
							field: "entry_date",
							type: 3,
							level: 19,
						},
						{
							field: "work_date",
							type: 3,
							level: 20,
						},
						{
							field: "duty",
							type: 3,
							level: 21,
						},
						{
							field: "auth_cert",
							type: 3,
							level: 22,
						},
						{
							field: "start_date",
							type: 3,
							level: 23,
						},
						{
							field: "user_id",
							type: 3,
							level: 24,
						},
						{
							field: "user_name",
							type: 3,
							level: 25,
						},
						{
							field: "nick_name",
							type: 3,
							level: 26,
						},
						{
							field: "head_con",
							type: 3,
							level: 27,
						},
						{
							field: "mobile",
							type: 3,
							level: 28,
						},
						{
							field: "telephone",
							type: 3,
							level: 29,
						},
						{
							field: "e_mail",
							type: 3,
							level: 30,
						},
						{
							field: "qq",
							type: 3,
							level: 31,
						},
						{
							field: "wechat",
							type: 3,
							level: 32,
						},
						{
							field: "description",
							type: 3,
							level: 33,
						},
						{
							field: "job_category",
							type: 3,
							level: 34,
						},
						{
							field: "check_range",
							type: 3,
							level: 35,
						},
						{
							field: "department",
							type: 3,
							level: 36,
						},
						{
							field: "commitment_img",
							type: 3,
							level: 37,
						},
						{
							field: "ability_img",
							type: 3,
							level: 38,
						},
						{
							field: "id_type",
							type: 3,
							level: 39,
						},
						{
							field: "contract_endTime",
							type: 3,
							level: 40,
						},
						{
							field: "family_contact",
							type: 3,
							level: 41,
						},
						{
							field: "family_relation",
							type: 3,
							level: 42,
						},
						{
							field: "family_mobile",
							type: 3,
							level: 43,
						},
						{
							field: "address",
							type: 3,
							level: 44,
						},
						{
							field: "emergency_contact",
							type: 3,
							level: 45,
						},
						{
							field: "emergency_relation",
							type: 3,
							level: 46,
						},
						{
							field: "emergency_mobile",
							type: 3,
							level: 47,
						},
						{
							field: "card_image_other",
							type: 3,
							level: 48,
						},
						{
							field: "work_status",
							type: 3,
							level: 49,
						},
						{
							field: "regist_cert",
							type: 3,
							level: 50,
						},
						{
							field: "work_relation",
							type: 3,
							level: 51,
						},
					];
					let fob = "";
					let sqlcode = -1;
					let msg = "";
					if (form.person_id && form.person_id > 0) {
						sqlcode = 73;
						fob = that.update_fob;
						msg = "更新";
						list.push({
							field: "person_id",
							level: list.length,
						});
					} else {
						//添加
						msg = "添加";
						sqlcode = 72;
						fob = that.QueryExec_fob_custom;
						list.push({
							type: 3,
							field: "type_id",
							level: list.length,
						});
					}
					const {
						code,
						influence,
						data
					} = await fob(list, form, sqlcode);
					that.loading = false;
					if (code != 200) {
						that.$baseMessage(msg + "失败", "error");
						return false;
					}
					if (msg == "添加") {
						if (data.length > 0 && data[0].info == "1") {
							that.$baseMessage(msg + "成功，密码默认为登录名", "success");
							if (callback) {
								callback(true);
							}
							return true;
						}
						if (data.length > 0) {
							that.$baseMessage("失败！" + data[0].info, "error");
							if (callback) {
								callback(false);
							}
							return false;
						}
						that.$baseMessage(msg + "失败", "error");
						if (callback) {
							callback(false);
						}
						return false;
					} else {
						if (influence > 0) {
							that.$baseMessage(msg + "成功", "success");
							if (callback) {
								callback(true);
							}
							return true;
						} else {
							that.$baseMessage(msg + "失败", "error");
							if (callback) {
								callback(false);
							}
							return false;
						}
					}
				}

				function success_fob(status2) {
					if (status2) {
						that.upload.delte_service = true;
						const refs = that.fileUploadRefs();
						let index = setInterval(function() {
							let flag = true;
							let length = refs.length;
							while (--length > -1) {
								if (!that.upload.old_delete[refs[length]]) {
									flag = false;
									break;
								}
							}
							if (flag) {
								clearInterval(index);
								that.close();
								callback(status2);
							}
						});
					} else {
						callback(status2);
					}
				}
				that.$refs["form"].validate(async (valid) => {
					if (valid) {
						that.$baseConfirm("确定提交？", null, async () => {
							that.fileUpload(function(status) {
								console.log("fileUpload ", status);
								if (status) {
									submit(that.form1, success_fob);
								} else {
									that.$baseMessage("上传文件失败", "error");
									that.loading = false;
								}
							});
						});
					} else {
						that.$baseMessage("校验失败", "error");
						return false;
					}
				});
			},
		},
	};
</script>

<style></style>

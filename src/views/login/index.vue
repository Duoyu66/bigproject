<template>
	<div class="login-container">
		<!-- 	<el-alert title="beautiful boys and girls欢迎加入vue-admin-beautifulQQ群：972435319" type="success" :closable="false" style="position: fixed" /> -->
		<el-row>
			<el-col :xs="24" :sm="24" :md="12" :lg="16" :xl="16">
				<div style="color: transparent">占位符</div>
			</el-col>
			<el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
         <div class="title-tips">{{ title }}</div>
        <div class="loginBox">

          <div class="logoPic"><b ></b></div>
          <el-form ref="form" :model="form" :rules="rules" class="login-form" label-position="left" style="margin: 0!important;">
            <!-- <div class="title">hello !</div> -->
            <!-- <div class="title-tips">欢迎来到{{ title }}！</div> -->
            <el-form-item style="margin-top: 40px" prop="user">
              <span class="svg-container svg-container-admin">
                <vab-icon :icon="['fas', 'user']" />
              </span>
              <el-input v-model.trim="form.user" v-focus placeholder="请输入用户名" tabindex="1" type="text" />
            </el-form-item>
            <el-form-item prop="pwd">
              <span class="svg-container">
                <vab-icon :icon="['fas', 'lock']" />
              </span>
              <el-input :key="passwordType" ref="password" v-model.trim="form.pwd" :type="passwordType"
                tabindex="2" placeholder="请输入密码" @keyup.enter.native="handleLogin" />
              <span v-if="passwordType === 'password'" class="show-password" @click="handlePassword">
                <vab-icon :icon="['fas', 'eye-slash']" />
              </span>
              <span v-else class="show-password" @click="handlePassword">
                <vab-icon :icon="['fas', 'eye']" />
              </span>
            </el-form-item>
            <el-button :loading="loading" class="login-btn" type="primary" @click="handleLogin">
              登录
            </el-button>
            <router-link to="/register" v-if="false">
              <div style="margin-top: 20px">注册</div>
            </router-link>
          </el-form>
        </div>
      </el-col>
		</el-row>
	</div>
</template>

<script>
	import {
		isPassword
	} from '@/utils/validate'
	import {
		homePage
	} from '@/config'
	export default {
		name: 'Login',
		directives: {
			focus: {
				inserted(el) {
					el.querySelector('input').focus()
				},
			},
		},
		data() {
			const validateusername = (rule, value, callback) => {
				if ('' == value) {
					callback(new Error('用户名不能为空'))
				} else {
					callback()
				}
			}
			const validatePassword = (rule, value, callback) => {
				//var reg = new RegExp(/^[^\u4e00-\u9fa5]+$/)
				// if (!isPassword(value)) {
				// 	//callback(new Error('密码不能少于6位'))
				// 	callback()
				// } else
				if ('' == value) {
					callback(new Error('密码不能为空'))
				} else {
					callback()
				}
			}
			return {
				nodeEnv: process.env.NODE_ENV,
				title: this.$baseTitleAbbr ? this.$baseTitleAbbr : this.$baseTitle,
				form: {
					user: '',
					pwd: '',
					plate: '0',
				},
				rules: {
					user: [{
						required: true,
						trigger: 'blur',
						validator: validateusername,
					}, ],
					pwd: [{
						required: true,
						trigger: 'blur',
						validator: validatePassword,
					}, ],
				},
				loading: false,
				passwordType: 'password',
				redirect: undefined,
			}
		},
		watch: {
			$route: {
				handler(route) {
					this.redirect = (route.query && route.query.redirect) || homePage
				},
				immediate: true,
			},
		},
		created() {
			document.body.style.overflow = 'hidden'
		},
		beforeDestroy() {
			document.body.style.overflow = 'auto'
		},
		mounted() {
			if (this.nodeEnv === 'development') {
				this.form.user = 'admin'
				this.form.pwd = '123456'
				this.form.plate = '0'
			}

		},
		methods: {
			handlePassword() {
				this.passwordType === 'password' ?
					(this.passwordType = '') :
					(this.passwordType = 'password')
				this.$nextTick(() => {
					this.$refs.password.focus()
				})
			},
			handleLogin() {
				this.$refs.form.validate(async (valid) => {
					let that = this
					if (valid) {
						that.loading = true
						await that.$store.dispatch('user/login', that.form)

						const routerPath =
							that.redirect === '/404' || that.redirect === '/401' ?
							'/' :
							that.redirect

						await that.$router.push(routerPath).catch(() => {})
						that.loading = false
					} else {
						return false
					}
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	.login-container {
		height: 100vh;
		background: url('~@/assets/login_images/background.jpg') center center fixed no-repeat;
		background-size: cover;

		.title {
			font-size: 54px;
			font-weight: 500;
			color: rgba(14, 18, 26, 1);
		}
    .loginBox {background:#ffffff35;box-sizing: border-box;margin-right:100px; border-radius:10px;text-align:center;position: relative;width:360px;padding:15px;}
    .loginBox .login-form{background:#fff;width:100%; padding:20px;margin-top: 0px!important;border-radius:10px;}
    .loginBox .logoPic{width:90px;height:90px;border:10px solid #ffffff35;position:absolute;top:-32px;left:50%;margin-left:-40px;border-radius:50%;z-index: 999;}
    .loginBox .logoPic b{width:70px;height:70px;background:#fff url('~@/assets/login_images/logo.png') no-repeat;background-size: 100%; display:block;margin: auto;
    border-radius:50%;box-sizing: border-box; }
		.title-tips {
			margin-top:200px;
      margin-bottom:70px;
			font-size: 26px;
			font-weight:bold;
			color: #fff;
			text-overflow: ellipsis;
			white-space: nowrap;
      text-shadow:1px 1px 1px #999999;

		}
    .login-container .logoBox .login-btn{width:100%!important;height:38px!important;}
		.login-btn {
      width:100%;
			display: inherit;
			height:46px;
			margin-top: 5px;
			border: 0;

			&:hover {
				opacity: 0.9;
			}
		}

		.login-form {
			position: relative;
			max-width: 100%;
			margin: calc((100vh - 425px) / 2) 10% 10%;
			overflow: hidden;

			.forget-password {
				width: 100%;
				margin-top: 40px;
				text-align: left;

				.forget-pass {
					width: 129px;
					height: 19px;
					font-size: 20px;
					font-weight: 400;
					color: rgba(92, 102, 240, 1);
				}
			}
		}

		.tips {
			margin-bottom: 10px;
			font-size: $base-font-size-default;
			color: $base-color-white;

			span {
				&:first-of-type {
					margin-right: 16px;
				}
			}
		}

		.title-container {
			position: relative;

			.title {
				margin: 0 auto 40px auto;
				font-size: 34px;
				font-weight: bold;
				color: $base-color-blue;
				text-align: center;
			}
		}

		.svg-container {
			position: absolute;
			top: 5px;
			left: 15px;
			z-index: $base-z-index;
			font-size: 16px;
			color: #d7dee3;
			cursor: pointer;
			user-select: none;
		}

		.show-password {
			position: absolute;
			top: 14px;
			right: 25px;
			font-size: 16px;
			color: #d7dee3;
			cursor: pointer;
			user-select: none;
		}

		::v-deep {
			.el-form-item {
				padding-right: 0;
				margin: 20px 0 30px;
				color: #454545;
				background: transparent;
				border: 1px solid transparent;
				border-radius: 2px;

				&__content {
					min-height: $base-input-height;
					line-height: $base-input-height;
				}

				&__error {
					position: absolute;
					top: 100%;
					left: 18px;
					font-size: $base-font-size-small;
					line-height: 18px;
					color: $base-color-red;
				}
			}

			.el-input {
				box-sizing: border-box;

				input {
					height:46px;
					padding-left: 45px;
					font-size: $base-font-size-default;
					line-height:46px;
					color: $base-font-color;
					background: #f6f4fc;
					border: 0;
					caret-color: $base-font-color;
				}
			}
		}
	}
</style>

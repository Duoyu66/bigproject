<template>
	<div class="vue-admin-beautiful-wrapper" :class="classObj">
		<div v-if="'horizontal' === layout" class="layout-container-horizontal" :class="{
        fixed: header === 'fixed',
        'no-tabs-bar': tabsBar === 'false' || tabsBar === false,
      }">
			<div :class="header === 'fixed' ? 'fixed-header' : ''">
				<vab-top-bar />
				<div v-if="tabsBar === 'true' || tabsBar === true" :class="{ 'tag-view-show': tabsBar }">
					<div class="vab-main">
						<vab-tabs-bar />
					</div>
				</div>
			</div>
			<div class="vab-main main-padding">
				<vab-ad />
				<vab-app-main />
			</div>
		</div>
		<div v-else class="layout-container-vertical" :class="{
        fixed: header === 'fixed',
        'no-tabs-bar': tabsBar === 'false' || tabsBar === false,
      }">
			<div v-if="device === 'mobile' && collapse === false" class="mask" @click="handleFoldSideBar" />
			<vab-side-bar />
			<div class="vab-main" :class="collapse ? 'is-collapse-main' : ''">
				<div :class="header === 'fixed' ? 'fixed-header' : ''">
					<vab-nav-bar />
					<vab-tabs-bar v-if="tabsBar === 'true' || tabsBar === true" />
				</div>

				<el-container>
					<!-- 展开的企业机构 -->
					<el-aside v-if="orgdisplay === true && orgexist === true" width="200px;">
						<el-button-group>
							<el-button type="default" icon="el-icon-s-fold" @click="orgchange" circle></el-button>
							<el-button ref="orgtree" v-if="" :type="isDisplayProject?'default':'primary'"
								>机构</el-button>
							<!-- 							<span class="hideArea" @click="orgchange"></span> -->

						</el-button-group>
						<p class="treeTitle" v-show="isOneOrg" >
							<b></b>
							组织机构
						</p>
						<div class="treeOrg" v-show="isOneOrg">
							<el-tree ref="treeOrg" :data="data2" :props="defaultProps" @node-click="gettreedata"
								:highlight-current="true" node-key="id" style="height:307px;overflow: scroll;"
								:default-expanded-keys="treeOrg.defaultExpandedKeys">
              </el-tree>
						</div>
						<p class="treeTitle" v-show="isDisplayTest" style="margin-top: 10px;">
							<b></b>
							试验名称
						</p>
						<div class="treeOrg" v-show="isDisplayTest">
							<el-tree ref="treeOrg" :data="data3" :props="defaultProps" @node-click="gettesttreedata"
								:highlight-current="true" node-key="id" style="height:307px;overflow: scroll;"
								:default-expanded-keys="treeOrg.defaultExpandedKeys"></el-tree>
						</div>

					</el-aside>
					<!-- 点击折叠按钮后收起的结构 -->
					<el-aside-hide v-else-if="orgdisplay === false && orgexist === true" width="10px">
						<el-button class="showTreeBtn" type="primary" icon="arrow-right-s-fill" @click="orgchange">
						</el-button>
					</el-aside-hide>
					<!-- 右侧主要内容 -->
					<el-main>
						<vab-app-main />
					</el-main>
				</el-container>
			</div>
		</div>
		<el-backtop />
	</div>
</template>

<script>
	import {
		mapActions,
		mapGetters
	} from 'vuex'
	import {
		tokenName
	} from '@/config'
	import {
		TreeDataDealExGetData,
	} from '@/global/tree_deal'
	import {
		getTreeList
	} from '@/api/tree'
	import {
		TreeDataDeal
	} from '@/global/tree_deal.js'
  import {
    getPersonel
  } from '@/utils/userInfo'
	import {
		unwantedReloadRouthPath
	} from '@/config'
	export default {
		name: 'Layout',
		data() {
			return {
				projectData: [],
				project: {
					defaultExpandedKeys: [],
				},
				treeOrg: {
					defaultExpandedKeys: [],
				},
				showyfdc: true,
				isOneOrg: true,
				isDisplayTest: true,
				isDisplayProject: false,
				oldLayout: '',
				data2: [],
				data3: [],
				defaultProps: {
					children: 'children',
					label: 'name',
				},
			}
		},
		computed: {
			...mapGetters({
				layout: 'settings/layout',
				tabsBar: 'settings/tabsBar',
				collapse: 'settings/collapse',
				header: 'settings/header',
				device: 'settings/device',
				orgexist: 'settings/orgexist',
				orgdisplay: 'settings/orgdisplay',
				current_org: 'org/current_org',
				current_and_chrilren_org: 'org/current_and_chrilren_org',
			}),
			classObj() {
				return {
					mobile: this.device === 'mobile',
				}
			},
		},
		beforeMount() {
			window.addEventListener('resize', this.handleResize)
		},
		beforeDestroy() {
			window.removeEventListener('resize', this.handleResize)
		},
		mounted() {
			this.oldLayout = this.layout
			const userAgent = navigator.userAgent
			if (userAgent.includes('Juejin')) {
				this.$baseAlert(
					'vue-admin-beautiful不支持在掘金内置浏览器演示，请手动复制以下地址到浏览器中查看http://mpfhrd48.sanxing.uz7.cn/vue-admin-beautiful'
				)
			}
			const isMobile = this.handleIsMobile()
			if (isMobile) {
				if (isMobile) {
					//横向布局时如果是手机端访问那么改成纵向版
					this.$store.dispatch('settings/changeLayout', 'vertical')
				} else {
					this.$store.dispatch('settings/changeLayout', this.oldLayout)
				}
				this.$store.dispatch('settings/toggleDevice', 'mobile')
				setTimeout(() => {
					this.$store.dispatch('settings/foldSideBar')
				}, 2000)
			} else {
				this.$store.dispatch('settings/openSideBar')
			}
			this.$nextTick(() => {
				this.getTreeListFuc(1)
				this.projectLoad();
				window.addEventListener(
					'storage',
					(e) => {
						if (e.key === tokenName || e.key === null) window.location.reload()
						if (e.key === tokenName && e.value === null)
							window.location.reload()
					},
					false
				)
			})
		},
		methods: {
			...mapActions({
				changeorgdisplay: 'settings/changeorgdisplay',
			}),
			async proJectCick(node) {
				await this.$store.dispatch('projectInfo/setCurrent_org', node);
				console.log(this.$route.path);
				console.log(this.$route);
				///index
			},
			getRoutePath() {
				try {
					return this.$route.path;
				} catch (e) {
					console.log(e);
					return '';
				}

			},
			IsReloadRouterView() {
				try {
					let path = this.getRoutePath();
					if (unwantedReloadRouthPath && path) {
						try {
							console.log('unwantedReloadRouthPath',unwantedReloadRouthPath);
							console.log('unwantedReloadRouthPath',unwantedReloadRouthPath);
							let index = unwantedReloadRouthPath.indexOf(path)
							if (index >= 0) {
								return false;
							}
						} catch (e) {
							console.log(e);
						}
					}
					this.reloadRouterView();
					return true;
				} catch (e) {
					console.log(e);
					return false;
				}
			},
			reloadRouterView() {
				this.$baseEventBus.$emit('reload-router-view')
			},
			async projectLoad() {
				const data = await this.$store.dispatch('projectInfo/GetData');
				this.projectData = data;
			},
			orgchange() {
				this.changeorgdisplay()
			},
			projecttreechange() {
				this.$nextTick(() => {
					//this.$refs["orgtree"].type = "default"
					//this.$refs["projecttree"].type = "primary"
					this.isDisplayProject = true
					this.isOneOrg = false
				})

			},
			orgtreechange() {
				//this.$refs["orgtree"].type = "primary"
				//this.$refs["projecttree"].type = "default"
				this.isDisplayProject = false
				this.isOneOrg = true
			},
			async getTreeListFuc(flag) {
				const tree1 = await this.$store.dispatch('org/SetOrgStore')
				this.data2 = tree1

				let select_list = []
				let queryForm = {}
				let sqlcode = 930
				const data = await TreeDataDealExGetData(
					sqlcode,
					select_list,
					queryForm,
					0,
					'id',
					'group_id',
					'hasChildren'
				)
				console.log(data)
				this.data3 = data
				this.$nextTick(() => {
					// treeBox 元素的ref   value 绑定的node-key
					console.log(tree1)
					if (this.current_org.length > 8) {
						this.isOneOrg = false
					}
					let array = []
					let arryTemp = []
					let temp = this.current_org.toString()
					for (let i = 0; i < temp.length; i++) {
						arryTemp.push(temp[i])
						array.push(arryTemp.join(''))
					}
					this.treeOrg.defaultExpandedKeys = array
					this.$refs.treeOrg.setCurrentKey(this.current_org.toString());
					console.log('getTreeListFuc current_org', this.current_org);
					console.log('getTreeListFuc defaultExpandedKeys', array);
				});
			},
			async gettreedata(node) {
				console.log(this.current_org)

				console.log(node)
				await this.$store.dispatch('org/setCurrent_org', node);
				this.IsReloadRouterView();
				//console.log(this.current_org)
				//console.log(this.current_and_chrilren_org)
				//this.$baseEventBus.$emit('reload-router-view')
				//await this.$store.dispatch('org/current_org')
			},
			async gettesttreedata(node) {
        await this.$store.dispatch('testInfo/setCurrent_Object', node);
			},
			handleIsMobile() {
				return document.body.getBoundingClientRect().width - 1 < 992
			},
			handleResize() {
				if (!document.hidden) {
					const isMobile = this.handleIsMobile()
					if (isMobile) {
						//横向布局时如果是手机端访问那么改成纵向版
						this.$store.dispatch('settings/changeLayout', 'vertical')
					} else {
						this.$store.dispatch('settings/changeLayout', this.oldLayout)
					}

					this.$store.dispatch(
						'settings/toggleDevice',
						isMobile ? 'mobile' : 'desktop'
					)
				}
			},
			handleFoldSideBar() {},
		},
	}
</script>
<style lang="scss" scoped>
	/* 组织机构树  点击树结构项的选中颜色 */
	aside.el-aside {
		background: #fff;
		border-radius: 5px;
		margin: 10px 0 0 10px;
		padding: 10px;
		box-sizing: border-box;
		border: 1px solid #dbe0e6;
		box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    width:200px;

	}
// .treeOrg{
// height:100%;overflow: hidden;
// }
// .el-tree-node{height:100%;
//   overflow-y:scroll!important;overflow-x:scroll!important;}
	// 无效样式 不起作用--------
	.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
		background-color: #6598ff;
	}
.el-tree-node > .el-tree-node__children{overflow-x: scroll!important;}
	// -------------


	div.yfdc_black {
		display: block;
		width: 100%;
		height: 40px;
		border-bottom: 1px solid #000;
		background-color: #0f0;
		position: fixed;
		left: 0px;
		right: 0px;
		top: 0px;
		bottom: 0px;
		z-index: $base-z-index + 9;

		p {
			float: left;
			position: relative;
			margin-left: 100px;
			margin-top: 2px;
			text-align: center;
			font-size: 1.5em;
		}
	}

	@mixin fix-header {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		z-index: $base-z-index - 2;
		width: 100%;
		overflow: hidden;
	}

	.vue-admin-beautiful-wrapper {
		position: relative;
		width: 100%;
		height: 100%;

		.layout-container-horizontal {
			position: relative;

			&.fixed {
				padding-top: calc(#{$base-top-bar-height} + #{$base-tabs-bar-height});
			}

			&.fixed.no-tabs-bar {
				padding-top: $base-top-bar-height;
			}

			::v-deep {
				.vab-main {
					width: 88%;
					margin: auto;

					.treeOrg {
						height: $base-app-main-height;
						overflow-y: scroll;
					}
				}

				.fixed-header {
					@include fix-header;
				}

				.tag-view-show {
					background: $base-color-white;
					box-shadow: $base-box-shadow;
				}

				.nav-bar-container {
					.fold-unfold {
						display: none;
					}
				}

				.main-padding {
					.app-main-container {
						margin-top: $base-padding;
						margin-bottom: $base-padding;
						background: $base-color-white;
					}
				}
			}
		}

		.layout-container-vertical {
			position: relative;

			.mask {
				position: fixed;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				z-index: $base-z-index - 1;
				width: 100%;
				height: 100vh;
				overflow: hidden;
				background: #000;
				opacity: 0.5;
			}

			&.fixed {
				padding-top: calc(#{$base-nav-bar-height} + #{$base-tabs-bar-height});
			}

			&.fixed.no-tabs-bar {
				padding-top: $base-nav-bar-height;
			}

			.vab-main {
				position: relative;
				min-height: 100%;
				margin-left: $base-left-menu-width;
				background: #f6f8f9;
				transition: $base-transition;

				::v-deep {
					.fixed-header {
						@include fix-header;

						left: $base-left-menu-width;
						width: $base-right-content-width;
						box-shadow: $base-box-shadow;
						transition: $base-transition;
					}

					.nav-bar-container {
						position: relative;
						box-sizing: border-box;
					}

					.tabs-bar-container {
						box-sizing: border-box;
					}

					.app-main-container {
						// margin: $base-padding auto;
						// margin: 10px auto 0;
						// background: $base-color-white;
						// border-radius: $base-border-radius;
					}
				}

				&.is-collapse-main {
					margin-left: $base-left-menu-width-min;

					::v-deep {
						.fixed-header {
							left: $base-left-menu-width-min;
							width: calc(100% - 65px);
						}
					}
				}
			}
		}

		//新添加机构树 2020-12-18王玲慧
		.el-button-group {
			width: 100%;
			box-sizing: border-box;
			padding-bottom: 6px;

			// border-bottom: 1px solid #ebeef5;
			span {
				width: 30px;
				height: 30px;
				display: inline-block;
				border-radius: 50%;
				margin-right: 19px;
			}

			.hideArea {
				background: #eef4ff url('../assets/images/treeIcons.png') no-repeat 4px 4px;
				// box-shadow: 0 0 6px 1px #00b4ff;
			}

			.hideTree {
				background: #eef4ff url('../assets/images/treeIcons.png') no-repeat 5px -19px;
				// box-shadow: 0 0 6px 1px #fdbf5e;
			}

			.showTree {
				background: #eef4ff url('../assets/images/treeIcons.png') no-repeat 4px -45px;
				// box-shadow: 0 0 6px 1px #ff3d57;
			}

			.searchUnit {
				background: #eef4ff url('../assets/images/treeIcons.png') no-repeat 4px -73px;
				// box-shadow: 0 0 6px 1px #0184ff;
				margin-right: 0px !important;
			}
		}

		.treeTitle {
			width: 100%;
			// border-bottom: 1px solid #ebeef5;
			padding: 10px 0 10px 30px;
			box-sizing: border-box;
			margin: 0px 0 10px 0;
			position: relative;
			text-align: left;
			color: #606266;
			font-weight: bold;
			background: #ecf5ff;
			border-radius: 0 20px 20px 0;

			b {
				width: 30px;
				height: 30px;
				display: block;
				position: absolute;
				background: url('../assets/images/treeIcons.png') no-repeat -41px 0px;
				top: 1px;
				left: 0px;
			}
		}

		.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
			background-color: #f5f7fa !important;
		}

		.el-aside {
			position: relative;
			overflow: inherit;
		}

		.showTreeBtn {
			width: 40px;
			height: 45px;
			background: url('../assets/images/showTreeBar.png') no-repeat;
			position: absolute;
			border: none;
			top: 200px;
			z-index: 999;
		}

		.el-main {
			margin: 10px 0 0 10px;
		}


		/* 手机端开始 */
		&.mobile {
			::v-deep {

				.el-pager,
				.el-pagination__jump {
					// 2021-02-01 注释页数跳转
					//display: none;
				}

				.layout-container-vertical {
					.el-scrollbar.side-bar-container.is-collapse {
						width: 0;
					}

					.vab-main {
						width: 100%;
						margin-left: 0;
					}
				}

				.vab-main {
					.fixed-header {
						left: 0 !important;
						width: 100% !important;
					}
				}
			}
		}

		/* 手机端结束 */
	}
</style>

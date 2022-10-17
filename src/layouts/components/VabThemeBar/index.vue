<template>
  <span v-if="themeBar">
    <vab-icon
      title="站内通知"
      :icon="['fas', 'palette']"
      @click="handleOpenThemeBar"
    />
    <div class="theme-bar-setting none">
      <div @click="handleOpenThemeBar">
        <vab-icon :icon="['fas', 'palette']" />
        <p>站内通知</p>
      </div>
    </div>

    <el-drawer
      title="通知消息"
      :visible.sync="drawerVisible"
      direction="rtl"
      append-to-body
      size="700px"
    >
      <div style="padding: 15px;">
        <el-table :data="gridData" >
          <el-table-column property="title" label="页面" width="150"></el-table-column>
          <el-table-column property="message" label="通知"></el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="80px" align="center"
          >
            <template #default="{ row }">
              <el-button type="success" size="mini" @click="handleEdit(row)" plain>
                已读
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
<!--      <el-button @click="test" >测试</el-button> -->
    </el-drawer>
  </span>
</template>

<script>
  import variables from '@/styles/variables.scss'
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import {
    QueryExec
  } from '@/api/table'
  import { layout as defaultLayout } from '@/config'
  export default {
    name: 'VabThemeBar',
    data() {
      return {
        drawerVisible: false,
        theme: {
          name: 'default',
          layout: '',
          header: 'fixed',
          tabsBar: '',
        },
        gridData: [],
      }
    },
    computed: {
      ...mapGetters({
        layout: 'settings/layout',
        header: 'settings/header',
        tabsBar: 'settings/tabsBar',
        themeBar: 'settings/themeBar',
        current_org: '',
        noticeList: 'notification/noticeList',
        person_id: 'user/person_id'
      }),

    },
    created() {
      this.$baseEventBus.$on('theme', () => {
        this.handleOpenThemeBar()
      })
      const theme = localStorage.getItem('vue-admin-beautiful-theme')
      if (null !== theme) {
        this.theme = JSON.parse(theme)
        this.handleSetTheme()
      } else {
        this.theme.layout = this.layout
        this.theme.header = this.header
        this.theme.tabsBar = this.tabsBar
      }
      this.refreshMessage()
    },
    methods: {
      ...mapActions({
        changeLayout: 'settings/changeLayout',
        changeHeader: 'settings/changeHeader',
        changeTabsBar: 'settings/changeTabsBar',
      }),
      handleIsMobile() {
        return document.body.getBoundingClientRect().width - 1 < 992
      },
      handleOpenThemeBar() {
        this.drawerVisible = true
      },
      refreshMessage() {
        let that=this
        let timer = setInterval(async () => {
          await that.getMessageFromServer()
        },30000)
      },
      handleEdit() {
      
      },
      async getMessageFromServer() {
        let sData='[Q]903{'+this.person_id+'$`0}|^SYS'
        const res = await QueryExec(sData)
        this.gridData = res.data
        console.log(sData,res)
      },
      async test() {
        await this.$store.commit("notification/putNoticeList",["123","456"])
        this.gridData = this.noticeList
        console.log(this.noticeList)
      },
      handleSetTheme() {
        let { name, layout, header, tabsBar } = this.theme
        localStorage.setItem(
          'vue-admin-beautiful-theme',
          `{
            "name":"${name}",
            "layout":"${layout}",
            "header":"${header}",
            "tabsBar":"${tabsBar}"
          }`
        )
        if (!this.handleIsMobile()) this.changeLayout(layout)
        this.changeHeader(header)
        this.changeTabsBar(tabsBar)
        document.getElementsByTagName(
          'body'
        )[0].className = `vue-admin-beautiful-theme-${name}`
        this.drawerVisible = false
      },
      handleSaveTheme() {
        this.handleSetTheme()
      },
      handleSetDfaultTheme() {
        let { name } = this.theme
        document
          .getElementsByTagName('body')[0]
          .classList.remove(`vue-admin-beautiful-theme-${name}`)
        localStorage.removeItem('vue-admin-beautiful-theme')
        this.$refs['form'].resetFields()
        Object.assign(this.$data, this.$options.data())
        this.changeHeader(defaultLayout)
        this.theme.name = 'default'
        this.theme.layout = this.layout
        this.theme.header = this.header
        this.theme.tabsBar = this.tabsBar
        this.drawerVisible = false
      },
      handleGetCode() {
        const url ='';
          //'https://github.com/chuzhixin/vue-admin-beautiful/tree/master/src/views'
        let path = this.$route.path + '/index.vue'
        if (path === '/vab/menu1/menu1-1/menu1-1-1/index.vue') {
          path = '/vab/nested/menu1/menu1-1/menu1-1-1/index.vue'
        }
        if (path === '/vab/icon/awesomeIcon/index.vue') {
          path = '/vab/icon/index.vue'
        }
        if (path === '/vab/icon/remixIcon/index.vue') {
          path = '/vab/icon/remixIcon.vue'
        }
        if (path === '/vab/icon/colorfulIcon/index.vue') {
          path = '/vab/icon/colorfulIcon.vue'
        }
        if (path === '/vab/table/comprehensiveTable/index.vue') {
          path = '/vab/table/index.vue'
        }
        if (path === '/vab/table/inlineEditTable/index.vue') {
          path = '/vab/table/inlineEditTable.vue'
        }
        window.open(url + path)
      },
    },
  }
</script>

<style lang="scss" scoped>
  @mixin right-bar {
    position: fixed;
    right: 0;
    z-index: $base-z-index;
    width: 60px;
    min-height: 60px;
    text-align: center;
    cursor: pointer;
    background: $base-color-blue;
    border-radius: $base-border-radius;

    > div {
      padding-top: 10px;
      border-bottom: 0 !important;

      &:hover {
        opacity: 0.9;
      }

      & + div {
        border-top: 1px solid $base-color-white;
      }

      p {
        padding: 0;
        margin: 0;
        font-size: $base-font-size-small;
        line-height: 30px;
        color: $base-color-white;
      }
    }
  }

  .theme-bar-setting {
    @include right-bar;

    top: calc((100vh - 110px) / 2);

    ::v-deep {
      svg:not(:root).svg-inline--fa {
        display: block;
        margin-right: auto;
        margin-left: auto;
        color: $base-color-white;
      }

      .svg-icon {
        display: block;
        margin-right: auto;
        margin-left: auto;
        font-size: 20px;
        color: $base-color-white;
        fill: $base-color-white;
      }
    }
  }

  .el-drawer__body {
    padding: 20px;
  }
</style>
<style lang="scss">
  .el-drawer__wrapper {
    outline: none !important;

    * {
      outline: none !important;
    }
  }

  .vab-color-picker {
    .el-color-dropdown__link-btn {
      display: none;
    }
  }
</style>

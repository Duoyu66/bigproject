<template>
  <div class="more-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
        <el-card>
          <div slot="header">
            开源版本
            <el-button style="float: right; padding: 3px 0" type="text">
              永久免费 个人/商业使用
            </el-button>
          </div>
          <div>
            <ul>
              <li>永久开源免费，支持横纵布局切换</li>
              <li>
                保留浏览器控制台打印即可免费商用，页面中的作者信息可全部去除，无需保留，可快速入手框架，包含打包优化，公共外框布局layout本地化及自定义教程
              </li>
              <li>
                开源地址
                <a
                  target="_blank"
                  href=""
                >
                  如果有幸帮到了你，麻烦给个star
                </a>
              </li>
              <li>提供讨论群专属文档，QQ群 972435319、1139183756</li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
        <el-card>
          <div slot="header">
            VIP群（自愿原则）
            <el-button style="float: right; padding: 3px 0" type="text">
              ￥100
            </el-button>
          </div>
          <div>
            <ul>
              <li>支持以上所有特权</li>
              <li>支持四种主题</li>
              <li>
                vip群提供终身技术支持、专属文档及视频教程、pro文档、es6文档等
              </li>
              <li>QQ咨询 1204505056</li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
        <el-card>
          <div slot="header">
            PRO版
            <el-button style="float: right; padding: 3px 0" type="text">
              ￥699
            </el-button>
          </div>
          <div>
            <ul>
              <li>
                演示地址：
                <a
                  target="_blank"
                  href="https://chu1204505056.gitee.io/vue-admin-beautiful-pro"
                >
                  点我
                </a>
              </li>
              <li>PRO独立版本与开源版本不同</li>
              <li>
                无版权限制，无需额外配置，拿来即用，支持权限精确到权限点，按钮级权限取反，支持代码一键生成
              </li>
              <li>免费加入vue-admin-beautifl github团队</li>
              <li>提供25种布局主题搭配</li>
              <li>图标使用方式大为简化</li>
              <li>支持国际化语言包、中英文无缝切换</li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'More',
    components: {},
    data() {
      return { nodeEnv: process.env.NODE_ENV }
    },
    created() {},
    mounted() {},
    methods: {},
  }
</script>
<style lang="scss" scoped>
  .more-container {
    ::v-deep {
      .el-card__body {
        > div {
          min-height: 220px;
          padding: 20px;

          > ul {
            > li {
              line-height: 30px;
            }
          }

          > img {
            display: block;
            margin: 40px auto;
            border: 1px solid #dedede;
          }
        }
      }
    }
  }
</style>

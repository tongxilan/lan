<template>
  <div class="app-view">
    <van-tabs v-model="active" line-height=".08rem" title-inactive-color="rgb(65, 82, 97)" title-active-color="rgb(0, 78, 162)" sticky>
      <van-tab v-if="tabs[0]" name="im" title="三重一大">
          <div class="main">
            <im-view/>
          </div>
      </van-tab>
      <van-tab v-if="tabs[1]" name="hr" title="人力资源">
          <div class="main">
            <hr-view/>
          </div>
      </van-tab>
      <van-tab v-if="tabs[2]" name="ad" title="审计">
          <div class="main">
            <ad-view/>
          </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import {
    Tab,
    Tabs
} from "vant";

import hrView from '../hr/hr.vue'
import adView from '../ad/ad.vue'
import imView from '../im/im.vue'
export default {
    data () {
        return {
            active: 'ad',
            tabs: [true, true, true]
        }
    },
    components: {
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
        hrView,
        adView,
        imView
    },
    mounted() {
        if(this.$route.query) {
            this.active = this.$route.query.type
            this.tabs = [JSON.parse(this.$route.query.szyd), JSON.parse(this.$route.query.rlzy), JSON.parse(this.$route.query.sj)]
        }
    }
};
</script>

<style lang="less" scoped>
.app-view {
    /deep/ .van-tabs__wrap {
        height: 1.5rem;
        border-bottom: 0.2rem solid #f2f4f7;
        .van-tab {
            font-size: 0.38rem;
            line-height: 1rem;
        }
        .van-tabs__line {
            background: rgb(0, 78, 162);
        }
    }
}
</style>
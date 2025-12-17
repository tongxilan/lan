<template>
  <div class="wrap">
    <dv-loading class="loading" v-show="requestNum != 0">Loading...</dv-loading>

    <div class="year">
      <div class="btn">
        <van-button round @click="showPicker = true"
          >{{ yearValue }}<van-icon name="arrow-down"></van-icon
        ></van-button>
      </div>
      <van-popup v-model="showPicker" position="bottom">
        <van-picker
          value-key="year"
          show-toolbar
          :columns="yearColumns"
          @confirm="onConfirm"
          @cancel="showPicker = false"
        />
      </van-popup>
    </div>
    <div class="all-chart">
      <div class="all-chart-item">
        <div class="left">
          <div class="name">审计项目总数</div>
          <div class="num">{{ adcountArr.item }}</div>
        </div>
        <img
          class="right"
          src="../../assets/images/ad-all-chart-icon-1.png"
          alt=""
        />
      </div>
      <div class="all-chart-item">
        <div class="left">
          <div class="name">审计项目总数</div>
          <div class="num">{{ adcountArr.staff }}</div>
        </div>
        <img
          class="right"
          src="../../assets/images/ad-all-chart-icon-2.png"
          alt=""
        />
      </div>
    </div>
    <div class="chart-item">
      <div class="title">分审计类型项目数量/比例</div>
      <van-empty v-show="showChart.AdTypeCount" description="暂无数据" />
      <div v-show="!showChart.AdTypeCount">
        <div style="height: 5.73rem" ref="AdTypeCount"></div>
        <div class="label-list">
          <div
            v-for="i in AdTypeCountData.data"
            :key="i.id"
            class="item"
            style="width: 50%"
          >
            <div class="name">
              <span class="tag" :style="{ background: i.color }"></span>
              <span class="detail">{{ i.name }}</span>
              <span class="num"
                >{{ InitializeNum(i.value / AdTypeCountData.combined) }}%</span
              >
            </div>
            <div class="num">{{ i.value }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="chart-item">
      <div class="title">分审计类型平均审计天数</div>
      <van-empty v-show="showChart.AdTypeAvgDay" description="暂无数据" />
      <div v-show="!showChart.AdTypeAvgDay">
        <div
          style="padding: 0 0.43rem"
          :style="{ height: AdTypeAvgDayHeight + 'rem' }"
          ref="AdTypeAvgDay"
        ></div>
      </div>
    </div>
    <div class="chart-item">
      <div class="title">每月启动/完成审计项目数量</div>
      <van-empty v-show="showChart.dateTrend" description="暂无数据" />
      <div
        v-show="!showChart.dateTrend"
        v-click-outside="dateTrendHasClickedOutsideBoxy"
        style="height: 8rem; padding: 0 0.43rem"
        ref="dateTrend"
      ></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";

import {
  Cell,
  CellGroup,
  Circle,
  Picker,
  Popup,
  Button,
  Icon,
  Empty,
} from "vant";

export default {
  data() {
    return {
      requestNum: 5,
      showPicker: false,
      yearValue: "",
      yearColumns: [],
      adcountArr: {
        item: 0,
        staff: 0,
      },
      AdTypeAvgDayHeight: "",
      showChart: {
        AdTypeCount: false,
        AdTypeAvgDay: false,
        dateTrend: false,
      },
      AdTypeCountData: {
        data: [
          { name: "内部控制审计", value: "2" },
          { name: "建设项目审计", value: "1" },
          { name: "经济责任审计", value: "1" },
          { name: "绩效审计", value: "25" },
        ],
      },

      dateTrendTimer: null,

      dateTrendChart: null,
    };
  },

  components: {
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [Circle.name]: Circle,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    [Button.name]: Button,
    [Icon.name]: Icon,
    [Empty.name]: Empty,
  },
  mounted() {
    this.initialization();
  },
  methods: {
    initialization() {
      this.getYear();
    },

    onConfirm(value) {
      let _this = this;
      _this.requestNum = 5;
      clearInterval(_this.dateTrendTimer);
      _this.dateTrendTimer = null;
      this.drawingAdcountChart(value.year);
      this.drawingAdTypeCountChart(value.year);
      this.drawingAdTypeAvgDayChart(value.year);
      this.drawingDateTrendChart(value.year);
      this.yearValue = value.year;
      this.showPicker = false;
    },

    getYear() {
      this.$http.post("/data_submit/imSrc/getYear").then((res) => {
        this.yearValue = res.data[0].year;
        this.yearColumns = res.data;
        this.drawingAdcountChart(this.yearValue);
        this.drawingAdTypeCountChart(this.yearValue);
        this.drawingAdTypeAvgDayChart(this.yearValue);
        this.drawingDateTrendChart(this.yearValue);
      });
    },
    drawingAdcountChart(year) {
      this.$http
        .post("/data_submit/adSrc/getAdcount", {
          year,
        })
        .then((res) => {
          this.requestNum = this.requestNum - 1;
          this.adcountArr.item = res.num;
          this.adcountArr.staff = res.num2;
        });
    },
    // 分审计类型项目数量
    drawingAdTypeCountChart(year) {
      this.$http
        .post("/data_submit/adSrc/getAdTypeCount", {
          year,
        })
        .then((res) => {
          this.requestNum = this.requestNum - 1;
          if (res.data.length <= 0) {
            this.showChart.AdTypeCount = true;
          } else {
            this.showChart.AdTypeCount = false;
            let arr = {
              data: res.data,
              color: [
                "#004EA2",
                "#1F8ECD",
                "#0EA29A",
                "#EA5405",
                "#95AFDB",
                "#FFE100",
              ],
              ref: "AdTypeCount",
              modelName: "AdTypeCountData",
              combined: 0,
            };
            this.drawingPieChart(arr);
          }
        });
    },
    // 分审计类型平均审计天数
    drawingAdTypeAvgDayChart(year) {
      this.$http
        .post("/data_submit/adSrc/getAdTypeAvgDay", {
          year,
        })
        .then((res) => {
          this.requestNum = this.requestNum - 1;
          if (res.data.length <= 0) {
            this.showChart.AdTypeAvgDay = true;
          } else {
            this.showChart.AdTypeAvgDay = false;
            this.AdTypeAvgDayHeight = res.data.length * 1.6;
            this.$nextTick(() => {
              let myEcharts = echarts.init(this.$refs.AdTypeAvgDay);
              let data = res.data;
              let salvProName = [];
              let salvProValue = [];

              for (let i of data) {
                salvProName.push(i.name);
                salvProValue.push(i.value);
              }
              var salvProMax = []; //背景按最大值
              for (let i = 0; i < salvProValue.length; i++) {
                var max = Math.max.apply(null, salvProValue);
                salvProMax.push(max);
              }
              let option = (option = {
                grid: {
                  left: "0%",
                  right: "0%",
                  bottom: "0%",
                  top: "0%",
                  containLabel: true,
                },
                xAxis: {
                  show: false,
                  type: "value",
                },
                yAxis: [
                  {
                    type: "category",
                    inverse: true,
                    axisLabel: {
                      show: true,
                      formatter: function (e, i) {
                        return (
                          "{name|" +
                          salvProName[i] +
                          "} \n" +
                          "{num|" +
                          salvProValue[i] +
                          "}"
                        );
                      },
                      rich: {
                        name: {
                          color: "#415261",
                          fontSize: 16,
                          baseline: "middle",
                        },
                        num: {
                          color: "#004EA2",
                          fontWeight: "bold",
                          fontSize: 16,
                          padding: [5, 5, 0, 0],
                          baseline: "middle",
                        },
                      },
                    },
                    splitLine: {
                      show: true,
                    },
                    axisTick: {
                      show: false,
                    },
                    axisLine: {
                      show: false,
                    },
                    data: salvProName,
                  },
                ],
                series: [
                  {
                    name: "值",
                    type: "bar",
                    zlevel: 1,
                    itemStyle: {
                      normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                          {
                            offset: 0,
                            color: "#1F8ECD",
                          },
                          {
                            offset: 1,
                            color: "#003A7C",
                          },
                        ]),
                      },
                    },
                    barWidth: 20,
                    data: salvProValue,
                  },
                  {
                    name: "背景",
                    type: "bar",
                    barWidth: 20,
                    barGap: "-100%",
                    data: salvProMax,
                    itemStyle: {
                      normal: {
                        color: "#F2F5F7",
                      },
                    },
                  },
                ],
              });
              myEcharts.resize();
              myEcharts.setOption(option);
            });
          }
        });
    },
    // 每月启动/完成审计项目数量
    drawingDateTrendChart(year) {
      this.$http
        .post("/data_submit/adSrc/getDateTrend", {
          year,
        })
        .then((res) => {
          this.requestNum = this.requestNum - 1;
          if (res.data.length <= 0) {
            this.showChart.dateTrend = true;
          } else {
            this.showChart.dateTrend = false;
            this.dateTrendChart = echarts.init(this.$refs.dateTrend);
            let data = res.data;
            let nameArr = [],
              qidongArr = [],
              wanchengArr = [];
            for (let i of data) {
              nameArr.push(i.name);
              qidongArr.push(i.qd);
              wanchengArr.push(i.wc);
            }
            let option = {
              backgroundColor: "#fff",
              color: ["#38BEEF"],
              grid: {
                left: "0%",
                right: "0%",
                bottom: "10%",
                top: "27%",
                containLabel: true,
              },
              legend: {
                height: 200,
                backgroundColor: "#EDEDED",
                data: ["启动", "完成"],
                textStyle: {
                  color: "#415261",
                  fontSize: 13,
                  lineHeight: 20,
                },
              },
              tooltip: {
                trigger: "axis",
              },
              dataZoom: [
                {
                  xAxisIndex: 0, //这里是从X轴的0刻度开始
                  show: false, //是否显示滑动条，不影响使用
                  type: "slider", // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                  startValue: 0, // 从头开始。
                  endValue: 3, // 一次性展示5个。
                },
              ],
              xAxis: [
                {
                  type: "category",
                  data: nameArr,
                  axisLine: {
                    show: false,
                  },
                  axisTick: {
                    show: false,
                  },
                  axisLabel: {
                    show: true,
                    rotate: 0,
                    interval: 0,
                    textStyle: {
                      padding: [8, 0, 0, 0],
                      fontSize: 14,
                      color: "#808E99",
                    },
                  },
                },
              ],
              yAxis: {
                type: "value",
                axisLine: {
                  show: false,
                },
                axisTick: {
                  show: false,
                },
                splitLine: {
                  lineStyle: {
                    color: "#9fa0a0",
                  },
                },
                axisLabel: {
                  formatter: "{value} ",
                  show: true,
                  textStyle: {
                    color: "#AAB6C0",
                    fontSize: 14,
                  },
                },
              },
              series: [
                {
                  name: "启动",
                  type: "bar",
                  data: qidongArr,
                  barWidth: 15,
                  itemStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: "#1F8ECD",
                        },
                        {
                          offset: 1,
                          color: "#003A7C",
                        },
                      ]),
                    },
                  },
                },
                {
                  name: "完成",
                  type: "bar",
                  data: wanchengArr,
                  barWidth: 15,
                  itemStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: "#F39800",
                        },
                        {
                          offset: 1,
                          color: "#EA5405",
                        },
                      ]),
                    },
                  },
                },
              ],
            };
            this.dateTrendChart.setOption(option);
            this.dateTrendTimer = setInterval(() => {
              this.dateTrendChart.dispatchAction({
                type: "hideTip",
              });
              if (option.dataZoom[0].endValue == nameArr.length) {
                option.dataZoom[0].endValue = 4;
                option.dataZoom[0].startValue = 0;
              } else {
                option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1;
                option.dataZoom[0].startValue =
                  option.dataZoom[0].startValue + 1;
              }
              this.dateTrendChart.setOption(option);
            }, 2000);
          }
          this.requestNum = this.requestNum - 1;
        });
    },
    dateTrendHasClickedOutsideBoxy() {
      if (this.dateTrendChart) {
        this.dateTrendChart.dispatchAction({
          type: "hideTip",
        });
      }
    },
    // 饼图方法
    drawingPieChart(arr) {
      for (let i in arr.data) {
        arr.data[i].value = arr.data[i].value;
        arr.data[i].color = arr.color[i];
        arr.combined += Number(arr.data[i].value);
        delete arr.data[i].num;
      }
      this[arr.modelName] = arr;
      let myEcharts = echarts.init(this.$refs[arr.ref]);
      let option = {
        color: arr.color,
        tooltip: {
          trigger: "item",
          formatter: function (res, data) {
            if (res.componentIndex == 0) {
              return res.name + ":" + res.percent + "%";
            }
          },
        },
        series: [
          // 主要展示层的
          {
            labelLine: {
              show: false,
            },

            label: {
              show: false,
              position: "center",
            },
            radius: ["60%", "95%"],
            center: ["50%", "50%"],
            type: "pie",
            data: arr.data,
          },
          // 边框的设置
          {
            radius: ["60%", "70%"],
            center: ["50%", "50%"],
            type: "pie",
            data: [
              {
                value: 1,
                itemStyle: {
                  color: "rgba(250,250,250,0.5)",
                },
              },
            ],
          },
        ],
      };

      myEcharts.setOption(option);
    },
    // 百分比计算
    InitializeNum(val) {
      return (val * 100).toFixed(2);
    },
  },
};
</script>

<style lang="less" scoped>
.wrap {
  background: #f2f4f7;
  position: relative;
  .year {
    position: absolute;
    width: 10rem;
    top: 0;
    left: 0;
    border-bottom: 0.013333rem solid #e3e6e8;
    height: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    background: #fff;
    .btn {
      background: #fff;
      display: flex;
      align-items: center;
      .van-button {
        padding: 0.16rem 0.37rem;
        height: auto;
      }
      .van-button__text {
        font-size: 0.37rem;
      }
    }
  }
  .all-chart {
    display: flex;
    justify-content: space-between;
    padding: 1.51rem 0.32rem 0.32rem;
    .all-chart-item {
      width: 4.53rem;
      height: 2.19rem;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.32rem;
      border-radius: 0.16rem;
      .left {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .name {
          font-size: 0.37rem;
          color: #808e99;
        }
        .num {
          font-size: 0.53rem;
          color: #004ea2;
          font-weight: bold;
          margin-top: 0.21rem;
        }
      }
      .right {
        width: 0.96rem;
        height: 0.96rem;
      }
    }
  }
  .chart-item {
    background: #fff;
    margin-bottom: 0.21rem;
    position: relative;
    &:last-child {
      margin-bottom: unset;
    }
    .van-empty {
      padding-bottom: 1rem;
      &.p-empty {
        position: absolute;
        z-index: 1;
        background: #fff;
        width: 100%;
        padding: unset;
      }
    }

    .label-list {
      display: flex;
      flex-flow: wrap;
      padding: 0 0.43rem;
      margin-top: 0.3rem;
      .item {
        border-bottom: 0.01rem solid #e3e6e8;
        padding: 0.25rem 0;
        .name {
          display: flex;
          align-items: center;
          .tag {
            display: inline-block;
            width: 0.21rem;
            height: 0.21rem;
            border-radius: 0.05rem;
            margin-right: 0.16rem;
          }
          .detail {
            color: #415261;
            font-size: 0.43rem;
          }
          .num {
            color: #808e99;
            font-size: 0.32rem;
            margin-left: 0.16rem;
          }
        }
        .num {
          margin-top: 0.16rem;
          color: #004ea2;
          font-size: 0.43rem;
          margin-left: 0.37rem;
          line-height: unset;
          font-weight: 600;
        }
      }
    }
    .title {
      color: #415261;
      font-size: 0.48rem;
      line-height: 1.44rem;
      font-weight: 600;
      padding: 0 0.43rem;
      &::before {
        margin-right: 0.21rem;
        display: inline-block;
        width: 0.38rem;
        height: 0.38rem;
        content: "";
        background: url("../../assets/images/title-before-icon.png") center
          center / 100% 100% no-repeat;
      }
    }
  }

  /deep/ .van-picker {
    .van-picker__toolbar {
      height: 1rem;
      button {
        font-size: 0.43rem;
      }
    }
    .van-picker__columns {
      .van-picker-column__item {
        .van-ellipsis {
          font-size: 0.43rem;
        }
      }
    }
  }
  .loading {
    width: 100vw;
    height: 100vh;
    z-index: 20;
    position: fixed;
    top: 0;
    left: 0;
    background: #fff;
  }
}
</style>
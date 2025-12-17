export default {
    /* 人资驾驶舱接口列表 */

    // 年份
    getYear: '/hrSrc/getYear',
    // 集团司属结构
    getOrgTree: '/hrSrc/getOrgTree',
    // 总员工人数与去年同期
    getStaffCount: '/hrSrc/getStaffCount',
    // 新入职人数与同期增减
    getEntryCount: '/hrSrc/getEntryCount',
    // 核心专家人数与同期增减
    getExpertCount: '/hrSrc/getExpertCount',
    // 注册类职业资质人员与占比
    getRegisterCount: '/hrSrc/getRegisterCount',
    // 各单位人员结构分析
    getOrgConstitute: '/hrSrc/getOrgConstitute',
    // 职称结构分析
    getTitleConstitute: '/hrSrc/getTitleConstitute',
    // 性别分析
    getSexConstitute: '/hrSrc/getSexConstitute',
    // 学历分析
    getEducationConstitute: '/hrSrc/getEducationConstitute',
    // 工龄分析
    getWorkAgeConstitute: '/hrSrc/getWorkAgeConstitute',
    // 年龄分析
    getAgeConstitute: '/hrSrc/getAgeConstitute',
    // 司龄分析
    getSiAgeConstitute: '/hrSrc/getSiAgeConstitute',
    // 各月人员流动分析
    getDateTrend: '/hrSrc/getDateTrend',


    /* 审计驾驶舱接口列表 */

    // 年份
    getAdcount: '/adSrc/getYear',
    // 审计项目总数与审计人员总数
    getAdcount: '/adSrc/getAdcount',
    // 集团总部，司属企业启动/完成审计项目数量
    getOrgConstitute: '/adSrc/getOrgConstitute',
    // 分状态项目数量
    getAdStatusCount: '/adSrc/getAdStatusCount',
    // 每月启动/完成审计项目数量
    getDateTrend: '/adSrc/getDateTrend',
    // 分审计类型项目数量/比例
    getAdTypeCount: '/adSrc/getAdTypeCount',
    // 分业务类型项目数量/比例
    getAdBusinessTypeCount: '/adSrc/getAdBusinessTypeCount',
    // 分审计类型平均审计天数
    getAdTypeAvgDay: '/adSrc/getAdTypeAvgDay',

    
    /* 三重一大驾驶舱接口列表 */

    // 年份
    getYear: '/imSrc/getYear',
    // 分议题类型数量/比例
    getTopicTypeCount: '/imSrc/getTopicTypeCount',
    // 议题实施状态分布
    getTopicStates: '/imSrc/getTopicStates',
    // 议题表决情况
    getTopicVoting: '/imSrc/getTopicVoting',
    // 资金支付趋势图
    getFundPay: '/imSrc/getFundPay',
    // 十九大以来决策会议情况
    get19thMeetingTypeCountDate: '/imSrc/get19thMeetingTypeCountDate',
    // 大额资金异常预警
    getFundWarm: '/imSrc/getFundWarm',
}
// 询盘种子数据 — 10 条

export interface InquirySeed {
  name: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  productInterest: string;
  message: string;
  status: 'new' | 'read' | 'replied';
}

export const inquiries: InquirySeed[] = [
  {
    name: '赵总',
    company: '瑞达新能源科技有限公司',
    position: 'CIO',
    email: 'zhao@ruidanewenergy.com',
    phone: '13800001111',
    productInterest: '智能数据中台',
    message: '我们公司正在规划企业级数据中台项目，目前数据分散在 ERP、MES、CRM 等多个系统中。想了解贵公司数据中台的架构方案、部署模式和典型实施周期，希望能安排一次技术交流。',
    status: 'new',
  },
  {
    name: '刘经理',
    company: '万丰机械制造集团',
    position: '生产总监',
    email: 'liu@wanfengmachinery.com',
    phone: '13900002222',
    productInterest: '生产制造执行系统(MES)',
    message: '我司有 3 个工厂需要进行 MES 系统改造。目前使用的是某进口品牌的老版本系统，维护成本高且不支持国产化要求。请提供贵司 MES 系统的详细方案、成功案例和报价。',
    status: 'read',
  },
  {
    name: '陈博士',
    company: '德康生物医药',
    position: '研发副总裁',
    email: 'chen@dekangpharma.com',
    phone: '13700003333',
    productInterest: 'AI 加速药物研发平台',
    message: '我们正在探索用 AI 加速小分子药物的苗头化合物发现。贵司的 AI 药物研发平台是否支持虚拟筛选和 ADMET 预测？能否提供一个试用环境进行评估？',
    status: 'new',
  },
  {
    name: '王行长',
    company: '江南农商银行',
    position: '零售银行部总经理',
    email: 'wang@jiangnangbank.com',
    phone: '13600004444',
    productInterest: 'BI 可视化分析平台',
    message: '我们需要为管理层建设经营分析驾驶舱，覆盖存款、贷款、理财、客户等核心指标。要求支持移动端访问和实时数据刷新。请提供方案和同类银行案例。',
    status: 'new',
  },
  {
    name: '孙工',
    company: '北建智慧城市运营公司',
    position: '技术总监',
    email: 'sun@beijiansmartcity.com',
    phone: '13500005555',
    productInterest: '数字孪生可视化平台',
    message: '我们承接了一个区级的城市大脑项目，需要 3D 数字孪生可视化和事件协同调度能力。请提供数字孪生产品的技术白皮书和城市治理类案例。',
    status: 'read',
  },
  {
    name: '李总',
    company: '丰联商业地产集团',
    position: '运营管理部总经理',
    email: 'li@fenglianrealestate.com',
    phone: '13400006666',
    productInterest: '企业协同办公平台',
    message: '集团 2000+ 员工分布在全国 20 个城市，需要一套支持私有化部署的协同办公平台，包括即时通讯、文档协作和项目管理。有金融级安全要求，请提供方案和报价。',
    status: 'new',
  },
  {
    name: '周主任',
    company: '省交通运输信息中心',
    position: '信息中心主任',
    email: 'zhou@transportation-gov.cn',
    phone: '13300007777',
    productInterest: '综合交通大数据平台',
    message: '我们正在规划全省综合交通大数据平台二期建设，需要实现公路、铁路、水运数据的深度融合和 AI 预测能力。请提供一期升级方案和同级别省份案例。',
    status: 'new',
  },
  {
    name: '黄医师',
    company: '华南大学附属第一医院',
    position: '信息科主任',
    email: 'huang@hnhospital.cn',
    phone: '13200008888',
    productInterest: '智慧医院数据平台',
    message: '我院正在创建国家区域医疗中心，需要建设集团级数据平台整合 5 个院区的医疗数据。重点需求：临床数据中心、DRG 成本分析和科研数据检索。请安排技术交流。',
    status: 'read',
  },
  {
    name: '吴总',
    company: '云端数据中心有限公司',
    position: '运维总监',
    email: 'wu@clouddatacenter.cn',
    phone: '13100009999',
    productInterest: '数据中心智能运维',
    message: '我司运营 3 个大型数据中心，PUE 平均 1.5，急需节能降耗方案。贵司的 AI 制冷优化方案能否在现有基础设施上部署？预估投资回报周期是多久？',
    status: 'new',
  },
  {
    name: '钱总',
    company: '盛泰保险集团',
    position: '理赔部总经理',
    email: 'qian@shengtaiinsurance.com',
    phone: '13000001010',
    productInterest: 'AI 智能理赔系统',
    message: '公司年处理车险理赔超过 600 万件，理赔员 2000+ 人，运营成本压力大。希望了解贵司 AI 理赔系统的技术方案、实施周期和 ROI，能否提供 demo 演示？',
    status: 'replied',
  },
];

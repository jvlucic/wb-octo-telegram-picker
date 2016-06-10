const valueType = {
  NUMBER: 'number',
  PERCENTAGE: 'percentage',
  CURRENCY: 'currency',
};

const constants = {
  TIMEFRAME: {
    YESTERDAY: 'yesterday',
    TODAY: 'today',
    LAST_7_DAYS: 'last7days',
    LAST_30_DAYS: 'last30days',
    THIS_MONTH: 'thisMonth',
    LAST_MONTH: 'lastMonth',
    LIFETIME: 'lifetime',
  },
  STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    ALL: 'all',
  },
  FREQUENCY: {
    HOURLY: 'hourly',
    DAILY: 'daily',
  },
  VALUE_TYPE: valueType,
  KPI: {
    IMPRESSIONS: {
      key: 'IMPRESSIONS',
      name: 'impressions',
      color: 'rgba(150 , 156 , 87 ,0.8 )',
      enabled: true,
      valueType: valueType.NUMBER,
    },
    CLICKS: {
      key: 'CLICKS',
      name: 'Clicks',
      color: 'rgba(93 , 43 , 170 ,0.8 )',
      enabled: true,
      valueType: valueType.NUMBER,
    },
    CTR: {
      key: 'CTR',
      name: 'CTR',
      color: 'rgba(27 , 68 , 236 ,0.8 )',
      enabled: true,
      valueType: valueType.PERCENTAGE,
    },
    CONVERSION: {
      key: 'CONVERSION',
      name: 'Conversion',
      color: 'rgba(177 , 40 , 101 ,0.8 )',
      enabled: true,
      valueType: valueType.NUMBER,
    },
    CVR: {
      key: 'CVR',
      name: 'CVR',
      color: 'rgba(87 , 10 , 30 ,0.8 )',
      enabled: true,
      valueType: valueType.PERCENTAGE,
    },
    CPM: {
      key: 'CPM',
      name: 'CPM',
      color: 'rgba(80 , 238 , 78 ,0.8 )',
      enabled: false,
      valueType: valueType.CURRENCY,
    },
    CPC: {
      key: 'CPC',
      name: 'CPC',
      color: 'rgba(235 , 141 , 76 ,0.8 )',
      enabled: false,
      valueType: valueType.CURRENCY,
    },
    CPO: {
      key: 'CPO',
      name: 'CPO',
      color: 'rgba(21 , 237 , 101 ,0.8 )',
      enabled: false,
      valueType: valueType.CURRENCY,
    },
    COST: {
      key: 'COST',
      name: 'Cost',
      color: 'rgba(42 , 113 , 180 ,0.8 )',
      enabled: false,
      valueType: valueType.CURRENCY,
    },
    ORDER_VALUE: {
      key: 'ORDER_VALUE',
      name: 'Order value',
      color: 'rgba(131 , 158 , 248 ,0.8 )',
      enabled: false,
      valueType: valueType.CURRENCY,
    },
    MARGIN: {
      key: 'MARGIN',
      name: 'Margin',
      color: 'rgba(42 , 202 , 189 ,0.8 )',
      enabled: false,
      valueType: valueType.CURRENCY,
    },
    ROI: {
      key: 'ROI',
      name: 'ROI',
      color: 'rgba(80 , 222 , 153 ,0.8 )',
      enabled: false,
      valueType: valueType.PERCENTAGE,
    },
  },
};

export default constants;

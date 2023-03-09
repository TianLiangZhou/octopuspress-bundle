import { NbJSThemeOptions, COSMIC_THEME as baseTheme } from '@nebular/theme';

const {
  bg,
  bg2,
  bg3,
  bg4,
  border2,
  border3,
  border4,
  border5,
  fg,
  fgHighlight,
  fgText,
  primary,
  primaryLight,
  separator,
  success,
  successLight,
  warning,
  warningLight
} = baseTheme.variables || {};

export const COSMIC_THEME = {
  name: 'cosmic',
  base: 'cosmic',
  variables: {
    temperature: {
      arcFill: [ '#2ec7fe', '#31ffad', '#7bff24', '#fff024', '#f7bd59' ],
      arcEmpty: bg2,
      thumbBg: '#ffffff',
      thumbBorder: '#ffffff',
    },

    solar: {
      gradientLeft: primary,
      gradientRight: primary,
      shadowColor: 'rgba(0, 0, 0, 0)',
      secondSeriesFill: bg2,
      radius: ['70%', '90%'],
    },

    traffic: {
      tooltipBg: bg,
      tooltipBorderColor: border2,
      tooltipExtraCss: 'box-shadow: 0px 2px 46px 0 rgba(50, 50, 89); border-radius: 10px; padding: 4px 16px;',
      tooltipTextColor: fgText,
      tooltipFontWeight: 'normal',

      yAxisSplitLine: separator,

      lineBg: border2,
      lineShadowBlur: '14',
      itemColor: border2,
      itemBorderColor: border2,
      itemEmphasisBorderColor: primary,
      shadowLineDarkBg: border3,
      shadowLineShadow: border3,
      gradFrom: bg,
      gradTo: bg2,
    },

    electricity: {
      tooltipBg: bg,
      tooltipLineColor: fgText,
      tooltipLineWidth: '0',
      tooltipBorderColor: border2,
      tooltipExtraCss: 'box-shadow: 0px 2px 46px 0 rgba(0, 255, 170, 0.35); border-radius: 10px; padding: 8px 24px;',
      tooltipTextColor: fgText,
      tooltipFontWeight: 'normal',

      axisLineColor: border3,
      xAxisTextColor: fg,
      yAxisSplitLine: separator,

      itemBorderColor: border2,
      lineStyle: 'dotted',
      lineWidth: '6',
      lineGradFrom: success,
      lineGradTo: warning,
      lineShadow: bg4,

      areaGradFrom: bg2,
      areaGradTo: bg3,
      shadowLineDarkBg: bg3,
    },

    bubbleMap: {
      titleColor: fgText,
      areaColor: bg4,
      areaHoverColor: fgHighlight,
      areaBorderColor: border5,
    },

    profitBarAnimationEchart: {
      textColor: fgText,

      firstAnimationBarColor: primary,
      secondAnimationBarColor: success,

      splitLineStyleOpacity: '1',
      splitLineStyleWidth: '1',
      splitLineStyleColor: border2,

      tooltipTextColor: fgText,
      tooltipFontWeight: 'normal',
      tooltipFontSize: '16',
      tooltipBg: bg,
      tooltipBorderColor: border2,
      tooltipBorderWidth: '1',
      tooltipExtraCss: 'border-radius: 10px; padding: 4px 16px;',
    },

    trafficBarEchart: {
      gradientFrom: warningLight,
      gradientTo: warning,
      shadow: warningLight,
      shadowBlur: '5',

      axisTextColor: fgText,
      axisFontSize: '12',

      tooltipBg: bg,
      tooltipBorderColor: border2,
      tooltipExtraCss: 'border-radius: 10px; padding: 4px 16px;',
      tooltipTextColor: fgText,
      tooltipFontWeight: 'normal',
    },

    countryOrders: {
      countryBorderColor: border4,
      countryFillColor: bg3,
      countryBorderWidth: '1',
      hoveredCountryBorderColor: primary,
      hoveredCountryFillColor: primaryLight,
      hoveredCountryBorderWidth: '1',

      chartAxisLineColor: border4,
      chartAxisTextColor: fg,
      chartAxisFontSize: '16',
      chartGradientTo: primary,
      chartGradientFrom: primaryLight,
      chartAxisSplitLine: separator,
      chartShadowLineColor: primaryLight,

      chartLineBottomShadowColor: primary,

      chartInnerLineColor: bg2,
    },

    echarts: {
      bg: bg,
      textColor: fgText,
      axisLineColor: fgText,
      splitLineColor: separator,
      itemHoverShadowColor: 'rgba(0, 0, 0, 0.5)',
      tooltipBackgroundColor: primary,
      areaOpacity: '1',
    },

    chartjs: {
      axisLineColor: separator,
      textColor: fgText,
    },

    orders: {
      tooltipBg: bg,
      tooltipLineColor: 'rgba(0, 0, 0, 0)',
      tooltipLineWidth: '0',
      tooltipBorderColor: border2,
      tooltipExtraCss: 'border-radius: 10px; padding: 8px 24px;',
      tooltipTextColor: fgText,
      tooltipFontWeight: 'normal',
      tooltipFontSize: '20',

      axisLineColor: border4,
      axisFontSize: '16',
      axisTextColor: fg,
      yAxisSplitLine: separator,

      itemBorderColor: primary,
      lineStyle: 'solid',
      lineWidth: '4',

      // first line
      firstAreaGradFrom: bg2,
      firstAreaGradTo: bg2,
      firstShadowLineDarkBg: bg2,

      // second line
      secondLineGradFrom: primary,
      secondLineGradTo: primary,

      secondAreaGradFrom: 'rgba(161, 110, 255, 0.8)',
      secondAreaGradTo: 'rgba(161, 110, 255, 0.5)',
      secondShadowLineDarkBg: primary,

      // third line
      thirdLineGradFrom: success,
      thirdLineGradTo: successLight,

      thirdAreaGradFrom: 'rgba(0, 214, 143, 0.7)',
      thirdAreaGradTo: 'rgba(0, 214, 143, 0.4)',
      thirdShadowLineDarkBg: success,
    },

    profit: {
      bg: bg,
      textColor: fgText,
      axisLineColor: border4,
      splitLineColor: separator,
      areaOpacity: '1',

      axisFontSize: '16',
      axisTextColor: fg,

      // first bar
      firstLineGradFrom: bg2,
      firstLineGradTo: bg2,
      firstLineShadow: 'rgba(0, 0, 0, 0)',

      // second bar
      secondLineGradFrom: primary,
      secondLineGradTo: primary,
      secondLineShadow: 'rgba(0, 0, 0, 0)',

      // third bar
      thirdLineGradFrom: success,
      thirdLineGradTo: successLight,
      thirdLineShadow: 'rgba(0, 0, 0, 0)',
    },

    orderProfitLegend: {
      firstItem: success,
      secondItem: primary,
      thirdItem: bg2,
    },

    visitors: {
      tooltipBg: bg,
      tooltipLineColor: 'rgba(0, 0, 0, 0)',
      tooltipLineWidth: '1',
      tooltipBorderColor: border2,
      tooltipExtraCss: 'border-radius: 10px; padding: 8px 24px;',
      tooltipTextColor: fgText,
      tooltipFontWeight: 'normal',
      tooltipFontSize: '20',

      axisLineColor: border4,
      axisFontSize: '16',
      axisTextColor: fg,
      yAxisSplitLine: separator,

      itemBorderColor: primary,
      lineStyle: 'dotted',
      lineWidth: '6',
      lineGradFrom: '#ffffff',
      lineGradTo: '#ffffff',
      lineShadow: 'rgba(0, 0, 0, 0)',

      areaGradFrom: primary,
      areaGradTo: primaryLight,

      innerLineStyle: 'solid',
      innerLineWidth: '1',

      innerAreaGradFrom: success,
      innerAreaGradTo: success,
    },

    visitorsLegend: {
      firstIcon: success,
      secondIcon: primary,
    },

    visitorsPie: {
      firstPieGradientLeft: success,
      firstPieGradientRight: successLight,
      firstPieShadowColor: 'rgba(0, 0, 0, 0)',
      firstPieRadius: ['70%', '90%'],

      secondPieGradientLeft: warning,
      secondPieGradientRight: warningLight,
      secondPieShadowColor: 'rgba(0, 0, 0, 0)',
      secondPieRadius: ['60%', '95%'],
      shadowOffsetX: '0',
      shadowOffsetY: '3',
    },

    visitorsPieLegend: {
      firstSection: warning,
      secondSection: success,
    },

    earningPie: {
      radius: ['65%', '100%'],
      center: ['50%', '50%'],

      fontSize: '22',

      firstPieGradientLeft: success,
      firstPieGradientRight: success,
      firstPieShadowColor: 'rgba(0, 0, 0, 0)',

      secondPieGradientLeft: primary,
      secondPieGradientRight: primary,
      secondPieShadowColor: 'rgba(0, 0, 0, 0)',

      thirdPieGradientLeft: warning,
      thirdPieGradientRight: warning,
      thirdPieShadowColor: 'rgba(0, 0, 0, 0)',
    },

    earningLine: {
      gradFrom: primary,
      gradTo: primary,

      tooltipTextColor: fgText,
      tooltipFontWeight: 'normal',
      tooltipFontSize: '16',
      tooltipBg: bg,
      tooltipBorderColor: border2,
      tooltipBorderWidth: '1',
      tooltipExtraCss: 'border-radius: 10px; padding: 4px 16px;',
    },
  },
} as NbJSThemeOptions;

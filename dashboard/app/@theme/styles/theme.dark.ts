import { NbJSThemeOptions, DARK_THEME as baseTheme } from '@nebular/theme';

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

export const DARK_THEME = {
  name: 'dark',
  base: 'dark',
  variables: {
    temperature: {
      arcFill: [
        primary,
        primary,
        primary,
        primary,
        primary,
      ],
      arcEmpty: bg2,
      thumbBg: bg2,
      thumbBorder: primary,
    },

    solar: {
      gradientLeft: primary,
      gradientRight: primary,
      shadowColor: 'rgba(0, 0, 0, 0)',
      secondSeriesFill: bg2,
      radius: ['80%', '90%'],
    },

    traffic: {
      tooltipBg: bg,
      tooltipBorderColor: border2,
      tooltipExtraCss: 'border-radius: 10px; padding: 4px 16px;',
      tooltipTextColor: fgText,
      tooltipFontWeight: 'normal',

      yAxisSplitLine: separator,

      lineBg: border4,
      lineShadowBlur: '1',
      itemColor: border4,
      itemBorderColor: border4,
      itemEmphasisBorderColor: primary,
      shadowLineDarkBg: 'rgba(0, 0, 0, 0)',
      shadowLineShadow: 'rgba(0, 0, 0, 0)',
      gradFrom: bg2,
      gradTo: bg2,
    },

    electricity: {
      tooltipBg: bg,
      tooltipLineColor: fgText,
      tooltipLineWidth: '0',
      tooltipBorderColor: border2,
      tooltipExtraCss: 'border-radius: 10px; padding: 8px 24px;',
      tooltipTextColor: fgText,
      tooltipFontWeight: 'normal',

      axisLineColor: border3,
      xAxisTextColor: fg,
      yAxisSplitLine: separator,

      itemBorderColor: primary,
      lineStyle: 'solid',
      lineWidth: '4',
      lineGradFrom: primary,
      lineGradTo: primary,
      lineShadow: 'rgba(0, 0, 0, 0)',

      areaGradFrom: bg2,
      areaGradTo: bg2,
      shadowLineDarkBg: 'rgba(0, 0, 0, 0)',
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
      splitLineStyleColor: separator,

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
      shadowBlur: '0',

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
      areaOpacity: '0.7',
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
      firstAreaGradFrom: bg3,
      firstAreaGradTo: bg3,
      firstShadowLineDarkBg: 'rgba(0, 0, 0, 0)',

      // second line
      secondLineGradFrom: primary,
      secondLineGradTo: primary,

      secondAreaGradFrom: 'rgba(51, 102, 255, 0.2)',
      secondAreaGradTo: 'rgba(51, 102, 255, 0)',
      secondShadowLineDarkBg: 'rgba(0, 0, 0, 0)',

      // third line
      thirdLineGradFrom: success,
      thirdLineGradTo: successLight,

      thirdAreaGradFrom: 'rgba(0, 214, 143, 0.2)',
      thirdAreaGradTo: 'rgba(0, 214, 143, 0)',
      thirdShadowLineDarkBg: 'rgba(0, 0, 0, 0)',
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
      firstLineGradFrom: bg3,
      firstLineGradTo: bg3,
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
      thirdItem: bg3,
    },

    visitors: {
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
      firstPieGradientRight: success,
      firstPieShadowColor: 'rgba(0, 0, 0, 0)',
      firstPieRadius: ['70%', '90%'],

      secondPieGradientLeft: warning,
      secondPieGradientRight: warningLight,
      secondPieShadowColor: 'rgba(0, 0, 0, 0)',
      secondPieRadius: ['60%', '97%'],
      shadowOffsetX: '0',
      shadowOffsetY: '0',
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

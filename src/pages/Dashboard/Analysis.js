import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Menu, Dropdown, notification } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';
import styles from './Analysis.less';
import PageLoading from '@/components/PageLoading';
import { AsyncLoadBizCharts } from '@/components/Charts/AsyncLoadBizCharts';

const IntroduceRow = React.lazy(() => import('./IntroduceRow'));
const SalesCard = React.lazy(() => import('./SalesCard'));
const TopSearch = React.lazy(() => import('./TopSearch'));
const ProportionSales = React.lazy(() => import('./ProportionSales'));
const OfflineData = React.lazy(() => import('./OfflineData'));

//mock数据 v1.5.0
//{"visitData":[{"x":"2020-10-17","y":7},{"x":"2020-10-18","y":5},{"x":"2020-10-19","y":4},{"x":"2020-10-20","y":2},{"x":"2020-10-21","y":4},{"x":"2020-10-22","y":7},{"x":"2020-10-23","y":5},{"x":"2020-10-24","y":6},{"x":"2020-10-25","y":5},{"x":"2020-10-26","y":9},{"x":"2020-10-27","y":6},{"x":"2020-10-28","y":3},{"x":"2020-10-29","y":1},{"x":"2020-10-30","y":5},{"x":"2020-10-31","y":3},{"x":"2020-11-01","y":6},{"x":"2020-11-02","y":5}],"visitData2":[{"x":"2020-10-17","y":1},{"x":"2020-10-18","y":6},{"x":"2020-10-19","y":4},{"x":"2020-10-20","y":8},{"x":"2020-10-21","y":3},{"x":"2020-10-22","y":7},{"x":"2020-10-23","y":2}],"salesData":[{"x":"1月","y":930},{"x":"2月","y":681},{"x":"3月","y":740},{"x":"4月","y":867},{"x":"5月","y":298},{"x":"6月","y":1059},{"x":"7月","y":905},{"x":"8月","y":1139},{"x":"9月","y":896},{"x":"10月","y":1060},{"x":"11月","y":318},{"x":"12月","y":1117}],"searchData":[{"index":1,"keyword":"搜索关键词-0","count":49,"range":97,"status":0},{"index":2,"keyword":"搜索关键词-1","count":145,"range":57,"status":1},{"index":3,"keyword":"搜索关键词-2","count":496,"range":38,"status":1},{"index":4,"keyword":"搜索关键词-3","count":513,"range":4,"status":1},{"index":5,"keyword":"搜索关键词-4","count":166,"range":47,"status":1},{"index":6,"keyword":"搜索关键词-5","count":361,"range":42,"status":0},{"index":7,"keyword":"搜索关键词-6","count":571,"range":66,"status":0},{"index":8,"keyword":"搜索关键词-7","count":706,"range":68,"status":1},{"index":9,"keyword":"搜索关键词-8","count":154,"range":51,"status":0},{"index":10,"keyword":"搜索关键词-9","count":488,"range":56,"status":1},{"index":11,"keyword":"搜索关键词-10","count":856,"range":91,"status":0},{"index":12,"keyword":"搜索关键词-11","count":564,"range":71,"status":1},{"index":13,"keyword":"搜索关键词-12","count":887,"range":63,"status":1},{"index":14,"keyword":"搜索关键词-13","count":625,"range":93,"status":0},{"index":15,"keyword":"搜索关键词-14","count":635,"range":56,"status":0},{"index":16,"keyword":"搜索关键词-15","count":616,"range":88,"status":1},{"index":17,"keyword":"搜索关键词-16","count":298,"range":68,"status":1},{"index":18,"keyword":"搜索关键词-17","count":128,"range":48,"status":0},{"index":19,"keyword":"搜索关键词-18","count":486,"range":76,"status":0},{"index":20,"keyword":"搜索关键词-19","count":643,"range":48,"status":0},{"index":21,"keyword":"搜索关键词-20","count":299,"range":93,"status":0},{"index":22,"keyword":"搜索关键词-21","count":295,"range":56,"status":0},{"index":23,"keyword":"搜索关键词-22","count":850,"range":5,"status":0},{"index":24,"keyword":"搜索关键词-23","count":762,"range":80,"status":1},{"index":25,"keyword":"搜索关键词-24","count":397,"range":37,"status":0},{"index":26,"keyword":"搜索关键词-25","count":232,"range":7,"status":0},{"index":27,"keyword":"搜索关键词-26","count":274,"range":59,"status":0},{"index":28,"keyword":"搜索关键词-27","count":212,"range":82,"status":1},{"index":29,"keyword":"搜索关键词-28","count":851,"range":78,"status":0},{"index":30,"keyword":"搜索关键词-29","count":550,"range":57,"status":0},{"index":31,"keyword":"搜索关键词-30","count":747,"range":96,"status":0},{"index":32,"keyword":"搜索关键词-31","count":962,"range":6,"status":0},{"index":33,"keyword":"搜索关键词-32","count":79,"range":34,"status":1},{"index":34,"keyword":"搜索关键词-33","count":476,"range":80,"status":1},{"index":35,"keyword":"搜索关键词-34","count":552,"range":94,"status":1},{"index":36,"keyword":"搜索关键词-35","count":160,"range":91,"status":0},{"index":37,"keyword":"搜索关键词-36","count":969,"range":79,"status":1},{"index":38,"keyword":"搜索关键词-37","count":650,"range":65,"status":0},{"index":39,"keyword":"搜索关键词-38","count":940,"range":84,"status":1},{"index":40,"keyword":"搜索关键词-39","count":756,"range":90,"status":1},{"index":41,"keyword":"搜索关键词-40","count":34,"range":13,"status":1},{"index":42,"keyword":"搜索关键词-41","count":906,"range":61,"status":1},{"index":43,"keyword":"搜索关键词-42","count":195,"range":98,"status":1},{"index":44,"keyword":"搜索关键词-43","count":203,"range":6,"status":0},{"index":45,"keyword":"搜索关键词-44","count":909,"range":25,"status":1},{"index":46,"keyword":"搜索关键词-45","count":348,"range":23,"status":1},{"index":47,"keyword":"搜索关键词-46","count":228,"range":39,"status":0},{"index":48,"keyword":"搜索关键词-47","count":252,"range":99,"status":0},{"index":49,"keyword":"搜索关键词-48","count":995,"range":20,"status":1},{"index":50,"keyword":"搜索关键词-49","count":539,"range":6,"status":1}],"offlineData":[{"name":"Stores 0","cvr":0.4},{"name":"Stores 1","cvr":0.8},{"name":"Stores 2","cvr":0.7},{"name":"Stores 3","cvr":0.7},{"name":"Stores 4","cvr":0.3},{"name":"Stores 5","cvr":0.3},{"name":"Stores 6","cvr":0.2},{"name":"Stores 7","cvr":0.7},{"name":"Stores 8","cvr":0.6},{"name":"Stores 9","cvr":0.3}],"offlineChartData":[{"x":1602939551191,"y1":65,"y2":61},{"x":1602941351191,"y1":30,"y2":104},{"x":1602943151191,"y1":28,"y2":87},{"x":1602944951191,"y1":77,"y2":13},{"x":1602946751191,"y1":95,"y2":91},{"x":1602948551191,"y1":31,"y2":43},{"x":1602950351191,"y1":27,"y2":27},{"x":1602952151191,"y1":17,"y2":27},{"x":1602953951191,"y1":67,"y2":10},{"x":1602955751191,"y1":15,"y2":37},{"x":1602957551191,"y1":45,"y2":73},{"x":1602959351191,"y1":28,"y2":38},{"x":1602961151191,"y1":83,"y2":41},{"x":1602962951191,"y1":67,"y2":79},{"x":1602964751191,"y1":76,"y2":31},{"x":1602966551191,"y1":84,"y2":11},{"x":1602968351191,"y1":29,"y2":13},{"x":1602970151191,"y1":16,"y2":102},{"x":1602971951191,"y1":70,"y2":27},{"x":1602973751191,"y1":66,"y2":106}],"salesTypeData":[{"x":"家用电器","y":4544},{"x":"食用酒水","y":3321},{"x":"个护健康","y":3113},{"x":"服饰箱包","y":2341},{"x":"母婴产品","y":1231},{"x":"其他","y":1231}],"salesTypeDataOnline":[{"x":"家用电器","y":244},{"x":"食用酒水","y":321},{"x":"个护健康","y":311},{"x":"服饰箱包","y":41},{"x":"母婴产品","y":121},{"x":"其他","y":111}],"salesTypeDataOffline":[{"x":"家用电器","y":99},{"x":"食用酒水","y":188},{"x":"个护健康","y":344},{"x":"服饰箱包","y":255},{"x":"其他","y":65}],"radarData":[{"name":"个人","label":"引用","value":10},{"name":"个人","label":"口碑","value":8},{"name":"个人","label":"产量","value":4},{"name":"个人","label":"贡献","value":5},{"name":"个人","label":"热度","value":7},{"name":"团队","label":"引用","value":3},{"name":"团队","label":"口碑","value":9},{"name":"团队","label":"产量","value":6},{"name":"团队","label":"贡献","value":3},{"name":"团队","label":"热度","value":1},{"name":"部门","label":"引用","value":4},{"name":"部门","label":"口碑","value":1},{"name":"部门","label":"产量","value":6},{"name":"部门","label":"贡献","value":5},{"name":"部门","label":"热度","value":7}]}

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class Analysis extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('day'),
  };

  //v1.5.0
  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'chart/fetch',
        payload: {},
        callback: response => {
          //错误提示信息
          let flag = this.tipMsg(response);
          if (!flag) {
            return;
          }
        },
      });
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };

  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  //v1.5.0
  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'chart/fetchVisitData',
      payload: {
        dateType: type,
      },
      callback: response => {
        //错误提示信息
        let flag = this.tipMsg(response);
        if (!flag) {
          return;
        }
      },
    });
  };

  isActive = type => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  //v1.4.0 消息提示
  tipMsg = response => {
    let flag = false;
    let notifyType = 'warning';
    let msg = '操作失败! ';
    let showTime = 4.5;
    if (response && response.code == '200') {
      flag = true;
      return flag;
    } else if (response && response.msg && response.msg != '') {
      msg = msg + response.msg;
      showTime = 10;
      notification[notifyType]({
        message: '提示信息',
        description: msg,
        duration: showTime,
      });
    }
    return flag;
  };

  render() {
    const { rangePickerValue, salesType, currentTabKey } = this.state;
    const { chart, loading } = this.props;
    const {
      visitData,
      userVisitData,
      redisConfigVisitData,
      userData,
      roleData,
      redisConfigData,

      visitData2,
      salesData,
      searchData,
      offlineData,
      offlineChartData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
    } = chart;
    let salesPieData;
    if (salesType === 'all') {
      salesPieData = salesTypeData;
    } else {
      salesPieData = salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;
    }
    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );

    const dropdownGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );

    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);

    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          <IntroduceRow
            loading={loading}
            visitData={visitData}
            userData={userData}
            roleData={roleData}
            redisConfigData={redisConfigData}
          />
        </Suspense>
        <Suspense fallback={null}>
          <SalesCard
            rangePickerValue={rangePickerValue}
            visitData={visitData || {}}
            userVisitData={userVisitData || {}}
            userVisitRangeData={userVisitData.rangeDatas || []}
            redisConfigVisitData={redisConfigVisitData || {}}
            userData={userData}
            isActive={this.isActive}
            handleRangePickerChange={this.handleRangePickerChange}
            loading={loading}
            selectDate={this.selectDate}
          />
        </Suspense>
        {/*<div className={styles.twoColLayout}>
          <Row gutter={24}>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <TopSearch
                  loading={loading}
                  visitData2={visitData2}
                  selectDate={this.selectDate}
                  searchData={searchData}
                  dropdownGroup={dropdownGroup}
                />
              </Suspense>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <ProportionSales
                  dropdownGroup={dropdownGroup}
                  salesType={salesType}
                  loading={loading}
                  salesPieData={salesPieData}
                  handleChangeSalesType={this.handleChangeSalesType}
                />
              </Suspense>
            </Col>
          </Row>
        </div>
        <Suspense fallback={null}>
          <OfflineData
            activeKey={activeKey}
            loading={loading}
            offlineData={offlineData}
            offlineChartData={offlineChartData}
            handleTabChange={this.handleTabChange}
          />
        </Suspense>*/}
      </GridContent>
    );
  }
}

export default props => (
  <AsyncLoadBizCharts>
    <Analysis {...props} />
  </AsyncLoadBizCharts>
);

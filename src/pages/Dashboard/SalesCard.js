import React, { memo } from 'react';
import { Row, Col, Card, Tabs, DatePicker } from 'antd';
import { FormattedMessage, formatMessage } from 'umi/locale';
import numeral from 'numeral';
import styles from './Analysis.less';
import { Bar } from '@/components/Charts';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: formatMessage({ id: 'app.analysis.test' }, { no: i }),
    total: 323234,
  });
}

const SalesCard = memo(
  ({
    rangePickerValue,
    visitData,
    userVisitData,
    userVisitRangeData,
    redisConfigVisitData,
    userData,
    isActive,
    handleRangePickerChange,
    loading,
    selectDate,
  }) => (
    <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
      <div className={styles.salesCard}>
        <Tabs
          tabBarExtraContent={
            <div className={styles.salesExtraWrap}>
              <div className={styles.salesExtra}>
                <a className={isActive('today')} onClick={() => selectDate('today')}>
                  <FormattedMessage id="app.analysis.all-day" defaultMessage="All Day" />
                </a>
                <a className={isActive('week')} onClick={() => selectDate('week')}>
                  <FormattedMessage id="app.analysis.all-week" defaultMessage="All Week" />
                </a>
                <a className={isActive('month')} onClick={() => selectDate('month')}>
                  <FormattedMessage id="app.analysis.all-month" defaultMessage="All Month" />
                </a>
                <a className={isActive('year')} onClick={() => selectDate('year')}>
                  <FormattedMessage id="app.analysis.all-year" defaultMessage="All Year" />
                </a>
              </div>
              <RangePicker
                value={rangePickerValue}
                onChange={handleRangePickerChange}
                style={{ width: 256 }}
              />
            </div>
          }
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
        >
          {/*v1.5.0访问量*/}
          <TabPane
            tab={<FormattedMessage id="app.analysis.qqvisits" defaultMessage="请求量" />}
            key="visits"
          >
            <Row>
              {/*占据一整行的3/4*/}
              {/*<Col xl={16} lg={12} md={12} sm={24} xs={24}>*/}
              {/*占据一整行*/}
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <Bar
                    color="#975FE4"
                    height={292}
                    title={
                      <FormattedMessage
                        id="app.analysis.qqvisitscount-trend"
                        defaultMessage="请求次数"
                      />
                    }
                    data={visitData.currentDatas}
                  />
                </div>
              </Col>
              {/*<Col xl={8} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesRank}>
                  <h4 className={styles.rankingTitle}>
                    <FormattedMessage
                      id="app.analysis.visits-ranking"
                      defaultMessage="Visits Ranking"
                    />
                  </h4>
                  <ul className={styles.rankingList}>
                    {rankingListData.map((item, i) => (
                      <li key={item.title}>
                        <span
                          className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}
                        >
                          {i + 1}
                        </span>
                        <span className={styles.rankingItemTitle} title={item.title}>
                          {item.title}
                        </span>
                        <span>{numeral(item.total).format('0,0')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>*/}
            </Row>
          </TabPane>
          {/*v1.5.0用户访问量*/}
          <TabPane
            tab={<FormattedMessage id="app.analysis.userslogin" defaultMessage="用户访问量" />}
            key="userslogin"
          >
            <Row>
              <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <Bar
                    height={292}
                    title={
                      <FormattedMessage id="app.analysis.userlogin-trend" defaultMessage="用户数" />
                    }
                    data={userVisitData.currentDatas}
                  />
                </div>
              </Col>
              <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesRank} style={{ height: 292, overflow: 'auto' }}>
                  <h4 className={styles.rankingTitle}>
                    <FormattedMessage
                      id="app.analysis.userranges-ranking"
                      defaultMessage="用户请求量排名"
                    />
                  </h4>
                  <ul className={styles.rankingList}>
                    {userVisitRangeData.map((item, i) => (
                      <li key={item.x}>
                        <span
                          className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}
                        >
                          {i + 1}
                        </span>
                        <span
                          className={styles.rankingItemTitle}
                          title={formatMessage({ id: item.x }, { no: i })}
                        >
                          {formatMessage({ id: item.x }, { no: i })}
                        </span>
                        <span>{numeral(item.y).format('0,0')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </TabPane>
          {/*v1.5.0Redis连接配置使用排行榜*/}
          <TabPane
            tab={
              <FormattedMessage id="app.analysis.redisuses" defaultMessage="Redis连接配置排行榜" />
            }
            key="redisuses"
          >
            <Row>
              {/*<Col xl={16} lg={12} md={12} sm={24} xs={24}>*/}
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <Bar
                    color="#3CB371"
                    height={292}
                    title={
                      <FormattedMessage
                        id="app.analysis.redisuses-trend"
                        defaultMessage="使用次数"
                      />
                    }
                    data={redisConfigVisitData.currentDatas}
                  />
                </div>
              </Col>
              {/*<Col xl={8} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesRank}>
                  <h4 className={styles.rankingTitle}>
                    <FormattedMessage
                      id="app.analysis.sales-ranking"
                      defaultMessage="Sales Ranking"
                    />
                  </h4>
                  <ul className={styles.rankingList}>
                    {rankingListData.map((item, i) => (
                      <li key={item.title}>
                        <span
                          className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}
                        >
                          {i + 1}
                        </span>
                        <span className={styles.rankingItemTitle} title={item.title}>
                          {item.title}
                        </span>
                        <span className={styles.rankingItemValue}>
                          {numeral(item.total).format('0,0')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>*/}
            </Row>
          </TabPane>
        </Tabs>
      </div>
    </Card>
  )
);

export default SalesCard;

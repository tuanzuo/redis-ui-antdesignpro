import React, { memo } from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';
import { FormattedMessage } from 'umi/locale';
import styles from './Analysis.less';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from '@/components/Charts';
import Trend from '@/components/Trend';
import numeral from 'numeral';
import Yuan from '@/utils/Yuan';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = memo(({ loading, visitData, userData, roleData, redisConfigData }) => (
  <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={<FormattedMessage id="app.analysis.qqvisits" defaultMessage="请求量" />}
        action={
          <Tooltip title={<FormattedMessage id="app.analysis.introduce" defaultMessage="请求量" />}>
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(visitData ? visitData.total : 0).format('0,0')}
        footer={
          <Field
            label={<FormattedMessage id="app.analysis.day-qqvisits" defaultMessage="日请求量" />}
            value={numeral(visitData ? visitData.dayTotal : 0).format('0,0')}
          />
        }
        contentHeight={46}
      >
        <MiniArea color="#975FE4" data={visitData ? visitData.totalDatas : []} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={<FormattedMessage id="app.analysis.userData" defaultMessage="注册人数" />}
        action={
          <Tooltip
            title={<FormattedMessage id="app.analysis.introduce" defaultMessage="注册人数" />}
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(userData ? userData.total : 0).format('0,0')}
        footer={
          <Field
            label={<FormattedMessage id="app.analysis.day-users" defaultMessage="日注册人数" />}
            value={numeral(userData ? userData.dayTotal : 0).format('0,0')}
          />
        }
        contentHeight={46}
      >
        <MiniArea color="#13C2C2" data={userData ? userData.dayDatas : []} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={<FormattedMessage id="app.analysis.roles" defaultMessage="角色数" />}
        action={
          <Tooltip title={<FormattedMessage id="app.analysis.introduce" defaultMessage="角色数" />}>
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(roleData ? roleData.total : 0).format('0,0')}
        footer={
          <Field
            label={<FormattedMessage id="app.analysis.day-roles" defaultMessage="日新增角色数" />}
            value={numeral(roleData ? roleData.dayTotal : 0).format('0,0')}
          />
        }
        contentHeight={46}
      >
        <MiniArea color="#3CB371" data={roleData ? roleData.dayDatas : []} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={<FormattedMessage id="app.analysis.redisconfigs" defaultMessage="Redis连接配置数" />}
        action={
          <Tooltip
            title={
              <FormattedMessage id="app.analysis.introduce" defaultMessage="Redis连接配置数" />
            }
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(redisConfigData ? redisConfigData.total : 0).format('0,0')}
        footer={
          <Field
            label={
              <FormattedMessage
                id="app.analysis.day-redisconfigs"
                defaultMessage="日新增Redis连接配置数"
              />
            }
            value={numeral(redisConfigData ? redisConfigData.dayTotal : 0).format('0,0')}
          />
        }
        contentHeight={46}
      >
        <MiniArea data={redisConfigData ? redisConfigData.dayDatas : []} />
      </ChartCard>
    </Col>
  </Row>
));

/*const IntroduceRow = memo(({ loading, visitData }) => (
  <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title={<FormattedMessage id="app.analysis.total-sales" defaultMessage="Total Sales" />}
        action={
          <Tooltip
            title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        loading={loading}
        total={() => <Yuan>126560</Yuan>}
        footer={
          <Field
            label={<FormattedMessage id="app.analysis.day-sales" defaultMessage="Daily Sales" />}
            value={`￥${numeral(12423).format('0,0')}`}
          />
        }
        contentHeight={46}
      >
        <Trend flag="up" style={{ marginRight: 16 }}>
          <FormattedMessage id="app.analysis.week" defaultMessage="Weekly Changes" />
          <span className={styles.trendText}>12%</span>
        </Trend>
        <Trend flag="down">
          <FormattedMessage id="app.analysis.day" defaultMessage="Daily Changes" />
          <span className={styles.trendText}>11%</span>
        </Trend>
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={<FormattedMessage id="app.analysis.visits" defaultMessage="Visits" />}
        action={
          <Tooltip
            title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(8846).format('0,0')}
        footer={
          <Field
            label={<FormattedMessage id="app.analysis.day-visits" defaultMessage="Daily Visits" />}
            value={numeral(1234).format('0,0')}
          />
        }
        contentHeight={46}
      >
        <MiniArea color="#975FE4" data={visitData} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title={<FormattedMessage id="app.analysis.payments" defaultMessage="Payments" />}
        action={
          <Tooltip
            title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(6560).format('0,0')}
        footer={
          <Field
            label={
              <FormattedMessage
                id="app.analysis.conversion-rate"
                defaultMessage="Conversion Rate"
              />
            }
            value="60%"
          />
        }
        contentHeight={46}
      >
        <MiniBar data={visitData} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        bordered={false}
        title={
          <FormattedMessage
            id="app.analysis.operational-effect"
            defaultMessage="Operational Effect"
          />
        }
        action={
          <Tooltip
            title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total="78%"
        footer={
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
            <Trend flag="up" style={{ marginRight: 16 }}>
              <FormattedMessage id="app.analysis.week" defaultMessage="Weekly Changes" />
              <span className={styles.trendText}>12%</span>
            </Trend>
            <Trend flag="down">
              <FormattedMessage id="app.analysis.day" defaultMessage="Weekly Changes" />
              <span className={styles.trendText}>11%</span>
            </Trend>
          </div>
        }
        contentHeight={46}
      >
        <MiniProgress percent={78} strokeWidth={8} target={80} color="#13C2C2" />
      </ChartCard>
    </Col>
  </Row>
));*/

export default IntroduceRow;

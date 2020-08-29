import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: 'RedisManger',
          title: <Icon type="github" />,
          href: 'https://github.com/tuanzuo/redismanager',
          blankTarget: true,
        },
        {
          key: 'RedisMangerUI',
          title: <Icon type="github" />,
          href: 'https://github.com/tuanzuo/redis-ui-antdesignpro',
          blankTarget: true,
        },
        {
          key: 'Ant Design Pro',
          title: 'Ant Design Pro',
          href: 'https://pro.ant.design',
          blankTarget: true,
        },
        {
          key: 'Ant Design Pro',
          title: <Icon type="github" />,
          href: 'https://github.com/ant-design/ant-design-pro',
          blankTarget: true,
        },
        {
          key: 'Ant Design',
          title: 'Ant Design',
          href: 'https://ant.design',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2019-{new Date().getFullYear()} tuanzuo
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;

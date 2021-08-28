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
          //---gitee---
          //stars：https://gitee.com/tuanzuo/redismanager/badge/star.svg
          //forks：https://gitee.com/tuanzuo/redismanager/badge/fork.svg
          //---github---
          //stars：https://img.shields.io/github/stars/tuanzuo/redismanager?style=flat-square&logo=GitHub
          //forks：https://img.shields.io/github/forks/tuanzuo/redismanager?style=flat-square&logo=GitHub
          //watchers：https://img.shields.io/github/watchers/tuanzuo/redismanager?style=flat-square&logo=GitHub
          //issues：https://img.shields.io/github/issues/tuanzuo/redismanager.svg?style=flat-square&logo=GitHub
          //license：https://img.shields.io/github/license/tuanzuo/redismanager.svg?style=flat-square
          title: <img src={'https://img.shields.io/github/stars/tuanzuo/redismanager?style=flat-square&logo=GitHub'} style={{borderRadius:5}} />,
          href: 'https://github.com/tuanzuo/redismanager',
          blankTarget: true,
        },
        {
          key: 'RedisMangerUI',
          title: <img src={'https://img.shields.io/github/stars/tuanzuo/redis-ui-antdesignpro?style=flat-square&logo=GitHub'} style={{borderRadius:5}} />,
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

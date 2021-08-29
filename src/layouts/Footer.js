import React, { Fragment } from 'react';
import { Layout, Icon, Avatar } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: 'RedisManger',
          //title: <Icon type="github" />,
          //---gitee---
          //stars：https://gitee.com/tuanzuo/redismanager/badge/star.svg
          //forks：https://gitee.com/tuanzuo/redismanager/badge/fork.svg
          //---github---
          //stars：https://img.shields.io/github/stars/tuanzuo/redismanager?style=flat-square&logo=GitHub
          //forks：https://img.shields.io/github/forks/tuanzuo/redismanager?style=flat-square&logo=GitHub
          //watchers：https://img.shields.io/github/watchers/tuanzuo/redismanager?style=flat-square&logo=GitHub
          //issues：https://img.shields.io/github/issues/tuanzuo/redismanager.svg?style=flat-square&logo=GitHub
          //license：https://img.shields.io/github/license/tuanzuo/redismanager.svg?style=flat-square
          //图片加载失败了就用默认的icon v1.7.0
          title: <Avatar style={{borderRadius:5,height:'5%',width:'4.2%',background:'rgb(255 255 255 / 0%)'}} shape="square" src="https://img.shields.io/github/stars/tuanzuo/redismanager?style=flat-square&logo=GitHub" icon={<Icon type="github" style={{color:"rgb(132 133 135)"}} /> }  />,
          href: 'https://github.com/tuanzuo/redismanager',
          blankTarget: true,
        },
        {
          key: 'RedisMangerUI',
          //title: <Icon type="github" />,
          //图片加载失败了就用默认的icon v1.7.0
          title: <Avatar style={{borderRadius:5,height:'5%',width:'4.2%',background:'rgb(255 255 255 / 0%)'}} shape="square" src="https://img.shields.io/github/stars/tuanzuo/redis-ui-antdesignpro?style=flat-square&logo=GitHub" icon={<Icon type="github" style={{color:"rgb(132 133 135)"}} /> }  />,
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

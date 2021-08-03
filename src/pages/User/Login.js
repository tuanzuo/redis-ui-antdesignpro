import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import {Checkbox, Alert, Icon, Input, Popover, Row, Col, Button, Form} from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';
import { notification } from 'antd';
import router from 'umi/router';
import { getToken, setToken } from '@/utils/token';

const FormItem = Form.Item;

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

//v1.6.0当前输入的图形验证码
let currentInputCaptcha;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
    //v1.6.0 验证码对象
    captchaInfo: {},
  };

  //v1.3.0
  componentDidMount() {
    //v1.6.0 清空验证码
    currentInputCaptcha="";
    //v1.6.0得到图形验证码
    this.onGetImageCaptcha();
    /*这里有bug,如果token过期了这里会反复跳转,先注释
    //得到token用于判断是否需要登录-v1.3.0
    const token = getToken();
    //有token存在就不在进行登录
    if (token && token != 'undefined' && token != '') {
      router.push('/');
      return;
    }*/
  }

  onTabChange = type => {
    this.setState({ type });
  };

  //v1.6.0 监听图形验证码输入
  onGetImageCaptchaChange = (e) => {
    console.log(e.currentTarget.value)
    currentInputCaptcha = e.currentTarget.value;
  };

  //v1.6.0 得到图形验证码
  onGetImageCaptcha = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'captcha/fakeCaptcha',
      callback: response => {
        //错误提示信息
        let flag = this.tipMsg(response);
        if (!flag) {
          return;
        }
        //设置验证码对象 v1.6.0
        let captchaInfo = response.datas;
        this.setState({
          captchaInfo: captchaInfo,
        });
      },
    });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      //v1.6.0 校验验证码是否为空
      if (!currentInputCaptcha || currentInputCaptcha == "") {
        let notifyType = 'warning';
        let showTime = 4.5;
        notification[notifyType]({
          message: '提示信息',
          description: "请输入验证码",
          duration: showTime,
        });
        return;
      }

      const { dispatch } = this.props;
      const { captchaInfo } = this.state;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
          //v1.6.0 验证码
          captchaKey: captchaInfo && captchaInfo.key ? captchaInfo.key : '',
          captcha: currentInputCaptcha,
        },
        callback: response => {
          //错误提示信息
          let flag = this.tipMsg(response);
          if (!flag) {
            //验证码过期重新获取  v1.6.0
            if (response && response.code == '600010') {
              this.onGetImageCaptcha();
            }
            return;
          }
        },
      });
    }
  };

  tipMsg = response => {
    let flag = false;
    let notifyType = 'warning';
    let msg = '登录失败! ';
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

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin,captchaInfo } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab={formatMessage({ id: 'app.login.tab-login-credentials' })}>
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
            <UserName
              name="name"
              placeholder={`${formatMessage({
                id: 'app.login.userName',
              })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.userName.required' }),
                },
              ]}
            />
            <Password
              name="pwd"
              placeholder={`${formatMessage({
                id: 'app.login.password',
              })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.password.required' }),
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
            <Form>
              {/*图形验证码*/}
              <FormItem>
                <Row gutter={8}>
                  <Col span={16}>
                    <Input
                      size="large"
                      placeholder={formatMessage({ id: 'form.verification-code.placeholder' })}
                      onChange = {this.onGetImageCaptchaChange}
                      autocomplete="off"
                    />
                  </Col>
                  <Col span={8}>
                    {/*图形验证码*/}
                    <img
                      id="verImg"
                      style={{ "cursor": 'pointer',"border-radius":"5px" }}
                      width="120px"
                      height="35px"
                      src={captchaInfo && captchaInfo.image ?  captchaInfo.image : ''}
                      onClick={this.onGetImageCaptcha}
                    />
                  </Col>
                </Row>
              </FormItem>
            </Form>

          </Tab>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
          <div className={styles.other}>
            {/*<FormattedMessage id="app.login.sign-in-with" />
            <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
            <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
            <Icon type="weibo-circle" className={styles.icon} theme="outlined" />*/}
            <Link className={styles.register} to="/user/register">
              <FormattedMessage id="app.login.signup" />
            </Link>
          </div>
        </Login>
      </div>
    );
  }
}

export default LoginPage;

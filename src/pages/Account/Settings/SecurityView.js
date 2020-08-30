import React, { PureComponent, Component, Fragment } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  List,
  Form,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Input,
  Icon,
  Collapse,
  Radio,
  Tooltip,
  Popconfirm,
  Spin,
  Drawer,
  message,
  notification,
  Popover,
  BackTop,
} from 'antd';
// import { getTimeDistance } from '@/utils/utils';
import styles from './SecurityView.less';

const FormItem = Form.Item;

const passwordStrength = {
  strong: (
    <font className="strong">
      <FormattedMessage id="app.settings.security.strong" defaultMessage="Strong" />
    </font>
  ),
  medium: (
    <font className="medium">
      <FormattedMessage id="app.settings.security.medium" defaultMessage="Medium" />
    </font>
  ),
  weak: (
    <font className="weak">
      <FormattedMessage id="app.settings.security.weak" defaultMessage="Weak" />
      Weak
    </font>
  ),
};

@connect(({ useropt, loading }) => ({
  useropt,
  loading: loading.models.useropt,
}))
@Form.create()
class SecurityView extends PureComponent {
  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  state = {
    visible: false,
    done: false,
  };

  getData = () => [
    {
      title: formatMessage({ id: 'app.settings.security.password' }, {}),
      description: (
        <Fragment>
          {formatMessage({ id: 'app.settings.security.password-description' })}：
          {passwordStrength.strong}
        </Fragment>
      ),
      actions: [
        <a onClick={this.showModal}>
          <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    /*{
      title: formatMessage({ id: 'app.settings.security.phone' }, {}),
      description: `${formatMessage(
        { id: 'app.settings.security.phone-description' },
        {}
      )}：138****8293`,
      actions: [
        <a>
          <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'app.settings.security.question' }, {}),
      description: formatMessage({ id: 'app.settings.security.question-description' }, {}),
      actions: [
        <a>
          <FormattedMessage id="app.settings.security.set" defaultMessage="Set" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'app.settings.security.email' }, {}),
      description: `${formatMessage(
        { id: 'app.settings.security.email-description' },
        {}
      )}：ant***sign.com`,
      actions: [
        <a>
          <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
    {
      title: formatMessage({ id: 'app.settings.security.mfa' }, {}),
      description: formatMessage({ id: 'app.settings.security.mfa-description' }, {}),
      actions: [
        <a>
          <FormattedMessage id="app.settings.security.bind" defaultMessage="Bind" />
        </a>,
      ],
    },*/
  ];

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'useropt/updatePwd',
          payload: values,
          callback: response => {
            //错误提示信息
            let flag = this.tipMsg(response);
            if (!flag) {
              return;
            }
          },
        });
      }
    });
  };

  tipMsg = response => {
    let flag = false;
    let notifyType = 'warning';
    let msg = '修改密码失败! ';
    let showTime = 4.5;
    if (response && response.code == '200') {
      flag = true;
      notifyType = 'success';
      msg = '密码修改成功!';

      this.setState({
        done: false,
        visible: false,
      });
    } else if (response && response.msg && response.msg != '') {
      msg = response.msg;
      showTime = 10;
    }
    notification[notifyType]({
      message: '提示信息',
      description: msg,
      duration: showTime,
    });
    return flag;
  };

  handleDone = () => {
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleCancel = () => {
    const { form } = this.props;
    form.resetFields();

    this.setState({
      visible: false,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { useropt, loading } = this.props;
    const { visible, done } = this.state;

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const addUpdateFootContent = () => {
      return [
        <Button key="cancle" onClick={this.handleCancel}>
          取消
        </Button>,
        <Button key="save" type="primary" onClick={this.handleSubmit}>
          保存
        </Button>,
      ];
    };

    const getModalContent = () => {
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="原密码" {...this.formLayout}>
            {getFieldDecorator('oldPwd', {
              rules: [{ required: true, message: '原密码不能为空' }],
            })(<Input.Password autoComplete="off" type="password" placeholder="原密码" />)}
          </FormItem>
          <FormItem label="新密码" {...this.formLayout}>
            {getFieldDecorator('pwd', {
              rules: [{ required: true, message: '新密码不能为空' }],
            })(<Input.Password autoComplete="off" type="password" placeholder="新密码" />)}
          </FormItem>
        </Form>
      );
    };

    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={this.getData()}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
        <Modal
          title="修改密码"
          className={styles.standardListForm}
          width={500}
          bodyStyle={done ? { padding: '5px 0' } : { padding: '5px 0 0' }}
          destroyOnClose
          visible={visible}
          footer={addUpdateFootContent()}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </Fragment>
    );
  }
}

export default SecurityView;

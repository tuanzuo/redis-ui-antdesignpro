/* eslint-disable react/prefer-stateless-function */
import React, {PureComponent} from 'react';
import { connect } from 'dva';
import {
  Form,
  Row,
  Input,
  Button,
  Col,
  Card,
  Tree,
  Modal,
  DatePicker,
  Select,
} from 'antd';
import styles from "../../List/BasicList.less";
import moment from "../../List/BasicList";

import Result from '@/components/Result';

const FormItem = Form.Item;
const {TreeNode} = Tree;
const { TextArea } = Input;
const SelectOption = Select.Option;

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 5,
  style: {marginBottom: 24,margin: 17},
};

let id = 0;
let data = {};
@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create({ name: 'testuser' })
class UserTest extends PureComponent {
  state = { visible: false, done: false };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  }

  onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  }

  add = (params) => {
    data[id]=params;
    console.log(data)

    console.log('add');
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    console.log(nextKeys);
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  handleSubmit = e => {
    const {dispatch, form} = this.props;
    e.preventDefault();
    let validFlag = true;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      } else {
        validFlag = false;
      }
    });
    if (validFlag) {
      console.log(form.getFieldsValue());
      this.add(form.getFieldsValue());

      const keys = form.getFieldValue('keys');
      form.resetFields();
      form.setFieldsValue({keys: keys});
    }
  };

  handleDone = () => {
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 240 },
        sm: { span: 37 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 80 },
        md: { span: 50 },
      },
    };


    const { visible, done, current = {} } = this.state;

    const { submitting } = this.props;
    const {getFieldDecorator, getFieldValue} = this.props.form;
    getFieldDecorator('keys', {initialValue: []});
    const keys = getFieldValue('keys');
    const colItems = keys.map((k, index) => (
      <Col {...topColResponsiveProps}>
        <Card
          bordered={false}
          size="small"
          title={data[k].name+"redis连接信息"}
          extra={<a href="#">More</a>}
          style={{width: 240}}
          hoverable="true"
          actions={[<a onClick={this.showModal}>连接信息</a>, <a>数据信息</a>]}
        >
          <p>name：{data[k].name}</p>
          <p>address：{data[k].address}</p>
          <p>password：{data[k].password}</p>
        </Card>
      </Col>
    ));

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title="操作成功"
            description="一系列的信息描述，很短同样也可以带标点。"
            actions={
              <Button type="primary" onClick={this.handleDone}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      return (
        <div>
          content
        </div>
      );
    };


    return (
      <div>
        <Row gutter={24}>
          {colItems}
          <Col {...topColResponsiveProps}>
            <Card
              bordered={false}
              size="small"
              title="新建redis连接信息"
              style={{width: 240}}
              hoverable="true"
            >
              <Form onSubmit={this.handleSubmit} style={{marginTop: 2}}>
                <FormItem {...formItemLayout} style={{marginBottom: 0}} label={"名称"}>
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: "名称不能为空"
                      },
                    ],
                  })(<Input autoComplete={"off"} placeholder={"给redis连接取个名称吧"}/>)}
                </FormItem>
                <FormItem {...formItemLayout} style={{marginBottom: 0}} label={"地址"}>
                  {getFieldDecorator('address', {
                    rules: [
                      {
                        required: true,
                        message: "地址不能为空"
                      },
                    ],
                  })(<Input autoComplete={"off"} placeholder={"redis连接地址"}/>)}
                </FormItem>
                <FormItem {...formItemLayout} style={{marginBottom: 0}} label={"密码"}>
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        required: false,
                        message: "密码信息"
                      },
                    ],
                  })(<Input autoComplete={"off"} type={"password"} placeholder={"redis的密码"}/>)}
                </FormItem>
                <FormItem {...formItemLayout} style={{marginBottom: 0}} label={"key Serializable"}>
                  {getFieldDecorator('keySer', {
                    rules: [
                      {
                        required: false,
                        message: "key Serializable"
                      },
                    ],
                  })(
                    <TextArea
                      style={{minHeight: 32}}
                      placeholder={"key序列化"}
                      rows={4}
                    />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} style={{marginBottom: 0}} label={"value Serializable"}>
                  {getFieldDecorator('valueSer', {
                    rules: [
                      {
                        required: false,
                        message: "value Serializable"
                      },
                    ],
                  })(
                    <TextArea
                      style={{minHeight: 32}}
                      placeholder={"value序列化"}
                      rows={4}
                    />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} style={{marginBottom: 0}}>
                  <Button id="redisSubmitFrom" type="primary" htmlType="submit" loading={submitting}>
                    提交
                  </Button>
                </FormItem>
              </Form>
            </Card>
          </Col>
          <Col {...topColResponsiveProps}>
            <Card
              bordered={false}
              size="small"
              title="tree"
              extra={<a href="#">More</a>}
              style={{width: 240}}
              hoverable="true"
            >
              <Tree
                checkable
                defaultExpandedKeys={['0-0-0', '0-0-1']}
                defaultSelectedKeys={['0-0-0', '0-0-1']}
                defaultCheckedKeys={['0-0-0', '0-0-1']}
                onSelect={this.onSelect}
                onCheck={this.onCheck}
              >
                <TreeNode title="parent 1" key="0-0">
                  <TreeNode title="parent 1-0" key="0-0-0" disabled>
                    <TreeNode title="leaf" key="0-0-0-0" disableCheckbox/>
                    <TreeNode title="leaf" key="0-0-0-1"/>
                  </TreeNode>
                  <TreeNode title="parent 1-1" key="0-0-1">
                    <TreeNode title={<span style={{color: '#1890ff'}}>sss</span>} key="0-0-1-0"/>
                  </TreeNode>
                </TreeNode>
              </Tree>
            </Card>
          </Col>
          <Col>
            <Modal
              title={done ? null : `任务${current.id ? '编辑' : '添加'}`}
              className={styles.standardListForm}
              width={640}
              bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
              destroyOnClose
              visible={visible}
              {...modalFooter}
            >
              {getModalContent()}
            </Modal>
          </Col>
        </Row>
      </div>
    );
  }
}

export default UserTest;


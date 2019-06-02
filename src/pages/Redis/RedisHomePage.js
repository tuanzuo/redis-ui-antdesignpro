import React, {PureComponent} from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import {
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
} from 'antd';

import {findDOMNode} from "react-dom";
import styles from './RedisHomePage.less';
import StandardFormRow from '@/components/StandardFormRow';

const FormItem = Form.Item;
const {TextArea} = Input;
const Panel = Collapse.Panel;

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 5,
  style: {marginBottom: 24, margin: 17, marginTop: 5},
};
const formItemLayout = {
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 16},
  },
};

// RedisHome对象
let RedisHomeObject;
// 搜索的value
let searchKeyConst = {};

@connect(({redisadmin, loading}) => ({
  redisadmin,
  loading: loading.models.redisadmin,
}))
@Form.create({name: 'redisHomeSearch'})
class SearchForm extends PureComponent {
  state = {formValues: []};

  // 查询
  handleSearch = e => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });
      searchKeyConst = values;
      RedisHomeObject.refeshList(searchKeyConst);
    });
  };

  // 重置
  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    searchKeyConst = {};
    RedisHomeObject.refeshList(searchKeyConst);
  };

  render() {
    const {
      form: {getFieldDecorator},
    } = this.props;

    const {formValues = {}} = this.state;

    const genExtra = () => (
      <Icon
        type="search"
        onClick={(event) => {
          // If you don't want click extra trigger collapse, you can prevent this:
          // event.stopPropagation();
        }}
      />
    );

    return (
      <Row gutter={24} style={{marginLeft: 16, marginRight: 19, marginTop: -8, marginBottom: -25}}>
        <Collapse defaultActiveKey={['1']}>
          <Panel header="搜索" key="10" extra={genExtra()}>
            <Form onSubmit={this.handleSearch} layout="inline">
              <StandardFormRow title="查询条件" grid last>
                <Row gutter={16}>
                  <Col lg={8} md={10} sm={10} xs={24} style={{marginRight: -88}}>
                    <FormItem {...formItemLayout} label="">
                      {getFieldDecorator('searchKey', {
                        rules: [{required: false, message: "名称不能为空"}],
                      })(<Input autoComplete="off" onPressEnter={this.handleSearch} placeholder=""/>)}
                    </FormItem>
                  </Col>
                  <Col lg={8} md={10} sm={10} xs={24}>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                    <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                      重置
                    </Button>
                  </Col>
                </Row>
              </StandardFormRow>
            </Form>
          </Panel>
        </Collapse>,
      </Row>
    );
  }
}

@connect(({redisadmin, loading}) => ({
  redisadmin,
  loading: loading.models.redisadmin,
}))
@Form.create({name: 'redisHome'})
class RedisHome extends PureComponent {
  formLayout = {
    labelCol: {span: 7},
    wrapperCol: {span: 13},
  };

  state = {visible: false, done: false};

  componentDidMount() {
    console.log("redis-home-init")

    this.refeshList(searchKeyConst);

    const {
      redisadmin,
      loading,
    } = this.props;
    console.log(redisadmin)

    // 初始化后把当前对象保存到RedisHomeObject变量中去
    RedisHomeObject = this;
  }

  refeshList = (searchKey) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'redisadmin/fetchConfigList',
      payload: searchKey,
    });
  }

  toRedisDataPage = (id) => {
    router.push(`/redis/data/${id}`);
  };

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };


  deleteModel = (item) => {
    Modal.confirm({
      title: '删除连接',
      content: `确定删除【${item.name}】这个redis连接信息吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.deleteItem(item.id),
    });
  };

  showEditModal = item => {
    console.log(item);
    this.setState({
      visible: true,
      current: item,
    });
  };

  handleDone = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    const {current} = this.state;
    const id = current ? current.id : '';
    console.log(current);

    setTimeout(() => this.addBtn.blur(), 0);
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;

      this.setState({
        done: false,
        visible: false,
      });


      const values = {
        ...fieldsValue,
      };

      console.log(values);

      // 保存数据到后台
      dispatch({
        type: id ? 'redisadmin/updateConfig' : 'redisadmin/addConfig',
        payload: {id, ...values},
        callback: () => {
          console.log(id ? "true" : "false")
          console.log("submitcallback")
          this.refeshList(searchKeyConst);
        },
      });
    });
  };

  deleteItem = id => {
    console.log(id)

    const {dispatch} = this.props;
    dispatch({
      type: 'redisadmin/removeConfig',
      payload: id,
      callback: () => {
        this.refeshList(searchKeyConst);
      },
    });
  };

  render() {
    const {
      form: {getFieldDecorator},
    } = this.props;


    const {redisadmin, loading} = this.props;
    const {configList} = redisadmin;

    const {visible, done, current = {}} = this.state;

    const colItems = configList.map((temp, index) => (
      <Col {...topColResponsiveProps} key={temp.id}>
        <Card
          bordered={false}
          size="small"
          title={`[${temp.name}]redis连接信息`}
          extra={
            <a onClick={e => {
              e.preventDefault();
              this.deleteModel(temp);
            }}
            >
              <Icon type="close-circle" theme="twoTone" width={50} height={50} />
            </a>
          }
          style={{width: 240}}
          hoverable="true"
          onDoubleClick={e => {
            e.preventDefault();
            this.toRedisDataPage(temp.id);
          }}
          actions={[
            <a onClick={e => {
              e.preventDefault();
              this.showEditModal(temp);
            }}
            >
              连接信息
            </a>,
            <a onClick={e => {
              e.preventDefault();
              this.toRedisDataPage(temp.id);
            }}
            >
              数据信息
            </a>,
          ]}
        >
          <p className={styles.pStyle}>名称：{temp.name}</p>
          <p className={styles.pStyle}>地址：{temp.address}</p>
          <p className={styles.pStyle}>创建时间：{temp.createTime}</p>
        </Card>
      </Col>
    ));

    const modalFooter = done
      ? {footer: null, onCancel: this.handleDone}
      : {okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel};

    const getModalContent = () => {
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="名称" {...this.formLayout}>
            {getFieldDecorator('name', {
              rules: [{required: true, message: "名称不能为空"}],
              initialValue: current.name,
            })(<Input autoComplete="off" placeholder="给redis连接取个名称吧" />)}
          </FormItem>
          <FormItem label="类型" {...this.formLayout}>
            {getFieldDecorator('type', {
              rules: [{required: true, message: "类型不能为空"}],
              initialValue: current.type,
            })(
              <Radio.Group>
                <Radio value={1}>
                  单机
                </Radio>
                <Radio value={2}>
                  集群
                </Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem
            {...this.formLayout}
            label={
              <span>
                地址&nbsp;
                <em className={styles.optional}>
                  <Tooltip title="单机地址：192.168.1.32:6379  集群地址：192.168.1.32:7000,192.168.1.32:7001,192.168.1.32:7002,192.168.1.32:7003,192.168.1.32:7004,192.168.1.32:7005">
                    <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                  </Tooltip>
                </em>
              </span>
            }
          >
            {getFieldDecorator('address', {
              rules: [{required: true, message: "地址不能为空"}],
              initialValue: current.address,
            })(<Input autoComplete="off" placeholder="redis连接地址" />)}
          </FormItem>
          <FormItem label="密码" {...this.formLayout}>
            {getFieldDecorator('password', {
              rules: [{required: false, message: "密码信息"}],
              initialValue: current.password,
            })(<Input.Password autoComplete="off" type="password" placeholder="redis的密码" />)}
          </FormItem>
          <FormItem {...this.formLayout} label="Serializable code">
            {getFieldDecorator('serCode', {
              rules: [{required: false, message: "Serializable code"}],
              initialValue: current.serCode,
            })(
              <TextArea
                placeholder="序列化code(Groovy)"
                rows={4}
              />
            )}
          </FormItem>
          <FormItem {...this.formLayout} label="备注">
            {getFieldDecorator('note', {
              rules: [{required: false, message: "备注"}],
              initialValue: current.note,
            })(
              <TextArea
                placeholder="备注"
                rows={2}
              />
            )}
          </FormItem>
        </Form>
      );
    };


    return (
      <div>
        <SearchForm />
        <Row gutter={24} style={{marginTop: 10}}>
          {colItems}
          <Col {...topColResponsiveProps}>
            <Card
              bordered={false}
              size="small"
              title="新建redis连接信息"
              style={{width: 240}}
              hoverable="true"
            >
              <p>
                <Button
                  type="dashed"
                  style={{width: '80%', margin: 20}}
                  icon="plus"
                  onClick={this.showModal}
                  ref={component => {
                    /* eslint-disable */
                    this.addBtn = findDOMNode(component);
                    /* eslint-enable */
                  }}
                >
                  添加
                </Button>
              </p>
            </Card>
          </Col>
        </Row>

        <Modal
          title={done ? null : `${current.id ? '编辑redis连接信息' : '添加redis连接信息'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? {padding: '5px 0'} : {padding: '5px 0 0'}}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </div>
    );
  }
}

export default RedisHome;

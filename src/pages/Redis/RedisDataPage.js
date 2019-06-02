import React, {PureComponent} from 'react';
import { connect } from 'dva';
// JSON 显示器:https://ant.design/docs/react/recommendation-cn
// https://github.com/mac-s-g/react-json-view
import ReactJson from 'react-json-view';
import {
  Form,
  Row,
  Col,
  Card,
  Button,
  Tree,
  Input,
  Icon,
  Divider,
  Modal,
  message,
  Descriptions,
  Typography,
} from 'antd';

import {findDOMNode} from "react-dom";
import styles from './RedisDataPage.less';
import StandardFormRow from '@/components/StandardFormRow';

const FormItem = Form.Item;
const { TextArea } = Input;
const { TreeNode } = Tree;
const { Paragraph } = Typography;

const formItemLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

// RedisData对象
let RedisDataObject;
// 当前redis的id
let id;
// 搜索的value
let searchKeyConst = {};
// 当前checked的节点
let currentCheckedKeys = [];

@connect(({redisadmin, loading}) => ({
  redisadmin,
  loading: loading.models.redisadmin,
}))
@Form.create()
class SearchForm extends PureComponent {
  state = {formValues: []};

  // 查询
  handleSearch = e => {
    console.log(this)

    e.preventDefault();
    const {dispatch, form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        id,
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });
      searchKeyConst = values;
      RedisDataObject.searchKeyList(values);
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
    const searchParam = {id, ...searchKeyConst};
    RedisDataObject.searchKeyList(searchParam);
  };

  // 删除选中的节点
  delCheckedNodes = () => {
    const params = {
      id,
      keys: currentCheckedKeys,
    };
    RedisDataObject.deleteModel(params);
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
      <Form onSubmit={this.handleSearch} layout="inline">
        <StandardFormRow title="查询条件" grid last>
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout} label="">
                {getFieldDecorator('searchKey', {
                  rules: [{required: false, message: "名称不能为空"}],
                })(<Input autoComplete="off" placeholder="" />)}
              </FormItem>
            </Col>
            <Col span={16} pull={2}>
              <Row>
                <Col span={3}>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                </Col>
                <Col span={3}>
                  <Button onClick={this.handleFormReset}>
                    重置
                  </Button>
                </Col>
                <Col span={3}>
                  <Button onClick={this.handleFormReset}>
                    修改
                  </Button>
                </Col>
                <Col span={3}>
                  <Button type="danger" onClick={this.delCheckedNodes}>
                    删除
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </StandardFormRow>
      </Form>
    );
  }
}

// 当前选中的叶子节点
let currentKey=[];
// 当前选中的叶子节点对应的value
let currentKeyValue;

@connect(({redisadmin, loading}) => ({
  redisadmin,
  loading: loading.models.redisadmin,
}))
@Form.create({name: 'redisData'})
class RedisData extends PureComponent {

  state = {
  /* treeData: [
    { title: 'Expand to load', key: '0' },
    { title: 'Expand to load', key: '1' },
    { title: 'Tree Node', key: '2', isLeaf: true },
    ], */
    treeData: [],
    visible: false, done: false
  };

  // 在第一次渲染后调用，只在客户端。之后组件已经生成了对应的DOM结构，可以通过this.getDOMNode()来进行访问
  componentDidMount() {
    console.log(this.state)

    console.log("redis-data-init")
    const { dispatch, match } = this.props;
    const { params } = match;
    console.log(params.id);

    id = params.id;
    // 初始化redis上下文
    dispatch({
      type: 'redisadmin/initContext',
      payload: id,
      callback: () => {
        console.log("initContextcallback")
        const searchParam = {id, searchKey: "*"};
        this.searchKeyList(searchParam);
        // 初始化后把当前对象保存到RedisDataObject变量中去
        RedisDataObject = this;
      },
    });
  };

  // 查询
  searchKeyList = (searchParam) => {
    // 初始化treeData
    this.initTreeData();

    const {dispatch} = this.props;
    dispatch({
      type: 'redisadmin/fetchKeyList',
      payload: searchParam,
      callback: () => {
        console.log("fetchKeyListcallback")
        const {
          redisadmin,
        } = this.props;
        const {keyList} = redisadmin;
        this.setState({
          treeData: keyList,
        });
        // 还原currentKey为空
        this.initCurrentKeyForNull();
        // 还原currentCheckedKeys为空
        this.initCurrentCheckedKeys();
      },
    });
  };

  searchKeyValue = (params) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'redisadmin/fetchKeyValue',
      payload: params,
      callback: () => {
        console.log("fetchKeyValuecallback");
        const {
          redisadmin,
        } = this.props;
        const {keyValue} = redisadmin;
        currentKeyValue = keyValue;
        console.log(currentKeyValue);
        console.log(typeof currentKeyValue);
        console.log(typeof currentKeyValue === 'string');
      },
    });
  };

  deleteModel = (params) => {
    if (params && params.keys && params.keys.length > 0) {
      let contentConst = params.keys;
      const keySize = params.keys.length;
      if (params.keys.length > 5) {
        contentConst = "";
        for (let i = 0; i < 5; i = (i + 1)) {
          contentConst += params.keys[i];
          if (i === 4) {
            contentConst += "......";
          } else {
            contentConst += ",";
          }
        }
      }
      Modal.confirm({
        title: `删除key(共${keySize}个)`,
        content: `确定删除【${contentConst}】这些key吗？`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => this.delKeys(params),
      });
    } else {
      message.warning('请选中key后,再删除!');
    }
  };

  delKeys = (params) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'redisadmin/delKeys',
      payload: params,
      callback: () => {
        console.log("delKeyscallback");
        this.searchKeyList(searchKeyConst);
      },
    });
  };

  // 还原currentKey为空
  initCurrentKeyForNull = ()=>{
    currentKey = [];
  };

  // 还原选中的keys
  initCurrentCheckedKeys = () => {
    currentCheckedKeys = [];
  };

  // 初始化treeData
  initTreeData = () => {
    this.setState({
      treeData: [],
    });
  };

  // 点击节点
  onSelect = (selectedKeys, info) => {
    console.log('selected');
    console.log(selectedKeys);
    console.log(info);
    console.log(info.node);
    console.log(info.node.props);
    console.log(info.node.props.eventKey);
    // currentKey[0] = info.node.props.eventKey;

    // 是叶子节点才给当前key设置值
    if (info.node.props.isLeaf) {
      const params = {
        id,
        searchKey: info.node.props.eventKey,
        keyType: info.node.props.keyType,
      };
      console.log(params);
      this.searchKeyValue(params);
      currentKey[0] = info.node.props;
    } else {
      this.initCurrentKeyForNull();
    }

    console.log(currentKey);
    // 加上onLoadData才能加载出右边页面的数据
    this.onLoadDataRefreshRightContent(info.node);
  };

  // 选中节点
  onCheck = (checkedKeys, info) => {
    this.initCurrentCheckedKeys();
    console.log('onCheck', checkedKeys, info);
    console.log(info.checkedNodes);

    info.checkedNodes.forEach((temp) => {
      console.log(temp.props.isLeaf);
      console.log(temp.props.dataRef.key);
      if (temp.props.isLeaf) {
        currentCheckedKeys.push(temp.props.dataRef.key);
      }
    });
    console.log(currentCheckedKeys);
  };

  onLoadDataRefreshRightContent = treeNode => new Promise((resolve) => {
    console.log(treeNode);
    this.setState({
      treeData: [...this.state.treeData],
    });
  });

  onLoadData = treeNode => new Promise((resolve) => {
    if (treeNode.props.children) {
      resolve();
      return;
    }
    setTimeout(() => {
      treeNode.props.dataRef.children = [
        { title: 'Child Node', key: `${treeNode.props.eventKey}-0` },
        { title: 'Child Node', key: `${treeNode.props.eventKey}-1` },
      ];
      this.setState({
        treeData: [...this.state.treeData],
      });
      resolve();
    }, 1000);
  });

  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} dataRef={item} />;
  });

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { visible, done, current = {} } = this.state;

    const contentRight = currentKey.map((k, index) => (
      <Card bordered={false} key={k.eventKey}>
        <p key={k.eventKey + 0}>type：{k.keyType.toUpperCase()}</p>
        <Paragraph ellipsis={{rows: 1, expandable: true}}>
          key：{k.eventKey}
        </Paragraph>
        <p key={k.eventKey + 3}>
          value：{typeof currentKeyValue === 'string' ? currentKeyValue : JSON.stringify(currentKeyValue)}
        </p>
        <ReactJson name="JsonValue" src={currentKeyValue} displayDataTypes={false} theme="monokai" />
      </Card>
    ));

    return (
      <Card
        bordered={false}
        size="small"
        hoverable
      >
        <div>
          <Row>
            <Col span={24}>
              <SearchForm />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Divider dashed style={{marginTop: 19, marginBottom: -1}} />
            </Col>
          </Row>
          <Row>
            <Col span={10} className={styles.treeContainer}>
              <Card bordered={false}>
                <Tree checkable showLine loadData={this.onLoadData} onSelect={this.onSelect} onCheck={this.onCheck}>
                  {this.renderTreeNodes(this.state.treeData)}
                </Tree>
              </Card>
            </Col>
            <Col span={14}>
              {contentRight}
            </Col>
          </Row>
        </div>
      </Card>
    );
  }
}

export default RedisData;

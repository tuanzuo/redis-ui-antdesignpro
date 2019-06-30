import React, { Component } from 'react';
import { Button } from 'antd';
// 需要提前安装md5-->npm install md5 --save
// import md5 from "md5"; // 加载md5
// import { stringify } from 'qs';
import 'ztree'; // 加载ztree
let ztreeIndex = 1;
let newCount = 1;
let className = 'dark',
  curDragNodes,
  autoExpandNode;

// 是否需要渲染ztree的标识
let renderZtreeDomFlag = false;

export default class ReactZtree extends Component {
  constructor(props) {
    super(props);
  }

  // 在第一次渲染后调用
  componentDidMount = () => {
    // console.log("ztree-componentDidMount");
    this.renderZtreeDom();
    // 调用ReactZtree中props中onInitTree属性对应的parent组件中的方法
    this.props.onInitTree(this.getTreeObj(), this);
  };

  // 在组件接收到一个新的 prop (更新后)时被调用。这个方法在初始化render时不会被调用。
  componentWillReceiveProps = nextProps => {
    // console.log("ztree-componentWillReceiveProps");
    // 比较之前的属性和当前传入的属性他们的Md5是否相等,如果相等说明没有改变，不重新渲染ztree；
    // 否则就需要重新渲染ztree，从而设置renderZtreeDomFlag为true
    /*if (md5(stringify(this.props)) === md5(stringify(nextProps))) {
      console.log("props not change")
    } else {
      renderZtreeDomFlag = true;
      console.log("props change")
    }*/
  };

  // 在组件完成更新后立即调用。在初始化时不会被调用。
  componentDidUpdate = () => {
    // console.log("ztree-componentDidUpdate");
    // console.log(this.props);
    // renderZtreeDomFlage为true时表示需要重新渲染ztree
    if (this.props.renderZtreeFlag) {
      // console.log("renderZtree");
      this.renderZtreeDom();
      renderZtreeDomFlag = false;
    }
  };

  // 在组件从 DOM 中移除的时候立刻被调用。
  componentWillUnmount = () => {
    // console.log("ztree-componentWillUnmount");
    if (!this.ztreeObj) return;
    this.ztreeObj.destroy();
  };

  renderZtreeDom = () => {
    let ztreeObj = (this.ztreeObj = window.$.fn.zTree.init(
      this.getTreeDom(),
      this.getTreeSetting(),
      this.props.nodes
    ));
    return ztreeObj;
  };

  getTreeDom = () => {
    return window.$(this.refs.ztree);
  };

  getTreeSetting = () => {
    let props = this.props;
    let edit = props.edit;
    if (edit) {
      if (edit.showRemoveBtn) {
        edit.showRemoveBtn = this.showRemoveBtn;
      }
      if (edit.drag) {
        edit.drag.prev = edit.drag.prev || edit.drag.prev === undefined ? this.dropPrev : false;
        edit.drag.inner = edit.drag.inner || edit.drag.inner === undefined ? this.dropInner : false;
        edit.drag.next = edit.drag.next || edit.drag.next === undefined ? this.dropNext : false;
      }
    }

    let view = props.view;
    if (view && view.addHoverDom) {
      view.addHoverDom = this.addHoverDom;
      view.removeHoverDom = this.removeHoverDom;
    }
    const callback = {
      beforeDrag: this.beforeDrag,
      onDrop: this.onDrop,
      beforeRemove: this.beforeRemove,
      beforeRename: this.beforeRename,
      onRemove: this.onRemove,
      onRename: this.onRename,
      onClick: this.onClick,
      onCheck: this.onCheck,
    };

    return {
      treeId: props.treeId,
      treeObj: props.treeObj,
      async: props.async,
      callback: callback, //props.events,
      check: props.check,
      data: props.data,
      edit: edit, //props.edit,
      view: view, //props.view
    };
  };

  getTreeObj = () => {
    return this.ztreeObj;
  };

  // 是否显示删除按钮
  showRemoveBtn = (treeId, treeNode) => {
    return !treeNode.isFirstNode;
  };

  addHoverDom = (treeId, treeNode) => {
    var sObj = window.$('#' + treeNode.tId + '_span');
    if (treeNode.editNameFlag || window.$('#addBtn_' + treeNode.tId).length > 0) return;
    var addStr =
      "<span class='button add' id='addBtn_" +
      treeNode.tId +
      "' title='add node' onfocus='this.blur();' style='margin-left:2px; margin-right: -1px; background-position:-144px 0; vertical-align:top; *vertical-align:middle'></span>";
    sObj.after(addStr);
    var me = this;
    var btn = window.$('#addBtn_' + treeNode.tId);
    if (btn)
      btn.bind('click', function() {
        var zTree = window.$.fn.zTree.getZTreeObj(treeId);
        // let newId = this.props.getNewId();
        let newName = 'new node' + newCount++;
        let xNewNodes = zTree.addNodes(treeNode, {
          id: 100 + newCount,
          pId: treeNode.id,
          name: newName,
        });
        let id = me.props.addNode(newName);
        xNewNodes[0].id = id;
        return false;
      });
  };

  removeHoverDom = (treeId, treeNode) => {
    window
      .$('#addBtn_' + treeNode.tId)
      .unbind()
      .remove();
  };

  dropPrev = (treeId, nodes, targetNode) => {
    var pNode = targetNode.getParentNode();
    if (pNode && pNode.dropInner === false) {
      return false;
    } else {
      for (var i = 0, l = curDragNodes.length; i < l; i++) {
        var curPNode = curDragNodes[i].getParentNode();
        if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
          return false;
        }
      }
    }
    return false;
  };

  dropInner = (treeId, nodes, targetNode) => {
    if (targetNode && targetNode.dropInner === false) {
      return false;
    } else {
      for (var i = 0, l = curDragNodes.length; i < l; i++) {
        if (!targetNode && curDragNodes[i].dropRoot === false) {
          return false;
        } else if (
          curDragNodes[i].parentTId &&
          curDragNodes[i].getParentNode() !== targetNode &&
          curDragNodes[i].getParentNode().childOuter === false
        ) {
          return false;
        }
      }
    }
    return true;
  };

  dropNext = (treeId, nodes, targetNode) => {
    var pNode = targetNode.getParentNode();
    if (pNode && pNode.dropInner === false) {
      return false;
    } else {
      for (var i = 0, l = curDragNodes.length; i < l; i++) {
        var curPNode = curDragNodes[i].getParentNode();
        if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
          return false;
        }
      }
    }
    return true;
  };

  beforeDrag = (treeId, treeNodes) => {
    className = className === 'dark' ? '' : 'dark';
    console.log('[ beforeDrag ]&nbsp;&nbsp;&nbsp;&nbsp; drag: ' + treeNodes.length + ' nodes.');
    for (var i = 0, l = treeNodes.length; i < l; i++) {
      if (treeNodes[i].drag === false) {
        curDragNodes = null;
        return false;
      } else if (treeNodes[i].parentTId && treeNodes[i].getParentNode().childDrag === false) {
        curDragNodes = null;
        return false;
      }
    }
    curDragNodes = treeNodes;
    return true;
  };

  onDrop = (event, treeId, treeNodes, targetNode, moveType, isCopy) => {
    console.log(JSON.stringify(targetNode));
    if (!targetNode) {
      return false;
    }
    this.props.onDrop(treeNodes[0].id, targetNode.id, moveType);
  };

  beforeRemove = (treeId, treeNode) => {
    className = className === 'dark' ? '' : 'dark';
    console.log('[  beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; ' + treeNode.name);
    var zTree = window.$.fn.zTree.getZTreeObj(treeId);
    zTree.selectNode(treeNode);
    return window.confirm('确认删除 节点 -- ' + treeNode.name + ' 吗？');
  };

  onRemove = (e, treeId, treeNode) => {
    console.log('[  onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; ' + treeNode.name);
    this.props.onDeleteNode(treeNode.id);
  };

  beforeRename = (treeId, treeNode, newName, isCancel) => {
    className = className === 'dark' ? '' : 'dark';
    console.log(
      (isCancel ? "<span style='color:red'>" : '') +
        '[  beforeRename ]&nbsp;&nbsp;&nbsp;&nbsp; ' +
        treeNode.name +
        (isCancel ? '</span>' : '')
    );
    if (newName.length == 0) {
      alert('节点名称不能为空.');
      var zTree = window.$.fn.zTree.getZTreeObj(treeId);
      setTimeout(function() {
        zTree.editName(treeNode);
      }, 10);
      return false;
    }
    return true;
  };

  onRename = (e, treeId, treeNode, isCancel) => {
    console.log(
      (isCancel ? "<span style='color:red'>" : '') +
        '[  onRename ]&nbsp;&nbsp;&nbsp;&nbsp; ' +
        treeNode.name +
        (isCancel ? '</span>' : '')
    );
    this.props.onChangeName(treeNode.id, treeNode.name);
  };

  onClick = (e, treeId, treeNode) => {
    var selectedNodes = this.ztreeObj.getSelectedNodes();
    this.props.onClick(e, treeId, treeNode, selectedNodes);
  };

  onCheck = (e, treeId, treeNode) => {
    var checkedNodes = this.ztreeObj.getCheckedNodes(true);
    this.props.onCheck(e, treeId, treeNode, checkedNodes);
  };

  expandAll = () => {
    if (this.ztreeObj) {
      this.ztreeObj.expandAll(true);
    }
  };

  foldAll = () => {
    if (this.ztreeObj) {
      this.ztreeObj.expandAll(false);
    }
  };

  render() {
    return (
      <div>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button size="small" onClick={this.expandAll}>
          展开全部
        </Button>
        &nbsp;&nbsp;
        <Button size="small" onClick={this.foldAll}>
          折叠全部
        </Button>
        <div className="ztree" ref="ztree" id={`ztree_${ztreeIndex++}`} />
      </div>
    );
  }
}

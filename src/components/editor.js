import compose from 'lodash/fp/compose';
import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/jsx/jsx';
import { updateCode, updateCursorPosition } from 'actions';
import { connect } from 'react-redux';

const Editor = React.createClass({
  componentDidMount(){
    this.codemirror = this.refs.codemirror.getCodeMirror();
    this.codemirror.on('cursorActivity', this.handleCursorActivity);
  },

  componentWillReceiveProps({ cursorPosition }) {
    const { doc } = this.codemirror;
    if (cursorPosition.force) {
      const { line, ch } = cursorPosition;
      doc.setCursor({ line, ch });
      this.refs.codemirror.focus();
    }
  },

  handleCursorActivity({ doc }){
    this.props.onUpdateCursorPosition(doc.getCursor());
  },

  render(){
    const { code, theme, onCodeChange } = this.props;
    return (
      <div>
        <CodeMirror
          ref="codemirror"
          value={code}
          onChange={onCodeChange}
          options={{ theme, mode: 'jsx', lineNumbers: true, tabSize: 2 }} />
      </div>
    );
  }
});

function mapStateToProps({ code, theme, cursorPosition }) {
  return { code: code.latest, theme, cursorPosition };
}

const mapDispatchToProps = (dispatch) => ({
  onCodeChange: compose(dispatch, updateCode),
  onUpdateCursorPosition: compose(dispatch, updateCursorPosition)
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);

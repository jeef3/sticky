import React from 'react';
import { ipcRenderer } from 'electron';
import {
  convertToRaw,
  convertFromRaw,
  Editor,
  EditorState,
  RichUtils
} from 'draft-js';

import Container from './Container';
import TitleBar from './TitleBar';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { editorState: EditorState.createEmpty() };

    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on('stickies-loaded', (event, raw) => {
      console.log('Got', JSON.parse(raw));
      this.setState({
        editorState: EditorState.createWithContent(
          convertFromRaw(JSON.parse(raw))
        )
      });
    });

    ipcRenderer.send('load-stickies', '');
  }

  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.handleUpdate(newState);
    }
  }

  handleUpdate(editorState) {
    this.setState({ editorState });

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      const raw = convertToRaw(editorState.getCurrentContent());

      console.log('saving...', raw);
      ipcRenderer.send('save-stickies', raw);
    }, 1000);
  }

  handle() {
    RichUtils.toggleInlineStyle(this.state.editorState, '');
  }

  render() {
    return (
      <Container>
        <TitleBar />
        <Editor
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.handleUpdate}
        />
      </Container>
    );
  }
}

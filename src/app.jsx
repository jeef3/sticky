import React from 'react';
import { ipcRenderer } from 'electron';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
// import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import Container from './Container';
import TitleBar from './TitleBar';
import TextEdit from './TextEdit';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { editorState: EditorState.createEmpty() };

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

  handleUpdate(editorState) {
    this.setState({ editorState });

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      const raw = convertToRaw(editorState.getCurrentContent());

      console.log('saving...', raw);
      ipcRenderer.send('save-stickies', raw);
    }, 1000);
  }

  render() {
    return (
      <Container>
        <TitleBar />
        <Editor
          editorState={this.state.editorState}
          onEditorStateChange={this.handleUpdate}
        />
      </Container>
    );
  }
}

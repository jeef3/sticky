import React from 'react';
import { ipcRenderer } from 'electron';
import {
  convertToRaw,
  convertFromRaw,
  Editor,
  EditorState,
  RichUtils
} from 'draft-js';
import { faBold, faListUl } from '@fortawesome/fontawesome-free-solid';

import Container from './Container';
import TitleBar from './TitleBar';
import EditorContainer from './EditorContainer';
import EditorButton from './EditorButton';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { editorState: EditorState.createEmpty() };

    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.handleBoldClick = this.handleBoldClick.bind(this);
    this.handleBullet = this.handleBullet.bind(this);
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

  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.handleUpdate(newState);
    }
  }

  handleBoldClick() {
    this.handleUpdate(
      RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD')
    );
  }

  handleBullet() {
    this.handleUpdate(
      RichUtils.toggleBlockType(this.state.editorState, 'unordered-list-item')
    );
  }

  render() {
    return (
      <Container>
        <TitleBar />
        <EditorContainer>
          <Editor
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.handleUpdate}
            style={{ padding: 10 }}
          />
        </EditorContainer>
        <div
          style={{
            position: 'absolute',
            zIndex: 1,
            top: 20,
            left: 20,

            background: '#0c0c0c',
            borderRadius: 3
          }}
        >
          <EditorButton
            onClick={this.handleBoldClick}
            label="Bold"
            icon={faBold}
          />
          <EditorButton
            onClick={this.handleBullet}
            label="Bullet"
            icon={faListUl}
          />
        </div>
      </Container>
    );
  }
}

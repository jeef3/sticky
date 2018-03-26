import React from 'react';
import { ipcRenderer } from 'electron';
import {
  convertToRaw,
  convertFromRaw,
  Editor,
  EditorState,
  RichUtils
} from 'draft-js';
import {
  faBold,
  faItalic,
  faUnderline,
  faListUl,
  faListOl
} from '@fortawesome/fontawesome-free-solid';

import Container from './Container';
import TitleBar from './TitleBar';
import EditorContainer from './EditorContainer';
import EditorButton from './EditorButton';
import EditorBar from './EditorBar';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      editorState: EditorState.createEmpty(),
      selectionRect: null
    };

    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);

    this.handleInlineStyle = this.handleInlineStyle.bind(this);
    this.handleBlockStyle = this.handleBlockStyle.bind(this);

    this.controls = [
      { label: 'Bold', icon: faBold, inline: true, style: 'BOLD' },
      { label: 'Italic', icon: faItalic, inline: true, style: 'ITALIC' },
      {
        label: 'Underline',
        icon: faUnderline,
        inline: true,
        style: 'UNDERLINE'
      },
      {
        label: 'Bullet List',
        icon: faListUl,
        inline: false,
        style: 'unordered-list-item'
      },
      {
        label: 'Numbered List',
        icon: faListOl,
        inline: false,
        style: 'ordered-list-item'
      }
    ];
  }

  componentDidMount() {
    ipcRenderer.on('stickies-loaded', (event, raw) => {
      console.log('Loaded', JSON.parse(raw));
      this.setState({
        editorState: EditorState.createWithContent(
          convertFromRaw(JSON.parse(raw))
        )
      });
    });

    ipcRenderer.send('load-stickies', '');
  }

  handleUpdate(editorState) {
    this.setState(() => ({ editorState }));

    const selection = window.getSelection();

    if (selection && selection.rangeCount) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      this.setState(() => ({ selectionRect: rect }));
    } else {
      this.setState(() => ({ selectionRect: null }));
    }

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      const raw = convertToRaw(editorState.getCurrentContent());

      console.log('saving...');
      ipcRenderer.send('save-stickies', raw);
    }, 1000);
  }

  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.handleUpdate(newState);
    }
  }

  createStyleHandler(inline, style) {
    return () =>
      this.handleUpdate(
        inline ? this.handleInlineStyle(style) : this.handleBlockStyle(style)
      );
  }

  handleInlineStyle(style) {
    return RichUtils.toggleInlineStyle(this.state.editorState, style);
  }

  handleBlockStyle(style) {
    return RichUtils.toggleBlockType(this.state.editorState, style);
  }

  render() {
    const { selectionRect } = this.state;

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

        {selectionRect && (
          <EditorBar
            x={selectionRect.left + selectionRect.width / 2}
            y={selectionRect.top - 10}
          >
            {this.controls.map(control => (
              <EditorButton
                onClick={this.createStyleHandler(control.inline, control.style)}
                label={control.label}
                icon={control.icon}
              />
            ))}
          </EditorBar>
        )}
      </Container>
    );
  }
}

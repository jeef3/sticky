import React from 'react';
import { ipcRenderer } from 'electron';

import Container from './Container';
import TitleBar from './TitleBar';
import TextEdit from './TextEdit';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { data: null };

    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on('stickies-loaded', (event, arg) => {
      this.setState({ data: arg });
    });

    ipcRenderer.send('load-stickies', '');
  }

  handleUpdate(data) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      console.log('saving...');
      ipcRenderer.send('save-stickies', data);
    }, 1000);
  }

  render() {
    return (
      <Container>
        <TitleBar />
        <TextEdit defaultValue={this.state.data} onChange={this.handleUpdate} />
      </Container>
    );
  }
}

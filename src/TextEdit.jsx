import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  flex: 1;
  padding: 15px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  :focus {
    outline: 0;
  }
`;

class TextEdit extends React.Component {
  constructor() {
    super();

    this.state = { html: null };

    this.handleUpdate = this.handleUpdate.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (!this.el || (
      nextProps.defaultValue !== this.el.innerHTML &&
      nextProps.defaultValue !== this.props.defaultValue
    )) {
      return true;
    }

    return false;
  }

  componentDidUpdate() {
    if (this.el && this.props.defaultValue !== this.el.innerHTML) {
      this.el.innerHTML = this.props.defaultValue;
    }
  }

  handleUpdate() {
    let html = this.el.innerHTML;

    // TODO: Mutations

    // @name
    const nameRegex = /(^|[^@\w])@(\w{1,15})\b/g;
    const replace = '$1<b>@$2</b>';
    html = html.replace(nameRegex, replace);

    this.setState({ html });

    if (this.props.onChange) {
      this.props.onChange(html);
    }
  }

  render() {
    return (
      <Container
        ref={el => (this.el = el)}
        contentEditable
        className="content"
        onInput={this.handleUpdate}
        onBlur={this.handleUpdate}
        dangerouslySetInnerHTML={{ __html: this.state.html }}
      />
    );
  }
}

export default TextEdit;

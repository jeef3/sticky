import React from 'react';
import styled from 'styled-components';
import Icon from '@fortawesome/react-fontawesome';

const Button = styled.button`
  width: 40px;
  height: 40px;
  padding: 0;

  cursor: pointer;
  color: ${props => (props.active ? '#ccc' : '#aaa')};
  font-size: 18px;

  background: transparent;
  border: 0;

  &:hover {
    color: white;
  }
`;

export default ({ onClick, label, icon }) => (
  <Button onClick={onClick} title={label}>
    <Icon icon={icon} />
  </Button>
);

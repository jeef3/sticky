import React from 'react';
import styled from 'styled-components';
import Icon from '@fortawesome/react-fontawesome';

const Button = styled.button`
  width: 50px;
  height: 50px;
  padding: 0;

  color: white;
  font-size: 20px;

  background: transparent;
  border: 0;
`;

export default ({ onClick, label, icon }) => (
  <Button onClick={onClick} title={label}>
    <Icon icon={icon} />
  </Button>
);

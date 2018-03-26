import styled from 'styled-components';

export default styled.div`
  position: absolute;
  z-index: 1;

  top: 0;
  left: 0;

  background: #1c1c1c;
  border-radius: 3px;

  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.25);

  transform-origin: bottom;
  transform: translate3d(-50%, -100%, 0) translateY(-10px)
    translate3d(${props => props.x}px, ${props => props.y}px, 0);

  display: flex;

  &:after {
    content: '';

    position: absolute;
    width: 0;
    height: 0;
    top: 100%;
    left: 50%;

    border: solid 8px;
    border-color: #1c1c1c transparent transparent;

    transform: translateX(-50%);
  }
`;

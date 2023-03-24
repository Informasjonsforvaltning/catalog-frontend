import styled, {AnyStyledComponent, css} from 'styled-components';
import {ButtonProps, ButtonType} from '.';

const button = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
`;

const iconStyle = css`
  svg {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const linkStyle = css`
  ${button};
  ${iconStyle};

  padding: 0.4rem;
  border-bottom: dashed;
  height: 2.4rem;
  background: none;

  svg {
    width: 1rem;
    height: 1rem;
  }

  :hover {
    border-bottom: inherit;
  }
`;

const filledStyle = css`
  ${button};
  ${iconStyle};

  height: 3.2rem;
  border-radius: 0.3rem;
  padding: 1.6rem 1.2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  :hover {
    color: #fff;
    background-color: #121619;

    & * {
      stroke: #fff;
    }
  }
`;

const tranparentStyle = css`
  ${button};
  ${iconStyle};

  background: none;
  border: none;
`;

const Text = styled.p`
  font-weight: 100;
  font-size: 1.2rem;
  line-height: 1.2rem;
  white-space: nowrap;
`;

const Filled = styled.button<ButtonProps>`
  color: ${({btnColor}) => btnColor};
  background-color: ${({bg}) => bg};
  ${filledStyle};

  ${({btnColor}) =>
    btnColor &&
    css`
      & * {
        stroke: ${btnColor};
      }
    `}

  ${({iconPos}) =>
    iconPos &&
    (iconPos === 'left'
      ? css`
          svg {
            margin-right: 0.4rem;
          }
        `
      : css`
          svg {
            margin-left: 0.4rem;
          }
        `)}
`;

const Link = styled.button<ButtonProps>`
  color: ${({btnColor}) => btnColor};
  border-color: ${({btnColor}) => btnColor};

  ${({btnColor}) =>
    btnColor &&
    css`
      & * {
        stroke: ${btnColor};
      }
    `}

  ${linkStyle};
  ${({iconPos}) =>
    iconPos &&
    (iconPos === 'left'
      ? css`
          svg {
            margin-right: 0.4rem;
          }
        `
      : css`
          svg {
            margin-left: 0.4rem;
          }
        `)}
`;

const Transparent = styled.button<ButtonProps>`
  ${tranparentStyle};

  ${({iconPos}) =>
    iconPos &&
    (iconPos === 'left'
      ? css`
          svg {
            margin-right: 0.4rem;
          }
        `
      : css`
          svg {
            margin-left: 0.4rem;
          }
        `)}
`;

const getStyledComponent = (type: ButtonType): AnyStyledComponent => {
  switch (type) {
    case 'filled':
      return Filled;
    case 'link':
      return Link;
    case 'transparent':
      return Transparent;
    default:
      return Filled;
  }
};

export {getStyledComponent, Text};

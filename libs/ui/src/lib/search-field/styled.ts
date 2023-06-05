import styled, { css } from 'styled-components';
import { SearchFieldProps } from '.';

const SearchField = styled.div<SearchFieldProps>`
  min-width: 20rem;
  height: 3.6rem;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border: 0.13rem solid #121619;
  border-radius: 0.2rem;

  :hover {
    outline: 0.07rem solid #121619;
  }

  svg {
    ${({ iconPos }) =>
      iconPos && iconPos === 'right'
        ? css`
            margin-right: 1.2rem;
          `
        : css`
            margin-left: 1.2rem;
          `}
  }

  ${({ error }) =>
    error &&
    css`
      input {
        color: #803353;
      }
      input::placeholder {
        color: #803353;
      }
      border-color: #803353;
      background-color: #f7f0f3;
      :hover {
        border-color: #803353;
      }
    `}
`;

const Input = styled.input`
  margin: 0 1.6rem 0 1.6rem;
  width: 100%;
  font-size: 1.6rem;
  background: none;
  border: 0;

  :focus-visible {
    outline: none;
    border: 0;
  }
`;

const SvgWrapper = styled.figure`
  display: contents;

  :hover {
    cursor: pointer;
  }
`;

export { Input, SearchField, SvgWrapper };

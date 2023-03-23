/* eslint-disable import/no-anonymous-default-export */
import {theme} from '@fellesdatakatalog/theme';
import {Breakpoint} from '@catalog-frontend/utils';
import styled from 'styled-components';

const SearchPage = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  padding: 1.6rem;
  overflow-wrap: break-word;
`;

/** wraps around title and "add concept" and "import" buttons */
const ContainerOne = styled.span`
  display: flex;
  width: 100%;
  display: flex;
  gap: ${theme.spacing('S10')};
  align-items: start;
  margin: 4px;

  div:first-child {
    flex-grow: 0.75;
  }

  ${Breakpoint.MEDIUM} {
    flex-direction: column;
    div:first-child {
      width: 100%;
    }
  }
`;

export default {SearchPage, ContainerOne};

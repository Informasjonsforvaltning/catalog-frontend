/* eslint-disable import/no-anonymous-default-export */
import {Breakpoint} from '@catalog-frontend/utils';
import styled from 'styled-components';

const SearchPage = styled.main`
  display: flex;
  flex-grow: 1;
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
  gap: 1rem;
  align-items: start;
  margin: 4px;
  justify-content: space-between;

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

const SearchHitContainer = styled.div`
  margin-bottom: 15px;
`;

export default {SearchPage, ContainerOne, SearchHitContainer};

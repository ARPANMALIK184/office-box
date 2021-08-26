// file to put more styled components for the ShowCard component
import styled from 'styled-components';

import { SearchCard } from '../styled';

export const StyledShowCard = styled(SearchCard)`
  // extending from an existing styled-component

  // add more styles in addition to ones being extended
  .btns {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    a {
      text-decoration-color: #000;
      color: #000;
      &:hover {
        text-decoration-color: blue;
        color: blue;
      }
    }
    button {
      outline: none;
      border: 1px solid #8e8e8e;
      border-radius: 15px;
      padding: 5px 20px;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      &:hover {
        cursor: pointer;
      }
    }
  }
`;

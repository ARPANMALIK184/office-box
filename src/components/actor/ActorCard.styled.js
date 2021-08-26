// file to put styled components for the ActorCard component
import styled from 'styled-components';

import { SearchCard } from '../styled';

export const StyledActorCard = styled(SearchCard)`
  // extending from an existing styled-component

  // add more styles in addition to ones being extended
  .deathday {
    margin: 0;
    margin-top: 15px;
    font-weight: bold;
  }
`;

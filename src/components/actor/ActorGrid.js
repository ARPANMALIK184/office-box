// React Component for business logic of list of actors being displayed on the app
import React from 'react';
import ActorCard from './ActorCard';

import IMG_NOT_FOUND from '../../images/not-found.png';

import { FlexGrid } from '../styled';

const ActorGrid = ({ data }) => {
  return (
    <FlexGrid>
      {data.map(({ person }) => (
        <ActorCard
          key={person.id}
          id={person.id}
          name={person.name}
          country={person.country ? person.country.name : null}
          gender={person.gender}
          birthday={person.birthday}
          deathday={person.deathday}
          image={person.image ? person.image.medium : IMG_NOT_FOUND}
        />
      ))}
    </FlexGrid>
  );
};

export default ActorGrid;

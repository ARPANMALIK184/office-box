/* eslint-disable react-hooks/rules-of-hooks */
// React Component for business logic of shows being displayed on the app
import React, { useCallback } from 'react';
import ShowCard from './ShowCard';

import IMG_NOT_FOUND from '../../images/not-found.png';

import { FlexGrid } from '../styled';
import { useShows } from '../../misc/custom-hooks'; // for Starred Shows

const ShowGrid = ({ data }) => {
  // call function which returns a custom-hook used for Starred Shows
  const [starredShows, despatchStarred] = useShows();

  return (
    <FlexGrid>
      {data.map(({ show }) => {
        const isStarred = starredShows.includes(show.id);

        // function to STAR or unSTAR a show (to be sent as a prop to ShowCard.js)
        const onStarClick = useCallback(() => {
          if (isStarred) {
            despatchStarred({ type: 'REMOVE', showId: show.id }); // remove (unSTAR) the show
          } else {
            despatchStarred({ type: 'ADD', showId: show.id }); // add (STAR) the show
          }
        }, [isStarred, show.id]);

        return (
          <ShowCard
            key={show.id}
            id={show.id}
            name={show.name}
            image={show.image ? show.image.medium : IMG_NOT_FOUND}
            summary={show.summary}
            onStarClick={onStarClick}
            isStarred={isStarred}
          />
        );
      })}
    </FlexGrid>
  );
};

export default ShowGrid;

/* eslint-disable no-underscore-dangle */
// React Component for page showing TV Show info
import React from 'react';
import { useParams } from 'react-router-dom';

import ShowMainData from '../components/show/ShowMainData';
import Details from '../components/show/Details';
import Seasons from '../components/show/Seasons';
import Cast from '../components/show/Cast';
import { InfoBlock, ShowPageWrapper } from './Show.styled';
import { useShow } from '../misc/custom-hooks';

const Show = () => {
  const { id } = useParams(); // to get id of the show from the page URL

  // using custom-hook
  const { show, isLoading, error } = useShow(id);

  if (isLoading) {
    return <div>Loading results...</div>;
  }
  if (error) {
    return <div>An error occured: {error}</div>;
  }

  return (
    <ShowPageWrapper>
      <ShowMainData
        image={show.image}
        name={show.name}
        rating={show.rating}
        summary={show.summary}
        tags={show.genres}
      />

      <InfoBlock>
        <h2>Details</h2>
        <Details
          status={show.status}
          network={show.network}
          premiered={show.premiered}
        />
      </InfoBlock>

      <InfoBlock>
        <h2>Seasons</h2>
        <Seasons seasons={show._embedded.seasons} />
      </InfoBlock>

      <InfoBlock>
        <h2>Cast</h2>
        <Cast cast={show._embedded.cast} />
      </InfoBlock>
    </ShowPageWrapper>
  );
};

export default Show;

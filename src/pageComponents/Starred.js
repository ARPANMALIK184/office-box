// React Component for Starred page of the app
import React, { useState, useEffect } from 'react';
import MainPageLayout from '../components/MainPageLayout';
import ShowGrid from '../components/show/ShowGrid';
import { apiGet } from '../misc/config';
import { useShows } from '../misc/custom-hooks';

const Starred = () => {
  const [starred] = useShows();

  // initial state for shows
  const [shows, setShows] = useState(null);

  // initial state to inform if the results are loading
  const [isLoading, setIsLoading] = useState(true);

  // initial state for loading errors
  const [error, setError] = useState(null);

  useEffect(() => {
    if (starred && starred.length > 0) {
      // starred is an array of show IDs stored in the browser's localStorage
      // fetching show info for all the show IDs, using the user-defined function apiGet(), which returns a promise.
      // creating promises for each show ID.
      const promises = starred.map(showId => apiGet(`/shows/${showId}`));

      // resolving the promises
      Promise.all(promises)
        .then(apiData => apiData.map(show => ({ show })))
        .then(showInfo => {
          setShows(showInfo);
          setIsLoading(false); // loading over
        })
        .catch(err => {
          setError(err.message);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [starred]);

  return (
    <MainPageLayout>
      {isLoading && <div>Shows are still loading</div>}
      {error && <div>Error occured: {error}</div>}
      {!isLoading && !shows && <div>No shows were added</div>}
      {!isLoading && !error && shows && <ShowGrid data={shows} />}
    </MainPageLayout>
  );
};

export default Starred;

/* eslint-disable no-console */
// JS file containing user-defined hooks
import { useState, useReducer, useEffect, useRef, useCallback } from 'react';

import { apiGet } from './config';

// reducer function for userPersistedReducer custom-hook
function showsReducer(prevState, action) {
  switch (action.type) {
    case 'ADD': {
      // add (STAR) a show
      return [...prevState, action.showId]; // returns array with new show ID added
    }
    case 'REMOVE': {
      // remove (unSTAR a show)
      return prevState.filter(showId => showId !== action.showId); // returns array with removed show ID
    }

    default:
      return prevState;
  }
}

/* In order to "store" the state in localStorage, so that it remains even when the page is refreshed, we have custom-hooks
   - usePersistedReducer() wraps around useReducer() and stores the state in the browser's local storage, with a key
   - it works just like useReducer(), but also reads and writes from/to the browser's localStorage
   - the states would be show IDs which would look something like [123, 512, 578,...] (array of show IDs) in the local storage
*/

function usePersistedReducer(reducer, initialState, key) {
  // useReducer() also takes a third argument, which is a function used to initialise the initialState
  // this function would replace the initialState passed to userReducer()
  const [state, dispatch] = useReducer(reducer, initialState, initial => {
    const persisted = localStorage.getItem(key); // access local storage and get item associated with the given key

    // return parsed version of "persisted" if it's not undefined
    return persisted ? JSON.parse(persisted) : initial;
  });

  // using the useEffect() hook whenever the state of "state" changes
  // as the state of the "state" variable changes, useEffect() comes into play
  // the "state" variable is nothing but an array of show IDs which have been starred
  // so useEffect() replaces the current array with the updated array ("state" variable)
  // so now, the localStorage would contain an updated array of starred show IDs
  useEffect(() => {
    // adding the item to browser's localStorage
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, dispatch];
}

/*
   if the usePersistedReducer() custom-hook is to be used mutiple times for different components, the reducer function 
   and initial states would have to be defined everytime. This is not convenient.
   Therefore, we custom function useShows() (with a default key) has been built around the usePersistedReducer() custom-hook.
   So anytime we want to use userPersistedReducer(), we can use useShows() instead.
*/
export function useShows(key = 'shows') {
  return usePersistedReducer(showsReducer, [], key);
}

// custom-hook function to manage the input state of the search bar,
// so that the input entered in the search bar doesn't disappear on refereshing the page
// this custom hook is a wrapper around the useState() hook
export function useLastQuery(key = 'lastQuery') {
  const [input, setInput] = useState(() => {
    // get the value of the search input stored in the sessionStorage with the given key
    const persisted = sessionStorage.getItem(key);

    // return value in the search input if there's one, or return empty space ''
    return persisted ? JSON.parse(persisted) : '';
  });

  // whatever has been entered in the search bar has to be stored in the sessionStorage
  // however, setInput() function doesn't do that, it only changes the state of input
  // so we create another function to save the search input in the sessionStorage
  // wrapping it around the useCallback() hook to prevent a new copy of the function being created everytime
  const setPersistedInput = useCallback(
    newState => {
      // newState is the search input entered in the search bar

      // call setInput to update state
      setInput(newState);

      // store newState in the sessionStorage
      sessionStorage.setItem(key, JSON.stringify(newState));
    },
    [key]
  );

  return [input, setPersistedInput];
}

// reducer function for useShow() custom-hook
/* takes 2 args:
   1. prevState: previous state
   2. action: a user-defined object defining action types and data
*/
const reducer = (prevState, action) => {
  // defining actions
  switch (action.type) {
    case 'FETCH_SUCCESS': {
      // in case data from the API has been fetched successfully
      return { isLoading: false, error: null, show: action.show };
    }
    case 'FETCH_FAILED': {
      return { ...prevState, isLoading: false, error: action.error };
    }

    default:
      return prevState;
  }
};

export function useShow(showId) {
  /* useReducer() hook:
      1. Works like useState(), but is used for managing states of complex types such as objects.
      2. Takes 2 args: 
         - reducer(prevState, action): a function that manipulates the prevState based on the "action" required
         - initialState: object consisting of variables/data whose states are to be changed
  */
  // using the useReducer() hook to manage states of the variables being used
  const [state, dispatch] = useReducer(reducer, {
    show: null,
    isLoading: true,
    error: null,
  });

  // the useEffect() hook is used to access the stages between the lifecycles of the Components.
  // It executes whenever the state of any of the elements inside the dependency array changes.
  /*
    - takes 2 args: 
    1. a callback function that executes whenever the state of any element inside the dependency array changes.
    2. dependency array: array of items that could change. 
    - the callback function sent to the useEffect() hook returns a "cleanup" function which always executes 
      before the execution of the callback function. the ComponentWillUnmount lifecycle can be achieved through the 
      cleanup function.
  */
  useEffect(() => {
    // variable to state whether the Component is mounted or not
    let isMounted = true;

    // retrieving the TV show's main info
    apiGet(`/shows/${showId}?embed[]=seasons&embed[]=cast`)
      .then(showInfo => {
        if (isMounted) {
          dispatch({ type: 'FETCH_SUCCESS', show: showInfo }); // when results have loaded successfully
        }
      })
      .catch(err => {
        if (isMounted) {
          dispatch({ type: 'FETCH_FAILED', error: err.message }); // if fetch fails
        }
      });

    // cleanup function
    return () => {
      isMounted = false;
    };
  }, [showId]);

  return state;
}

export function useWhyDidYouUpdate(name, props) {
  // Get a mutable ref object where we can store props ...
  // ... for comparison next time this hook runs.
  const previousProps = useRef();
  useEffect(() => {
    if (previousProps.current) {
      // Get all keys from previous and current props
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      // Use this object to keep track of changed props
      const changesObj = {};
      // Iterate through keys
      allKeys.forEach(key => {
        // If previous is different from current
        if (previousProps.current[key] !== props[key]) {
          // Add to changesObj
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });
      // If changesObj not empty then output to console
      if (Object.keys(changesObj).length) {
        console.log('[why-did-you-update]', name, changesObj);
      }
    }
    // Finally update previousProps with current props for next hook call
    previousProps.current = props;
  });
}

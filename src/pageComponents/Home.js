// React Component for homepage of the app
import React, { useState, useCallback } from 'react';
import ActorGrid from '../components/actor/ActorGrid';
import MainPageLayout from '../components/MainPageLayout';
import { apiGet } from '../misc/config'; // user-defined function
import ShowGrid from '../components/show/ShowGrid';
import { useLastQuery, useWhyDidYouUpdate } from '../misc/custom-hooks';
import {
  RadioInputsWrapper,
  SearchButtonWrapper,
  SearchInput,
} from './Home.styled';
import CustomRadio from '../components/CustomRadio';

// function to return results
const renderResults = results => {
  if (results && results.length === 0) {
    return <div>No results found</div>;
  }
  if (results && results.length > 0) {
    return results[0].show ? (
      <ShowGrid data={results} />
    ) : (
      <ActorGrid data={results} />
    );
  }

  return null;
};

const Home = () => {
  // using custom-hook to mantain state of the search input
  const [input, setInput] = useLastQuery();

  // initial state for results
  const [results, setResults] = useState(null);

  // initial state for search options (i.e., either shows or people)
  const [searchOption, setSearchOption] = useState('shows');

  // boolean const to keep track if the search made is for 'shows' or 'people'
  const isShowsSearch = searchOption === 'shows';

  // function to take action when a text is typed in the input box (like onChange)
  // it's called wby the onChange() function of the input field
  // wrapping the useCallback() hook around it
  const onInputChange = useCallback(
    event => {
      // the text entered in the text-box can be found using event.target.box
      // update state
      setInput(event.target.value);
    },
    [setInput]
  );

  // function to make an API request for the text search
  const onSearch = () => {
    // calling apiGet() function to perform a http fetch API request to get results
    apiGet(`/search/${searchOption}?q=${input}`).then(result => {
      // updating state of results
      setResults(result);
    });
  };

  // function to make search even when the user presses "Enter" on the keyboard
  // wrapping the useCallback() hook around it
  const onKeyDown = event => {
    if (event.keyCode === 13) {
      // keyCode for "Enter" is 13
      onSearch(); // call search function
    }
  };

  // using useWhyDidYouUpdate custom-hook (borrowed from the internet)
  /* - It keeps track of props whose states change, which causes Component re-rendering
     - We can't keep track of state changes of props such as the setInput() function 
       so useWhyDidYouUpdate helps us with that.
     - Takes 2 args:
        1. text for the console.log to print in case of state change of prop(s).
        2. object containing list of functions which use the prop(s).
  */
  // useWhyDidYouUpdate('home', { onInputChange, onKeyDown });

  // function to search for shows or people based on the radio button selected
  // the useCallback() hook is wrapped around the onRadioChange() function
  // useCallback() hook prevents the creation of separate copies of the same function during re-rendering.
  // so a new copy of onRadioChange() won't be created everytime the Home Component is re-rendered.
  /* useCallback() takes 2 args:
      1. the function which is not supposed to be created everytime on re-rendering.
      2. dependency array: a new copy of the function would be created if any of the element 
         inside the dependency array changes. 
  */
  const onRadioChange = useCallback(event => {
    // updating state of searchOption (based on the radio button selected)
    setSearchOption(event.target.value); // value is either 'shows' or 'people'
  }, []);

  // return page layout
  return (
    <MainPageLayout>
      <SearchInput
        type="text"
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        value={input}
        placeholder={isShowsSearch ? 'Search for shows' : 'Search for people'}
      />

      <RadioInputsWrapper>
        <div>
          <CustomRadio
            label="Shows"
            id="shows-search"
            value="shows"
            checked={isShowsSearch}
            onChange={onRadioChange}
          />
        </div>
        <div>
          <CustomRadio
            label="Actors"
            id="actors-search"
            value="people"
            checked={!isShowsSearch}
            onChange={onRadioChange}
          />
        </div>
      </RadioInputsWrapper>
      <SearchButtonWrapper>
        <button type="button" onClick={onSearch}>
          Search
        </button>
      </SearchButtonWrapper>
      {renderResults(results)}
    </MainPageLayout>
  );
};

export default Home;

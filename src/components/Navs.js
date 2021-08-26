// React Component to list down a nav-bar directing to different pages of the app
import React, { memo } from 'react';
import { useLocation } from 'react-router-dom'; // wrapper around the HTML <a> tag (to use <a> tag in react-router)
import { NavList, LinkStyled } from './Navs.styled';

// const array to contain link paths
const LINKS = [
  { to: '/', linkName: 'Home' },
  { to: '/starred', linkName: 'Starred' },
];

const Navs = () => {
  // React hook from react-router-dom to tell what page the user is currently at
  const location = useLocation();
  // "location" is an object. One of its members is "pathname" which tells what page we're on.
  // for eg. if we're on the "starred" page, the value of "pathname" would be "/starred"

  return (
    <div>
      <NavList>
        {LINKS.map(item => (
          <li key={item.to}>
            <LinkStyled
              to={item.to}
              className={item.to === location.pathname ? 'active' : ''}
            >
              {item.linkName}
            </LinkStyled>
          </li>
        ))}
      </NavList>
    </div>
  );
};

export default memo(Navs);

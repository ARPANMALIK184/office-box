// React Component for Title of the app
import React, { memo } from 'react';
import { TitleWrapper } from './Title.styled';

const Title = ({ title, subtitle }) => {
  // memo is used for optimizing the app
  // It would compare the current props passed to Title with its previous and next props
  // If they're the same, the Title Component won't be re-rendered.
  // However, the comparison performed is "shallow", i.e., the props are compared on the basis of values and not reference
  // so memo cannot distinguish between objects with different references but same values.
  return (
    <TitleWrapper>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
    </TitleWrapper>
  );
};

export default memo(Title);

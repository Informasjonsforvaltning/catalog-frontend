import React from 'react';
import { render } from '@testing-library/react';

import InfoCard from './info-card';

describe('CardList', () => {
  
  const cardList = (
    <InfoCard>
      <InfoCard.Item>
        Item #1
      </InfoCard.Item>
      <InfoCard.Item>
        Item #2
      </InfoCard.Item>
    </InfoCard>
  )

  it('should render successfully', () => {
    const { baseElement } = render(cardList);
    expect(baseElement).toBeTruthy();
  });
  
});

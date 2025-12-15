import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import HomePage from './page';

describe('HomePage', () => {
  it('renders correctly', async () => {
    const component = await HomePage();
    const { container } = render(component);
    expect(container).toBeTruthy();
  });
});


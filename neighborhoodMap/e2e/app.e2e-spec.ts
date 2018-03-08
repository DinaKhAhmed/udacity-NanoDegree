import { NeighborhoodMapPage } from './app.po';

describe('neighborhood-map App', () => {
  let page: NeighborhoodMapPage;

  beforeEach(() => {
    page = new NeighborhoodMapPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});

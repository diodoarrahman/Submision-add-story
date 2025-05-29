import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import DetailStoryPage from '../pages/detail-story/detail-story-page';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/detail-story/:id': new DetailStoryPage(),
};

export default routes;

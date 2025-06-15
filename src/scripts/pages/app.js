import UrlParser from '../routes/url-parser';
import routes from '../routes/routes';

const App = {
  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();
    const pageName = routes[url];
    const pageModule = await import(`../view/${pageName}.js`);
    const page = new pageModule.default();

    const container = document.querySelector('#main-content');

    // ViewTransition + Animation API
    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        container.style.opacity = '0';
        container.style.transform = 'translateY(10px)';
        container.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

        container.innerHTML = await page.render();
        await page.afterRender();

        requestAnimationFrame(() => {
          container.style.opacity = '1';
          container.style.transform = 'translateY(0)';
        });
      });
    } else {
      container.innerHTML = await page.render();
      await page.afterRender();
    }
  }
};

export default App;

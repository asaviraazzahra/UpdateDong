import App from './pages/app';

window.addEventListener('hashchange', () => {
  App.renderPage();
});

window.addEventListener('load', () => {
  App.renderPage();
});

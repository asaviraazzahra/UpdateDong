import App from './pages/app';
import '../styles/styles.css';
import 'leaflet/dist/leaflet.css';

window.addEventListener('hashchange', () => {
    App.renderPage();
});

window.addEventListener('load', () => {
    App.renderPage();
});

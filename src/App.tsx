import Header from "./partials/Header";
import Main from "./partials/Content";
import Footer from "./partials/Footer";
import "../sass/_sticky-footer.scss";


export default function App() {
  return (
    <div id="root">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

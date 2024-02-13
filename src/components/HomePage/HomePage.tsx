import Header from '../Header/Header';
import './HomePage.scss';
import Posts from '../Posts/Posts';

function HomePage() {
  return (
    <div className="home">
      <Header />
      <Posts />
    </div>
  );
}

export default HomePage;

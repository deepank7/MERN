import './App.css';
import { Container } from 'reactstrap';
import Routes from './routes';

function App() {
  return (
    <div className="App">
      <Container>
        <h2>Sports App</h2>
        <Routes />
      </Container>

    </div>
  );
}

export default App;

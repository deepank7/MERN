import './App.css';
import { Container } from 'reactstrap';
import Routes from './routes';

function App() {
  return (
    <div className="App">
      <Container>
        <h1><b><center>Sports App</center></b></h1>
        <Routes />
      </Container>
    </div>
  );
}

export default App;

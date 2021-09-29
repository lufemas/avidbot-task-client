import App from "./App";
import MapInput from "./MapInput";
import Header from "./Header";

import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function Bootstrapper() {
  const [socket, setSocket] = useState(null);
  const [subtitle, setSubtitle] = useState('')
  const [isRunning, setIsRunning] = useState(false)


  useEffect(() => {
    const newSocket = io(`ws://avidbot-task-server.herokuapp.com`);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);
  return (
    <>
    <main>
      <Header subtitle={subtitle} isRunning={isRunning} />
       { socket ? (
        <>
    <Router>

          {/* Two paths, the Map Input and the App Sumilator */}
          <Switch>
          <Route exact path="/" >
            <MapInput socket={socket} setSubtitle={setSubtitle} />
          </Route>
          <Route path="/app">
           <App socket={socket} setSubtitle={setSubtitle} setIsRunning={setIsRunning}/>

          </Route>
        </Switch>


    </Router>
        </>
      ) : (
        <div>No server found...</div>
      )}
    </main>

    <footer style={{textAlign:'center', fontSize:'.75em', marginTop:'8em'}}>
      <h3><strong>Avidbot Programming Challenge</strong></h3>
      <p style={{margin:'0'}}><strong>Candidate:</strong> Luis Fernando Maschietto Junior</p> 
      <p style={{margin:'0'}}><strong>email:</strong> maschietto.jr@gmail.com</p> 
    </footer>
    </>
  );
}

export default Bootstrapper;

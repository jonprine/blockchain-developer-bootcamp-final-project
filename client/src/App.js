import React, { useEffect, useState } from "react";
import { getWeb3, getConcert } from "./utils";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Offers from "./pages/Offers";
import Create from "./pages/Create";
import Main from "./pages/Main";
import Layout from "./components/Layout";

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [concert, setConcert] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const web3 = getWeb3();
      const accounts = await web3.eth.getAccounts();
      const concert = await getConcert(web3);
      setWeb3(web3);
      setAccounts(accounts);
      setConcert(concert);
    };
    init();
  }, []);

  if (
    typeof web3 === "undefined" ||
    typeof accounts === "undefined" ||
    typeof concert === "undefined"
  ) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/">
            <Main />
          </Route>
          <Route path="/offers">
            <Offers />
          </Route>
          <Route path="/create">
            <Create />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;

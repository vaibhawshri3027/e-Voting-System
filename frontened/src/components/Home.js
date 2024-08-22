import React, { useState, useEffect } from "react";
import getWeb3 from "../getWeb3";
import Election from "../contracts/Election.json";
import NavigationAdmin from "./NavigationAdmin";
import Navigation from "./Navigation";

const Home = () => {
  const [ElectionInstance, setElectionInstance] = useState(undefined);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Election.networks[networkId];
        const instance = new web3.eth.Contract(
          Election.abi,
          deployedNetwork && deployedNetwork.address,
        );
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.

        setElectionInstance(instance);
        setWeb3(web3);
        setAccount(accounts[0]);

        const owner = await instance.methods.getOwner().call();
        if (accounts[0] === owner) {
          setIsOwner(true);
        }

        let start = await instance.methods.getStart().call();
        let end = await instance.methods.getEnd().call();

        setStart(start);
        setEnd(end);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    };

    fetchData();
  }, []);

  if (!web3) {
    return (
      <div className="CandidateDetails">
        <div className="CandidateDetails-title">
          <h1>
          Loading Web3, accounts, and contract..
          </h1>
        </div>
      {isOwner ? <NavigationAdmin /> : <Navigation />}
      </div>
    );
  }

  return (
    <div className="App">
        {/* <div>{this.state.owner}</div> */}
        {/* <p>Account address - {this.state.account}</p> */}
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
            {isOwner ? (<div>ADMIN DASHBOARD</div>) : (<div>VOTER DASHBOARD</div>)}
            </h1>
          </div>
        </div>
        {isOwner ? <NavigationAdmin /> : <Navigation />}

        <div className="home">
            WELCOME TO VOTING SYSTEM
        </div>

      </div>
  );
};

export default Home;

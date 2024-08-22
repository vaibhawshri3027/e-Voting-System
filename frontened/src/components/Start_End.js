import React, { useState, useEffect } from "react";
import getWeb3 from "../getWeb3";
import Election from "../contracts/Election.json";
import NavigationAdmin from "./NavigationAdmin";
import Navigation from "./Navigation";
import { Button } from 'react-bootstrap';

const Start_End = () => {
  const [ElectionInstance, setElectionInstance] = useState(undefined);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);

  // const addCandidate = async () => {
  //   await ElectionInstance.methods.addCandidate(name, party, constituency).send({ from: account, gas: 1000000 });
  //   // Reload
  //   window.location.reload(false);
  // };

  const startElection = async () => {
    await ElectionInstance.methods.startElection().send({ from: account, gas: 1000000 });
    window.location.reload(false);
  };

  const endElection = async () => {
    await ElectionInstance.methods.endElection().send({ from: account, gas: 1000000 });
    window.location.reload(false);
  };

  useEffect(() => {
    // FOR REFRESHING PAGE ONLY ONCE -
    // if (!window.location.hash) {
    //   window.location = window.location + "#loaded";
    //   window.location.reload();
    // }

    const loadWeb3 = async () => {
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

        const start = await instance.methods.getStart().call();
        const end = await instance.methods.getEnd().call();

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

    loadWeb3();
  },[]);

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
  // if(!isOwner){
  //   return(
  //     <div className="CandidateDetails">
  //       <div className="CandidateDetails-title">
  //         <h1>
  //           ONLY ADMIN CAN ACCESS
  //         </h1>
  //       </div>
  //     {isOwner ? <NavigationAdmin /> : <Navigation />}
  //     </div>
  //   );
  // }
  return (
    <div className="App">
      {/* <div>{this.state.owner}</div> */}
      {/* <p>Account address - {this.state.account}</p> */}
      <div className="CandidateDetails">
        <div className="CandidateDetails-title">
          <h1>
            Start/End Election
          </h1>
        </div>
      </div>
      {isOwner ? <NavigationAdmin /> : <Navigation />}


      <div className="admin-buttons">
        {start
          ? <Button onClick={startElection} className="admin-buttons-start-s">Start Election</Button>
          : <Button onClick={startElection} className="admin-buttons-start-e">Start Election</Button>
        }
        {end
          ? <Button onClick={endElection} className="admin-buttons-end-s">End Election</Button>
          : <Button onClick={endElection} className="admin-buttons-end-e">End Election</Button>
        }
      </div>

    </div>
  );
}

export default Start_End;

import React, { useState, useEffect } from "react";
import Election from "../contracts/Election.json";
import getWeb3 from "../getWeb3";

import { Button } from "react-bootstrap";

import '../index.css';

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';


const VerifyVoter = (props) => {
  const [ElectionInstance, setElectionInstance] = useState(undefined);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [votersList, setVotersList] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const verifyVoter = async (event) => {
    await ElectionInstance.methods.verifyVoter(event.target.value).send({from : account , gas: 1000000});
    window.location.reload(false);
  }

  useEffect(() => {
    const getVoter = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Election.networks[networkId];
        const ElectionInstance = new web3.eth.Contract(
          Election.abi,
          deployedNetwork && deployedNetwork.address,
        );

        setElectionInstance(ElectionInstance);
        setWeb3(web3);
        setAccount(accounts[0]);

        const owner = await ElectionInstance.methods.getOwner().call();
        if(accounts[0] === owner){
          setIsOwner(true);
        }

        let votersCount = await ElectionInstance.methods.getVoterCount().call();
        let votersList = [];
        for(let i=0;i<votersCount;i++){
          let voterAddress = await ElectionInstance.methods.voters(i).call();
          let voterDetails = await ElectionInstance.methods.voterDetails(voterAddress).call();
          if(!voterDetails.hasVoted){
          }
          votersList.push(voterDetails);
        }
        setVotersList(votersList);

      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    }
    getVoter();
  }, []);

  if (!web3) {
    return (
      <div className="CandidateDetails">
        <div className="CandidateDetails-title">
          <h1>Loading Web3, accounts, and contract..</h1>
        </div>
        {isOwner ? <NavigationAdmin /> : <Navigation />}
      </div>
    );
  }

  // if(!isOwner){
  //   return(
  //     <div className="CandidateDetails">
  //         <div className="CandidateDetails-title">
  //           <h1>ONLY ADMIN CAN ACCESS</h1>
  //         </div>
  //       {isOwner ? <NavigationAdmin /> : <Navigation />}
  //     </div>
  //   );
  // }

  return (
    <div>
      <div className="CandidateDetails">
        <div className="CandidateDetails-title">
          <h1>Verify Voters</h1>
        </div>
      </div>
      {isOwner ? <NavigationAdmin/> : <Navigation/>}
      <div>
    {votersList && votersList.map((voter) => {
      return (
        <div className="candidate">
        <div className="candidateName">{voter.name}</div>
        <div className="candidateDetails">
          <div>Aadhar : {voter.aadhar}</div>
          <div>Constituency : {voter.constituency}</div>
          <div>Voter Address : {voter.voterAddress}</div>
        </div>

          {voter.isVerified ? (
            <Button className="button-verified" disabled>
              Verified
            </Button>
          ) : (
            <Button
              onClick={verifyVoter}
              value = {voter.voterAddress}
              className="button-verify"
            >
              Verify
            </Button>
          )}
        </div>
      );
    })}
  </div>
</div>
);
};

export default VerifyVoter;

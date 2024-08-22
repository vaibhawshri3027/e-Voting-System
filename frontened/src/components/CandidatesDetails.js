import React, { useState, useEffect } from "react";
import Election from "../contracts/Election.json";
import getWeb3 from "../getWeb3";

import '../index.css';

import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';


const CandidateDetails = (props) => {
  const [ElectionInstance, setElectionInstance] = useState(undefined);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [candidateCount, setCandidateCount] = useState(0);
  const [candidateList, setCandidateList] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const getData = async () => {
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

        let candidateCount = await ElectionInstance.methods.getCandidateNumber().call();
        setCandidateCount(candidateCount);

        let candidateList = [];
        for(let i=0;i<candidateCount;i++){
          let candidate = await ElectionInstance.methods.candidateDetails(i).call();
          candidateList.push(candidate);
        }
        setCandidateList(candidateList);

        const owner = await ElectionInstance.methods.getOwner().call();
        if(accounts[0] === owner){
          setIsOwner(true);
        }

      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    }
    getData();
  }, []);

  if (!web3) {
    return (
      <div className="CandidateDetails">
        <div className="CandidateDetails-title">
          <h1>
          Loading Web3, accounts, and contract..
          </h1>
        </div>
      {/* {isOwner ? <NavigationAdmin /> : <Navigation />} */}
      </div>
    );
  }

  let candidateListComponent;
  if(Array.isArray(candidateList)) {
    candidateListComponent = candidateList.map((candidate) => {
      return (
        <div className="candidate">
          <div className="candidateName">{candidate.name}</div>
          <div className="candidateDetails">
            <div>Party : {candidate.party}</div>
            <div>Constituency Number : {candidate.constituency}</div>
            <div>Candidate ID : {candidate.candidateId}</div>
          </div>
        </div>
      );
    });
    
    
    
    return (
      <div className="CandidateDetails">
        <div className="CandidateDetails-title">
          <h1>
            Candidates List
          </h1>
        </div>

        {isOwner ? <NavigationAdmin /> : <Navigation />}
        
        <div className="CandidateDetails-sub-title">
          Total Number of Candidates - {candidateCount}
        </div>
        <div>
          {candidateListComponent}
        </div>
      </div>
    );
  }
}
export default CandidateDetails;


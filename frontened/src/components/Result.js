import React, { useState, useEffect } from "react";
import Election from "../contracts/Election.json";
import getWeb3 from "../getWeb3";
import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';
import { FormGroup, FormControl,Button } from 'react-bootstrap';

function Result() {
  const [electionInstance, setElectionInstance] = useState(undefined);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [result, setResult] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [candidateList, setCandidateList] = useState(null);
  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);
  const [constituency, setConstituency] = useState('');

  const updateConstituency = event => {
    setConstituency(event.target.value);
  }

  const fetchResult = async () => {
    let result = [];
    let max=0;
    let candidateList=[];
    let candidateCount = await electionInstance.methods.getCandidateNumber().call();

    for(let i=0;i<candidateCount;i++){
        let candidate = await electionInstance.methods.candidateDetails(i).call();

        if(constituency === candidate.constituency){
          candidateList.push(candidate);

            if(candidate.voteCount === max){
                result.push(candidate);
            }else if(candidate.voteCount > max){
                result = [];
                result.push(candidate);
                max = candidate.voteCount;
            }
        }
    }

    setResult(result);
    setToggle(true);
    setCandidateList(candidateList);
  }

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Election.networks[networkId];
        const instance = new web3.eth.Contract(Election.abi, deployedNetwork && deployedNetwork.address);
        setElectionInstance(instance);
        setWeb3(web3);
        setAccount(accounts[0]);

        const owner = await instance.methods.getOwner().call();
        if(accounts[0] === owner){
          setIsOwner(true);
        }

        const start = await instance.methods.getStart().call();
        const end = await instance.methods.getEnd().call();
        setStart(start);
        setEnd(end);
      } catch (error) {
        alert(`Failed to load web3, accounts, or contract. Check console for details.`);
        console.error(error);
      }
    };

    // if(!window.location.hash){
    //   window.location = window.location + '#loaded';
    //   window.location.reload();
    // }

    init();
  }, []);

  let candidateList1;
  if(result){
    candidateList1 = result.map((candidate) => {
      return (
        <div className="candidate">
          <div className="candidateName">{candidate.name} : {candidate.voteCount} Votes</div>
          <div className="candidateDetails">
            <div>Party : {candidate.party}</div>
            <div>Constituency Number : {candidate.constituency}</div>
            <div>Candidate ID : {candidate.candidateId}</div>
          </div>
        </div>
      );
    });
  }

  let candidateList2;
  if(candidateList){
    candidateList2 = candidateList.map((candidate) => {
        return (
            <div className="candidate">
              <div className="candidateName">{candidate.name} : {candidate.voteCount} Votes</div>
              <div className="candidateDetails">
                <div>Party : {candidate.party}</div>
                <div>Constituency Number : {candidate.constituency}</div>
                <div>Candidate ID : {candidate.candidateId}</div>
              </div>
            </div>
          );
        });
      }

if(end){
  return (
    <div className="App">
      {/* <div>{owner}</div> */}
      {/* <p>Account address - {account}</p> */}
      <div className="CandidateDetails">
        <div className="CandidateDetails-title">
          <h1>
            RESULTS
          </h1>
        </div>
      </div>
      {isOwner ? <NavigationAdmin /> : <Navigation />}


      <div className="form">
        <FormGroup>
          <div className="form-label">Enter Constituency Number for results - </div>
          <div className="form-input">
            <FormControl
                input = 'text'
                value = {constituency}
                onChange={updateConstituency}
            />
          </div>
          <Button onClick={fetchResult}  className="button-vote">
            Result
          </Button>
        </FormGroup>
      </div>
      

      <br></br>

      {toggle ? 
        <div>
          <div className="CandidateDetails-mid-sub-title">
            Leaders -
          </div>
          {candidateList1}
          <div className="CandidateDetails-mid-sub-title">
            Constituency Votes -
          </div>
          {candidateList2}
        </div>

        
        : ''}


    </div>
  );
}
else{
  return(
    <div className="CandidateDetails">
    <div className="CandidateDetails-title">
      <h1>
      END THE VOTING....TO SEE RESULTS
      </h1>
    </div>
    {isOwner ? <NavigationAdmin /> : <Navigation />}
  </div>
  );
}
}


export default Result;
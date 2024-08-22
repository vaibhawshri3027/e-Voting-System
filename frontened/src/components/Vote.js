import React, { useState, useEffect } from "react";
import Election from "../contracts/Election.json";
import getWeb3 from "../getWeb3";
import { FormGroup, FormControl, Button } from "react-bootstrap";
import NavigationAdmin from "./NavigationAdmin";
import Navigation from "./Navigation";

function Vote() {
  const [electionInstance, setElectionInstance] = useState(undefined);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [candidateList, setCandidateList] = useState(null);
  const [candidateId, setCandidateId] = useState("");
  const [toggle, setToggle] = useState(false);
  const [myAccount, setMyAccount] = useState(null);
  const [candidateConstituencyList, setCandidateConstituencyList] = useState(null);
  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const updateCandidateId = (event) => {
    setCandidateId(event.target.value);
  };

  const vote = async () => {
    let candidate = await electionInstance.methods.candidateDetails(candidateId).call();

    if (myAccount.constituency !== candidate.constituency) {
      setToggle(true);
    } else {
      await electionInstance.methods.vote(candidateId).send({ from: account, gas: 1000000 });
      setToggle(false);
      window.location.reload(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!window.location.hash) {
        window.location = window.location + "#loaded";
        window.location.reload();
      }

      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Election.networks[networkId];
        const instance = new web3.eth.Contract(Election.abi, deployedNetwork && deployedNetwork.address);

        setElectionInstance(instance);
        setWeb3(web3);
        setAccount(accounts[0]);

        let myAccount = await instance.methods.voterDetails(accounts[0]).call();
        setMyAccount(myAccount);

        let candidateCount = await instance.methods.getCandidateNumber().call();
        let candidateList = [];

        for (let i = 0; i < candidateCount; i++) {
          let candidate = await instance.methods.candidateDetails(i).call();
          if (myAccount.constituency === candidate.constituency) {
            candidateList.push(candidate);
          }
        }

        setCandidateConstituencyList(candidateList);
        let start = await instance.methods.getStart().call();
        let end = await instance.methods.getEnd().call();

        setStart(start);
        setEnd(end);

        const owner = await instance.methods.getOwner().call();
        if (accounts[0] === owner) {
          setIsOwner(true);
        }
      } catch (error) {
        alert(`Failed to load web3, accounts, or contract. Check console for details.`);
        console.error(error);
      }
    };
    init();
  }, []);

  let candidateListRender;
  if (candidateConstituencyList) {
    candidateListRender = candidateConstituencyList.map((candidate) => {
      return (
        <div className="candidate">
          <div className="candidateName">{candidate.name}</div>
          <div className="candidateDetails">
            <div>Party: {candidate.party}</div>
            <div>Constituency: {candidate.constituency}</div>
            <div>CandidateId: {candidate.candidateId}</div>
          </div>
        </div>
      );
    });
  } else {
    candidateListRender = <div>No candidates found.</div>;
  }
  

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

    if(end){
      return(
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
              VOTING HAS ENDED
            </h1>
          </div>
        {isOwner ? <NavigationAdmin /> : <Navigation />}
        </div>
      );
    }

    if(!setStart){
      return(
        <div className="CandidateDetails">
        <div className="CandidateDetails-title">
          <h1>
          VOTING HAS NOT STARTED YET.
          </h1>
        </div>

        <div className="CandidateDetails-sub-title">
        Please Wait.....While election starts !
        </div>
        {isOwner ? <NavigationAdmin /> : <Navigation />}
        </div>
      );
    }

    if(myAccount){
      if(!myAccount.isVerified){
        return(
          <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
            You need to verified first for voting.
            </h1>
          </div>

          <div className="CandidateDetails-sub-title">
          Please wait....the verification can take time
          </div>
        {isOwner ? <NavigationAdmin /> : <Navigation />}
          </div>
        );
      }
    }

    if(myAccount){
      if(myAccount.hasVoted){
        return(
          <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
              YOU HAVE SUCCESSFULLY CASTED YOUR VOTE
            </h1>
          </div>
        {isOwner ? <NavigationAdmin /> : <Navigation />}
        </div>
        );
      }
    }

    return (
      <div className="App">
        {/* <div>{this.state.owner}</div> */}
        {/* <p>Account address - {this.state.account}</p> */}
        <div className="CandidateDetails">
          <div className="CandidateDetails-title">
            <h1>
              VOTE
            </h1>
          </div>
        </div>
        {isOwner ? <NavigationAdmin /> : <Navigation />}

        <div className="form">
          <FormGroup>
            <div className="form-label">Enter Candidate ID you want to vote - </div>
            <div className="form-input">
              <FormControl
                  input = 'text'
                  value = {candidateId}
                  onChange={updateCandidateId}
              />
            </div>

            <Button onClick={vote} className="button-vote">
              Vote
            </Button>
          </FormGroup>
        </div>

        {/* <Button onClick={this.getCandidates}>
          Get Name
        </Button> */}

        {toggle ? <div>You can only vote to your own constituency</div> : ''}

        <div className="CandidateDetails-mid-sub-title">
          Candidates from your Constituency
        </div>

        <div>
          {candidateListRender}
        </div>

      </div>
    );
  }

export default Vote;
import { useState, useEffect } from "react";
import Election from "../contracts/Election.json";
import getWeb3 from "../getWeb3";
import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';
import { FormGroup, FormControl, Button } from 'react-bootstrap';

function RequestVoter() {
  const [ElectionInstance, setElectionInstance] = useState(undefined);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [name, setName] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [constituency, setConstituency] = useState('');
  const [registered, setRegistered] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const updateName = event => {
    setName(event.target.value);
  }

  const updateAadhar = event => {
    setAadhar(event.target.value);
  }

  const updateConstituency = event => {
    setConstituency(event.target.value);
  }

  const addVoter = async () => {
    await ElectionInstance.methods.requestVoter(name, aadhar, constituency).send({from : account , gas: 1000000});
    // Reload
    window.location.reload(false);
  }

  useEffect(() => {
    const init = async () => {
      // FOR REFRESHING PAGE ONLY ONCE -
      if(!window.location.hash){
        window.location = window.location + '#loaded';
        window.location.reload();
      }

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

        let voterCount = await ElectionInstance.methods.getVoterCount().call();
        let registered;
        for(let i=0;i<voterCount;i++){
            let voterAddress = await ElectionInstance.methods.voters(i).call();
            if(voterAddress === accounts[0]){
              registered = true;
              break;
            }
        }
        setRegistered(registered);

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
    };

    init();
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

  if (registered) {
    return (
      <div className="CandidateDetails">
        <div className="CandidateDetails-title">
          <h1>ALREADY REQUESTED TO REGISTER</h1>
        </div>
        {isOwner ? <NavigationAdmin /> : <Navigation />}
      </div>
    );
  }
 
  return (
    <div className="App">
      <div className="CandidateDetails">
        <div className="CandidateDetails-title">
          <h1>
            VOTER FORM
          </h1>
        </div>
      </div>

      {isOwner ? <NavigationAdmin /> : <Navigation />}

      <div className="form">
      <FormGroup>
          <div className="form-label">Enter Name - </div>
          <div className="form-input">
            <FormControl
                input = 'text'
                value = {name}
                onChange={updateName}
            />
          </div>
      </FormGroup>

      <FormGroup>
          <div className="form-label">Enter Aadhar Number - </div>
          <div className="form-input">
            <FormControl
                input = 'textArea'
                value = {aadhar}
                onChange={updateAadhar}
            />
          </div>
      </FormGroup>

      <FormGroup>
          <div className="form-label">Enter Constituency - </div>
          <div className="form-input">
            <FormControl
                input = 'text'
                value = {constituency}
                onChange={updateConstituency}
            />
          </div>
      </FormGroup>
      <Button onClick={addVoter}  className="button-vote">
        Request to Add Voter
      </Button>
      </div>


    </div>
  );
}

export default RequestVoter;  
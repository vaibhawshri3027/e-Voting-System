import React, { useState, useEffect } from "react";
import Election from "../contracts/Election.json";
import getWeb3 from "../getWeb3";
import { Form, FormGroup, FormControl, Button } from "react-bootstrap";
import NavigationAdmin from './NavigationAdmin';
import Navigation from './Navigation';

const AddCandidate = () => {
  const [ElectionInstance, setElectionInstance] = useState(undefined);
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [name, setName] = useState("");
  const [party, setParty] = useState("");
  const [constituency, setConstituency] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePartyChange = (event) => {
    setParty(event.target.value);
  };

  const handleConstituencyChange = (event) => {
    setConstituency(event.target.value);
  };

  const addCandidate = async () => {
    await ElectionInstance.methods
      .addCandidate(name, party, constituency)
      .send({ from: account, gas: 1000000 });
    window.location.reload(false);
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Election.networks[networkId];
        const instance = new web3.eth.Contract(
          Election.abi,
          deployedNetwork && deployedNetwork.address
        );

        setElectionInstance(instance);
        setWeb3(web3);
        setAccount(accounts[0]);

        const owner = await instance.methods.getOwner().call();
        if (accounts[0] === owner) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
          }
          } catch (error) {
          console.error(error);
          }
          };
          initialize();
        }, []);

        return (
          <div className="App">
      {/* <div>{this.state.owner}</div> */}
      {/* <p>Account address - {this.state.account}</p> */}
      <div className="CandidateDetails">
        <div className="CandidateDetails-title">
          <h1>
            ADD CANDIDATE
          </h1>
        </div>
      </div>
        
        {isOwner ? <NavigationAdmin /> : <Navigation />}
        <h1 className="text-center mt-5">Add Candidate</h1>
        <Form className="m-5">
        <FormGroup>
        <FormControl
                 type="text"
                 placeholder="Name"
                 value={name}
                 onChange={handleNameChange}
               />
        </FormGroup>
        <FormGroup>
        <FormControl
                 type="text"
                 placeholder="Party"
                 value={party}
                 onChange={handlePartyChange}
               />
        </FormGroup>
        <FormGroup>
        <FormControl
                 type="text"
                 placeholder="Constituency"
                 value={constituency}
                 onChange={handleConstituencyChange}
               />
        </FormGroup>
        <Button className="btn btn-primary" onClick={addCandidate}>
        Add Candidate
        </Button>
        </Form>
        </div>
        );
        };
        
        export default AddCandidate;


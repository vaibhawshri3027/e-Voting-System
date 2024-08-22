import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import CandidateDetails from "./components/CandidatesDetails"
import Start_End from "./components/Start_End"
import AddCandidate from "./components/AddCandidate";
import RequestVoter from "./components/RequestVoter";
import VerifyVoter from "./components/VerifyVoter";
import Vote from "./components/Vote";
import Result from "./components/Result";
import ResultVoter from "./components/ResultVoter";
//import Admin from './components/Admin'


function App(){
    return(
        <div>
            <BrowserRouter>
             <Routes>
                <Route exact path="/" element={<Home/>}></Route>
                <Route exact path="/Start_End" element={<Start_End/>}></Route>
                <Route exact path="/AddCandidate" element={<AddCandidate/>}></Route>
                <Route exact path="/CandidateDetails" element={<CandidateDetails/>}></Route>
                <Route exact path="/RequestVoter" element={<RequestVoter/>}></Route>
                <Route exact path="/VerifyVoter" element={<VerifyVoter/>}></Route>
                <Route exact path="/Vote" element={<Vote/>}></Route>
                <Route exact path="/Result" element={<Result/>}></Route>
                <Route exact path="/ResultVoter" element={<ResultVoter/>}></Route>

             </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;

// import React from 'react'
// import HomeNavbar from './components/HomeNavbar';

// const App = () => {
//   return (
//     <div>
//         <Navbar/>
//     </div>
//   )
// }

// export default App;

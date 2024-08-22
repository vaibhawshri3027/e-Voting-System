import React,{ Component } from 'react';
import { NavLink } from 'react-router-dom';

class NavigationAdmin extends Component {
    render() {
        return (
            <div className='navbar'>
                    {/* <div className="Admin">ADMIN</div> */}
                    <NavLink activeclassname="active_Styles" to ='/' className ="heading">HOME</NavLink>
                    <NavLink activeclassname="active_Styles" to='/CandidateDetails'>CANDIDATES</NavLink>
                    {/* <NavLink activeclassname="active_Styles" to='/RequestVoter'>APPLY FOR VOTER</NavLink> */}
                    {/* <NavLink activeclassname="active_Styles" to='/Vote'>VOTE</NavLink> */}
                    <NavLink activeclassname="active_Styles" to='/VerifyVoter'>VERIFY VOTER</NavLink>
                    <NavLink activeclassname="active_Styles" to='/AddCandidate'>ADD CANDIDATE</NavLink>
                    <NavLink activeclassname="active_Styles" to='/Result'>RESULTS</NavLink>
                    <NavLink activeclassname="active_Styles" to='/Start_End'>START/END</NavLink>
                </div>
        );
    }
}

export default NavigationAdmin;
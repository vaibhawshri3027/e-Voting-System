import React,{ Component } from 'react';
import { NavLink } from 'react-router-dom';

class Navigation extends Component {
    render() {
        return (
            <div className='navbar'>
                    <NavLink activeClassName="active_Styles" to ='/' className ="heading">HOME</NavLink>
                    {/* <NavLink activeClassName="active_Styles" to='/CandidateDetails'>CANDIDATES</NavLink> */}
                    <NavLink activeClassName="active_Styles" to='/RequestVoter'>APPLY FOR VOTER</NavLink>
                    <NavLink activeClassName="active_Styles" to='/Vote'>VOTE</NavLink>
                    <NavLink activeclassname="active_Styles" to='/ResultVoter'>RESULTS</NavLink>
                </div>
        );
    }
}

export default Navigation;
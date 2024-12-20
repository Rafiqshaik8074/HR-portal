import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Username from './Components/Username';  //-- actual username
// import Username from './Components/LoginPage.js'
import Username from './Components/LoginPageWithEmail.js'
import Password from './Components/Password';
import Register from './Components/Register';
import Profile from './Components/Profile';
import Recovery from './Components/Recovery';
import Reset from './Components/Reset';
import Pagenotfound from './Components/Pagenotfound';
import Homescreen from './Components/Homescreen';
import Recuterpost from './Components/Recuterpost';
import SearchForm from './Components/SearchForm';
import UpdateRecuterpost from './Components/UpdateRecuterpost';
import Arohabench from './Components/Arohabench';
import Adminpost from './Components/Adminpost';
import SearchAdminPost from './Components/SearchAdminPost';
import UpdateAdminPost from './Components/UpdateAdminPost';
import { ProtectRoute,AuthorizeUser } from './middleware/auth';
import CountsByTicketAndStatus from './Components/CountsByTicketAndStatus';
import Admindetailsacess from './Components/Admindetailsacess'
import Viewadminpost from './Components/Viewadminpost';
import ViewCandidatedetails from './Components/ViewCandidatedetails';
import Dashboard from './Components/Dashboard';
import useFetch from './hooks/Fetch.hook';
import { Spinner } from 'react-bootstrap';
import App1 from './App1';
import Clientinfo from './Components/Clientinfo';
import Getclientdetails from './Components/Getclientdetails';
import Updateclientdetail from './Components/Updateclientdetail';
import Benchresourcepost from './Components/Benchresourcepost';
import Logout from './Components/LogOut.js';

function App() {
  const [{ isLoading, apiData }] = useFetch();
  const userPosition = apiData?.position || '';

  if (isLoading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }
  return (
    <Router>
            <main>
              <Routes>
              {userPosition === 'recruiter'?(<>
                <Route path="/" element={<Username/>} />
                {/* <Route path="/" element={<Reset/>} /> */}
                <Route path="/password" element={<ProtectRoute><Password /></ProtectRoute>} />
                <Route path="/profile" element={<AuthorizeUser><Profile /></AuthorizeUser>} />
                <Route path="/recovery" element={<ProtectRoute><Recovery /></ProtectRoute>} />
                <Route path="/reset" element={<ProtectRoute><Reset /></ProtectRoute>} />
                <Route path="/home" element={<AuthorizeUser><Homescreen /></AuthorizeUser>} />
                <Route path="/arohabenchresource" element={<AuthorizeUser><Arohabench /></AuthorizeUser>} />
                <Route path="/App1" element={<AuthorizeUser><App1/></AuthorizeUser>}/>
                <Route path="/admindetailsacess" element={<AuthorizeUser><Admindetailsacess/></AuthorizeUser>} />   
                <Route path="/searchform" element={<AuthorizeUser><SearchForm /></AuthorizeUser>} />
                <Route path="/viewadminpost/:userId" element={<AuthorizeUser><Viewadminpost /></AuthorizeUser>}/>
                <Route path="/recutepost/:userId" element={<AuthorizeUser><Recuterpost /></AuthorizeUser>} />
                <Route path="/viewcandidatedetails/:userId" element={<AuthorizeUser><ViewCandidatedetails/></AuthorizeUser>}/>
                <Route path="/updatepost/:userId" element={<AuthorizeUser><UpdateRecuterpost /></AuthorizeUser>} />
                <Route path="*" element={<Pagenotfound />} /> 
                <Route path='/logout' element={<Logout/>} />
              </>):(<>
                <Route path="/" element={<Username />} />
                {/* <Route path="/" element={<Reset/>} /> */}
                <Route path="/register" element={<AuthorizeUser><Register /></AuthorizeUser>} />
                <Route path="/password" element={<ProtectRoute><Password /></ProtectRoute>} />
                <Route path="/profile" element={<AuthorizeUser><Profile /></AuthorizeUser>} />
                <Route path="/recovery" element={<ProtectRoute><Recovery /></ProtectRoute>} />
                <Route path="/reset" element={<ProtectRoute><Reset /></ProtectRoute>} />
                <Route path="/home" element={<AuthorizeUser><Homescreen /></AuthorizeUser>} />
                <Route path="/admindetailsacess" element={<AuthorizeUser><Admindetailsacess/></AuthorizeUser>} />       
                <Route path="/recutepost/:userId" element={<AuthorizeUser><Recuterpost /></AuthorizeUser>} />
                <Route path="/searchform" element={<AuthorizeUser><SearchForm /></AuthorizeUser>} />
                <Route path="/updatepost/:userId" element={<AuthorizeUser><UpdateRecuterpost /></AuthorizeUser>} />
                <Route path="/arohabenchresource" element={<AuthorizeUser><Arohabench /></AuthorizeUser>} />
                <Route path="/adminpost" element={<AuthorizeUser><Adminpost /></AuthorizeUser>} />
                <Route path="/searchadminpost" element={<AuthorizeUser><SearchAdminPost /></AuthorizeUser>} />
                <Route path="/updateadminpost/:userId" element={<AuthorizeUser><UpdateAdminPost /></AuthorizeUser>}/>
                <Route path="/viewadminpost/:userId" element={<AuthorizeUser><Viewadminpost /></AuthorizeUser>}/>
                <Route path="/viewcandidatedetails/:userId" element={<AuthorizeUser><ViewCandidatedetails/></AuthorizeUser>}/>
                <Route path="/getCountByTicket" element={<AuthorizeUser><CountsByTicketAndStatus/></AuthorizeUser>}/>
                <Route path="/dashboard" element={<AuthorizeUser><Dashboard/></AuthorizeUser>}/>
                <Route path="/App1" element={<AuthorizeUser><App1/></AuthorizeUser>}/>
                <Route path="/clientinfo" element={<AuthorizeUser><Clientinfo/></AuthorizeUser>}/>
                <Route path="/getclientdetails" element={<AuthorizeUser><Getclientdetails/></AuthorizeUser>}/>
                <Route path="/updateclientdetail/:id" element={<AuthorizeUser><Updateclientdetail /></AuthorizeUser>} />
                <Route path="/benchresourcepost" element={<AuthorizeUser><Benchresourcepost /></AuthorizeUser>} />
                <Route path="*" element={<Pagenotfound />} /> 
                <Route path='/logout' element={<Logout/>} />
              </>)}
               
              </Routes>
            </main>
    </Router>
  );
}

export default App;
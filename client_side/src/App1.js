import React, { useState } from 'react'
import './App.css'; 
import Chat from './Components/Chat'

const App1 = () => {

    // eslint-disable-next-line no-unused-vars
    const[user,setuser]=useState('Aroha technologies')
  return (
    <div className='App1'>
        <Chat user={user}/>
    </div>
  )
}

export default App1

import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext=React.createContext();

const GithubProvider=({children})=>{
    const [githubUser,setGithubUser]=useState(mockUser)
    const [followers,setFollowers]=useState(mockFollowers)
    const[repos,setRepos]=useState(mockRepos)
    const [requests,setRequests]=useState(0);
    const [isLoading,setIsLoading]=useState(false)
    const [error,setError]=useState({show:false,msg:''})
    const searchGithubUser= async(user)=>{
        //toggleError()
    setIsLoading(true)
      const response= await axios(`${rootUrl}/users/${user}`).catch(error=>console.log(error))
      if (response) {setGithubUser(response.data);
        const {login,followers_url}=response.data
        //repos
        axios(`${rootUrl}/users/${login}/repos?per_page=100`).then(response=>{
            setRepos(response.data)
        })
        //followers
        axios(`${followers_url}?per_page=100`).then(response=>{
            setFollowers(response.data)
        })
        // more logic here
        //repos
        //https://api.github.com/users/john-smilga/repos?per_page=100
        //followers
        //https://api.github.com/users/john-smilga/followers


    } else {
        toggleError(true,'there is no user from your search')
    }
    checkRequests();
    setIsLoading(false)

    }
const checkRequests=()=>{
    axios(`${rootUrl}/rate_limit`).then((data)=>{  
    let {rate:{remaining}}=data.data;
    
    setRequests(remaining);
    if (remaining===0){
        toggleError(true,'sorry you have exceeded your hourly rate limit!')
    } 
    }).catch((error)=>{console.log(error)})
}

function toggleError(show=false,msg=''){
    setError({show,msg})
}
    useEffect(()=>checkRequests(),[githubUser])



    return <GithubContext.Provider value={{
        githubUser,followers,repos,isLoading, requests,error,searchGithubUser 
    }}>
        {children}
    </GithubContext.Provider>
}

export {GithubContext,GithubProvider};
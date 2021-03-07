import React from 'react';
import styled from 'styled-components';
import { GithubContext } from '../context/context';
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts';
const Repos = () => {
  const{repos}=React.useContext(GithubContext)

const languages=repos.reduce((total,item)=>{
  if (!item.language) return total
  if (!total[item.language]) {total[item.language]={label:item.language,value:1,star:item.stargazers_count}}
  else {total[item.language]={...total[item.language],value:total[item.language].value+1,star:total[item.language].star+item.stargazers_count}}
  return total
},{})

const mostUsed=Object.values(languages).sort((a,b)=>{
  return b.value- a.value}).slice(0,5);

const mostPopular=Object.values(languages).sort((a,b)=>{
  return b.star- a.star}).map((item)=>{return {...item,value:item.star}}).slice(0,5);

// stars forked

let {stars,forks}=repos.reduce((total,item)=>{
const {stargazers_count,name,forks}=item;
total.stars[stargazers_count]={label:name,value:stargazers_count}
total.forks[forks]={label:name,value:forks}
  return total
},{stars:{},forks:{}})

stars=Object.values(stars).sort((a,b)=>{ return b.value-a.value}).slice(0,5)
forks=Object.values(forks).sort((a,b)=>{ return b.value-a.value}).slice(0,5)


  return <section className='section'>
    <Wrapper className='section-center'>
    <Pie3D data={mostUsed}/>
    <Column3D data={stars}/>
    <Doughnut2D data={mostPopular}/>
    <Bar3D data={forks}/>
    </Wrapper>
   
</section>};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;

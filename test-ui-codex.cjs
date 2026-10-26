const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const html=fs.readFileSync('index-codex.html','utf8'),elements={};
function elem(id){return elements[id]??=( {id,value:id==='gender'?'f':'0',checked:false,hidden:false,disabled:false,innerHTML:'',textContent:'',add(){},setAttribute(k,v){this[k]=v;}});}
const modes=['single','guide','sentence'].map(m=>({...elem(m),dataset:{mode:m}}));
const c=vm.createContext({document:{getElementById:elem,querySelectorAll:q=>q.includes('[data-mode]')?modes:[]},window:{addEventListener(){}},Option:function(){},console,Float32Array,Float64Array,setTimeout,clearInterval});
vm.runInContext(html.match(/<script>([\s\S]*)<\/script>/)[1],c);
assert.equal(elem('prompt').textContent,'a [a]');assert.equal((elem('map').innerHTML.match(/<circle/g)||[]).length,10);
const sample={ok:true,comparable:true,reasons:[],frames:80,total:100,duration:2,F1:{lo:800,mid:850,hi:900},F2:{lo:1200,mid:1300,hi:1400},F0:{lo:185,mid:190,hi:195},track:[{t:0,F1:850,F2:1300,F0:190}]};c.fixture=sample;
vm.runInContext('last=fixture;render()',c);assert(elem('result').innerHTML.includes('不可用于对比'));
elem('confirm').checked=true;elem('confirm').onchange();assert(elem('result').innerHTML.includes('较稳定'));
modes[2].onclick();vm.runInContext('last=fixture;render()',c);assert(elem('maparea').hidden);assert(!elem('result').innerHTML.includes('中位数'));assert.equal((elem('sentencePlot').innerHTML.match(/<svg/g)||[]).length,3);
modes[1].onclick();for(let i=0;i<10;i++){elem('confirm').checked=true;vm.runInContext('last=fixture;render()',c);elem('next').onclick();}
assert.equal(vm.runInContext('Object.keys(saved).length',c),10);assert(elem('status').textContent.includes('十项已完成'));assert.equal((elem('historyRows').innerHTML.match(/较稳定/g)||[]).length,10);
console.log('PASS UI DOM simulation: initialization; all 10 reference points; confirmation gate; sentence hides map and median; 3 time plots; guided 10-item saving/completion.');

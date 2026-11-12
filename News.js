function id(el) {
	// console.log("return element whose id is "+el);
	return document.getElementById(el);
}
'use strict';
// GLOBAL VARIABLES	
var dragStart={};
var drag={};
var sources=[]; // available news sources
var source; // current news source
var newsData=null;
var items=[]; // all news items
var list=[]; // listed news items
var item=null; // current news item
var itemIndex=null;
var tags=[];
var findTag=null;
var months="JanFebMarAprMayJunJulAugSepOctNovDec";
// NEWS SOURCES
sources[0]={
	"name":"The Guardian",
	"url":"https://content.guardianapis.com/search?api-key=17cb040c-0a32-4478-829c-382887d95fed"	
}
// add FinancialTimes, New York Times, AP, MSN,...

// GET NEWS ITEMS FROM CURRENT NEWS SOURCE
async function getNews() {
	console.log('get news items from '+source.name);
	var url=source.url;
	var response=await fetch(url,
	{
		method: "GET",
		headers: {"Content-Type": "application/json"}
	});
	var data=await response.json();
	console.log('results: '+data.response.results.length);
	console.log('first item: '+data.response.results[0].webTitle);
	if(response.ok) console.log('good response');
	var results=data.response.results;
	for(var i in results) {
		items[i]={
			"text":results[i].webTitle,
			"url":results[i].webUrl,
			"content":results[i].apiUrl
		}
	}
	populateList();
}
// POPULATE LIST OF NEWS ITEMS FOR CURRENT NEWS SOURCE
function populateList() {
	id('headerTitle').textContent=source.name;
	// items.sort(function(a,b) { return Date.parse(a.date)-Date.parse(b.date)}); // date order
	list=[];
	for(var i=0;i<items.length;i++) { // build list of news items
		list.push(i);
	}
	console.log('list '+list.length+' items');
	id('list').innerHTML=""; // clear list
	var html="";
	var d="";
	var mon=0;
	for(var i in list) { // build list
  		var listItem=document.createElement('li');
		listItem.index=list[i]; // index of listed log
		item=items[list[i]]; // listed item
	 	listItem.classList.add('news-item');
		listItem.addEventListener('click', function(){itemIndex=this.index; showItem();});
		html="<span class='news-text'>"+item.text+"</span><br>";
		listItem.innerHTML=html;
		id('list').appendChild(listItem);
  	}
}
// DISPLAY NEWS PAGE
function showItem() {
	console.log('display news page for item '+itemIndex);
	// console.log('page content: '+items[itemIndex].content);
	// id('pageFrame').src=items[itemIndex].url;
	// id('page').style.display='block';
	window.open(items[itemIndex].url,'pageTab');
} 
// DISPLAY MESSAGE
function message(text,clear) {
	console.log(text);
	if(clear) id('message').innerText=text;
	else id('message').innerText+='\n'+text;
	toggleDialog('messageDialog',true);
}
// START-UP CODE
console.log('starting');
var i=sources.length;	// shuffle array or news sources
var j;
var temp;
while(--i>0) {
	j=Math.floor(Math.random*(i+1));
	temp=sources[j];
	sources[j]=sources[i];
	sources[i]=temp;
}
source=sources[0]; // start with first in shuffled array of news sources
getNews(0); // get news items 
// SERVICE WORKER
if (navigator.serviceWorker.controller) {
	console.log('Active service worker found, no need to register')
} else { //Register the ServiceWorker
	navigator.serviceWorker.register('sw.js', {
		scope: '/Latest/'
	}).then(function(reg) {
		console.log('Service worker has been registered for scope:'+ reg.scope);
	});
}

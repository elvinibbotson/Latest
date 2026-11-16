function id(el) {
	return document.getElementById(el);
}
'use strict';
// GLOBAL VARIABLES	
var source; // current news source
var section; // current news source
var address; // url for news query
var url; // start of address
var key; // api key
var newsData=null;
var items=[]; // all news items
var list=[]; // listed news items
var item=null; // current news item
var itemIndex=null;
var guardianUrl="https://content.guardianapis.com/search?";
var guardianKey="api-key=17cb040c-0a32-4478-829c-382887d95fed";
var nytUrl="https://api.nytimes.com/svc/topstories/v2/";
var nytKey="api-key=zV8GmGzPualLscUxVSIVuFWGM4U5ezSFB6QX5Esp00qhJOw0";
var guardianSections=[
	{"value":"latest","name":"Latest"},
	{"value":"artanddesign","name":"Art+Design"},
	{"value":"books","name":"Books"}
	// ADD THE REST........
]
var nytSections=[
	{"value":"latest","name":"Latest"},
	{"value":"arts","name":"Arts"},
	{"value":"business","name":"Business"},
	{"value":"education","name":"Education"}
	// ADD MORE.........
]
// POPULATE SECTION CHOOSER
function populateChooser() {
	var sections=(source=="guardian")? guardianSections:nytSections;
	var html='';
	for(var i in sections) html+='<option value='+sections[i].value+'>'+sections[i].name+'</option>';
	console.log('sections options:'+html);
	id('sectionChooser').innerHTML=html;
}
// SOURCE CHOICE
id('sourceLogo').addEventListener('click',toggleSource);
// TOGGLE NEWS SOURCE
function toggleSource() {
	console.log('toggle news source');
	if(source=='guardian') {
		source='nyt';
		id('sourceLogo').src='nyt.png';
		url=nytUrl;
		key=nytKey;
	}
	else {
		source='guardian';
		id('sourceLogo').src='guardian.png';
		url=guardianUrl;
		key=guardianKey;
	}
	id('sourceLogo').src=source+'.png';
	populateChooser();
	section="latest";
	getNews();
}
// SECTION CHOOSER
id('sectionChooser').addEventListener('change',function(e) {
	console.log('choose section');
	address=url; 
	section=this.value;
	console.log('select section '+section);
	/*
	if(section=="latest") address+=key;
	else address+="section="+section+"&"+key;
	console.log("address: "+address);
	*/
	getNews();
})
// REFRESH
id('refresh').addEventListener('click',getNews);
// GET NEWS ITEMS FROM CURRENT SECTION CHOICE
async function getNews() {
	console.log('get news');
	address=url;
	if(source=='guardian') {
		if(section=="latest") address+=key;
		else address+="section="+section+"&"+key;
	}
	else {
		if(section=="latest") address+="home.json?"+key;
		else address+=section+".json?"+key;
	}
	console.log('get news items from '+address);
	var response=await fetch(address,
	{
		method: "GET"
	});
	var data=await response.json();
	// if(data.articles) console.log('first item: '+data.articles[0].title+' from '+data.articles[0].source);
	if(response.ok) console.log('good response');
	if(source=='guardian') {
		console.log('results: '+data.response.results.length);
		console.log('first item: '+data.response.results[0].webTitle);
		var results=data.response.results;
		for(var i in results) { // always 10 results
			items[i]={
				"text":results[i].webTitle,
				"source":"The Guardian",
				"url":results[i].webUrl,
				"time":results[i].webPublicationDate
			}
		}
	}
	else {
		console.log('results: '+data.results.length);
		var results=data.results;
		for(var i=0;i<10;i++) {
			items[i]={
				"text":results[i].title,
				"source":"New York Times",
				"url":results[i].url,
				"time":results[i].published_date
			}
		}
	}
	for(i in items) console.log('article '+i+': '+items[i].source+' @ '+items[i].time);
	populateList();
}
// POPULATE LIST OF NEWS ITEMS FOR CURRENT NEWS SOURCE
function populateList() {
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
source="guardian";
url=guardianUrl;
key=guardianKey;
populateChooser();
section="latest";
address=url+key;
getNews(); // get news items 
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

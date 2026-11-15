function id(el) {
	return document.getElementById(el);
}
'use strict';
// GLOBAL VARIABLES	
var section; // current news source
var newsData=null;
var items=[]; // all news items
var list=[]; // listed news items
var item=null; // current news item
var itemIndex=null;
var url="https://content.guardianapis.com/search?";
var key="api-key=17cb040c-0a32-4478-829c-382887d95fed"
// SECTION CHOOSER
id('sectionChooser').addEventListener('change',function(e) {
	var choice=this.value;
	console.log('select section '+choice);
	if(choice=="latest") source=url+key;
	else source=url+"section="+choice+"&"+key;
	getNews();
})
// REFRESH
id('refresh').addEventListener('click',getNews);
// GET NEWS ITEMS FROM CURRENT SECTION CHOICE
async function getNews() {
	var url=source;
	console.log('get news items from '+source);
	var response=await fetch(url,
	{
		method: "GET"
	});
	var data=await response.json();
	if(data.articles) console.log('first item: '+data.articles[0].title+' from '+data.articles[0].source);
	if(response.ok) console.log('good response');
	console.log('results: '+data.response.results.length);
	console.log('first item: '+data.response.results[0].webTitle);
	var results=data.response.results;
	for(var i in results) {
		items[i]={
			"text":results[i].webTitle,
			"source":"The Guardian",
			"url":results[i].webUrl,
			"time":results[i].webPublicationDate
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
source=url+key;
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

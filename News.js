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
sources[1]={
	"name":"BBC News",
	"url":"https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=cb249f18c5814e8b9a6eb540f590e40a"
}
sources[2]={
	"name":"The Washington Post",
	"url":"https://newsapi.org/v2/top-headlines?sources=the-washington-post&apiKey=cb249f18c5814e8b9a6eb540f590e40a"
}
sources[3]={
	"name":"Associated Press",
	"url":"https://newsapi.org/v2/top-headlines?sources=associated-press&apiKey=cb249f18c5814e8b9a6eb540f590e40a"
}
sources[4]={
	"name":"UK news",
	"url":"https://gnews.io/api/v4/top-headlines?lang=en&country=gb&apikey=098cacc5ea46b70cf48d64acb673b23a"
}
sources[5]={
	"name":"US news",
	"url":"https://gnews.io/api/v4/top-headlines?lang=en&country=us&apikey=098cacc5ea46b70cf48d64acb673b23a"
}
// SOURCE CHOOSER
id('sourceChooser').addEventListener('change',function(e) {
	var choice=this.selectedIndex;
	console.log('select source '+choice);
	source=sources[choice];
	getNews();
})
// REFRESH
id('refresh').addEventListener('click',getNews);
// GET NEWS ITEMS FROM CURRENT NEWS SOURCE
async function getNews() {
	/* TRY GNews API
	var url="https://gnews.io/api/v4/top-headlines?lang=en&source=bbc-news&apikey=098cacc5ea46b70cf48d64acb673b23a";
	*/
	/* TRY USING NEWS API
	var url="https://newsapi.org/v2/top-headlines?sources=associated-press&apiKey=cb249f18c5814e8b9a6eb540f590e40a";
	*/
	// NEWS FROM SOURCES
	var url=source.url;
	console.log('get news items from '+source.name+' at '+url);
	var response=await fetch(url,
	{
		method: "GET"
	});
	var data=await response.json();
	// NewsAPI code...
	// console.log('results: '+data.sources.length);
	// for(var i in data.sources) console.log(data.sources[i].name+' - '+data.sources[i].id);
	// if(data.sources) console.log('first source: '+data.sources[0].id+' '+data.sources[0].name);
	if(data.articles) console.log('first item: '+data.articles[0].title+' from '+data.articles[0].source);
	/* Guardian code...
	console.log('results: '+data.response.results.length);
	console.log('first item: '+data.response.results[0].webTitle);
	*/
	if(response.ok) console.log('good response');
	if(source.name=="The Guardian") {
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
	}
	else {
		var results=data.articles;
		for(var i=0;i<results.length;i++) {
			items[i]={
				"text":results[i].title,
				"source":results[i].source.name,
				"url":results[i].url,
				"time":results[i].publishedAt
			}
		}
	}
	for(i in items) console.log('article '+i+': '+items[i].source+' @ '+items[i].time);
	populateList();
}
// POPULATE LIST OF NEWS ITEMS FOR CURRENT NEWS SOURCE
function populateList() {
	// id('headerTitle').textContent=source.name;
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
var html='';
for(var i in sources) {
	html+="<option value="+i+">"+sources[i].name+"</option>";
}
id('sourceChooser').innerHTML=html;
source=sources[0]; // start with first in shuffled array of news sources
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

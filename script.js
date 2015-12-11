var Tomo = Tomo || {};


/**
 * @constructor
 */
Tomo.AutoComplete = function() {
	this.init.call(this);
};


/**
 * @const {Array}
 */
Tomo.AutoComplete.prototype.titleLangs = [
    'te',
    'tf',
    'tj',
    'tt',
    'tzh',
    'tzt'
];


/**
 * @const {HTMLUListElement}
 */
Tomo.AutoComplete.prototype.ul =
    document.getElementsByClassName('navbar-search-results')[0];


/**
 * @const {HTMLLIistElement}
 */
Tomo.AutoComplete.prototype.li =
    document.getElementsByClassName('media')[0];
        
        
/**
 * @const {HTMLLIistElement}
 */
Tomo.AutoComplete.prototype.liLast =
    document.getElementsByClassName('media')[1];
        
        
/**
 * @this {Tomo.AutoComplete}
 */
Tomo.AutoComplete.prototype.init = function() {
    var search = document.getElementById('search');
    
    search.addEventListener('cut', this.handleCutKeyupPaste.bind(this), false);
    search.addEventListener('keyup', this.handleCutKeyupPaste.bind(this), false);
    search.addEventListener('paste', this.handleCutKeyupPaste.bind(this), false);
    
	this.xhr = new XMLHttpRequest();
    this.xhr.onreadystatechange = this.handleReadyStateChange.bind(this); 
};


/**
 * @param {Event} ev .
 * @this {Tomo.AutoComplete}
 */
Tomo.AutoComplete.prototype.handleCutKeyupPaste = function(ev) {
    clearTimeout(this.timer);
    this.timer = setTimeout(this.getSearchResult.bind(this, ev), 100);
};


/**
 * @param {Event} ev .
 * @this {Tomo.AutoComplete}
 */
Tomo.AutoComplete.prototype.getSearchResult = function(ev) {
    this.searchTerm = ev.target.value;
    
    var url = 'https://api.viki.io/v4/search.json?' +
        'c=' + encodeURIComponent(this.searchTerm) + '&' +
        'per_page=5&' +
        'with_people=true&' +
        'app=100266a&' +
        't=' + String((new Date()).getTime());
    
    this.xhr.open('GET', url, false);
      
    this.xhr.send();
};


/**
 * @this {Tomo.AutoComplete}
 */
Tomo.AutoComplete.prototype.handleReadyStateChange = function() {
    if (this.xhr.readyState !== XMLHttpRequest.DONE) {
        return;
    }
    
    if (this.xhr.status !== 200) {
        return;
    }
    
    var fragment = document.createDocumentFragment();
    
    JSON.parse(this.xhr.responseText)
    .map(this.mapResult.bind(this))
    .forEach(this.forEachResult.bind(this, fragment));
    
    this.ul.style.display = 'block';
    this.ul.innerHTML = '';
    this.ul.appendChild(fragment);
    this.ul.appendChild(this.liLast);
};


/**
 * @param {Object} result .
 * @return {Object} .
 * @this {Tomo.AutoComplete}
 */
Tomo.AutoComplete.prototype.mapResult = function(result) {
    var pattern = new RegExp(this.searchTerm, 'i');
   
    var titles = this.titleLangs.map(function(key) {
        return result[key]; 
    }).filter(function(title) {
        return pattern.test(title);
    });
    
    result.title = titles[0];
    
    return result;
};


/**
 * @param {DocumentFragment} fragment .
 * @param {Object} result .
 * @this {Tomo.AutoComplete}
 */
Tomo.AutoComplete.prototype.forEachResult = function(fragment, result) {
    var li = this.li.cloneNode(true);
    
    var a = li.getElementsByClassName('vkal-search-autocomplete')[0];
    a.href = 'https://www.viki.jp' + result.u.w;
    
    var img = li.getElementsByClassName('thumbnail-tiny')[0];
    img.src = result.i;
    
    var div = li.getElementsByClassName('media-body')[0];
    div.appendChild(document.createTextNode(result.title || result.tt));
    
    fragment.appendChild(li);
};



new Tomo.AutoComplete();
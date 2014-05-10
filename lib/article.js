// Copyright 2014 Tjatse
// https://github.com/Tjatse/read-art
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

"use strict";

var read = require('./reader');

module.exports = Article;

/**
 * The article implementation.
 * @param $ dom.
 * @param options the options.
 * @return {Object}
 * @constructor
 */
function Article($, options) {
  this.$ = $;
  this.title = $('title');
  this.html = $.html();
  this.caches = options.cacheable ? {} : null;
  this.options = options;

  // return content,title and html wrapped object.
  return {
    __proto: this,
    get content(){
      return this.__proto.getContent();
    },
    get title(){
      return this.__proto.getTitle();
    },
    get html(){
      return this.__proto.html;
    }
  };
}

/**
 * Get content of article.
 * @return {*}
 */
Article.prototype.getContent = function() {
  var content;
  // if cache exists, return it directly.
  if (this.caches && (content = this.caches['article-content'])) {
    return content;
  }
  // else read it by article reader.
  var node = read(this.$, this.options);
  var content = ((node && node.length > 0) ? node.html() : '' );
  // if cacheable, cache it.
  if(this.caches){
    this.caches['article-content'] = content;
  }
  return content;
};

/**
 * Get title of article.
 * @return {*}
 */
Article.prototype.getTitle = function() {
  // if cache exists, return it directly.
  var title;
  if (this.caches && (title = this.caches['article-title'])) {
    return title;
  }

  // find better title by separators.
  title = this.title.text();
  var separators = ['|', '_', '-', '«', '»', '—'], betterTitle;

  // when find better title, break the loop.
  for(var i = 0; i < separators.length; i++){
    var titles = title.split(separators[i]);
    if (titles.length > 1) {
      if (betterTitle && betterTitle.length > 10){
        break;
      }
      betterTitle = titles[0].trim();
    }
  }

  // length of better title must gte 10.
  if (betterTitle && betterTitle.length > 10){
    title = betterTitle;
  }

  // if cacheable, cache it.
  if(this.caches){
    this.caches['article-title'] = title;
  }
  return title;
};
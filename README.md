# Match: Expressive pattern matching in JavaScript
Match is a small DSL written in JavaScript that allows Erlang/Elixir/Rust-style pattern matching with a legible syntax. It supports matching against wildcards and multiple values, and ultimately resolves to a value. 

It runs both in the browser and via Node, but requires support for ES205+ features. 

## Getting started
### Via package manager
Match is published on https://npmjs.org and can be installed via package managers such as NPM or Yarn. 
```bash
$ npm install @svartkonst/match
```
### Manual installation
There is currently no browser-ready, single-file, distribution available, but the package can be downloaded and included via `require` or `import` in a compatible environment. 

## Basic usage
#### Terminology
* Match takes any number of _clauses_, where each clause consists of a _condition_ and a _function_. It will return itself until a final value is provided, at which point it will evaluate. 
	`match(condition, function) -> (condition, function) -> ... -> (needle) -> function(needle)`
* If a clause matches the needle, it will apply the function to the needle and return the result
* If no clauses match, an error is thrown. 
* If no clauses are provided, an error is thrown.
* Clauses can be added indefinitely, and evaluation will cease once a match has been found. 
* `Symbol.for('_')` is used as a wildcard and works similarly to `_` in Erlang, Elixir, Scala, etc.  

#### Matching against single values
**Example**
```js
const _ = Symbol.for('_'); // Wildcard

const complementColour = match('blue',   () => 'red')
			      ('red', 	 () => 'blue')
			      ('green',  () => 'yellow')
			      ('yellow', () => 'green')
			      (_,        () => 'No colour found') // Prevents "No matching clause
			      
const bluesComplement = complementColour('blue'); // -> 'red'
```
#### Matching against multiple values
Both the needle and the clauses can be single values, or an array of values. Clauses are evaluated left-to-right, top-to-bottom. The clause cannot be longer than the needle, but the needle may be longer than the clause. 

**Example**
```js
const httpResponse = [200, 'Hello Mike'];

const parseHttpResponse = match( 200, 	     x => x) // matches, and returns [200, 'Hello Mike']
			       ([200, _],    x => x) // matches, but is never evaluated
			       ([200, _, _], x => x) // never matches - clause is longer than needle
```
#### Matching with RegEx
```js
const httpResponse = [200, 'Hello Mike'];

const parseHttpResponse = match([_, /hello mike/i], x => x) // matches
```
#### Chaining matches
Since match expects the needle last, we can easily "cache" expressions, as seen in the above examples. Another benefit of this is that chaining matches becomes very easy, e.g. via `map`, `filter`, or `Promise.then`. 
**Example:**
```js
const parseHttpResponse = match([200, _],     x => x)			   // Success!
			       ( /[3-5]\d\d/, x => x)		  	   // Well-formed error/redirect
			       ( _, 	      x => [500, 'General Error']) // Undefined behaviour 
		
/* ... */
fetch('api/articles/123')
  // Convert a Fetch Response to Promise<[status, body]>
  .then((res) => {
    const status = res.status;

    return res.text()
      .then(body => [status, body]);
  })
  // Enforce a well-formed response
  .then(match(200,         x => x)                       // Success!
             (/[3-5]\d\d/, x => x)                       // Well-formed error/redirect
             (_,           x => [500, 'General Error'])) // Undefined behaviour
  // Render the response, or render an error. 
  .then(match(200, ([_, article]) => render(article)) 
	     (_,   ([_, reason])  => render(`Error: ${reason}`));


```
## Issues, questions, and contributions 
May be filed freely using GitLab issues, or by merge request, respectively. 

## License 

> Copyright 2019 Emil Johnsen
> 
> Permission is hereby granted, free of charge, to any person obtaining
> a copy of this software and associated documentation files (the
> "Software"), to deal in the Software without restriction, including
> without limitation the rights to use, copy, modify, merge, publish,
> distribute, sublicense, and/or sell copies of the Software, and to
> permit persons to whom the Software is furnished to do so, subject to
> the following conditions:
> 
> The above copyright notice and this permission notice shall be
> included in all copies or substantial portions of the Software.
> 
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
> EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
> MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
> IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
> CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
> TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
> SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


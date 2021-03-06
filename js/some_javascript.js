// Begin capsule.
(function() {
   /**
    * Callback for parsing json from a fetch() response.
    * 
    * @param {Response} requestResult
    *    
    * 
    * @returns {JSON}
    *   The response body as JSON.
    * 
    *   Used for fetch requests to APIs that return JSON.
    */
   const parseJson = function(requestResult) {
      return requestResult.json();
   }

   /**
    * Callback for getting an image URL from a request to
    * a service that returns random images from the same URL 
    * such as picsum.photos.
    * 
    * This callback doesn't technically do anything other than
    * immediately return the argument it is provided, but this
    * makes it possible for a service such as picsum to be
    * used interchangably with JSON-returning services that
    * require two Promise guarantees.
    * 
    * @param {Response} requestResult 
    *   The result of the fetch request.
    * 
    * @returns {Response}
    *   The response object exactly as it was provided in
    *   param 1.
    */
   const parseImageUrl = function(requestResult) {
      return requestResult;
   }

   /**
    * Creates an element to be added to a cell in the grid.
    * 
    * This will usually be an image, but may be a video.
    * 
    * @param {*} url 
    *   The URL where the image or video is located.
    * 
    * @returns  {Element}
    *   An HTML element that will be added to a grid cell. 
    */
   const createGridContents = function(url) {
      // If the url points to an mp4 or webm file, then it is a video.
      // Videos need to be handled slightly differently.
      const isVideo = url.includes('.mp4') || url.includes('.webm');

      // Create the HTML element, it will either be 'video' or 'img'
      // We use a ternary statement to determine video or img inside the 
      // function call.
      // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
      const toInsertInGrid = document.createElement((isVideo ? 'video' : 'img'));
      
      // Additional steps that are needed if the resource is a video.
      if (isVideo) {
         // The video element should have controls.
         toInsertInGrid.setAttribute('controls', true);
         
         // A message to display if the video content is not supported
         // on the browser.
         toInsertInGrid.textContent = "Sorry, your browser doesn't support embedded videos.";
      } 

      // The spinner class will be removed once the resource is loaded. The
      // event that should be listened to is different if the resource is
      // a video, so we use a ternary statement based on `isVideo` to determine
      // what event is listened to.
      toInsertInGrid.addEventListener((isVideo ? 'loadeddata' : 'load') , function (e) {
         e.target.parentElement.classList.remove('spinner');
      });

      // Set the src element of the image/video to the resource URL. The loading 
      // process will _begin_ as soon as the attribute is set. The time it takes
      // for loading to complete depends on the API being used and the size of
      // the resource.
      toInsertInGrid.setAttribute('src', url);

      // Return the element that will be inserted in the grid cell.
      return toInsertInGrid;
   }

   /**
    * Populate the grid with new images.
    * 
    * @param {string} endpoint 
    *   A URL providing the image
    * @param {*} parseResults 
    *   The callback function for parsing the result of the 
    *   fetch request made to the endpoint.
    */
   const populateGrid = (endpoint, parseResults) => {
      // The div with id `#supergrid` in index.html.
      const supergrid = document.querySelector('#supergrid');

      // Remove everything inside supergrid -- we're starting fresh.
      supergrid.innerHTML = '';

      // The number of cells in the grid is determined by the value of 
      // the `#how-many`input.
      numCells = document.querySelector('#how-many').value;

      // Loop as many times as specified by `numCells`.
      for (let i = 0; i < numCells; i++) {
         const gridItem = document.createElement('div');
         gridItem.classList.add('spinner');
         supergrid.append(gridItem);
         fetch(endpoint)
         .then(parseResults)
         .then((responseObject) => {
            // The cat API returns an array even if only a single
            // item is returned, so use a ternary to determine if
            // the reponse object is an array. If so, get the URL
            // from array item 0.
            const { url } = responseObject instanceof Array ? responseObject[0] :responseObject;           
            
            // Use createGridContents() to create the element that
            // will be added to the grid cell.
            const toInsertInGrid = createGridContents(url);

            // Append the generated item to the grid cell.
            gridItem.append(toInsertInGrid);
         }).catch(error => {
            console.error('Error:', error);
          });;
      }
   }
   // Perform initial call to populateGrid()
   populateGrid('https://api.thecatapi.com/v1/images/search?api_key=240265c7-38bd-47a1-8655-7adc3861f710', parseJson);

   // Create an array of objects that represent
   // - the buttons that trigger API requests
   // - the endpoint of the API it will fetch
   // - The callback for parsing the fetch result.
   const buttonsAndEndpoints = [
      {
         selector: '#more-dogs',
         endpointUrl: 'https://random.dog/woof.json',
         parseFunction: parseJson,
      },
      {
         selector: '#more-cats',
         endpointUrl: 'https://api.thecatapi.com/v1/images/search?api_key=240265c7-38bd-47a1-8655-7adc3861f710',
         parseFunction: parseJson,
      },
      {
         selector: '#more-random',
         endpointUrl: 'https://picsum.photos/200/300',
         parseFunction: parseImageUrl,
      },
   ];

   // Add button listeners that, on click, will populate the grid with
   // images from a given endpoint.
   buttonsAndEndpoints.forEach((item) => {
     // Use destructuring to assign each object property to
     // its own variable.
     // @see https://dmitripavlutin.com/javascript-object-destructuring/.
     const { selector, endpointUrl, parseFunction } = item;
     document.querySelector(selector).addEventListener('click', (e) => {
         // Add the 'button--pressed' class, which will trigger a CSS animation
         // that makes the button momentarily expand on click.
         e.target.classList.add('button--pressed');
         populateGrid(endpointUrl, parseFunction);

         // After 500ms, remove the class that makes the button expand.
         setTimeout(() => {
            e.target.classList.remove('button--pressed');
         }, 500);
      });
   });
 // End capsule.  
 })();

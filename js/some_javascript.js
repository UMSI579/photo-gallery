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

      // Create img element to insert in grid.
      const toInsertInGrid = document.createElement('img');
      

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

   
   // Clicking on 'More cats" should place a request to the
   // api.thecatapi.com
   document.querySelector('#more-cats').addEventListener('click', (e) => {
      // Add the 'button--pressed' class, which will trigger a CSS animation
      // that makes the button momentarily expand on click.
      e.target.classList.add('button--pressed');
      populateGrid('https://api.thecatapi.com/v1/images/search?api_key=240265c7-38bd-47a1-8655-7adc3861f710', parseJson);
      // After 500ms, remove the class that makes the button expand.
      setTimeout(() => {
         e.target.classList.remove('button--pressed');
      }, 500);
   });
 // End capsule.  
 })();

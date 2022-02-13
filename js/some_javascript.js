/**
 * Callback for parsing json from a fetch() response.
 */
const parseJson = function(requestResult) {
   return requestResult.json();
}

/**
 * Creates an element to be added to a cell in the grid.
 * 
 * @param {*} url 
 *   The URL where the image is located.
 * 
 * @returns  {Element}
 *   An HTML element that will be added to a grid cell. 
 */
const createGridContents = function(url) {

   // Create img element to insert in grid.
   const toInsertInGrid = document.createElement('img');
   
   // The spinner class will be removed once the resource is loaded.
   toInsertInGrid.addEventListener('load' , function (e) {
      e.target.parentElement.classList.remove('spinner');
   });

   // Set the src element to the resource URL. 
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
         // item is returned get the url property.
         const { url } = responseObject[0];           
         
         // Use createGridContents() to create the element that
         // will be added to the grid cell.
         const toInsertInGrid = createGridContents(url);

         // Append the generated item to the grid cell.
         gridItem.append(toInsertInGrid);
      }).catch(error => {
         console.error('Error:', error);
      });
   }
}
// Perform initial call to populateGrid()
populateGrid('https://api.thecatapi.com/v1/images/search?api_key=240265c7-38bd-47a1-8655-7adc3861f710', parseJson);

// Clicking on 'More cats" places a request to api.thecatapi.com
document.querySelector('#more-cats').addEventListener('click', (e) => {
   // Add the 'button--pressed' class to animate the click.
   e.target.classList.add('button--pressed');
   populateGrid('https://api.thecatapi.com/v1/images/search?api_key=240265c7-38bd-47a1-8655-7adc3861f710', parseJson);
   // After 500ms, remove the class that makes the button expand.
   setTimeout(() => {
      e.target.classList.remove('button--pressed');
   }, 500);
});

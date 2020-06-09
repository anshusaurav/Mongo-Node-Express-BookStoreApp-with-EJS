 //Switch View Gallery View, List View

 var current = false;
 var currBooks;  
 var currentView = 'gallery';
 var mainGrid = document.querySelector('.books-main-grid');
 var allElemGrid = Array.from(document.querySelectorAll('.books-main-grid-elem'));
 var ulElems = Array.from(document.querySelectorAll('.ul-books-grid'));
 var cartElems = Array.from(document.querySelectorAll('.books-main-elem-misc'));
 var bookExtElems = Array.from(document.querySelectorAll('.books-book-extend'));
 var imgContElems = Array.from(document.querySelectorAll('.books-main-grid-elem-div'));
 //View Beafication
 function isInViewport (elem) {
     var bounding = elem.getBoundingClientRect();
     return ((
         bounding.top >= 0 &&
         bounding.left >= 0 &&
         bounding.top <= (window.innerHeight || document.documentElement.clientHeight) &&
         bounding.left <= (window.innerWidth || document.documentElement.clientWidth)
     )|| (
         bounding.bottom >= 0 &&
         bounding.left >= 0 &&
         bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
         bounding.left <= (window.innerWidth || document.documentElement.clientWidth)
     )||(
         bounding.top >= 0 &&
         bounding.right >= 0 &&
         bounding.top <= (window.innerHeight || document.documentElement.clientHeight) &&
         bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
     )||(
         bounding.bottom >= 0 &&
         bounding.right >= 0 &&
         bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
         bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
     ));
 };
 let last_known_scroll_position = 0;
 let ticking = false;

 function doSomething(scroll_pos) {
     var cnt = 0;
     allElemGrid.forEach(elem =>{
         if(isInViewport(elem)){
             elem.style.visibility = 'visible';
             elem.style.opacity = 1;
             cnt++;
         }
         else {
             elem.style.visibility = 'hidden';
             elem.style.opacity = 0;
         }

     });
     console.log(cnt);
 }

 window.addEventListener('scroll', function(e) {
 last_known_scroll_position = window.scrollY;

 if (!ticking) {
     window.requestAnimationFrame(function() {
     doSomething(last_known_scroll_position);
     ticking = false;
     });

     ticking = true;
 }
 });
 function switchView() {
     if(currentView === 'gallery') {
         currentView = 'list';
     }
     else {
         currentView = 'gallery';
     }
     if(currentView ==='list') {
         mainGrid.style.gridTemplateColumns = '1fr';
         mainGrid.style.gridAutoRows= 'auto';
         repaint(currBooks)
     }
     else{
         mainGrid.style.gridTemplateColumns = 'repeat(auto-fit, 240px)';
         mainGrid.style.gridAutoRows= '440px';
         repaint(currBooks)
     }
     
 }

 //Sort Implementation
 //Getting values
 var bookList = "<%= JSON.stringify(books)%>";
 function htmlDecode(s) {
     var el = document.createElement("div");
     el.innerHTML = s;
     return el.innerText || el.textContent;
 }
 var s = htmlDecode(bookList);
 s=s.replace(/(\r\n|\n|\r)/gm," ");
 var bookArr = JSON.parse(s);
 bookArr.forEach(book =>{
     var isRated = false;
     if(book.ratings.length > 0)
         isRated = true;
     var sum = 0;
     var cnt = 0;
     book.ratings.forEach(elem =>{
         sum += elem.rating;
         cnt++;
     })    
     var dt = new Date(book.createdAt);
     // console.log(dt);
     if(isRated) {
         book.isRated = true;
         book.averageRating = Math.round(sum/cnt);
         book.dt = dt;
     } else {
         book.isRated = false;
         book.averageRating = 0;
         book.dt = dt;
     }
 });
 currBooks = bookArr;
 function repaint() {
     var newHTML = '';
     if(currentView ==='gallery') {
         currBooks.forEach(book =>{
             newHTML+= `
             <style>
                 .books-main-grid-elem {
                     display: inline-block;
                 }
                 .ul-books-grid{
                     padding: 0rem;
                 }
                 .books-main-elem-misc{
                     padding: 0rem;
                 }
                 .books-main-grid-elem-div{
                     overflow: hidden;
                 }
             </style>
             <div class='books-main-grid-elem'>
                 <div class='books-main-grid-elem-div'>
                     <a class='books-main-grid-elem-img' href='/books/${book.slug}'>
                         <img class='books-main-single-image' src='${book.thumbnailURL}'>
                     </a> 
                 </div>  

                 <ul class='ul-books-grid'>
                     <li>
                         <a class='books-book-name' href='/books/${book.slug}'><h2> 
                             ${book.title}
                         </h2></a>
                     </li>   
                     <li>
                         <h2 class='books-book-author'> 
                             ${book.author}
                         </h2>
                     </li>
                     <li> 
                         <div class='book-price-div'>
                             <i class="fas fa-rupee-sign"></i>
                             <p class='books-book-price'>${book.price}</p>
                         </div>
                     </li>
                     <li>`;
                     if(book.isRated) { 
                         newHTML+=`<div class="rate-grid">`
                                 for(var i = 0; i < book.averageRating; i++) {
                                     newHTML+= `<i class="fas fa-star star-filled"></i>`;
                                 }
                                 for(var i = 0; i < 5-book.averageRating; i++) {
                                     newHTML+=`<i class="fas fa-star star-unfilled"></i>`;
                                 } 
                                 newHTML += `<a href='/books/${book.slug}#Reviews'class='rategrid-count-num'>(${book.ratings.length})</a>
                             </div>`
                             }else{
                                 newHTML += `<div class="rate-grid">
                                 </div>`
                         } 
                     newHTML+=`</li>
                     </ul>
                     
                     <div class='books-main-elem-misc'>
                         <form class='add-to-cart' method="POST" action="/books/${book.slug}/add">
                             <input type="number" placeholder="1" value="1" name="quantity">
                             <button type="submit"><i class="fas fa-cart-plus"></i></button>
                         </form>
                         <a class='books-main-gatipay-elem' href='/books/${book.slug}/wish'>
                             <i class="fab fa-gratipay"></i>
                         </a>
                     </div>
                 </div>`;
         });
         
     }
     else{
         currBooks.forEach(book =>{
             newHTML+= `
             <style>
                 .books-main-grid-elem {
                     display: grid;
                     grid-template-columns: 0.75fr 3fr 1fr;
                 }
                 .ul-books-grid{
                     padding: 1.5rem 1rem;
                 }
                 .books-main-elem-misc{
                     padding: 2.5rem 1rem;
                 }
                 .books-main-grid-elem-div{
                     overflow: inherit;
                 }
             </style>
             
             <div class='books-main-grid-elem'>
                 <div class='books-main-grid-elem-div'>
                     <a class='books-main-grid-elem-img' href='/books/${book.slug}'>
                         <img class='books-main-single-image' src='${book.thumbnailURL}'>
                     </a> 
                 </div>  

                 <ul class='ul-books-grid' style="padding: 1.5rem 1rem;">
                     <li>
                         <a class='books-book-name' href='/books/${book.slug}'><h2> 
                             ${book.title}
                         </h2></a>
                     </li>   
                     <li>
                         <h2 class='books-book-author'> 
                             ${book.author}
                         </h2>
                     </li>
                     <li> 
                         <div class='book-price-div'>
                             <i class="fas fa-rupee-sign"></i>
                             <p class='books-book-price'>${book.price}</p>
                         </div>
                     </li>
                     <li>`;
                     if(book.isRated) { 
                         newHTML+=`<div class="rate-grid">`
                                 for(var i = 0; i < book.averageRating; i++) {
                                     newHTML+= `<i class="fas fa-star star-filled"></i>`;
                                 }
                                 for(var i = 0; i < 5-book.averageRating; i++) {
                                     newHTML+=`<i class="fas fa-star star-unfilled"></i>`;
                                 } 
                                 newHTML += `<a href='/books/${book.slug}#Reviews'class='rategrid-count-num'>(${book.ratings.length})</a>
                             </div>`
                             }else{
                                 newHTML += `<div class="rate-grid">
                                 </div>`
                         } 
                     newHTML+=`</li>
                     </ul>
                     
                     <div class='books-main-elem-misc'>
                         <form class='add-to-cart' method="POST" action="/books/${book.slug}/add">
                             <input type="number" placeholder="1" value="1" name="quantity">
                             <button type="submit"><i class="fas fa-cart-plus"></i></button>
                         </form>
                         <a class='books-main-gatipay-elem' href='/books/${book.slug}/wish'>
                             <i class="fab fa-gratipay"></i>
                         </a>
                     </div>
                 </div>`;
         });
     }
     mainGrid.innerHTML = newHTML;
     
 }


 var sortSelectElem = document.querySelector('.sort-select');
 sortSelectElem.addEventListener('change', selectSort);
 function selectSort(event){
     var sortCriteria = (event.target.value);
     switch (sortCriteria) {
     case 'Avg. Customer Rating':
         var sortByRatingArr = bookArr;
         sortByRatingArr.sort((a,b) => b.averageRating - a.averageRating);
         currBooks = sortByRatingArr;
         repaint();
         break;
     case 'Name(A-Z)':
         var sortByNameArr = bookArr;
         sortByNameArr.sort((a,b) => a.title.localeCompare(b.title));
         repaint(sortByNameArr);
         break;
     case 'Date Added':
         var sortByDateArr = bookArr;
         sortByDateArr.sort((a,b) => a.dt - b.dt);
         currBooks = sortByDateArr;
         repaint();
         break;
     case 'Price(Low-High)':
         var sortByPriceArr = bookArr;
         sortByPriceArr.sort((a,b) => a.price - b.price);
         currBooks = sortByPriceArr;
         repaint();
         break;
     case 'Price(High-Low)':
         var sortByPriceArr = bookArr;
         sortByPriceArr.sort((a,b) => b.price - a.price);
         currBooks = sortByPriceArr;
         repaint();
         break;
     default:
         console.log(`Sorry, we are out of options.`);
     }   
 }
 let switchRadio = document.querySelector('.switch-radio-div');
 switchRadio.addEventListener('change', switchViewEventHandler);
 function switchViewEventHandler(event){
     var data = new FormData(switchRadio);
     var output = "";
     for (const entry of data) {
         output = entry[1];
     };
     console.log(output);
     if(output !== currentView){
         switchView();
     }   
 }

 
 
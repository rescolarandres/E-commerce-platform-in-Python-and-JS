# E-commerce-platform-in-Python-and-JS
As capstone project for the second term, real data from H&M was given to obtain some KPI's. What I decided to do was, to integrate my knowledge in Javascript and Python with this real data, to create an e-commerce platform, and typical e commerce functionality with Javascript and Flask. The web application was deployed in Google Cloud App Engine
## Description
The system has three main pages: Index, Search and Cart
  ### Index:
  The page that loads when connected to the page. This page offers the following funcionality:
  
    * Login and register form: you can login if you already have and account or register in case you do not. Passwords are hashed in the database. Cookies are implemented to store the information of the user in the session. The login and register are implemented with Bootstrap modals rather than html files.
    * Catalog display: a catalog showing 10 articles as a result of the query. Each article shows its real name, color and price.
    * Add to cart: a button that adds an item to the shopping cart. The shopping cart is created using localStorage in javascript. When this button is clicked, the localStorage is either created or updated.
    * Search: a search bar so that the user can search for specific items (names have to be literally as in the catalog). If the user searches for an item, a cookie with the item and its information is created.
    * Categories display: a dynamic categories dropdown, that displays the categories of the articles retreived from the database.
    * Shopping Cart button: that will redirect to the shopping cart Page.
  ### Cart: 
  Displays the shopping cart stored in the localStorage.
  A page in which the cart is showed as a table, with each row being obtained from the localStorage. The total checkout quantity is computed based on the price of each product and the quantity added. The localStorage and thus the shopping cart have an expire time of 1 minute.
  ### Search: 
  Through the cookies and forms, the item is queried to the database, and the results are displayed in this page. There is a basic color filter that filters when any checkbox is marked. Whenever they are dismarked, the page reloads.

  ## Technical Details:
      1. The page uses a wide range of utilities, such as forms, cookies, localStorage or html functionality. This was done just for showing porpoises, to show that all these type of features were succesfully implemented, leaving aside coding standards and performance.
      2. An API was used to obtain the pictures of the articles: this API uses the type of product and color to query photos of those items.
      3. The website uses data from a real database, not just from a static json.
      4. A multipage website was correctly implemented.
      5. Common javascript functionalaties such as preventDefaults, eventListeners, JSONparsing, etc... were correctly implemented and integrated with the html files and python backend.
      

  ## Possible improvements:
    * Improving the search engine, as the specific word has to be input if results are to be shown.
    * Displaying items by choosing a category: whenever a category is clicked, the items of that category could be displayed.
    * Adding filters to the index page and adding more filters to the search page.
    * Adding pages to the catalog so that more items can be seen.
    * Standarizing features: use localStorage for all the session features, as well as using javascript to modify the html.
    * Adding a detail description page: every item should have its own page to obtain further details of it, as well as size.
    * Overall design of the page.

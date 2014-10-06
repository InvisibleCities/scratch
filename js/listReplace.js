var Lister = (function (options) {
//============================instructions========================================//
/*   in js file, add an options variable with an array with format similar to     */
/*   settings array bellow. If the default is acceptable, simply don't include it */
/*   ex.                                                                          */
/*                                                                                */
/*   var options = {itemsPerPage : "3",                                           */
/*                  searchInput : "#searchBox"};                                  */
/*                                                                                */
/*   then construct a new list with:                                              */
/*                                                                                */
/*   var list = new Lister(options);                                              */
/*                                                                                */
//===========================end instructions=====================================//

//===========================defaults=============================================//
//  give full selector as a string e.g. "#list", ".key1," "li"
    var settings = {  
        listID : "#list",
        liEquiv : "li",  //top level of the individual list objects, can be anything
        searchInput : "#search",
        listKey1 : ".key1",
        listKey2 : ".key2",
        sortButtonKey1 : "#sKey1",
        sortButtonKey2 : "#sKey2",
        //pagination
        itemsPerPage : "", //Leave empty if no pagination required
        paginationLeft : "3",
        paginationRight : "3",
        stringBeforeNum : "Page " //include whitespace if needed
    };
//==========================end defaults==========================================//



//===================change out defaults for user options=========================//    
    for(var prop in options) {
        if(options.hasOwnProperty(prop)){
            settings[prop] = options[prop];
        }
    }
//==============================establish initial values==========================//   
    var elements = $(settings.listID + ">" + settings.liEquiv),  
        list = $(settings.listID),
        currentPage = 1,
        newPage = 1,
        index1, index2;
    if (settings.itemsPerPage.length){
        var pages = Math.ceil(elements.length / settings.itemsPerPage);
    }
    $(settings.sortButtonKey1).data("sortKey", settings.listKey1);
    $(settings.sortButtonKey2).data("sortKey", settings.listKey2);
    //copy elements to initial search results (the same, as the search box is empty until keyup)
    var searchResults = elements.slice();  
    changePage(0, 1); //initialize page
    
    function initPagination() {
        for (var i = 1; i <= pages; i++) {
            $("#pagination").append("<span class='nums page-" + i + "'><a href='#'>" + settings.stringBeforeNum + i + "</a><span>");
        }

        $(".nums").click(function (e) {
            e.preventDefault();
            var newPage = parseInt($(this).attr("class").split(' ')[1].replace("page-", ""));
            changePage(currentPage, newPage);
        });
    }
    if (settings.itemsPerPage) {
        initPagination();
    }
    
//====================================end initial values===========================//
    
    $(settings.searchInput).keyup(function () { 
        var searchQuery = $(this).val().toLowerCase();
        searchResults = [];
        $(elements).each(function () {
            var textKey1 = $(this).children(settings.listKey1).text().toLowerCase();
            var textKey2 = $(this).children(settings.listKey2).text().toLowerCase(); 
            if (searchQuery.length > 0){   
                if (textKey2.indexOf(searchQuery) >= 0 || textKey1.indexOf(searchQuery) >= 0){ 
                    searchResults.push(this);
                }
            }
            else searchResults = elements.slice();
        });
        formatList(searchResults);
    });
    
    function sortText(key, ord) {
        var items = searchResults.sort(function (a, b) {
            var vA = $(key, a).text();
            var vB = $(key, b).text();
            if (ord === "asc") {
                return (vA < vB) ? -1 : (vA > vB) ? 1 : 0;
            } else if (ord === "desc") {
                return (vA < vB) ? 1 : (vA > vB) ? -1 : 0;
            }
        });
        list.append(items);
        return items;
    }

    $(".sort").click(function () {
        if ($(this).hasClass("asc")) {
            $(this).removeClass("asc").addClass("desc");
        }
        else if ($(this).hasClass("desc")){
            $(this).removeClass("desc");
        }
        else {
            $(this).addClass("asc");
        }
        searchResults = (sortText($(this).data("sortKey"), $(this).attr('class').split(' ')[1]));
        formatList(searchResults);
    });
    
    function changePage(currentPage, newPage) {
        currentPage = newPage;   
        formatList(searchResults);
    }
    
    function formatList(arr){
        $(elements).hide();
        var showing = arr.slice();  
        for (var i = index1; i < index2; i++) {
            $(showing[i]).show();
        }
        if (settings.itemsPerPage){
            formatPagination(showing);
        }
    }
    
        function formatPagination(showing){
            index1 = settings.itemsPerPage * (newPage - 1);
            index2 = settings.itemsPerPage * newPage;   
            var newPages = Math.ceil(showing.length / settings.itemsPerPage);
            $('.nums').hide().filter( ':lt(' + newPages + ')' ).show();
        }  
});
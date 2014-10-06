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
        itemsPerPage : 100000, //Leave at this inoridinately high number if no pagination needed
        paginationLeft : 3,
        paginationRight : 3,
        stringBeforeNum : "" //include whitespace if needed
    };
//==========================end defaults==========================================//
//===================change out defaults for user options=========================//    
    for(var prop in options) {
        if(options.hasOwnProperty(prop)){
            settings[prop] = options[prop];
        }
    }
//==============================establish initial values==========================//
    
    var total = $(settings.liEquiv + ":visible").length,
        pages = Math.ceil(total / settings.itemsPerPage),
        list = $(settings.listID),
        elements = $(settings.listID + ">" + settings.liEquiv),
        currentPage, index1, index2;
    //copy elements to initial search results (the same, as the search box is empty until keyup)
    var searchResults = elements.slice();  
    
    $(settings.sortButtonKey1).data("sortKey", settings.listKey1);
    $(settings.sortButtonKey2).data("sortKey", settings.listKey2);
    
    //initialize page
    for (var i = 1; i <= pages; i++) {
        $("#pagination").append("<span class='nums page-" + i + "'><a href='#'>" + settings.stringBeforeNum + i + "</a><span>"); 
    }
    changePage(1, 1, 1);
    
    //click function for pagination
    $(".nums").click(function(){
        var newPage = parseInt($(this).attr("class").split(' ')[1].replace("page-", ""));
        changePage(currentPage, newPage, newPage);
    });
    
//============================================end initial values===========================//
    
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
    
    $(settings.searchInput).keyup(function () { 
        var current = $('#pagination').data("currentPage");
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
        var newPages = Math.ceil(searchResults.length / settings.itemsPerPage);
       
        if (current > newPages){  //trigger a page change w/ custom values
            formatList(searchResults);
            changePage(current, newPages, newPages);
        }
        else{
            $('.nums').hide();
            formatList(searchResults);
            changePage(current, current, current);
        }      
    });

    function formatList(arr){
        $(elements).hide();
        for (var i = index1; i < index2; i++) {
            $(arr[i]).show();
        }      
    }
    
    function formatPagination(active){       
        var newPages = Math.ceil(searchResults.length / settings.itemsPerPage),
            initLeft = parseInt(active), 
            endLeft = parseInt(initLeft) + parseInt(settings.paginationLeft),
            leftNums = $('.nums').slice(initLeft, endLeft),
            rightNums = $('.nums').slice((newPages - settings.paginationRight), newPages);
    
        $('.nums').hide();
        if (newPages > (+settings.paginationLeft + +settings.paginationRight)) {
            $('.ellipsis').hide();
            $('.nums:eq(0)').show();
            if(initLeft > settings.paginationLeft - (settings.paginationLeft - 1)){
                $('.nums:first-child').append("<span class='ellipsis'>...<span>");
            }
            $(leftNums).show();
            $('.nums:visible').last().append("<span class='ellipsis'>...<span>");
            $(rightNums).show();
        }else {
            $('.nums:lt(' + newPages + ')' ).show();
        }
    }
    
    function changePage(currentPage, newPage, active) {
        currentPage = newPage;
        index1 = settings.itemsPerPage * (newPage - 1);
        index2 = settings.itemsPerPage * newPage;         
        formatList(searchResults);
        if (active) {
            if (active > 1) {
                --active;
            }
            $(".nums").removeClass("active");
            $(".nums:eq(" + +active + ")").addClass("active");
        }
        formatPagination(active);
        $('#pagination').data("currentPage", newPage);
    }
});

//active is one too high, probably at this last if statement
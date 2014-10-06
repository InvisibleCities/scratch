(function ($) {
    $.lister = function (options) {

//============================user options============================================//
        var defaults = {
            itemsPerPage: "4", //Leave empty if no pagination required
            listID: "#list",
            liEquiv: "li",
            listKey1: ".key1",
            listKey2: ".key2",
            searchInput: "#search",
            sortButtonKey1: "#sKey1",
            sortButtonKey2: "#sKey2"
        };

//======================================establish initial values==========================//
        var plugin = this;
        plugin.settings = {};
        plugin.settings = $.extend({}, defaults, options);
        var elements = $(plugin.settings.listID + ">" + plugin.settings.liEquiv),
                pages = Math.ceil(elements.length / plugin.settings.itemsPerPage),
                list = $(plugin.settings.listID),
                currentPage = 1,
                index1, index2;

        var searchResults = elements.slice();
        changePage(0, 1); //initialize page

        for (var i = 1; i <= pages; i++) {
            $("#pagination").append("<span class='nums page-" + i + "'>P" + i + "<span>");
        }

        $(".nums").click(function () {
            var newPage = parseInt($(this).attr("class").split(' ')[1].replace("page-", ""));
            changePage(currentPage, newPage);
        });

        $(plugin.settings.sortButtonKey1).data("sortKey", plugin.settings.listKey1);
        $(plugin.settings.sortButtonKey2).data("sortKey", plugin.settings.listKey2);

        $(plugin.settings.searchInput).keyup(function () {
            var searchQuery = $(this).val().toLowerCase();
            searchResults = [];
            $(elements).each(function () {
                var textKey1 = $(this).children(plugin.settings.listKey1).text().toLowerCase();
                var textKey2 = $(this).children(plugin.settings.listKey2).text().toLowerCase();
                if (searchQuery.length > 0) {
                    if (textKey2.indexOf(searchQuery) >= 0 || textKey1.indexOf(searchQuery) >= 0) {
                        searchResults.push(this);
                    }
                }
                else
                    searchResults = elements.slice();
            });
            formatList(searchResults);
        });

        $(".sort").click(function () {
            var $this = $(this);
            if ($this.hasClass("asc")) {
                $this.removeClass("asc").addClass("desc");
            }
            else if ($this.hasClass("desc")) {
                $this.removeClass("desc");
            }
            else {
                $this.addClass("asc");
            }
            searchResults = (sortText($(this).data("sortKey"), $(this).attr('class').split(' ')[1]));
            formatList(searchResults);
        });



        var sortText = function (key, ord) {
            var items = elements.sort(function (a, b) {
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
        };

        var changePage = function (currentPage, newPage) {
            currentPage = newPage;
            index1 = plugin.settings.itemsPerPage * (newPage - 1);
            index2 = plugin.settings.itemsPerPage * newPage;
            formatList(searchResults);
        };

        var formatList = function (arr) {
            $(elements).hide();
            var showing = arr.slice();
            for (var i = index1; i < index2; i++) {
                $(showing[i]).show();
            }
            formatPagination(showing);
        };

        var formatPagination = function (showing) {
            var newPages = Math.ceil(showing.length / plugin.settings.itemsPerPage);
            $('.nums').hide().filter(':lt(' + newPages + ')').show();
        };


    };


    $.fn.pluginName = function (options) {

        return this.each(function () {
            if (undefined == $(this).data('lister')) {
                var plugin = new $.lister(this, options);
                $(this).data('lister', plugin);
            }
        });
    };





}(jQuery));


$(document).ready(function () {
    $.lister();
});
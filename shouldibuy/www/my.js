(function ($) {
    //var page1Initialized = false;
    var urlPrefix = "";
    if(window.cordova) {
        urlPrefix = "http://localhost:3000";
    }
    $.widget('mobile.tabbar', $.mobile.navbar, {
        _create:function () {
            // Set the theme before we call the prototype, which will
            // ensure buttonMarkup() correctly grabs the inheritied theme.
            // We default to the "a" swatch if none is found
            var theme = this.element.jqmData('theme') || "a";
            this.element.addClass('ui-footer ui-footer-fixed ui-bar-' + theme);

            // Make sure the page has padding added to it to account for the fixed bar
            this.element.closest('[data-role="page"]').addClass('ui-page-footer-fixed');


            // Call the NavBar _create prototype
            $.mobile.navbar.prototype._create.call(this);
        },

        // Set the active URL for the Tab Bar, and highlight that button on the bar
        setActive:function (url) {
            // Sometimes the active state isn't properly cleared, so we reset it ourselves
            this.element.find('a').removeClass('ui-btn-active ui-state-persist');
            this.element.find('a[href="' + url + '"]').addClass('ui-btn-active ui-state-persist');
        }
    });

    $(document).bind('pagecreate create', function (e) {
        return $(e.target).find(":jqmData(role='tabbar')").tabbar();
    });

    $(":jqmData(role='page')").live('pageshow', function (e) {
        // Grab the id of the page that's showing, and select it on the Tab Bar on the page
        var tabBar, id = $(e.target).attr('id');

        tabBar = $.mobile.activePage.find(':jqmData(role="tabbar")');
        if (tabBar.length) {
            tabBar.tabbar('setActive', '#' + id);
        }
        if (id == "page1") {
            getQuestions();
        }
    });

    $("#item1SearchBtn").live('click', function (e) {

        $.ajax({
            url: urlPrefix + '/search?item1=' + $('#item1').val(),
            type:'GET',
            dataType:'json',
            error:function () {
                alert("error");
            },
            success:function (results) {
                createList(results, 2, 1);
                //alert(JSON.stringify(results));
            }
        });


        //  createList(results, 2, 1);

    });

    $("#item2SearchBtn").live('click', function (e) {
        /*
         $.ajax({
         url: urlPrefix + '/search?item1=' + $('#item1').val(),
         type:'GET',
         dataType:'json',
         error:function () {
         alert("error");
         },
         success:function (results) {
         createList(results, 2, 2);
         alert(JSON.stringify(results));
         }
         });
         */

        createList(results, 2, 2);

    });

    function createList(r, pageNumber, listNumber) {
        results =  r;//save to global variable for now
        var items = results.items;
        var list = "";
        var radioName = "page" + pageNumber + "radio" + listNumber + "listName";
        var radioId = "#page" + pageNumber + "radio" + listNumber + "list";

        $.each(items, function (i, item) {
            var id = item.ASIN;
            var checked = "checked";
            // list += '<li>';
            // list += '<a href="' + item.DetailPageURL + '">';
            //  list += '<p>';
            if (i != 0) {
                checked = "";
            }
            list += '<input type="radio" ' + checked + ' name=' + radioName + ' id=' + id + ' value=' + id + '  />';
            list += '<label for=' + id + ' >';
            //  list += '</p>';
            list += '<table width="100%">';
            list +=   '<tr><td colspan=2>'
            list += '<h4>' + item.ItemAttributes.Title + '</h4>';
            list += '</td></tr>';
            list +=   '<tr>';
            list += '<td width="110px" valign="top"><img  src="' + item.MediumImage.URL + '"></img></td>';

            list += '<td valign="top" style="text-align:top">';


            list += '<label style="font-weight: bold; font-size:14px">Brand - ' +  item.ItemAttributes.Brand  + '</label>';

            list += '<p style="color:yellow;">' + item.OfferSummary.LowestNewPrice.FormattedPrice + '</p>';
            list += '</td>';
            list += '</tr></table>';
            list += '</label>';

            // list += '</a>';
            //  list += '</li>';
        });

        $(radioId).empty();
        $(radioId).append(list).controlgroup('refresh');
        $(radioId).trigger('create');
    }

    function getQuestions() {
        $.ajax({
            url:urlPrefix + '/getQuestions',
            type:'GET',
            dataType:'json',
            error:function () {
                alert("error");
            },
            success:function (questions) {
                createQuestionList(questions);
            }
        });
    }

    function createQuestionList(questions) {
        var list = "";

        $.each(questions, function (i, question) {
            var questionId = question._id;
            list += "<li>";
            var items = ["item1", "item2", "item3"];
            var item1 = question.item1;
            var item2 = question.item2;
            var item3 = question.item3;
            for (var i = 0; i < items.length; i++) {
                var item = question[items[i]];
                if (!item) {
                    continue;
                }
                list += "<div>";
                list += '<h4>' + item.title + '</h4>';
                list += '<table width="100%"><tr>';
                list += '<td width="110px" valign="top"><img  src="' + item.img + '"></img></td>';

                list += '<td valign="top" style="text-align:top">';

                list += '<label style="font-weight: bold; font-size:14px;">Brand - ' + item.brand + '</label>';
                list += "<br>";
                list += '<label style="color:yellow;font-weight: bold; font-size:14px;padding-top:10px">' + item.price + '</label>';
                list += '</td>';
                list += '</tr>';
                list += '</table>';
                list += "</div>";
            }
            list += "<div>";

            var qASIN = questionId + "__" + item1.ASIN + "__";
            var qItem1Yes = qASIN + "YES";
            var qItem1No = qASIN + "NO";
            var qItem1 = qASIN + "ITEM1";
            var qItem2 = qASIN + "ITEM2";
            var qItem3 = qASIN + "ITEM3";
            if (question.noOfItems == 1) {
                list += '<a data-role="button" id=' + qItem1Yes + ' data-inline="true" data-theme="a">Hell Yeah! <span id=' + qItem1Yes + "_COUNTSPAN" + ' style="color:green;"> (' + question.item1YesCnt + ')</span></a>';
                list += '<a data-role="button" id=' + qItem1No + ' data-inline="true" data-theme="a">Hell No! <span id=' + qItem1No + "_COUNTSPAN" + ' style="color:RED;"> (' + question.item1NoCnt + ')</span></a>';
            } else {
                if (item1) {
                    list += '<a data-role="button" id=' + qItem1 + ' data-inline="true" data-theme="a">Item 1! <span id=' + qItem1 + "_COUNTSPAN" + ' style="color:green;"> (' + question.item1YesCnt + ')</span></a>';
                }
                if (item2) {
                    list += '<a data-role="button"  id=' + qItem2 + ' data-inline="true" data-theme="a">Item 2!<span id=' + qItem2 + "_COUNTSPAN" + 'style="color:green;"> (' + question.item2YesCnt + ')</span></a>';
                }
                if (item3) {
                    list += '<a data-role="button"  id=' + qItem3 + 'data-inline="true" data-theme="a">Item 3!<span id=' + qItem3 + "_COUNTSPAN" + ' style="color:green;"> (' + question.item3YesCnt + ')</span></a>';
                }
            }
            list += "</div>";

            list += "</li>";

            //  list += '</p>';


            // list += '</a>';
            //  list += '</li>';
        });
        $('#page1radio1list').append(list).listview('refresh');
        $('#page1radio1list').trigger("create");
    }

    $('#page1radio1list').live('click', function () {
        var id = $(event.target).closest("a").attr('id');
        if (!id || id == "") {
            return;
        }
        var arr = id.split("__");
        if (arr.length != 3) {
            return;
        }
        var html  = $('#'+id + "_COUNTSPAN").html();
        var newCount = parseInt(html.trim().replace("\(","").replace("\)", "")) +  1;
        $('#'+id + "_COUNTSPAN").html(" (" + newCount + ")");
        /*
         var voteJson = {"id": arr[0], "ASIN": arr[1], "vote": arry[2]};
         $.post(urlPrefix + '/addVote', voteJson, function (data) {
         alert(1);
         }, 'json');
         */
    });

    $('#ask').live('click', function () {
        var radioName = "page2radio1listName";

        var radio_val = $('input[name=' + radioName + ']:checked').val();
        var items = results.items;
        for (var i in items) {
            var item = items[i];
            if (item.ASIN == radio_val) {
                break;
            }
        }
        var questionJson = {
            "owner":"user1",
            "created_at":(new Date()).getTime(),
            "updated_at":(new Date()).getTime(),
            "item1":{
                "img":item.MediumImage.URL,
                "brand":item.ItemAttributes.Brand,
                "ASIN":item.ASIN,
                "title":item.ItemAttributes.Title,
                "url":item.DetailPageURL,
                "price":item.OfferSummary.LowestNewPrice.FormattedPrice,
                "yesCnt":0,
                "noCnt":0
            },
            "item2":{},
            "item3":{},
            "item1YesCnt":0,
            "item2YesCnt":0,
            "item3YesCnt":0,
            "item1NoCnt":0,
            "item2NoCnt":0,
            "item3NoCnt":0,
            "noOfItems":1,
            "comments":[
                {"user":"user1", comment:"from user1"},
                {"user":"user2", comment:"from user2"}
            ],
            "commentsCnt":2
        };


        var user = "user" + (new Date()).getTime() % 100000;
        $.post(urlPrefix + '/addQuestion', questionJson, function (data) {
            alert("Question Added!");
        }, 'json');
    });
})(jQuery);


var results = {"items":[
    {"ASIN":"059035342X", "DetailPageURL":"http://www.amazon.com/Harry-Potter-Sorcerers-Stone-Book/dp/059035342X%3FSubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeASIN%3D059035342X", "ItemLinks":{"ItemLink":[
        {"Description":"Technical Details", "URL":"http://www.amazon.com/Harry-Potter-Sorcerers-Stone-Book/dp/tech-data/059035342X%3FSubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D059035342X"},
        {"Description":"Add To Baby Registry", "URL":"http://www.amazon.com/gp/registry/baby/add-item.html%3Fasin.0%3D059035342X%26SubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D059035342X"},
        {"Description":"Add To Wedding Registry", "URL":"http://www.amazon.com/gp/registry/wedding/add-item.html%3Fasin.0%3D059035342X%26SubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D059035342X"},
        {"Description":"Add To Wishlist", "URL":"http://www.amazon.com/gp/registry/wishlist/add-item.html%3Fasin.0%3D059035342X%26SubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D059035342X"},
        {"Description":"Tell A Friend", "URL":"http://www.amazon.com/gp/pdp/taf/059035342X%3FSubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D059035342X"},
        {"Description":"All Customer Reviews", "URL":"http://www.amazon.com/review/product/059035342X%3FSubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D059035342X"},
        {"Description":"All Offers", "URL":"http://www.amazon.com/gp/offer-listing/059035342X%3FSubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D059035342X"}
    ]}, "SmallImage":{"URL":"http://ecx.images-amazon.com/images/I/51MU5VilKpL._SL75_.jpg", "Height":{"#":"75", "@":{"Units":"pixels"}}, "Width":{"#":"51", "@":{"Units":"pixels"}}}, "MediumImage":{"URL":"http://ecx.images-amazon.com/images/I/51MU5VilKpL._SL160_.jpg", "Height":{"#":"160", "@":{"Units":"pixels"}}, "Width":{"#":"109", "@":{"Units":"pixels"}}}, "LargeImage":{"URL":"http://ecx.images-amazon.com/images/I/51MU5VilKpL.jpg", "Height":{"#":"500", "@":{"Units":"pixels"}}, "Width":{"#":"340", "@":{"Units":"pixels"}}}, "ImageSets":{"ImageSet":[
        {"@":{"Category":"primary"}, "SwatchImage":{"URL":"http://ecx.images-amazon.com/images/I/51MU5VilKpL._SL30_.jpg", "Height":{"#":"30", "@":{"Units":"pixels"}}, "Width":{"#":"20", "@":{"Units":"pixels"}}}, "SmallImage":{"URL":"http://ecx.images-amazon.com/images/I/51MU5VilKpL._SL75_.jpg", "Height":{"#":"75", "@":{"Units":"pixels"}}, "Width":{"#":"51", "@":{"Units":"pixels"}}}, "ThumbnailImage":{"URL":"http://ecx.images-amazon.com/images/I/51MU5VilKpL._SL75_.jpg", "Height":{"#":"75", "@":{"Units":"pixels"}}, "Width":{"#":"51", "@":{"Units":"pixels"}}}, "TinyImage":{"URL":"http://ecx.images-amazon.com/images/I/51MU5VilKpL._SL110_.jpg", "Height":{"#":"110", "@":{"Units":"pixels"}}, "Width":{"#":"75", "@":{"Units":"pixels"}}}, "MediumImage":{"URL":"http://ecx.images-amazon.com/images/I/51MU5VilKpL._SL160_.jpg", "Height":{"#":"160", "@":{"Units":"pixels"}}, "Width":{"#":"109", "@":{"Units":"pixels"}}}, "LargeImage":{"URL":"http://ecx.images-amazon.com/images/I/51MU5VilKpL.jpg", "Height":{"#":"500", "@":{"Units":"pixels"}}, "Width":{"#":"340", "@":{"Units":"pixels"}}}},
        {"@":{"Category":"variant"}, "SwatchImage":{"URL":"http://ecx.images-amazon.com/images/I/41dJ7mMI7VL._SL30_.jpg", "Height":{"#":"30", "@":{"Units":"pixels"}}, "Width":{"#":"21", "@":{"Units":"pixels"}}}, "SmallImage":{"URL":"http://ecx.images-amazon.com/images/I/41dJ7mMI7VL._SL75_.jpg", "Height":{"#":"75", "@":{"Units":"pixels"}}, "Width":{"#":"52", "@":{"Units":"pixels"}}}, "ThumbnailImage":{"URL":"http://ecx.images-amazon.com/images/I/41dJ7mMI7VL._SL75_.jpg", "Height":{"#":"75", "@":{"Units":"pixels"}}, "Width":{"#":"52", "@":{"Units":"pixels"}}}, "TinyImage":{"URL":"http://ecx.images-amazon.com/images/I/41dJ7mMI7VL._SL110_.jpg", "Height":{"#":"110", "@":{"Units":"pixels"}}, "Width":{"#":"77", "@":{"Units":"pixels"}}}, "MediumImage":{"URL":"http://ecx.images-amazon.com/images/I/41dJ7mMI7VL._SL160_.jpg", "Height":{"#":"160", "@":{"Units":"pixels"}}, "Width":{"#":"112", "@":{"Units":"pixels"}}}, "LargeImage":{"URL":"http://ecx.images-amazon.com/images/I/41dJ7mMI7VL.jpg", "Height":{"#":"500", "@":{"Units":"pixels"}}, "Width":{"#":"350", "@":{"Units":"pixels"}}}}
    ]}, "ItemAttributes":{"Author":"J.K. Rowling", "Binding":"Paperback", "Brand":"Scholastic", "Creator":{"#":"Mary GrandPré", "@":{"Role":"Illustrator"}}, "EAN":"9780590353427", "EANList":{"EANListElement":["9780590353427", "9780439708180", "0038332166576", "0078073006991", "0000590353425"]}, "Edition":"1st", "Feature":["Harry Potter", "and the", "Sorcerer's", "Stone", "(Book 1)"], "ISBN":"0439708184", "ItemDimensions":{"Height":{"#":"78", "@":{"Units":"hundredths-inches"}}, "Length":{"#":"764", "@":{"Units":"hundredths-inches"}}, "Weight":{"#":"53", "@":{"Units":"hundredths-pounds"}}, "Width":{"#":"525", "@":{"Units":"hundredths-inches"}}}, "Label":"Scholastic Paperbacks", "Languages":{"Language":[
        {"Name":"English", "Type":"Unknown"},
        {"Name":"English", "Type":"Original Language"},
        {"Name":"English", "Type":"Published"}
    ]}, "ListPrice":{"Amount":"1099", "CurrencyCode":"USD", "FormattedPrice":"$10.99"}, "Manufacturer":"Scholastic Paperbacks", "MPN":"059035342X", "NumberOfItems":"1", "NumberOfPages":"320", "PackageDimensions":{"Height":{"#":"90", "@":{"Units":"hundredths-inches"}}, "Length":{"#":"750", "@":{"Units":"hundredths-inches"}}, "Weight":{"#":"45", "@":{"Units":"hundredths-pounds"}}, "Width":{"#":"530", "@":{"Units":"hundredths-inches"}}}, "PackageQuantity":"1", "PartNumber":"059035342X", "ProductGroup":"Book", "ProductTypeName":"ABIS_BOOK", "PublicationDate":"1999-10-01", "Publisher":"Scholastic Paperbacks", "ReleaseDate":"1999-09-08", "SKU":"F010613X63454622142", "Studio":"Scholastic Paperbacks", "Title":"Harry Potter and the Sorcerer's Stone (Book 1)", "UPC":"038332166576", "UPCList":{"UPCListElement":["038332166576", "000590353425", "078073006991"]}}, "OfferSummary":{"LowestNewPrice":{"Amount":"378", "CurrencyCode":"USD", "FormattedPrice":"$3.78"}, "LowestUsedPrice":{"Amount":"1", "CurrencyCode":"USD", "FormattedPrice":"$0.01"}, "LowestCollectiblePrice":{"Amount":"359", "CurrencyCode":"USD", "FormattedPrice":"$3.59"}, "TotalNew":"174", "TotalUsed":"3895", "TotalCollectible":"14", "TotalRefurbished":"0"}, "Offers":{"TotalOffers":"1", "TotalOfferPages":"1", "MoreOffersUrl":"http://www.amazon.com/gp/offer-listing/059035342X%3FSubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D059035342X", "Offer":{"OfferAttributes":{"Condition":"New"}, "OfferListing":{"OfferListingId":"cXjZtkH%2BXPlK8u2nVpOnR5%2BUMihwzGkjdxNfunGuIEdqoIKsr9AyOG7S8PxtNQRDeM2m7KTHP8qZFWIaKZ5nPKFCEJROLdx9%2B03CDR1%2FOrM%3D", "Price":{"Amount":"879", "CurrencyCode":"USD", "FormattedPrice":"$8.79"}, "AmountSaved":{"Amount":"220", "CurrencyCode":"USD", "FormattedPrice":"$2.20"}, "PercentageSaved":"20", "Availability":"Usually ships in 24 hours", "AvailabilityAttributes":{"AvailabilityType":"now", "MinimumHours":"0", "MaximumHours":"0"}, "IsEligibleForSuperSaverShipping":"1"}}}},

    {"ASIN":"0545162076", "DetailPageURL":"http://www.amazon.com/Harry-Potter-Paperback-Box-Books/dp/0545162076%3FSubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeASIN%3D0545162076", "ItemLinks":{"ItemLink":[
        {"Description":"Technical Details", "URL":"http://www.amazon.com/Harry-Potter-Paperback-Box-Books/dp/tech-data/0545162076%3FSubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D0545162076"},
        {"Description":"Add To Baby Registry", "URL":"http://www.amazon.com/gp/registry/baby/add-item.html%3Fasin.0%3D0545162076%26SubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D0545162076"},
        {"Description":"Add To Wedding Registry", "URL":"http://www.amazon.com/gp/registry/wedding/add-item.html%3Fasin.0%3D0545162076%26SubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D0545162076"},
        {"Description":"Add To Wishlist", "URL":"http://www.amazon.com/gp/registry/wishlist/add-item.html%3Fasin.0%3D0545162076%26SubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D0545162076"},
        {"Description":"Tell A Friend", "URL":"http://www.amazon.com/gp/pdp/taf/0545162076%3FSubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D0545162076"},
        {"Description":"All Customer Reviews", "URL":"http://www.amazon.com/review/product/0545162076%3FSubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D0545162076"},
        {"Description":"All Offers", "URL":"http://www.amazon.com/gp/offer-listing/0545162076%3FSubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D0545162076"}
    ]}, "SmallImage":{"URL":"http://ecx.images-amazon.com/images/I/41A8SsxNQcL._SL75_.jpg", "Height":{"#":"75", "@":{"Units":"pixels"}}, "Width":{"#":"50", "@":{"Units":"pixels"}}}, "MediumImage":{"URL":"http://ecx.images-amazon.com/images/I/41A8SsxNQcL._SL160_.jpg", "Height":{"#":"160", "@":{"Units":"pixels"}}, "Width":{"#":"107", "@":{"Units":"pixels"}}}, "LargeImage":{"URL":"http://ecx.images-amazon.com/images/I/41A8SsxNQcL.jpg", "Height":{"#":"500", "@":{"Units":"pixels"}}, "Width":{"#":"333", "@":{"Units":"pixels"}}}, "ImageSets":{"ImageSet":{"@":{"Category":"primary"}, "SwatchImage":{"URL":"http://ecx.images-amazon.com/images/I/41A8SsxNQcL._SL30_.jpg", "Height":{"#":"30", "@":{"Units":"pixels"}}, "Width":{"#":"20", "@":{"Units":"pixels"}}}, "SmallImage":{"URL":"http://ecx.images-amazon.com/images/I/41A8SsxNQcL._SL75_.jpg", "Height":{"#":"75", "@":{"Units":"pixels"}}, "Width":{"#":"50", "@":{"Units":"pixels"}}}, "ThumbnailImage":{"URL":"http://ecx.images-amazon.com/images/I/41A8SsxNQcL._SL75_.jpg", "Height":{"#":"75", "@":{"Units":"pixels"}}, "Width":{"#":"50", "@":{"Units":"pixels"}}}, "TinyImage":{"URL":"http://ecx.images-amazon.com/images/I/41A8SsxNQcL._SL110_.jpg", "Height":{"#":"110", "@":{"Units":"pixels"}}, "Width":{"#":"73", "@":{"Units":"pixels"}}}, "MediumImage":{"URL":"http://ecx.images-amazon.com/images/I/41A8SsxNQcL._SL160_.jpg", "Height":{"#":"160", "@":{"Units":"pixels"}}, "Width":{"#":"107", "@":{"Units":"pixels"}}}, "LargeImage":{"URL":"http://ecx.images-amazon.com/images/I/41A8SsxNQcL.jpg", "Height":{"#":"500", "@":{"Units":"pixels"}}, "Width":{"#":"333", "@":{"Units":"pixels"}}}}}, "ItemAttributes":{"Author":"J. K. Rowling", "Binding":"Paperback", "Brand":"Arthur A. Levine Books", "EAN":"9780545162074", "EANList":{"EANListElement":"9780545162074"}, "Edition":"Kindle", "Feature":"Harry Potter Paperback Box Set (Books 1-7)", "Format":"Box set", "ISBN":"0545162076", "IsEligibleForTradeIn":"1", "ItemDimensions":{"Height":{"#":"550", "@":{"Units":"hundredths-inches"}}, "Length":{"#":"1060", "@":{"Units":"hundredths-inches"}}, "Weight":{"#":"712", "@":{"Units":"hundredths-pounds"}}, "Width":{"#":"850", "@":{"Units":"hundredths-inches"}}}, "Label":"Arthur A. Levine Books", "Languages":{"Language":[
        {"Name":"English", "Type":"Unknown"},
        {"Name":"English", "Type":"Original Language"},
        {"Name":"English", "Type":"Published"}
    ]}, "ListPrice":{"Amount":"8693", "CurrencyCode":"USD", "FormattedPrice":"$86.93"}, "Manufacturer":"Arthur A. Levine Books", "MPN":"545162076", "NumberOfItems":"1", "NumberOfPages":"4167", "PackageDimensions":{"Height":{"#":"760", "@":{"Units":"hundredths-inches"}}, "Length":{"#":"1820", "@":{"Units":"hundredths-inches"}}, "Weight":{"#":"1960", "@":{"Units":"hundredths-pounds"}}, "Width":{"#":"1370", "@":{"Units":"hundredths-inches"}}}, "PartNumber":"545162076", "ProductGroup":"Book", "ProductTypeName":"ABIS_BOOK", "PublicationDate":"2009-07-01", "Publisher":"Arthur A. Levine Books", "ReleaseDate":"2009-07-07", "SKU":"ACOMMP2_book_usedgood_0545162076", "Studio":"Arthur A. Levine Books", "Title":"Harry Potter Paperback Box Set (Books 1-7)", "TradeInValue":{"Amount":"2325", "CurrencyCode":"USD", "FormattedPrice":"$23.25"}}, "OfferSummary":{"LowestNewPrice":{"Amount":"5085", "CurrencyCode":"USD", "FormattedPrice":"$50.85"}, "LowestUsedPrice":{"Amount":"4000", "CurrencyCode":"USD", "FormattedPrice":"$40.00"}, "LowestCollectiblePrice":{"Amount":"8800", "CurrencyCode":"USD", "FormattedPrice":"$88.00"}, "TotalNew":"70", "TotalUsed":"54", "TotalCollectible":"3", "TotalRefurbished":"0"}, "Offers":{"TotalOffers":"1", "TotalOfferPages":"1", "MoreOffersUrl":"http://www.amazon.com/gp/offer-listing/0545162076%3FSubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D0545162076", "Offer":{"OfferAttributes":{"Condition":"New"}, "OfferListing":{"OfferListingId":"VoFW0LM5U%2FTgqDl1%2FPwTqPGqDgEpbpGqFM2RB9nj9bh4v2a5ewkOojYlu2JYSSZQEIY3Vgy80uJK5Z0UWMw%2B3lgEd8dDCteO5O%2B%2BJg2rKjh8zyAsdb6yjQ%3D%3D", "Price":{"Amount":"5085", "CurrencyCode":"USD", "FormattedPrice":"$50.85"}, "AmountSaved":{"Amount":"3608", "CurrencyCode":"USD", "FormattedPrice":"$36.08"}, "PercentageSaved":"42", "Availability":"Usually ships in 24 hours", "AvailabilityAttributes":{"AvailabilityType":"now", "MinimumHours":"0", "MaximumHours":"0"}, "IsEligibleForSuperSaverShipping":"1"}}}},

    {"ASIN":"0545139708", "DetailPageURL":"http://www.amazon.com/Harry-Potter-Deathly-Hallows-Book/dp/0545139708%3FSubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeASIN%3D0545139708", "ItemLinks":{"ItemLink":[
        {"Description":"Technical Details", "URL":"http://www.amazon.com/Harry-Potter-Deathly-Hallows-Book/dp/tech-data/0545139708%3FSubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D0545139708"},
        {"Description":"Add To Baby Registry", "URL":"http://www.amazon.com/gp/registry/baby/add-item.html%3Fasin.0%3D0545139708%26SubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D0545139708"},
        {"Description":"Add To Wedding Registry", "URL":"http://www.amazon.com/gp/registry/wedding/add-item.html%3Fasin.0%3D0545139708%26SubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D0545139708"},
        {"Description":"Add To Wishlist", "URL":"http://www.amazon.com/gp/registry/wishlist/add-item.html%3Fasin.0%3D0545139708%26SubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D0545139708"},
        {"Description":"Tell A Friend", "URL":"http://www.amazon.com/gp/pdp/taf/0545139708%3FSubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D0545139708"},
        {"Description":"All Customer Reviews", "URL":"http://www.amazon.com/review/product/0545139708%3FSubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D0545139708"},
        {"Description":"All Offers", "URL":"http://www.amazon.com/gp/offer-listing/0545139708%3FSubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D0545139708"}
    ]}, "SmallImage":{"URL":"http://ecx.images-amazon.com/images/I/51YLjeIs-DL._SL75_.jpg", "Height":{"#":"75", "@":{"Units":"pixels"}}, "Width":{"#":"51", "@":{"Units":"pixels"}}}, "MediumImage":{"URL":"http://ecx.images-amazon.com/images/I/51YLjeIs-DL._SL160_.jpg", "Height":{"#":"160", "@":{"Units":"pixels"}}, "Width":{"#":"109", "@":{"Units":"pixels"}}}, "LargeImage":{"URL":"http://ecx.images-amazon.com/images/I/51YLjeIs-DL.jpg", "Height":{"#":"500", "@":{"Units":"pixels"}}, "Width":{"#":"342", "@":{"Units":"pixels"}}}, "ImageSets":{"ImageSet":[
        {"@":{"Category":"primary"}, "SwatchImage":{"URL":"http://ecx.images-amazon.com/images/I/51YLjeIs-DL._SL30_.jpg", "Height":{"#":"30", "@":{"Units":"pixels"}}, "Width":{"#":"21", "@":{"Units":"pixels"}}}, "SmallImage":{"URL":"http://ecx.images-amazon.com/images/I/51YLjeIs-DL._SL75_.jpg", "Height":{"#":"75", "@":{"Units":"pixels"}}, "Width":{"#":"51", "@":{"Units":"pixels"}}}, "ThumbnailImage":{"URL":"http://ecx.images-amazon.com/images/I/51YLjeIs-DL._SL75_.jpg", "Height":{"#":"75", "@":{"Units":"pixels"}}, "Width":{"#":"51", "@":{"Units":"pixels"}}}, "TinyImage":{"URL":"http://ecx.images-amazon.com/images/I/51YLjeIs-DL._SL110_.jpg", "Height":{"#":"110", "@":{"Units":"pixels"}}, "Width":{"#":"75", "@":{"Units":"pixels"}}}, "MediumImage":{"URL":"http://ecx.images-amazon.com/images/I/51YLjeIs-DL._SL160_.jpg", "Height":{"#":"160", "@":{"Units":"pixels"}}, "Width":{"#":"109", "@":{"Units":"pixels"}}}, "LargeImage":{"URL":"http://ecx.images-amazon.com/images/I/51YLjeIs-DL.jpg", "Height":{"#":"500", "@":{"Units":"pixels"}}, "Width":{"#":"342", "@":{"Units":"pixels"}}}},
        {"@":{"Category":"variant"}, "SwatchImage":{"URL":"http://ecx.images-amazon.com/images/I/511ShP8zchL._SL30_.jpg", "Height":{"#":"30", "@":{"Units":"pixels"}}, "Width":{"#":"21", "@":{"Units":"pixels"}}}, "SmallImage":{"URL":"http://ecx.images-amazon.com/images/I/511ShP8zchL._SL75_.jpg", "Height":{"#":"75", "@":{"Units":"pixels"}}, "Width":{"#":"52", "@":{"Units":"pixels"}}}, "ThumbnailImage":{"URL":"http://ecx.images-amazon.com/images/I/511ShP8zchL._SL75_.jpg", "Height":{"#":"75", "@":{"Units":"pixels"}}, "Width":{"#":"52", "@":{"Units":"pixels"}}}, "TinyImage":{"URL":"http://ecx.images-amazon.com/images/I/511ShP8zchL._SL110_.jpg", "Height":{"#":"110", "@":{"Units":"pixels"}}, "Width":{"#":"76", "@":{"Units":"pixels"}}}, "MediumImage":{"URL":"http://ecx.images-amazon.com/images/I/511ShP8zchL._SL160_.jpg", "Height":{"#":"160", "@":{"Units":"pixels"}}, "Width":{"#":"110", "@":{"Units":"pixels"}}}, "LargeImage":{"URL":"http://ecx.images-amazon.com/images/I/511ShP8zchL.jpg", "Height":{"#":"500", "@":{"Units":"pixels"}}, "Width":{"#":"345", "@":{"Units":"pixels"}}}}
    ]}, "ItemAttributes":{"Author":"J.K. Rowling", "Binding":"Paperback", "Brand":"Arthur A. Levine Books", "Creator":{"#":"Mary GrandPre", "@":{"Role":"Illustrator"}}, "EAN":"9780545139700", "EANList":{"EANListElement":["0490591207771", "9780545139700"]}, "Feature":["Harry", "Freaking", "Potter", "Man", "!!!"], "ISBN":"0545139708", "IsEligibleForTradeIn":"1", "ItemDimensions":{"Height":{"#":"166", "@":{"Units":"hundredths-inches"}}, "Length":{"#":"756", "@":{"Units":"hundredths-inches"}}, "Weight":{"#":"110", "@":{"Units":"hundredths-pounds"}}, "Width":{"#":"531", "@":{"Units":"hundredths-inches"}}}, "Label":"Arthur A. Levine Books", "Languages":{"Language":[
        {"Name":"English", "Type":"Unknown"},
        {"Name":"English", "Type":"Original Language"},
        {"Name":"English", "Type":"Published"}
    ]}, "ListPrice":{"Amount":"1499", "CurrencyCode":"USD", "FormattedPrice":"$14.99"}, "Manufacturer":"Arthur A. Levine Books", "MPN":"545139708", "NumberOfItems":"1", "NumberOfPages":"784", "PackageDimensions":{"Height":{"#":"180", "@":{"Units":"hundredths-inches"}}, "Length":{"#":"790", "@":{"Units":"hundredths-inches"}}, "Weight":{"#":"160", "@":{"Units":"hundredths-pounds"}}, "Width":{"#":"510", "@":{"Units":"hundredths-inches"}}}, "PackageQuantity":"1", "PartNumber":"545139708", "ProductGroup":"Book", "ProductTypeName":"ABIS_BOOK", "PublicationDate":"2009-07-01", "Publisher":"Arthur A. Levine Books", "ReleaseDate":"2009-07-07", "SKU":"BK-092511-441", "Studio":"Arthur A. Levine Books", "Title":"Harry Potter and the Deathly Hallows (Book 7)", "TradeInValue":{"Amount":"130", "CurrencyCode":"USD", "FormattedPrice":"$1.30"}, "UPC":"490591207771", "UPCList":{"UPCListElement":"490591207771"}}, "OfferSummary":{"LowestNewPrice":{"Amount":"918", "CurrencyCode":"USD", "FormattedPrice":"$9.18"}, "LowestUsedPrice":{"Amount":"389", "CurrencyCode":"USD", "FormattedPrice":"$3.89"}, "LowestCollectiblePrice":{"Amount":"1099", "CurrencyCode":"USD", "FormattedPrice":"$10.99"}, "TotalNew":"128", "TotalUsed":"197", "TotalCollectible":"8", "TotalRefurbished":"0"}, "Offers":{"TotalOffers":"1", "TotalOfferPages":"1", "MoreOffersUrl":"http://www.amazon.com/gp/offer-listing/0545139708%3FSubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D0545139708", "Offer":{"OfferAttributes":{"Condition":"New"}, "OfferListing":{"OfferListingId":"kg0T1mCymUnogzz56oAbYg9kte6HCWr1yMAq1NlsDvPZJfNnOa6Y%2BVEBPFb1ml5bqJfzcEAVGnnCkoD28cBcM7JxzGIV98RX49ZhKcFVbWg%3D", "Price":{"Amount":"1019", "CurrencyCode":"USD", "FormattedPrice":"$10.19"}, "AmountSaved":{"Amount":"480", "CurrencyCode":"USD", "FormattedPrice":"$4.80"}, "PercentageSaved":"32", "Availability":"Usually ships in 24 hours", "AvailabilityAttributes":{"AvailabilityType":"now", "MinimumHours":"0", "MaximumHours":"0"}, "IsEligibleForSuperSaverShipping":"1"}}}},

    {"ASIN":"0439064872", "DetailPageURL":"http://www.amazon.com/Harry-Potter-Chamber-Secrets-Book/dp/0439064872%3FSubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeASIN%3D0439064872", "ItemLinks":{"ItemLink":[
        {"Description":"Technical Details", "URL":"http://www.amazon.com/Harry-Potter-Chamber-Secrets-Book/dp/tech-data/0439064872%3FSubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D0439064872"},
        {"Description":"Add To Baby Registry", "URL":"http://www.amazon.com/gp/registry/baby/add-item.html%3Fasin.0%3D0439064872%26SubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D0439064872"},
        {"Description":"Add To Wedding Registry", "URL":"http://www.amazon.com/gp/registry/wedding/add-item.html%3Fasin.0%3D0439064872%26SubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D0439064872"},
        {"Description":"Add To Wishlist", "URL":"http://www.amazon.com/gp/registry/wishlist/add-item.html%3Fasin.0%3D0439064872%26SubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D0439064872"},
        {"Description":"Tell A Friend", "URL":"http://www.amazon.com/gp/pdp/taf/0439064872%3FSubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D0439064872"},
        {"Description":"All Customer Reviews", "URL":"http://www.amazon.com/review/product/0439064872%3FSubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D0439064872"},
        {"Description":"All Offers", "URL":"http://www.amazon.com/gp/offer-listing/0439064872%3FSubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D0439064872"}
    ]}, "SmallImage":{"URL":"http://ecx.images-amazon.com/images/I/51jNORv6nQL._SL75_.jpg", "Height":{"#":"75", "@":{"Units":"pixels"}}, "Width":{"#":"51", "@":{"Units":"pixels"}}}, "MediumImage":{"URL":"http://ecx.images-amazon.com/images/I/51jNORv6nQL._SL160_.jpg", "Height":{"#":"160", "@":{"Units":"pixels"}}, "Width":{"#":"109", "@":{"Units":"pixels"}}}, "LargeImage":{"URL":"http://ecx.images-amazon.com/images/I/51jNORv6nQL.jpg", "Height":{"#":"500", "@":{"Units":"pixels"}}, "Width":{"#":"342", "@":{"Units":"pixels"}}}, "ImageSets":{"ImageSet":{"@":{"Category":"primary"}, "SwatchImage":{"URL":"http://ecx.images-amazon.com/images/I/51jNORv6nQL._SL30_.jpg", "Height":{"#":"30", "@":{"Units":"pixels"}}, "Width":{"#":"21", "@":{"Units":"pixels"}}}, "SmallImage":{"URL":"http://ecx.images-amazon.com/images/I/51jNORv6nQL._SL75_.jpg", "Height":{"#":"75", "@":{"Units":"pixels"}}, "Width":{"#":"51", "@":{"Units":"pixels"}}}, "ThumbnailImage":{"URL":"http://ecx.images-amazon.com/images/I/51jNORv6nQL._SL75_.jpg", "Height":{"#":"75", "@":{"Units":"pixels"}}, "Width":{"#":"51", "@":{"Units":"pixels"}}}, "TinyImage":{"URL":"http://ecx.images-amazon.com/images/I/51jNORv6nQL._SL110_.jpg", "Height":{"#":"110", "@":{"Units":"pixels"}}, "Width":{"#":"75", "@":{"Units":"pixels"}}}, "MediumImage":{"URL":"http://ecx.images-amazon.com/images/I/51jNORv6nQL._SL160_.jpg", "Height":{"#":"160", "@":{"Units":"pixels"}}, "Width":{"#":"109", "@":{"Units":"pixels"}}}, "LargeImage":{"URL":"http://ecx.images-amazon.com/images/I/51jNORv6nQL.jpg", "Height":{"#":"500", "@":{"Units":"pixels"}}, "Width":{"#":"342", "@":{"Units":"pixels"}}}}}, "ItemAttributes":{"Author":["J. K. Rowling", "Mary GrandPré"], "Binding":"Paperback", "Brand":"Scholastic", "EAN":"9780439064873", "EANList":{"EANListElement":["9780439064873", "0000439064871", "0004390648729", "9780848710682"]}, "Edition":"Edition Unstated", "ISBN":"0439064872", "ItemDimensions":{"Height":{"#":"756", "@":{"Units":"hundredths-inches"}}, "Length":{"#":"531", "@":{"Units":"hundredths-inches"}}, "Weight":{"#":"59", "@":{"Units":"hundredths-pounds"}}, "Width":{"#":"87", "@":{"Units":"hundredths-inches"}}}, "Label":"Scholastic Paperbacks", "Languages":{"Language":[
        {"Name":"English", "Type":"Unknown"},
        {"Name":"English", "Type":"Original Language"},
        {"Name":"English", "Type":"Published"}
    ]}, "ListPrice":{"Amount":"1099", "CurrencyCode":"USD", "FormattedPrice":"$10.99"}, "Manufacturer":"Scholastic Paperbacks", "MPN":"439064872", "NumberOfItems":"1", "NumberOfPages":"352", "PackageDimensions":{"Height":{"#":"100", "@":{"Units":"hundredths-inches"}}, "Length":{"#":"750", "@":{"Units":"hundredths-inches"}}, "Weight":{"#":"55", "@":{"Units":"hundredths-pounds"}}, "Width":{"#":"520", "@":{"Units":"hundredths-inches"}}}, "PartNumber":"439064872", "ProductGroup":"Book", "ProductTypeName":"ABIS_BOOK", "PublicationDate":"2000-09-01", "Publisher":"Scholastic Paperbacks", "ReleaseDate":"2000-08-15", "SKU":"6647723", "Studio":"Scholastic Paperbacks", "Title":"Harry Potter and the Chamber of Secrets (Book 2)", "UPC":"000439064871", "UPCList":{"UPCListElement":["000439064871", "004390648729"]}}, "OfferSummary":{"LowestNewPrice":{"Amount":"365", "CurrencyCode":"USD", "FormattedPrice":"$3.65"}, "LowestUsedPrice":{"Amount":"1", "CurrencyCode":"USD", "FormattedPrice":"$0.01"}, "LowestCollectiblePrice":{"Amount":"250", "CurrencyCode":"USD", "FormattedPrice":"$2.50"}, "TotalNew":"204", "TotalUsed":"2846", "TotalCollectible":"26", "TotalRefurbished":"0"}, "Offers":{"TotalOffers":"1", "TotalOfferPages":"1", "MoreOffersUrl":"http://www.amazon.com/gp/offer-listing/0439064872%3FSubscriptionId%3DAKIAIWH4I4MAW6HWNUYA%26tag%3Dwwwshouldibuy-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D386001%26creativeASIN%3D0439064872", "Offer":{"OfferAttributes":{"Condition":"New"}, "OfferListing":{"OfferListingId":"nAJds6z0xgQ52xHXMjfyeZIb6pvCbtJ6gnkkGdxd9%2BeUdZu8aqCdNQV%2Bjgt7diF%2FMk1DI%2BtHDrAejr2OTmZrBeaW26I8OjQAcAMY%2BFBc9hQ%3D", "Price":{"Amount":"879", "CurrencyCode":"USD", "FormattedPrice":"$8.79"}, "AmountSaved":{"Amount":"220", "CurrencyCode":"USD", "FormattedPrice":"$2.20"}, "PercentageSaved":"20", "Availability":"Usually ships in 24 hours", "AvailabilityAttributes":{"AvailabilityType":"now", "MinimumHours":"0", "MaximumHours":"0"}, "IsEligibleForSuperSaverShipping":"1"}}}}
]};

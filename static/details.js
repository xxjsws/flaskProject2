function p_details() {
    var url = window.location.href;
    var params = {};
    url.slice(url.indexOf("?") + 1).split("&").forEach(function (param) {
        var keyValue = param.split("=");
        var key = decodeURIComponent(keyValue[0]);
        params[key] = decodeURIComponent(keyValue[1]);
    });
    var pname = params["pname"];
    $.ajax({
        url: 'before_after',
        type: 'POST',
        data: { pname: pname },
        success: function (response) {
            if (response.length === 0) {
            } else {
                var str1 = "<div class=\"details-gallery\">\n" +
                    "        <div class=\"details-label-group\">\n" +
                    "        <label class=\"details-label new\">new</label>\n" +
                    "        <label class=\"details-label off\">-10%</label>\n" +
                    "       </div>\n" +
                    "       <ul class=\"details-preview\">\n" +
                    "        <li><img src='" + response.product_image + "'  alt=" + response.product_name + " /></li>\n" +
                    "       </ul>\n" +
                    "      </div>"

                var v1 = response.product_tag.split(/[,，]/);
                var htmlCode = "";
                $.each(v1, function (i, item) {
                    htmlCode += '<li><a href="/products?search='+item+'">' + item + '</a></li>';
                });
                
                var pname1= pname+"详情"
                var str2 = "<ul class=\"product-navigation\">\n" +
                    "       <li class=\"product-nav-prev\"><a href=\"/product-details?pname=" + response.prev_data.product_name + "\"><i class=\"icofont-arrow-left\"></i>上一件商品<span class=\"product-nav-popup\"><img src=\"" + response.prev_data.product_image + "\" alt=\"product\" /><small>" + response.prev_data.product_name + "</small></span></a></li>\n" +
                    "       <li class=\"product-nav-next\"><a href=\"/product-details?pname=" + response.next_data.product_name + "\">下一件商品<i class=\"icofont-arrow-right\"></i><span class=\"product-nav-popup\"><img src=\"" + response.next_data.product_image + "\" alt=\"product\" /><small>" + response.next_data.product_name + "</small></span></a></li>\n" +
                    "      </ul>\n" +
                    "      <div class=\"details-content\">\n" +
                    "       <h3 class=\"details-name\">" + response.product_name + "</h3>\n" +
                    "       <h3 class=\"details-price\">\n" +
                    "        <span>￥" + response.product_price + "</span></h3>\n" +
                    "       <p class=\"details-desc\">产品描述：" + response.product_describe + "</p>\n" +
                    "       <div class=\"details-list-group\">\n" +
                    "        <label class=\"details-list-title\">tags:</label>\n" +
                    "        <ul class=\"details-tag-list\">\n" +
                    htmlCode +
                    "        </ul>\n" +
                    "       </div>\n" +
                    "       <div class=\"details-list-group\">\n" +
                    "        <label class=\"details-list-title\">Share:</label>\n" +
                    "        <ul class=\"details-share-list\">\n" +
                    "         <li><a href=\"https://www.facebook.com/sharer/sharer.php?u="+url+"\" target=\"_blank\" class=\"icofont-facebook\" title=\"Facebook\"></a></li>\n" +
                    "         <li><a href=\"https://twitter.com/intent/tweet?url="+url+"&text="+pname1+"\" target=\"_blank\" class=\"icofont-twitter\" title=\"Twitter\"></a></li>\n" +
                    "         <li><a href=\"https://www.instagram.com/share?url="+url+"\" target=\"_blank\" class=\"icofont-instagram\" title=\"Instagram\"></a></li>\n" +
                    "        </ul>\n" +
                    "       </div>\n" +
                    "       <div class=\"details-add-group\">\n" +
                    "        <button class=\"product-add\" title=\"Add to Cart\" data-name='" + response.product_name + "' ><i class=\"icofont-cart\"></i><span>add to cart</span></button>\n" +
                    "        <div class=\"product-action mt-3\">\n" +
                    "         <button class=\"action-minus\" title=\"Quantity Minus\"><i class=\"icofont-minus\"></i></button>\n" +
                    "         <input class=\"action-input\" title=\"Quantity Number\" type=\"text\" name=\"quantity\" value=\"1\" data-name=" + response.product_name + ">\n" +
                    "         <button class=\"action-plus\" title=\"Quantity Plus\"><i class=\"icofont-plus\"></i></button>\n" +
                    "        </div>\n" +
                    "       </div>\n" +
                    "      </div>"

                $(".row").find(".col-lg-6").eq(0).html(str1);
                $(".showdetails").find(".col-lg-6").eq(1).html(str2);
                show_cart();
                car_list();
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

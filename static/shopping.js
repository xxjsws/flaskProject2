var globalRes;
var leftValue = -Infinity;
var rightValue = Infinity;
$(".price-btn").click(function() {
        leftValue = $("#slider-range").slider("values", 0);
        rightValue = $("#slider-range").slider("values", 1);

        if(leftValue > 50){
            leftValue = 5000 + ((leftValue - 50) / 50) * 15000;
        } else {
            leftValue = leftValue * 100;
        }
        if(rightValue > 50){
            rightValue = 5000 + ((rightValue - 50) / 50) * 15000;
        } else {
            rightValue = rightValue * 100;
        }
        res1()
        
    });
function brand() {
    var b1=0
    var b2=0
    var b3=0
    var b4=0
    var b5=0
    var b6=0
    var b7=0
    var b8=0
$.each(globalRes, function(i, v) {
    if (v[1].includes("AMD")) {
        b1+=1
    } else if (v[1].includes("华硕")){
        b2+=1
    }else if (v[1].includes("联想")){
        b3+=1
    }else if (v[1].includes("三星")){
        b4+=1
    }else if (v[1].includes("七彩虹")){
        b5+=1
    }else if (v[1].includes("戴尔")){
        b6+=1
    }else if (v[1].includes("Intel")){
        b7+=1
    }else {
        b8+=1
    }
});
    var brand = "<li>\n" +
        "          <div class=\"shop-widget-content\">\n" +
        "            <a class=\"link\" href=\"/products\">AMD</a>" +
        "          </div><span class=\"shop-widget-number\">(" + b1 + ")</span></li>\n" +
        "<li>\n" +
        "          <div class=\"shop-widget-content\">\n" +
        "            <a class=\"link\" href=\"/products\">华硕</a>          </div><span class=\"shop-widget-number\">(" + b2 + ")</span></li>" +
        "<li>\n" +
        "          <div class=\"shop-widget-content\">\n" +
        "            <a class=\"link\" href=\"/products\">联想</a>          </div><span class=\"shop-widget-number\">(" + b3 + ")</span></li>" +
        "<li>\n" +
        "          <div class=\"shop-widget-content\">\n" +
        "            <a class=\"link\" href=\"/products\">三星</a>          </div><span class=\"shop-widget-number\">(" + b4 + ")</span></li>" +
        "<li>\n" +
        "          <div class=\"shop-widget-content\">\n" +
        "            <a class=\"link\" href=\"/products\">七彩虹</a>          </div><span class=\"shop-widget-number\">(" + b5 + ")</span></li>" +
        "<li>\n" +
        "          <div class=\"shop-widget-content\">\n" +
        "            <a class=\"link\" href=\"/products\">戴尔</a>          </div><span class=\"shop-widget-number\">(" + b6 + ")</span></li>" +
        "<li>\n" +
        "          <div class=\"shop-widget-content\">\n" +
        "            <a class=\"link\" href=\"/products\">Intel</a>          </div><span class=\"shop-widget-number\">(" + b7 + ")</span></li>" +
        "<li>\n" +
        "          <div class=\"shop-widget-content\">\n" +
        "            <a class=\"link\" href=\"/products\">其他</a>          </div><span class=\"shop-widget-number\">(" + b8 + ")</span></li>"
    $('.shop-widget-list').html(brand)
// 获取所有带有 "link" 类的 <a> 标签
var links = document.getElementsByClassName("link");

// 遍历每个链接并添加点击事件处理函数
Array.from(links).forEach(function(link) {
    link.addEventListener("click", function(event) {
        event.preventDefault(); // 阻止默认的链接行为

        var currentUrl = window.location.href; // 获取当前网页的 URL
        var searchParam = "?search=";

        if (currentUrl.includes("?search=")) {
            // 如果当前 URL 中已经包含 ?search=
            var linkText = link.textContent.trim(); // 获取 <a> 标签内部的文本内容并去除首尾空格

            window.location.href = currentUrl + " " + encodeURIComponent(linkText);
        } else {
            // 如果当前 URL 中不包含 ?search=
            linkText = link.textContent.trim(); // 获取 <a> 标签内部的文本内容并去除首尾空格

            window.location.href = currentUrl + searchParam + encodeURIComponent(linkText);;
        }
    });
});

}
function res1() {
    
    var str = "";
    if (globalRes.length === 0){
        str = "<div class=\"col\">\n" +
            "    <div class=\"product-card\">没有相关的产品" +
            "    </div>\n" +
            "</div>"
    }else {
        $.each(globalRes, function(i, v) {
               var price = parseFloat(v[2]); // 将价格转换为浮点数

    if (price >= leftValue && price <= rightValue) { // 判断价格是否在指定范围内
        if (v[5]===0){
            str += "<div class=\"col\">\n" +
            "    <div class=\"product-card\">\n"
        }
        else
        {
            str += "<div class=\"col\">\n" +
            "    <div class=\"product-card product-disable\">\n"
        }
        str +="        <div class=\"product-media\">\n" +
            "            <div class=\"product-label\">\n" +
            "                <label class=\"label-text new\">new</label>\n" +
            "            </div>\n" +
            "            <button class=\"product-wish wish\"><i class=\"icofont-ui-love\"></i></button>\n" +
            "            <a class=\"product-image\" href=\"/product-details?pname=" + v[0] + "\"><img src='" + v[4] + "'  alt=" + v[0] + " /></a>\n" +
            "            <div class=\"product-widget\">\n" +
            "                <a title=\"Product View\" href=\"/product-details?pname=" + v[0] + "\" class=\"icofont-eye-alt\"></a>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "        <div class=\"product-content\">\n" +
            "            <h6 class=\"product-name\"><a href=\"/product-details?pname=" + v[0] + "\">" + v[0] + "</a></h6>\n" +
            "            <h6 class=\"product-price\">\n" +
            "                <span>￥" + v[2] + "</span></h6>\n" +
            "            <button class=\"product-add\" title=\"Add to Cart\" data-name='" + v[0] + "'><i class=\"icofont-cart\"></i><span>add</span></button>\n" +
            "            <div class=\"product-action mt-3\">\n" +
            "                <button class=\"action-minus\" title=\"Quantity Minus\"><i class=\"icofont-minus\"></i></button>\n" +
            "                <input class=\"action-input\" title=\"Quantity Number\" type=\"text\" name=\"quantity\" value=\"1\" data-name=" + v[0] + " >\n" +
            "                <button class=\"action-plus\" title=\"Quantity Plus\"><i class=\"icofont-plus\"></i></button>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</div>";
    }
            });
    }

            $('.row-cols-2').html(str)
            if (typeof p_details === 'function') {
                // 当 p_details 函数被定义时执行的代码块
                p_details();
              } else{
                show_cart();
                car_list();
              }
              
}
function p_List() {
    var url = window.location.href;
    var params = {};
    url.slice(url.indexOf("?") + 1).split("&").forEach(function (param) {
        var keyValue = param.split("=");
        var key = decodeURIComponent(keyValue[0]);
        params[key] = decodeURIComponent(keyValue[1]);
    });
    var search = params["search"];
    var pname = params["pname"];
    var path = window.location.pathname;
    if (search !== null && search !== undefined && search !== '') {
  $.ajax({
        url: '/product_list', // 请求的URL
        type: 'POST', // 请求类型
        dataType: 'json', // 预期服务器返回的数据类型
        data: { pname: search },
        success: function(res) { // 请求成功后的回调函数
            globalRes = res;
            brand()
            res1();
        },
        error: function(xhr, status, error) {
            // 处理错误情况
            console.error("An error occurred: " + status + ", error: " + error);
        }
    });
} else if (path === '/') {
  $.ajax({
        url: '/request_list', // 请求的URL
        type: 'POST', // 请求类型
        data: { request: "5" },
        dataType: 'json', // 预期服务器返回的数据类型
        success: function(res) { // 请求成功后的回调函数
            globalRes = res;
            brand()
            res1();
        },
        error: function(xhr, status, error) {
            // 处理错误情况
            console.error("An error occurred: " + status + ", error: " + error);
        }
    });
} else if (path === '/product-details') {
  $.ajax({
        url: '/request_list', // 请求的URL
        type: 'POST', // 请求类型
        data: { request: pname },
        dataType: 'json', // 预期服务器返回的数据类型
        success: function(res) { // 请求成功后的回调函数
            globalRes = res;
            brand()
            res1();
        },
        error: function(xhr, status, error) {
            // 处理错误情况
            console.error("An error occurred: " + status + ", error: " + error);
        }
    });
}else {
  $.ajax({
        url: '/product_list', // 请求的URL
        type: 'GET', // 请求类型
        dataType: 'json', // 预期服务器返回的数据类型
        success: function(res) { // 请求成功后的回调函数
            globalRes = res;
            brand()
            res1();
        },
        error: function(xhr, status, error) {
            // 处理错误情况
            console.error("An error occurred: " + status + ", error: " + error);
        }
    });
}
}

p_List();
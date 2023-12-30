function orderlist() {
    $.ajax({
        url: '/order_list', // 请求的URL
        type: 'GET', // 请求类型
        dataType: 'json', // 预期服务器返回的数据类型
        success: function(res) { // 请求成功后的回调函数
          $('.orderlist-filter h5 span').html("- ("+res.length+")");
          var str1 =  ""
if (res.length === 0) {
    str1 = "<div class=\"orderlist\"><div class=\"orderlist-head\">您还没有任何订单<div><div>"
$('.order1').html(str1);
        }else {

            $.each(res, function(i, v) {
                str1 += "<div class=\"orderlist\">\n" +
                    "       <div class=\"orderlist-head\">\n" +
                    "        <h5>订单#"+(i+1)+"</h5>\n"
                    if(v[4]===1){
                    str1 +="        <h5>订单已处理</h5>\n"
                    }else {
                        str1 +="        <h5>订单已接受</h5>\n"
                    }
                    if (v[2]===null){
                        v[2] = ""
                    }
                    str1 +="       </div>\n" +
                    "       <div class=\"orderlist-body\">\n" +
                    "        <div class=\"row\">\n" +
                    "         <div class=\"col-lg-12\">\n" +
                    "          <div class=\"order-track\">\n" +
                    "           <ul class=\"order-track-list\">\n"
                if(v[4]===1){
                    str1 +="            <li class=\"order-track-item active\"><i class=\"icofont-check\"></i><span>订单已接受</span></li>\n" +
                    "            <li class=\"order-track-item active\"><i class=\"icofont-check\"></i><span>订单已处理</span></li>\n"
                    }else {
                        str1 +="            <li class=\"order-track-item active\"><i class=\"icofont-check\"></i><span>订单已接受</span></li>\n" +
                    "            <li class=\"order-track-item\"><i class=\"icofont-close\"></i><span>订单未处理</span></li>\n"
                    }
const items = v[3].split(',');
var sum3 = 0
// 处理每三个元素作为一组
let sum1 = 0;
let sum2 = 0;
for (let i = 0; i < items.length; i += 3) {
    if (i + 2 >= items.length) {
    break;
  }
  const value1 = parseFloat(items[i + 1]?.trim() ?? '0');
  const value2 = parseFloat(items[i + 2]?.trim() ?? '0');

  const product = value1 * value2;
  sum1 += product;
  sum2+=value1
}
if (v[5].indexOf('立即送货') !== -1 || v[5].indexOf('预约送货') !== -1){
    sum3 = 10
}

                    str1 += "           </ul>\n" +
                    "          </div>\n" +
                    "         </div>\n" +
                    "         <div class=\"col-lg-5\">\n" +
                    "          <ul class=\"orderlist-details\">\n" +
                    "           <li><h6>订单号</h6><p>"+v[0]+"</p></li>\n" +
                    "           <li><h6>总量</h6><p>"+sum2+"件</p></li>\n" +
                    "          </ul>\n" +
                    "         </div>\n" +
                    "         <div class=\"col-lg-4\">\n" +
                    "          <ul class=\"orderlist-details\">\n" +
                    "           <li><h6>小计</h6><p>￥"+sum1+"</p></li>\n" +
                    "           <li><h6>总计<small>(包含增值税)</small></h6><p>￥"+(sum1+sum3)+"</p></li>\n" +
                    "          </ul>\n" +
                    "         </div>\n" +
                    "         <div class=\"col-lg-3\">\n" +
                    "          <ul class=\"orderlist-details\">\n" +
                    "           <li><h6>备注</h6></li>\n" +
                    "           <li><h6>"+v[5]+"</h6></li>\n" +
                    "          </ul>\n" +
                    "         </div>\n" +
                    "         <div class=\"col-lg-12\">\n" +
                    "          <div class=\"table-scroll\">\n" +
                    "           <table class=\"table-list\">\n" +
                    "            <thead>\n" +
                    "             <tr>\n" +
                    "              <th scope=\"col\">编号</th>\n" +
                    "              <th scope=\"col\">商品名称</th>\n" +
                    "              <th scope=\"col\">产品单价</th>\n" +
                    "              <th scope=\"col\">商品价格</th>\n" +
                    "             </tr>\n" +
                    "            </thead>\n" +
                    "            <tbody>\n"
                var j = 1
                for (let i = 0; i < items.length; i += 3) {
                    if (i + 2 >= items.length) {
    break;
  }
                    str1 +="             <tr>\n" +
                    "              <td class=\"table-serial\"><h6>"+j+"</h6></td>\n" +
                    "              <td class=\"table-name\"><a href=\"/product-details?pname=" + items[i]?.trim() + "\"><h6>"+items[i]?.trim()+"</h6></a></td>\n" +
                    "              <td class=\"table-price\"><h6>"+parseFloat(items[i + 1]?.trim() ?? '0')+"</h6></td>\n" +
                    "              <td class=\"table-quantity\"><h6>"+parseFloat(items[i + 2]?.trim() ?? '0')+"</h6></td>\n" +
                    "             </tr>\n"
                    j+=1
                }

                    str1 +="            </tbody>\n" +
                    "           </table>\n" +
                    "          </div>\n" +
                    "         </div>\n" +
                    "        </div>\n" +
                    "       </div>\n" +
                    "      </div>";

            });
            $('.order1').html(str1);
            executeAfterFunction()
}
        },
        error: function(xhr, status, error) {
            // 处理错误情况
            console.error("An error occurred: " + status + ", error: " + error);
        }
    });
}
orderlist();
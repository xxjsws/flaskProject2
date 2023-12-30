var warnAlert = $('<div>').addClass('alert alert-warning')
  .append($('<strong>').text('尚未登录用户请登陆后再查看购物车吧'));
warnAlert.css({
  'position': 'fixed',
  'top': '0',
  'left': '10%',
  'right': '10%',
  'z-index': '9999'
});
function car_list() {
  const usernameElement = document.getElementById('username');
  if (usernameElement) {
    $(".header-cart, .cart-btn").on("click", (function () {
      $("body").css("overflow", "hidden")
      $(".cart-part").addClass("active")
      $(".cart-close").on("click", (function () {
        $("body").css("overflow", "inherit")
        $(".cart-part").removeClass("active")
      }))
    }))
    $('input[name="quantity"]').on('input', function () {
      // 获取当前输入框的值
      var quantity = parseInt($(this).val());
      console.log(quantity)
      // 检查值是否小于等于0
      if (quantity <= 0) {
        // 如果小于等于0，则将其父盒子的display属性设置为none
        $(this).closest('.product-action').css('display', 'none');
      }
    })
    $(".product-add").on("click", (function () {
      var i = $(this).next(".product-action");
      if (i.css("display") === "flex") {
        // 当 display 属性为 flex 时执行的逻辑
        i.css("display", "none")
        var input = i.find("input.action-input");
        var value = input.val();
        var dataName = input.data("name");
        $.ajax({
          url: 'add_cart',
          type: 'POST',
          data: { pname: dataName, value: value },
          success: function (response) {
            if (response === "ok"){
              show_cart()
            }else{
              alert("购物车已满！请在删除或下单后继续添加！")
              show_cart()
            }
            
          }
        })
      } else {
        i.css("display", "flex")
        i.find("input.action-input").val(1);
      }

    }))



  } else {
    $(".header-cart, .cart-btn").on("click", (function () {
      $('body').prepend(warnAlert);
      setTimeout(function () {
        warnAlert.alert('close');
      }, 1500);
    }))
  }
}
function show_cart() {
  const usernameElement = document.getElementById('username');
  if (usernameElement) {
    if (window.location.pathname.includes('/checkout')) {
      // 当前页面是 checkout 页面或包含 /checkout 的路径

      $.ajax({
        url: 'cart_list',
        type: 'GET',
        success: function (response) {

          if (response === "0") {
            $('tbody').html("<tr>\n" +
              "              <td colspan=\"6\">购物车空空如也</td>\n" +
              "          </tr>")
              $('.header-cart sup,.cart-btn sup').html("0")
          $('ul li span:eq(1),ul li span:eq(3),ul li span:last,.checkout-price').html("￥00.00")
          $('.header-cart span').html("00.00")
          $('.cart-total span').html("全部商品（0）")
          } else {
            var str1 = "";
            var total = 0; // 初始化总和变量

            $.each(response, function (i, v) {
              var productTotal = v.product_number * v.suggested_price; // 计算每个商品的乘积结果
              total += productTotal; // 累加到总和变量
              // 其他操作...

              str1 += "<tr>\n" +
                "            <td class=\"table-image\"><img src=" + v.product_image + " alt=" + v.product_name + " /></td>\n" +
                "            <td class=\"table-name\"><h6>" + v.product_name + "</h6></td>\n" +
                "            <td class=\"table-price\"><h6>" + v.suggested_price + "</h6></td>\n" +
                "            <td class=\"table-quantity\"><h6>" + v.product_number + "</h6></td>\n" +
                "            <td class=\"table-total\"><h6>" + productTotal + "</h6></td>\n" +
                "            <td class=\"table-action\"><a class=\"view\"  title=\"Quick View\" href=\"/product-details?pname=" + v.product_name + "\"><i class=\"icofont-eye-alt\"></i></a><a class=\"trash\"  title=\"Remove Wishlist\"><i class=\"icofont-trash\"></i></a></td>\n" +
                "           </tr>";
            });
            $('tbody').html(str1)
            calTotal(total)
            $(".trash").on("click", function (e) {
              e.preventDefault(); // 阻止默认链接行为

              var productName = $(this).closest("tr").find(".table-name h6").text();


              // 发起 AJAX 请求，将商品名称传递给服务器
              $.ajax({
                url: "delete_cart",
                method: "POST",
                data: { pname: productName },
                success: function (response) {
                  show_cart()
                  calTotal(total)
                  calculateTotal()
                },
                error: function (xhr, status, error) {
                  // 处理错误
                  console.log(error);
                }
              });
            });
            var submitBtn = document.querySelector('.btn-inline');

            // 添加点击事件监听器
            submitBtn.addEventListener('click', function () {
              $.ajax({
                url: "post_e",
                method: "POST",
                data: {
                  h6Content: $('.profile-card.contact.no.active h6').text()
                },
                success: function (response) {
                  show_cart();
                }
              });
            })
            $(".profile-card.contact").on("click", (function () {
              if ($(this).hasClass("no")) {
                $('ul li span:eq(3)').html("￥00.00")
                calTotal(total)
              } else {
                $('ul li span:eq(3)').html("￥10.00")
                calTotal(total)
              }
            }))
          }
        }
      })
    }
    $.ajax({
      url: 'cart_list',
      type: 'GET',
      success: function (response) {
        if (response === "0") {
          $('.cart-list').html("购物车空空如也")
          $('.header-cart sup,.cart-btn sup').html("0")
          $('.header-cart span').html("00.00")
          $('.cart-total span').html("全部商品（0）")
          bdsj();
        } else {
          var length = response.length;
          if (length > 9) {
            length = "9+"
          }
          if (response === "0") {
            length = "0"
          }
          $('.cart-total span').html("全部商品（" + length + "）")
          $('.header-cart sup,.cart-btn sup').html(length)
          var str = "";
          $.each(response, function (i, v) {
            str += "<li class=\"cart-item\">\n" +
              "      <div class=\"cart-media\">\n" +
              "       <a href=\"/product-details?pname=" + v.product_name + "\"><img src=" + v.product_image + " alt=" + v.product_name + " /></a>\n" +
              "       <button class=\"cart-delete\"><i class=\"icofont-bin\"></i></button>\n" +
              "      </div>\n" +
              "      <div class=\"cart-info-group\">\n" +
              "       <div class=\"cart-info\">\n" +
              "        <h6><a href=\"/product-details?pname=" + v.product_name + "\">" + v.product_name + "</a></h6>\n" +
              "        <p>单价 - ￥" + v.suggested_price + "</p>\n" +
              "       </div>\n" +
              "       <div class=\"cart-action-group\">\n" +
              "        <div class=\"product-action\">\n" +
              "         <button class=\"action-minus\" title=\"Quantity Minus\"><i class=\"icofont-minus\"></i></button>\n" +
              "         <input class=\"action-input\" title=\"Quantity Number\" type=\"text\" name=\"quantity\" value=" + v.product_number + " />\n" +
              "         <button class=\"action-plus\" title=\"Quantity Plus\"><i class=\"icofont-plus\"></i></button>\n" +
              "        </div>\n" +
              "        <h7>￥" + v.product_number * v.suggested_price + "</h7>\n" +
              "       </div>\n" +
              "      </div></li>"
          });
          $(document).on('change', '.action-input', function () {
            var quantity = $(this).val(); // 获取输入框的值
            var suggestedPrice = $(this).closest('.cart-info-group').find('p').text(); // 获取单价
            suggestedPrice = suggestedPrice.replace('单价 - ￥', ''); // 去除前缀，得到纯数字
            var totalPrice = parseFloat(quantity) * parseFloat(suggestedPrice); // 计算总价
            $(this).closest('.cart-info-group').find('h7').text('￥' + totalPrice); // 更新 h6 标签里的数值
            calculateTotal();
          });
          $('.cart-checkout-btn').on('click', function () {

            var dataArr = [];
            // 遍历所有.cart-item
            $(".cart-item").each(function () {
              // 获取<h6>内容和<input>的值
              var itemName = $(this).find("h6 a").text();
              var itemValue = $(this).find(".action-input").val();

              // 将<h6>内容和<input>的值作为数组元素存储
              dataArr.push(itemName);
              dataArr.push(itemValue);
            });

            console.log(dataArr)
            $.ajax({
              url: 'cart_list',
              type: 'POST',
              data: JSON.stringify({ pname: dataArr }),
              contentType: 'application/json',
              success: function (response) {

              }
            })
          })
          $(document).on('click', '.action-plus', function () {
            var inputElement = $(this).siblings('.action-input'); // 获取当前按钮相邻的输入框元素
            inputElement.change(); // 触发 change 事件
          });


          $(".cart-list").html(str);
          calculateTotal();
          bdsj();
          document.querySelectorAll(".cart-delete").forEach(function (button) {
            button.addEventListener("click", function () {
              // 获取对应的.product-name
              var productName = this.parentNode.querySelector("a").getAttribute("href");
              var index = productName.indexOf('='); // 找到等号的位置
              if (index !== -1) {
                var extractedName = productName.substring(index + 1); // 提取等号后面的部分
                console.log(extractedName);
                $.ajax({
                  url: 'delete_cart',
                  type: 'POST',
                  data: { pname: extractedName },
                  success: function (response) {
                    if (response === "ok") {
                      // 如果 response 为 "ok"，则重新调用 show_cart() 函数
                      show_cart();
                      calTotal(total)
                  calculateTotal()
                    }
                  }
                })
              }
            });
          });
        }
      }
    })

  }else{
    bdsj();
  }

}

function calTotal(total) {
  var secondSpan = $('ul li span:eq(1)');
  var fourthSpan = $('ul li span:eq(3)');
  var priceText = fourthSpan.text();
  var priceRegex = /￥(\d+(\.\d{2})?)/;
  var match = priceRegex.exec(priceText);
  var price = match[1];

  secondSpan.html("￥" + total.toFixed(2));

  var totalPrice = parseFloat(total) + parseFloat(price);
  $('ul li span:last').html("￥" + totalPrice.toFixed(2));
}

function calculateTotal() {
  var total = 0;
  var h7Elements = document.getElementsByTagName("h7");

  for (var i = 0; i < h7Elements.length; i++) {
    var value = parseInt(h7Elements[i].textContent.replace("￥", ""));
    total += value;
  }
  $(".checkout-price").html("￥" + total);
  $('.header-cart span').html("￥" +total)

}
$(document).ready(function () {
  show_cart();
  car_list();
});

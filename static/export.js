var qusAlert = $('<div>').addClass('alert alert-warning')
    .append($('<strong>').text('没有那么多库存!'));
qusAlert.css({
    'position': 'fixed',
    'top': '0',
    'left': '10%',
    'right': '10%',
    'z-index': '9999'
});
// 获取当前页面的 URL
var url = new URL(window.location.href);
// 创建 URLSearchParams 对象
var params = new URLSearchParams(url.search);
// 获取 pname 参数的值
var eid = params.get('eid');
$(document).ready(function() {
    if (eid){
        var cname = params.get('cname');
        var ename = params.get('ename');

        var details = params.get('details');
        var remark = params.get('remark');
        var detailsArray = details.split(', ');
        if (ename !== undefined&&ename !== null && ename !== '') {
            $('#ename').val(ename)
          } 
        $('#cname').val(cname)
        $('#remarks').val(remark)
        $('tbody tr').each(function(index) {
    var inputs = $(this).find('input');
    // 给第1，3，4个input赋值
    $(inputs[0]).val(detailsArray[index * 3]);
    if (detailsArray[index * 3]){
        $.ajax({
            url: 'product_list',
            type: 'POST',
            data: { pname: detailsArray[index * 3] },
            success: function(response) {
                if (response.length === 1 ){
                    $.each(response, function(i, v) {
                        $(inputs[1]).val(v[6]);
                    })
                }
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
        $(inputs[2]).val(detailsArray[index * 3 + 1]);
        $(inputs[3]).val(detailsArray[index * 3 + 2]);
        $(inputs[4]).val(detailsArray[index * 3 + 2]*detailsArray[index * 3 + 1]);
    }
    calculateTotal1()
});
    }
});


$('.p-name').on('keyup dblclick', function(event) {
    if (event.key === 'Enter'|| event.type === 'dblclick') {
    var pd_name = this
        $.ajax({
            url: 'product_list',
            type: 'POST',
            data: { pname: $(this).val() },
            success: function(response) {
                if (response.length === 0 ){

                } else {
                    $('#choose_p').modal('show');
                    var str = "<thead><tr><th>产品名</th><th>建议零售价</th><th>产品数量</th>" +
                        "<th>产品成本</th></tr></thead><tbody>";
                     $.each(response, function(i, v) {
                        str += "<tr>"; // str拼接出一个表格
                        str += "<td>" + v[0] + "</td>";
                        str += "<td>" + v[2] + "</td>";
                        str += "<td>" + v[6] + "</td>";
                        str += "<td>" + v[7] + "</td>";
                        str += "</tr>";
                     })
                    str += "</tbody>";
                    if ($('#ptable').hasClass('bootstrap-table')) {
                        $('#ptable').bootstrapTable('destroy');
                    }

                    // 然后重新初始化表格实例
                    $('#ptable').html(str).bootstrapTable();
                }
                $('#ptable tr').click(function() {
                // 获取第一个<td>的内容
                var pname = $(this).find('td:first').text();
                var price = $(this).find('td').eq(1).text();
                var repertory = $(this).find('td').eq(2).text();
                $(pd_name).val(pname);
                $(pd_name).closest('tr').find('input:not(.p-name)').eq(2).val(price);
                $(pd_name).closest('tr').find('input:not(.p-name)').eq(1).val(1);
                $(pd_name).closest('tr').find('input:not(.p-name)').eq(0).val(repertory);
                $(pd_name).closest('tr').find('input:not(.p-name)').eq(3).val(price);
                calculateTotal1();
                $('#choose_p').modal('hide');
              });

            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    }
});
$(document).ready(function() {
  $('input').keydown(function(event) {
    // 检查是否按下回车键
    if (event.keyCode === 13) {
      // 阻止表单提交
      event.preventDefault();
    }
  });
});

$('#cname').on('keyup dblclick', function(event) {
    if (event.key === 'Enter'|| event.type === 'dblclick') {
    var pd_name = this
        $.ajax({
            url: 'user_list',
            type: 'POST',
            data: { pname: $(this).val() },
            success: function(response) {
                if (response.length === 0 ){
                } else {
                    $('#choose_p').modal('show');
                    var str = "<thead><tr><th>客户名</th></tr></thead><tbody>";
                     $.each(response, function(i, v) {
                        str += "<tr>"; // str拼接出一个表格
                        str += "<td>" + v[1] + "</td>";
                        str += "</tr>";
                     })
                    str += "</tbody>";
                    if ($('#ptable').hasClass('bootstrap-table')) {
                        $('#ptable').bootstrapTable('destroy');
                    }

                    // 然后重新初始化表格实例
                    $('#ptable').html(str).bootstrapTable();
                }
                $('#ptable tr').click(function() {
                // 获取第一个<td>的内容
                var pname = $(this).find('td:first').text();
                $(pd_name).val(pname);
                $('#choose_p').modal('hide');
              });

            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    }
});
// 监听每个 tr 中的第三个和第四个输入框的 change 事件
$('tr').each(function() {
  var $secondInput = $(this).find('input.form-control:eq(1)');
  var $thirdInput = $(this).find('input.form-control:eq(2)');
  var $fourthInput = $(this).find('input.form-control:eq(3)');
  var $fifthInput = $(this).find('input.form-control:eq(4)');
  $thirdInput.add($fourthInput).on('change', function() {
      var secondValue = parseInt($secondInput.val().trim()) || 0;
    var thirdValue = parseInt($thirdInput.val().trim()) || 0;
    var fourthValue = parseFloat($fourthInput.val().trim()) || 0;
    var sum = thirdValue * fourthValue;
    $fifthInput.val(sum);
    calculateTotal1();
    if (thirdValue > secondValue){
        $('body').prepend(qusAlert);
                setTimeout(function () {
                    qusAlert.alert('close');
                }, 2000);
    }
  });
  $fifthInput.on('change', function() {
    var thirdValue = parseInt($thirdInput.val().trim()) || 0;
    var fifthValue = parseFloat($fifthInput.val().trim()) || 0;
    var sum;
    if (thirdValue === 0){
        sum = 0
    } else {
        sum =  fifthValue/thirdValue;
    }
    $fourthInput.val(sum);
  });
});
function calculateTotal1() {
    var total = 0;
    $('tbody tr').each(function() {
        var pname = $(this).find('.p-name').val();
        if (pname) {
            var price = parseFloat($(this).find('input[type=text]').last().val());
            if (!isNaN(price)) {
                total += price;
            }
        }
    });
    $('.price p').text(total);
}
function eList() {
    var url = window.location.href;
    var params = {};
    url.slice(url.indexOf("?") + 1).split("&").forEach(function (param) {
        var keyValue = param.split("=");
        var key = decodeURIComponent(keyValue[0]);
        params[key] = decodeURIComponent(keyValue[1]);
    });
    var search = params["search"];
    if (search !== null && search !== undefined && search !== '') {
        $.ajax({
            url: '/export_list', // 请求的URL
            type: 'POST', // 请求类型
            data: { pname: search },
            dataType: 'json', // 预期服务器返回的数据类型
            success: function(res) { // 请求成功后的回调函数
                var str = "<thead><tr><th>订单号</th><th>客户名</th><th>是否审单</th><th>操作员工</th>"+
                            "<th>备注</th><th>操作</th></tr></thead><tbody>";
                $.each(res, function(i, v) {
                    str += "<tr>"; // str拼接出一个表格
                    str += "<td>" + v[0] + "</td>";
                    str += "<td>" + v[1] + "</td>";
                    const type = parseFloat(v[4]) > 0 ? '已审单' : '未审单';
                    str += "<td>" + type + "</td>";
    
                    if (v[2]===null){
                        v[2] = ""
                    }
                    str += "<td>" + v[2] + "</td>";
                    str += "<td>" + v[5] + "</td>";
                    str += '<td> ' +
                '<a class="edit-btn btn btn-success btn-xs" href="/export_details?eid='+v[0]+'&cname='+v[1]+'' +
                        '&ename='+v[2]+'&details='+v[3]+'&remark='+v[5]+'&sh='+v[4]+'">详情</a></td>';
                    str += "</tr>";
                });
                str += "</tbody>";
                $('#export-list').html(str);
            },
            error: function(xhr, status, error) {
                // 处理错误情况
                console.error("An error occurred: " + status + ", error: " + error);
            }
        });
    }else{
        $.ajax({
            url: '/export_list', // 请求的URL
            type: 'GET', // 请求类型
            dataType: 'json', // 预期服务器返回的数据类型
            success: function(res) { // 请求成功后的回调函数
                var str = "<thead><tr><th>订单号</th><th>客户名</th><th>是否审单</th><th>操作员工</th>"+
                            "<th>备注</th><th>操作</th></tr></thead><tbody>";
                $.each(res, function(i, v) {
                    str += "<tr>"; // str拼接出一个表格
                    str += "<td>" + v[0] + "</td>";
                    str += "<td>" + v[1] + "</td>";
                    const type = parseFloat(v[4]) > 0 ? '已审单' : '未审单';
                    str += "<td>" + type + "</td>";
    
                    if (v[2]===null){
                        v[2] = ""
                    }
                    str += "<td>" + v[2] + "</td>";
                    str += "<td>" + v[5] + "</td>";
                    str += '<td> ' +
                '<a class="edit-btn btn btn-success btn-xs" href="/export_details?eid='+v[0]+'&cname='+v[1]+'' +
                        '&ename='+v[2]+'&details='+v[3]+'&remark='+v[5]+'&sh='+v[4]+'">详情</a></td>';
                    str += "</tr>";
                });
                str += "</tbody>";
                $('#export-list').html(str);
            },
            error: function(xhr, status, error) {
                // 处理错误情况
                console.error("An error occurred: " + status + ", error: " + error);
            }
        });
    }
}
eList();
const searchBtn = document.querySelector('#search-btn');
const searchInput = document.querySelector('#search-input');
searchBtn.addEventListener('click', function(event) {
  event.preventDefault(); // 阻止表单提交默认行为
  const searchValue = searchInput.value.trim();
  // 跳转到目标页面
  window.location.href = `/goods_export?search=${encodeURIComponent(searchValue)}`;
});
const form = document.querySelector('#export-d');
const submitBtn = document.querySelector('#submit-add');

if (form && submitBtn) {
submitBtn.addEventListener('click', function(event) {
  // 阻止默认的表单提交行为
  event.preventDefault();
  // 阻止表单默认的提交行为
  event.preventDefault();

  var tableRows = document.querySelectorAll("#export-d tbody tr");

  var isValid = true;
  var failedRows = [];

  // 遍历每个tr中的输入框进行验证
  tableRows.forEach(function(row) {
    var inputFields = row.querySelectorAll("input");
    // 获取第一个、第二个和第三个输入框的值
    var name = inputFields[0].value;
    var num2 = parseInt(inputFields[1].value);
    var num3 = parseInt(inputFields[2].value);
    // 进行比较
    if (num3 > num2) {
      isValid = false;
      // 如果有任何一行不满足条件，则设置isValid为false，并将当前行的第一个输入框的值存入failedRows数组中
      failedRows.push(name);
      return;
    }
  });
  // 最后根据isValid的值来决定是否提交表单
  if (isValid) {
    document.getElementById('export-d').submit();
  } else {
    // 如果验证失败，则输出所有验证失败的行的第一个输入框的值
    alert(failedRows+' 没那么多货！');
  }
})}

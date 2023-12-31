$(document).ready(function () {
    $('#add-import').on('shown.bs.modal', function () {
        $('.select2').select2({
            
            dropdownParent: $('#add-import'),
            
        });
        $.ajax({
        url: '/product_list', // 请求的URL
        type: 'GET', // 请求类型
        dataType: 'json', // 预期服务器返回的数据类型
        success: function(res) {
            var str = ""
            $.each(res, function(i, v) {
                str += "<option value='"+v[0]+"'>"+v[0]+"</option>";
            })
            $('#pname1').html(str);
           },
        error: function(xhr, status, error) {
            // 处理错误情况
            console.error("An error occurred: " + status + ", error: " + error);
        }
    });
    });
});
function importList() {
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
            url: '/import_list', // 请求的URL
            type: 'POST', // 请求类型
            data: { pname: search },
            dataType: 'json', // 预期服务器返回的数据类型
            success: function(res) { // 请求成功后的回调函数
                if (res.length == 0){

                }else{
                var str = "<thead><tr><th>产品名</th><th>产品数量</th><th>产品单价</th>" +
                            "<th>是否到货</th><th>操作</th></tr></thead><tbody>";
                $.each(res, function(i, v) {
                    str += "<tr>"; // str拼接出一个表格
                    str += "<td>" + v[1] + "</td>";
                    str += "<td>" + v[2] + "</td>";
                    str += "<td>" + v[3] + "</td>";
                    const type = parseFloat(v[4]) > 0 ? '已到货' : '未到货';
                    str += "<td>" + type + "</td>";
                    str += '<td> '
                    if (v[4] === 0){
                        str +=  '<button data-iid="' + v[0] + '" data-pname="' + v[1] + '"'+
                            ' class="off-btn btn btn-warning btn-xs">到货</button>'
                        str +='<button data-iid="' + v[0] + '" data-pname="' + v[1] + '"'+
                ' data-number="' + v[2] + '" data-price="' + v[3] + '"'+
                ' class="edit-btn btn btn-success btn-xs" data-bs-toggle="modal" ' +
                'data-bs-target="#edit-import">修改</button></td>';
                    } else {
    
                        str +='<button data-iid="' + v[0] + '" data-pname="' + v[1] + '"'+
                ' data-number="' + v[2] + '" data-price="' + v[3] + '"'+
                ' class="edit-btn btn btn-success btn-xs" data-bs-toggle="modal" ' +
                'data-bs-target="#edit-import" disabled>修改</button></td>';
                    }
    
                    str += "</tr>";
                });
                str += "</tbody>";
                $('#import-list').html(str);
            }},
            error: function(xhr, status, error) {
                // 处理错误情况
                console.error("An error occurred: " + status + ", error: " + error);
            }
        });
    }else{
        $.ajax({
            url: '/import_list', // 请求的URL
            type: 'GET', // 请求类型
            dataType: 'json', // 预期服务器返回的数据类型
            success: function(res) { // 请求成功后的回调函数
                if (res.length == 0){

                }else{
                var str = "<thead><tr><th>产品名</th><th>产品数量</th><th>产品单价</th>" +
                            "<th>是否到货</th><th>操作</th></tr></thead><tbody>";
                $.each(res, function(i, v) {
                    str += "<tr>"; // str拼接出一个表格
                    str += "<td>" + v[1] + "</td>";
                    str += "<td>" + v[2] + "</td>";
                    str += "<td>" + v[3] + "</td>";
                    const type = parseFloat(v[4]) > 0 ? '已到货' : '未到货';
                    str += "<td>" + type + "</td>";
                    str += '<td> '
                    if (v[4] === 0){
                        str +=  '<button data-iid="' + v[0] + '" data-pname="' + v[1] + '"'+
                            ' class="off-btn btn btn-warning btn-xs">到货</button>'
                        str +='<button data-iid="' + v[0] + '" data-pname="' + v[1] + '"'+
                ' data-number="' + v[2] + '" data-price="' + v[3] + '"'+
                ' class="edit-btn btn btn-success btn-xs" data-bs-toggle="modal" ' +
                'data-bs-target="#edit-import">修改</button></td>';
                    } else {
    
                        str +='<button data-iid="' + v[0] + '" data-pname="' + v[1] + '"'+
                ' data-number="' + v[2] + '" data-price="' + v[3] + '"'+
                ' class="edit-btn btn btn-success btn-xs" data-bs-toggle="modal" ' +
                'data-bs-target="#edit-import" disabled>修改</button></td>';
                    }
    
                    str += "</tr>";
                });
                str += "</tbody>";
                $('#import-list').html(str);
            }},
            error: function(xhr, status, error) {
                // 处理错误情况
                console.error("An error occurred: " + status + ", error: " + error);
            }
        });
    }
}
importList();
const searchBtn = document.querySelector('#search-btn');
const searchInput = document.querySelector('#search-input');
searchBtn.addEventListener('click', function(event) {
  event.preventDefault(); // 阻止表单提交默认行为
  const searchValue = searchInput.value.trim();
  // 跳转到目标页面
  window.location.href = `/goods_import?search=${encodeURIComponent(searchValue)}`;
});
$(document).on('click', '.edit-btn', function () {
    let iid = $(this).attr('data-iid');
    let pname = $(this).attr('data-pname');
    let number = $(this).attr('data-number');
    let price = $(this).attr('data-price');
    $('#iid').val(iid);
    $('#pname').val(pname);
    $('#pnumber').val(number);
    $('#pcost').val(price);
});
$(document).on('click', '.off-btn', function () {
        var iid = $(this).data('iid');
        var pname = $(this).data('pname');
        // 发送 POST 请求
        $.ajax({
            url: 'arrival',
            type: 'POST',
            data: { iid: iid ,pname: pname},
            success: function() {
                importList();
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    });
$(document).on('click', '.delete-btn', function () {
        var iid = $(this).data('iid');
        var pname = $(this).data('pname');
        // 发送 POST 请求
        $.ajax({
            url: 'delete_import',
            type: 'POST',
            data: { iid: iid ,pname: pname },
            success: function() {
                importList();
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    });
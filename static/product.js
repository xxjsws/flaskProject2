function pList() {
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
            url: '/product_list', // 请求的URL
            type: 'POST', // 请求类型
            data: { pname: search },
            dataType: 'json', // 预期服务器返回的数据类型
            success: function(res) { // 请求成功后的回调函数
                var str = "<thead><tr><th>产品名</th><th>标签</th><th>建议零售价</th><th>描述</th>" +
                            "<th>图片</th><th>库存</th><th>成本单价</th><th>操作</th></tr></thead><tbody>";
                $.each(res, function(i, v) {
                    str += "<tr>"; // str拼接出一个表格
                    if (v[5] === 1) {
                        str += "<td>(已下架)" + v[0] + "</td>";
                    } else {
                        str += "<td>" + v[0] + "</td>";
                    }
                    str += "<td>" + v[1] + "</td>";
                    str += "<td>" + v[2] + "</td>";
                    str += "<td>" + v[3] + "</td>";
                    str += "<td class='img-container'><img src='"+ v[4]+ "'  alt="+v[0]+"></td>";
                    str += "<td>" + v[6] + "</td>";
                    str += "<td>" + v[7] + "</td>";
                    const type = parseFloat(v[5]) > 0 ? '上架' : '下架';
                    str += '<td> <button data-pname="' + v[0] + '" class="off-btn btn btn-warning btn-xs">' +
                type+'</button>' +
                '<button data-pname="' + v[0] + '" data-tag="' + v[1] + '" data-suggest="' + v[2] + '"' +
                ' data-describe="' + v[3] + '" data-src="' + v[4] + '"'+
                ' class="edit-btn btn btn-success btn-xs" data-bs-toggle="modal" ' +
                'data-bs-target="#edit-product">修改</button></td>';
                    str += "</tr>";
                });
                str += "</tbody>";
                $('#product-list').html(str);
            },
            error: function(xhr, status, error) {
                // 处理错误情况
                console.error("An error occurred: " + status + ", error: " + error);
            }
        });
    }else{
        $.ajax({
            url: '/product_list', // 请求的URL
            type: 'GET', // 请求类型
            dataType: 'json', // 预期服务器返回的数据类型
            success: function(res) { // 请求成功后的回调函数
                var str = "<thead><tr><th>产品名</th><th>标签</th><th>建议零售价</th><th>描述</th>" +
                            "<th>图片</th><th>库存</th><th>成本单价</th><th>操作</th></tr></thead><tbody>";
                $.each(res, function(i, v) {
                    str += "<tr>"; // str拼接出一个表格
                    if (v[5] === 1) {
                        str += "<td>(已下架)" + v[0] + "</td>";
                    } else {
                        str += "<td>" + v[0] + "</td>";
                    }
                    str += "<td>" + v[1] + "</td>";
                    str += "<td>" + v[2] + "</td>";
                    str += "<td>" + v[3] + "</td>";
                    str += "<td class='img-container'><img src='"+ v[4]+ "'  alt="+v[0]+"></td>";
                    str += "<td>" + v[6] + "</td>";
                    str += "<td>" + v[7] + "</td>";
                    const type = parseFloat(v[5]) > 0 ? '上架' : '下架';
                    str += '<td> <button data-pname="' + v[0] + '" class="off-btn btn btn-warning btn-xs">' +
                type+'</button>' +
                '<button data-pname="' + v[0] + '" data-tag="' + v[1] + '" data-suggest="' + v[2] + '"' +
                ' data-describe="' + v[3] + '" data-src="' + v[4] + '"'+
                ' class="edit-btn btn btn-success btn-xs" data-bs-toggle="modal" ' +
                'data-bs-target="#edit-product">修改</button></td>';
                    str += "</tr>";
                });
                str += "</tbody>";
                $('#product-list').html(str);
            },
            error: function(xhr, status, error) {
                // 处理错误情况
                console.error("An error occurred: " + status + ", error: " + error);
            }
        });
    }
    
}
pList();
const searchBtn = document.querySelector('#search-btn');
const searchInput = document.querySelector('#search-input');
searchBtn.addEventListener('click', function(event) {
  event.preventDefault(); // 阻止表单提交默认行为
  const searchValue = searchInput.value.trim();
  // 跳转到目标页面
  window.location.href = `/editproduct?search=${encodeURIComponent(searchValue)}`;
});
$(document).on('click', '.edit-btn', function () {
    let pname = $(this).attr('data-pname');
    let tag = $(this).attr('data-tag');
    let suggest = $(this).attr('data-suggest');
    let describe = $(this).attr('data-describe');
    let src = $(this).attr('data-src');
    console.log(src)
    $('#productname').val(pname);
    $('#tag').val(tag);
    $('#suggest').val(suggest);
    $('#describe').val(describe);
    if (src.startsWith("static/uploads/")) {
        document.getElementById('uploadOption').checked = true;
        var event = new Event('change');
        document.getElementById('uploadOption').dispatchEvent(event);
        $('#imageInput').val(src);
    } else {
        document.getElementById('linkOption').checked = true;
        event = new Event('change');
        document.getElementById('linkOption').dispatchEvent(event);
        $('#imageLink').val(src);
    }

});
document.querySelectorAll('input[type=radio][name=imageType]').forEach(function(radio) {
        var selectedValue = document.querySelector('input[type=radio][name=imageType]:checked').value;
        if (selectedValue === 'upload') {
                var elements = document.getElementsByClassName('linkSection');
                for (var i = 0; i < elements.length; i++) {
                    elements[i].style.display = 'none';
                }
            }
        radio.addEventListener('change', function() {
            if (this.value === 'upload') {
                elements = document.getElementsByClassName('uploadSection');
                for (i = 0; i < elements.length; i++) {
                    elements[i].style.display = 'block';
                }
                elements = document.getElementsByClassName('linkSection');
                for (i = 0; i < elements.length; i++) {
                    elements[i].style.display = 'none';
                }
                document.getElementById('imageLink').value = '';
            } else if (this.value === 'link') {
                elements = document.getElementsByClassName('uploadSection');
                for (i = 0; i < elements.length; i++) {
                    elements[i].style.display = 'none';
                }
                elements = document.getElementsByClassName('linkSection');
                for (i = 0; i < elements.length; i++) {
                    elements[i].style.display = 'block';
                }
                document.getElementById('imageInput').value = '';
            }
        });
    });
$(document).on('click', '.off-btn', function () {
        var pname = $(this).data('pname');
        // 发送 POST 请求
        $.ajax({
            url: 'off_product',
            type: 'POST',
            data: { pname: pname },
            success: function(response) {
                console.log(response);
                pList();
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    });
$(document).on('click', '.delete-btn', function () {
        var pname = $(this).data('pname');
        // 发送 POST 请求
        $.ajax({
            url: 'delete_product',
            type: 'POST',
            data: { pname: pname },
            success: function(response) {
                console.log(response);
                pList();
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    });
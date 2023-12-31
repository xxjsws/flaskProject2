function UserList() {
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
        url: '/user_list', // 请求的URL
        type: 'POST', // 请求类型
        data: { pname: search },
        dataType: 'json', // 预期服务器返回的数据类型
        success: function(res) { // 请求成功后的回调函数
            if (res.length == 0){

            }else{
            var str = "<thead><tr><td>用户名</td><td>权限</td>" +
                "<td>操作</td></tr></thead><tbody>";
            $.each(res, function(i, v) {
                str += "<tr>"; // str拼接出一个表格
                str += "<td><a href=\"/logs?uname=" + v[0] + "\">" + v[1] + "</a></td>";
                str += "<td>" + v[2] + "</td>";
                str += '<td>' +
            '<button data-username="' + v[1] + '" data-authority="' + v[2] + '"  ' +
            'class="edit-btn btn btn-success btn-xs">修改</button></td>';
                str += "</tr>";
            });
            str += "</tbody>";
            $('#user-list').html(str);
        }},
        error: function(xhr, status, error) {
            // 处理错误情况
            console.error("An error occurred: " + status + ", error: " + error);
        }
    });
    }else{
        $.ajax({
        url: '/user_list', // 请求的URL
        type: 'GET', // 请求类型
        dataType: 'json', // 预期服务器返回的数据类型
        success: function(res) { // 请求成功后的回调函数
            if (res.length == 0){

            }else{
            var str = "<thead><tr><td>用户名</td><td>权限</td>" +
                "<td>操作</td></tr></thead><tbody>";
            $.each(res, function(i, v) {
                str += "<tr>"; // str拼接出一个表格
                str += "<td><a href=\"/logs?uname=" + v[0] + "\">" + v[1] + "</a></td>";
                str += "<td>" + v[2] + "</td>";
                str += '<td> ' +
            '<button data-username="' + v[1] + '" data-authority="' + v[2] + '"  ' +
            'class="edit-btn btn btn-success btn-xs">修改</button></td>';
                str += "</tr>";
            });
            str += "</tbody>";
            $('#user-list').html(str);
        }},
        error: function(xhr, status, error) {
            // 处理错误情况
            console.error("An error occurred: " + status + ", error: " + error);
        }
    });
    }

}
UserList();
 const searchBtn = document.querySelector('#search-btn');
  const searchInput = document.querySelector('#search-input');
  searchBtn.addEventListener('click', function(event) {
    event.preventDefault(); // 阻止表单提交默认行为
    const searchValue = searchInput.value.trim();
    // 跳转到目标页面
    window.location.href = `/boss?search=${encodeURIComponent(searchValue)}`;
  });
      // 5秒后隐藏flash消息
      setTimeout(function() {
        var flashMessages = document.getElementById('flash-messages');
        if (flashMessages) {
          flashMessages.style.display = 'none';
        }
      }, 5000);
    
$(document).on('click', '.edit-btn', function () {
    let username = $(this).attr('data-username');
    let authority = $(this).attr('data-authority');
    $('#username').val(username);
    $('#authority').val(authority);
    $('#edit-user').modal('show');
});

$(document).on('click', '.delete-btn', function () {
        var username = $(this).data('username');
        // 发送 POST 请求
        $.ajax({
            url: 'delete_user',
            type: 'POST',
            data: { username: username },
            success: function(response) {
                // 处理成功的响应
                console.log('操作成功');
                UserList();
            },
            error: function(xhr, status, error) {
                // 处理错误
                console.error('操作失败');
            }
        });
    });
$(document).on('click', '.add-btn', function () {
    $('#add-user').modal('show');
});
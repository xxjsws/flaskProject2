function logList() {
    var url = window.location.href;
    var params = {};
    url.slice(url.indexOf("?") + 1).split("&").forEach(function (param) {
        var keyValue = param.split("=");
        var key = decodeURIComponent(keyValue[0]);
        params[key] = decodeURIComponent(keyValue[1]);
    });
    var uname = params["uname"];
if (uname === null || uname === undefined) {
  $.ajax({
        url: '/log_list', // 请求的URL
        type: 'GET', // 请求类型
        dataType: 'json', // 预期服务器返回的数据类型
        success: function(res) { // 请求成功后的回调函数
            
            if (res.length === 0) {

        }else {
               var str = "<thead><tr><th>用户名</th><th>时间</th>"+
                        "<th>行为</th></tr></thead>";
            $.each(res, function(i, v) {
                str += "<tr>"; // str拼接出一个表格
                str += "<td>" + v[1] + "</td>";
                str += "<td>" + v[3] + "</td>";
                str += "<td>" + v[2] + "</td>";
                str += "</tr>";
            });
            str += "</tbody>";
            $('#log-list').html(str);
            }
        },
        error: function(xhr, status, error) {
            // 处理错误情况
            console.error("An error occurred: " + status + ", error: " + error);
        }
    });
} else {
  $.ajax({
        url: '/log_list', // 请求的URL
        type: 'POST', // 请求类型
        data: { username: uname },
        dataType: 'json', // 预期服务器返回的数据类型
        success: function(res) {
            if (res.length === 0) {

        }else {
               var str = "<thead><tr><th>用户名</th><th>时间</th>"+
                        "<th>行为</th></tr></thead>";
            $.each(res, function(i, v) {
                str += "<tr>"; // str拼接出一个表格
                str += "<td>" + v[1] + "</td>";
                str += "<td>" + v[3] + "</td>";
                str += "<td>" + v[2] + "</td>";
                str += "</tr>";
            });
            str += "</tbody>";
            $('#log-list').html(str);
            }


        },
        error: function(xhr, status, error) {
            // 处理错误情况
            console.error("An error occurred: " + status + ", error: " + error);
        }
    });
}

}
logList();
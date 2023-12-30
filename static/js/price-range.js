$(function() {
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 100,
        values: [30, 53.33333333],
        slide: function(event, ui) {
            var leftValue = ui.values[0]
            var rightValue = ui.values[1]
            if(leftValue>50){
                leftValue = 5000 + ((leftValue - 50) / 50) * 15000;
            } else {
                leftValue = leftValue * 100;
            }
            if(rightValue>50){
                rightValue = 5000 + ((rightValue - 50) / 50) * 15000;
            } else {
                rightValue = rightValue * 100;
            }
            
            $("#amount").val("￥" + leftValue.toFixed(2) + " - ￥" + rightValue.toFixed(2));
        }
    });
    
    var leftValue = $("#slider-range").slider("values", 0)
    var rightValue = $("#slider-range").slider("values", 1)
    if(leftValue>50){
        leftValue = 5000 + ((leftValue - 50) / 50) * 15000;
    } else {
        leftValue = leftValue * 100;
    }
    if(rightValue>50){
        rightValue = 5000 + ((rightValue - 50) / 50) * 15000;
    } else {
        rightValue = rightValue * 100;
    }
    
    $("#amount").val("￥" + leftValue.toFixed(2) + " - ￥" + rightValue.toFixed(2));
});

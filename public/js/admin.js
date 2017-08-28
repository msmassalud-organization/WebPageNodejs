$(function(){
  $('#createMemberships').click(function(){
    $.ajax({
      type: "POST",
      url: '/createMemberships',
      data: {cant: 1000},
      success: function(data){
        console.log(data);
      }
    });
  });
});

//Date format
$(function() {
  $("#date").keydown(function(e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
      // Allow: Ctrl/cmd+A
      (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: Ctrl/cmd+C
      (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: Ctrl/cmd+X
      (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }

    var length = $('#date').val().length;
    if(length > 9){
      e.preventDefault();
    }
  });

  $("#date").keyup(function(e) {
    var length = $('#date').val().length;
    if(length == 2 || length == 5){
      var text = $('#date').val();
      $('#date').val(text+'-');
    }
  });
});

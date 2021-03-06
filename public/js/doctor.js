function addPatient(id) {
  console.log("Agregando paciente");
  $.ajax({
    type: "POST",
    url: '/addPatient',
    data: {
      memberId: id
    },
    success: function(data) {
      console.log(data);
      location.reload();
    }
  });
}

function addPatientByMemberIdToken(memberId, token) {
  console.log("Agregando paciente");
  $.ajax({
    type: "POST",
    url: '/addPatientByMemberIdToken',
    data: {
      'memberId': memberId,
      'token': token
    },
    success: function(data) {
      console.log(data);
      location.reload();
    }
  });
}

/* Verificacion de membresia y token
Requiere:
  - <input id='memberIdInput'> => Se ingresa la membresía
  - <button id='btnVerMember'> => Verifica que sea valida
*/
$(function() {
  $("#btnVerMember").click(function() {
    //Obtenemos la membresia
    var memberId = $("#memberIdInput").val();
    console.log(memberId);
    $.ajax('/isMember', {
      data: {
        'memberId': memberId
      },
      statusCode: {
        200: function(data) {
          //Si encontró la membresía habilita la verificación de token
          //Muestra una palomita
          console.log("Si existe la membresía");
          $("#tokenInput").val("");
          $("#tokenPanel").show("slow");
          $("#memberIdInput").prop("disabled", true);
        },
        204: function(data) {
          //No se encontró la membresía, pone una equis
          console.log("No existe la membresía");
        }
      }
    });
  });
});
/*
- <input id='tokenInput'> => Se ingresa token del miembro
- <button id='btnVerToken'> => Verifica que el token sea válido
*/
$(function() {
  $("#btnVerToken").click(function() {
    //Obtenemos la membresia
    var token = $("#tokenInput").val();
    var memberId = $("#memberIdInput").val();
    $.ajax('/verifyToken', {
      method: "POST",
      data: {
        'memberId': memberId,
        'token': token
      },
      statusCode: {
        200: function(data) {
          //Si el token es correcto
          console.log("Token correcto");
          $("#tokenInput").val("");
          $("#tokenPanel").hide("slow");
          $("#memberIdInput").prop("disabled", false);
          addPatientByMemberIdToken(memberId, token);
        },
        204: function(data) {
          //Token incorrecto
          console.log("Token incorrecto");
        }
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
    if (length > 9) {
      e.preventDefault();
    }
  });

  $("#date").keyup(function(e) {
    var length = $('#date').val().length;
    if (length == 2 || length == 5) {
      var text = $('#date').val();
      $('#date').val(text + '-');
    }
  });
});

$(function() {
  $('#findByName').on('keyup', function(e) {
    //Si son letras
    $('#patientsList').empty();
    if (e.keyCode == 13) {
      var parameters = {
        name: $(this).val().toUpperCase()
      };
      //Buscamos a los contactos
      $.ajax('/findPatientByName', {
        data: parameters,
        statusCode: {
          200: function(data) {
            var rows = "";
            var patients = data;
            console.log(data.length);
            for (var i = 0; i < patients.length; i++) {
              rows += '<li class="list-group-item">';
              rows += '<div class="row">';
              rows += '<div class="col-sm-3">' + patients[i].fullName + '</div>';
              rows += '<div class="col-sm-3">' + patients[i].email + '</div>';
              rows += '<div class="col-sm-3">' + patients[i].cellphone + '</div>';
              rows += "</div></li>";
            }
            if (data.length > 0) {
              $('#patientsList').append(rows);
            }
          },
          204: function(data) {
            $('#patientsList').empty();
          }
        }
      });
    }
  });
});

$(function() {
  $('#btnFindByName').on('click', function(e) {
    //Si son letras
    $('#patientsList').empty();
    var parameters = {
      name: $('#findByName').val().toUpperCase()
    };
    if (parameters.name == "") return;
    //Buscamos a los contactos
    $.ajax('/getMembersByName', {
      data: parameters,
      statusCode: {
        200: function(data) {
          console.log(data);
          var rows = "";
          for (var i = 0; i < data.length; i++) {
            rows += '<li class="list-group-item">';
            rows += '<div class="row">';
            rows += '<div class="col-sm-3">' + data[i].name + '</div>';
            rows += '<div class="col-sm-3">' + data[i].dadLastName + '</div>';
            rows += '<div class="col-sm-3">' + data[i].momLastName + '</div>';

            var button = '<button class="btn btn-lg btn-primary" type="button"';
            button += 'onclick="addPatient(\'' + data[i].membership.memberId + '\')" >Agregar</button>';

            rows += '<div class="col-sm-3">' + button + '</div>';
            rows += "</div></li>";
          }
          console.log(rows);
          $('#patientsList').append(rows);
        },
        204: function(data) {
          $('#patientsList').empty();
        }
      }
    });
  });
});

function loadPatientProfile(id) {
  var email = $('#patient' + id).text();
  email = email.replace(/\s/g, '');

  var form = document.createElement('form');
  form.setAttribute('method', 'get');
  form.setAttribute('action', '/loadPatientProfile');
  form.setAttribute('id', 'hiddenForm');
  form.style.display = 'hidden';
  document.body.appendChild(form);

  var input = document.createElement("input");
  input.setAttribute("type", "hidden");
  input.setAttribute("name", "email");
  input.setAttribute("value", email);

  //append to form element that you want .
  document.getElementById("hiddenForm").appendChild(input);

  form.submit();
}

function deletePatient(id) {
  var email = $('#patient' + id).text();
  email = email.replace(/\s/g, '');

  var form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', '/deletePatient');
  form.setAttribute('id', 'hiddenForm');
  form.style.display = 'hidden';
  document.body.appendChild(form);

  var input = document.createElement("input");
  input.setAttribute("type", "hidden");
  input.setAttribute("name", "email");
  input.setAttribute("value", email);

  //append to form element that you want.
  document.getElementById("hiddenForm").appendChild(input);

  form.submit();
}

function registerEvent(){
  var start = $('#start').data('DateTimePicker').date();
  var end = $('#end').data('DateTimePicker').date();
  var title = $('#title').val();

  var form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', '/registerEvent');
  form.setAttribute('id', 'hiddenForm');
  form.style.display = 'hidden';
  document.body.appendChild(form);

  var inputStart = document.createElement("input");
  inputStart.setAttribute("type", "hidden");
  inputStart.setAttribute("name", "start");
  inputStart.setAttribute("value", start);

  var inputEnd = document.createElement("input");
  inputEnd.setAttribute("type", "hidden");
  inputEnd.setAttribute("name", "end");
  inputEnd.setAttribute("value", end);

  var inputTitle = document.createElement("input");
  inputTitle.setAttribute("type", "hidden");
  inputTitle.setAttribute("name", "title");
  inputTitle.setAttribute("value", title);

  //append to form element that you want.
  document.getElementById("hiddenForm").appendChild(inputStart);
  document.getElementById("hiddenForm").appendChild(inputEnd);
  document.getElementById("hiddenForm").appendChild(inputTitle);

  form.submit();
}

function initFullCalendar() {
  $.ajax('/getDoctorEvents', {
    success: function(data) {
      $('#fullCalendar').fullCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'listDay,agendaDay,month'
        },

        // customize the button names,
        // otherwise they'd all just say "list"
        views: {
          listDay: {
            buttonText: 'list day'
          },
          listWeek: {
            buttonText: 'list week'
          }
        },
        timezone: 'local',
        selectable: true,
        selectHelper: true,
        select: function(start, end){
          $('#eventCreation').show();
          console.log(start._d);
          $('#start').data("DateTimePicker").date(start._d).format('h:mm A');

          /*swal({
            title: 'Crea un evento',
            html: '<br><input class="form-control" placeholder="Nombre" id="input-field">'+
                  '<input class="form-control timepicker" placeholder="Time Picker Here" type="text">',
            showCancelButton: true,
            closeOnConfirm: true
          }, function(){
            var eventData;
            titulo = $('#input-field').val();
            console.log(titulo);
            console.log(start._d);
            console.log(end._d);
            $('#fullCalendar').fullCalendar('unselect');
          });*/
        },
        defaultView: 'agendaDay',
        defaultDate: Date.now(),
        navLinks: true, // can click day/week names to navigate views
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        events: data
      });
    }
  });

}

/* Verificacion de membresia y token
Requiere:
  - <input id='memberIdInput'> => Se ingresa la membresía
  - <button id='btnVerMember'> => Verifica que sea valida
*/
$(function() {
  $("#btnVerToken").click(function() {
    //Obtenemos la membresia
    var memberId = $("#memberIdInput").val();
    var token = $("#tokenInput").val();
    console.log(memberId);
    $.ajax('/verifyToken', {
      method: "POST",
      data: {
        'memberId': memberId,
        'token': token
      },
      statusCode: {
        200: function(data) {
          $("#memberPanel").show("slow");
          var activa = data.isActive?'Activa':'Inactiva';

          $("#result").html(
            'Membresía: <strong>'+activa+'</strong><br/>'+
            '<strong>Nombre:</strong>'+data.userProfile.fullName+'<br/>'+
            '<strong>Usuario:</strong>'+data.userProfile.email+'<br/>'
          );

          $("#aMR").attr("href", "/medicalRecord?email="+data.userProfile.email);
          localStorage.setItem("member",data.userProfile.email);
        },
        204: function(data) {
          //No se encontró la membresía, pone una equis
          console.log("No existe la membresía");
        }
      }
    });
  });
});

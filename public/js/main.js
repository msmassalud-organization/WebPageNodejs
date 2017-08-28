function numbersMaximo(e,id,size){
  return(e.keyCode == 8) || (soloNumeros(e) && maximo(id, size));
}
function soloNumeros(e){
  var key = window.Event ? e.which : e.keyCode;
  return ((key >= 48 && key <= 57) || (key==8))
}

function maximo(id, size) {
  var texto = document.getElementById(id).value;

  if (texto.length > size) {
    //document.getElementById(id).value = texto.substring(0,size);
    return false;
  }
  return true;
}


function toggleLabel(id) {
    console.log("Magistral");

     $('#'+id).toggle('slow');
}

function ocultar(id) {
  $('#'+id).hide('slow');
}

# MS MAS Salud Web Page using Nodejs and MongoDB

## Configurar el ambiente de trabajo

* Dirígete al [sitio][1] y descarga el instalador de Nodejs según sea tu sistema operativo.
* Abre una terminal y ejecuta el comando `node --version`. Debería mostrar la versión
  de Nodejs. De no ser así, configura el directorio `bin` ubicado en la carpeta de
  instalación de Nodejs como variable de entorno. Reinicia la terminal.
* Clona está distribución con el comando `git clone https://github.com/msmassalud/WebPageNodejsMongo.git`. Si estás usando la aplicación
  de escritorio, ve a `File > Clone repository...` y pega la liga.
* Dirígete al directorio clonado usando `cd WebPageNodejsMongo`. Si usaste la aplicación,
  usa la terminal para moverte hasta donde está el proyecto clonado. Si no especificaste
  la ubicación, debería estar en `Documents/GitHub`.
* Ejecuta el comando `npm install` para instalar las dependencias definidas en el
  archivo **package.json**.
* Ejecuta el comando `npm install -g nodemon` para instalar un demonio que actualizará
  el servidor en tiempo de ejecución cuando se realice un cambio en los archivos.
* Ejecuta el comando `npm start` para iniciar el servidor.
* Si no hay ningún error, dirígete a [http://localhost:8080/](http://localhost:8080/) para ver el index de
  la aplicación.

## Diagrama de clases del sistema

![alt text][ClassDiagram]


[1]: https://nodejs.org/en/download/
[ClassDiagram]: ./repoImages/ClassDiagram.png

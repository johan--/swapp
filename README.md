Swapp
====================

Aplicativo para a disciplina Empreendedorismo em Software, período 2015.1, Universidade Federal de Campina Grande.

Instruções:

1 - Usar Google Chrome

2 - Instalar plugin para habilitar funcionalidades do gps: https://chrome.google.com/webstore/detail/cordova-mocks/iigcccneenmnplhhfhaeahiofeeeifpn

3 - Instalar o servidor localmente: https://github.com/julioleitao/swapp-server

4 - O servidor para quando a aplicação está em produção se encontra em: http://swapp-server.herokuapp.com/api

5 - O banco de dados é provido em um servidor na nuvem da Amazon. Ele está sendo fornecido pelo https://mongolab.com/

Para alterar a notificacao para ser enviada em dispositivos, antes da build, fazer:
ionic config set dev_push false
e depois:
ionid run android

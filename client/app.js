(function() {
  'use strict';

  /*
  Vamos estruturar um pequeno app utilizando módulos.
  Nosso APP vai ser um cadastro de carros. Vamos fazê-lo por partes.
  A primeira etapa vai ser o cadastro de veículos, de deverá funcionar da
  seguinte forma:
  - No início do arquivo, deverá ter as informações da sua empresa - nome e
  telefone (já vamos ver como isso vai ser feito)
  - Ao abrir a tela, ainda não teremos carros cadastrados. Então deverá ter
  um formulário para cadastro do carro, com os seguintes campos:
    - Imagem do carro (deverá aceitar uma URL)
    - Marca / Modelo
    - Ano
    - Placa
    - Cor
    - e um botão "Cadastrar"

  Logo abaixo do formulário, deverá ter uma tabela que irá mostrar todos os
  carros cadastrados. Ao clicar no botão de cadastrar, o novo carro deverá
  aparecer no final da tabela.

  Agora você precisa dar um nome para o seu app. Imagine que ele seja uma
  empresa que vende carros. Esse nosso app será só um catálogo, por enquanto.
  Dê um nome para a empresa e um telefone fictício, preechendo essas informações
  no arquivo company.json que já está criado.

  Essas informações devem ser adicionadas no HTML via Ajax.

  Parte técnica:
  Separe o nosso módulo de DOM criado nas últimas aulas em
  um arquivo DOM.js.

  E aqui nesse arquivo, faça a lógica para cadastrar os carros, em um módulo
  que será nomeado de "app".
  */

  function app() {
    
    function getCompanyInfo() {

      const ajaxRequest = new XMLHttpRequest();
      ajaxRequest.open('GET', 'http://127.0.0.1:8080/company.json');
      ajaxRequest.send();
      
      return new Promise((resolve, reject) => {
        ajaxRequest.onreadystatechange = function() {
  
          if (ajaxRequest.readyState !== ajaxRequest.DONE)  {
            return;
          }

          if (ajaxRequest.status !== 200) {
            reject('Erro ao obter os dados da empresa');
          }

          resolve(JSON.parse(ajaxRequest.response));
        };
      });
    }

    function getCars() {
      const ajaxRequest = new XMLHttpRequest();
      ajaxRequest.open('GET', 'http://127.0.0.1:3000/car');
      ajaxRequest.send();
      
      return new Promise((resolve, reject) => {
        ajaxRequest.onreadystatechange = function() {
  
          if (ajaxRequest.readyState !== ajaxRequest.DONE)  {
            return;
          }

          if (ajaxRequest.status !== 200) {
            reject('Erro ao obter os dados dos carros');
          }

          resolve(JSON.parse(ajaxRequest.response));
        };
      });
    }

    function createRemoveColumn(carId) {
      const removeColumn = document.createElement('td');
      removeColumn.insertAdjacentHTML(
        'afterbegin', 
        `<button class="remove-button" car-id="${carId}">Remover</button>`
      );

       return removeColumn;
    }

    function convertObjectToPost(currentObject) {
      return Object.entries(currentObject).reduce((acum, entry) => {
        const [key, value] = entry;
        return acum + `${key}=${value}&`;
      }, '');
    }

    function addCar(carAttributes) {
      const ajaxRequest = new XMLHttpRequest();
      ajaxRequest.open('POST', 'http://127.0.0.1:3000/car');
      ajaxRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      ajaxRequest.send(convertObjectToPost(carAttributes));
      
      return new Promise((resolve, reject) => {
        ajaxRequest.onreadystatechange = function() {
  
          if (ajaxRequest.readyState !== ajaxRequest.DONE)  {
            return;
          }

          if (ajaxRequest.status !== 200) {
            reject('Erro ao enviar os dados do carro');
          }

          resolve(carAttributes);
        };
      });
    }

    function showCompanyInfo(company) {
      const nameElement = document.querySelector('#company h2');
      const phoneElement = document.querySelector('#company h3');

      nameElement.innerHTML = company.name;
      phoneElement.innerHTML = company.phone;
    }

    function showCarsOnTable(cars) {
      const carsTable = document.querySelector('#cars_table tbody');
      
      cars.forEach(car => {
        
        const newCarRow = document.createElement('tr'); 
        const rowId = Date.now();
        newCarRow.setAttribute('id', rowId);
        
        Object.entries(car).forEach(carAttributes => {
          
          const newCarColumn = document.createElement('td');
          const [key, value] = carAttributes;

          if (key === 'image') {
            newCarColumn.insertAdjacentHTML('afterbegin', `<img src="${value}"/>`);
          } else {
            newCarColumn.insertAdjacentHTML('afterbegin', value);
          }

          newCarRow.appendChild(newCarColumn);
        });

        const removeColumn = createRemoveColumn(rowId);
        newCarRow.appendChild(removeColumn);

        carsTable.appendChild(newCarRow);
      });
    }

    function getCarInputs() {
      const carAttributes = [...document.querySelectorAll('#car_form input')];
      return carAttributes.reduce((acumObj, elem) => ({ ...acumObj, [elem.getAttribute('car-attribute')]: elem.value }), {});
    }

    function removeCar(carId) {
      const carRow = document.getElementById(carId);
      carRow.remove();
    }

    function listenToAddcar() {

      const carForm = document.querySelector('#car_form');

      carForm.addEventListener('submit', event => {

        event.preventDefault();
        addCar(getCarInputs())
          .then(car => 
            showCarsOnTable([car])
          )
          .catch(alert);
      });
    }

    function listenToRemoveCar() {

      const carTable = document.querySelector('#cars_table tbody');
      carTable.addEventListener('click', event => {
        
        const clickedElement = event.target;

        if (clickedElement.classList.contains('remove-button')) {
          removeCar(clickedElement.getAttribute('car-id'));
        }
      });
    }

    function initialize() {

      // Get and show company info
      getCompanyInfo()
        .then(showCompanyInfo)
        .catch(alert);

      getCars()
        .then(showCarsOnTable)
        .catch(alert)
        
      // Listeners
      listenToAddcar();
      listenToRemoveCar();
    }

    initialize();
  }

  window.app = app;

  app();

})();

'use strict';

class Game {  
  constructor() {
    this.field = document.querySelector('.field');
    this.cellSide = 100;
    this.cellsArr = [];
    this.shuffledCells = [];
    this.divsArr = [];
    this.empty = {
      value: 15,
      face: '',
      left: '300px',
      top: '300px'
    };
  }

  start() {
    this.createField();
    this.arrFillCells();
    this.shuffle();
    this.addEmptyCell();
    this.makeIndex(this.cellsArr);
    this.makeDivs(this.cellsArr);
    this.render(this.divsArr);
    this.addListeners();
  }

  //Создаёт игровое поле
  createField() {
    let fieldDiv =  document.createElement('div');
    let cont = document.querySelector('.container');
    fieldDiv.className ='field';
    cont.append(fieldDiv);
    this.field = fieldDiv;
  }

  //Заполняет массив объектами ячеек
  arrFillCells() {
    this.cellsArr.splice(0, this.cellsArr.length);
    for (let val = 0; val < 15; val++) {
      this.cellsArr[val] = new Cell(val);
    }
  }
  //Тасует объекты ячеек в массиве и проверяет комбинацию на решаемость
  shuffle() {
    let shaffledCells = [];
    while (this.cellsArr.length !== 0) {
      let i = Math.floor(Math.random() * this.cellsArr.length);
      shaffledCells.push(this.cellsArr.splice(i, 1)[0]);
    }
    
    this.shuffledCells = this.pairSumCheck(this.shuffledCells);
    this.cellsArr = shaffledCells;
  }

  //Проверка комбинации на решаемость
  pairSumCheck(arr) { 
    let count = 0;
  
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        (arr[i] > arr[j]) ? count++ : count + 0;
      }
    }

    if (count % 2) {
      [arr[0], arr[1]] = [arr[1], arr[0]];
      this.pairSumCheck(arr);
    } else {return arr;}

  }

  //Добавляет объектам ячеек свойство индекс
  makeIndex(arr) {
    for (let i = 0; i < arr.length; i++) {
      let obj = {index: i};
      Object.assign(arr[i], obj);
    }
  }

  //Добавляет в массив объектов ячеек объект пустой ячейки
  addEmptyCell() {
    this.cellsArr.push(this.empty);
  }

  //Создаёт массив div`ов для заполнения игрового поля ячейками
  makeDivs(arr) { 
    this.divsArr.splice(0, this.divsArr.length);

    arr.forEach( (elem, index) => {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.innerText = elem.face;
    
      const offsetLeft = index % 4;
      const offsetTop = (index - offsetLeft) / 4;
      elem.left = `${offsetLeft * this.cellSide}px`;
      elem.top = `${offsetTop * this.cellSide}px`;
    
      cell.style.left = elem.left;
      cell.style.top = elem.top;
      
      this.divsArr.push(cell);
    })
  }

  //Заполняет игровое поле ячейками
  render(arr) {
    arr.forEach(item => this.field.append(item));
  }

  //Удаляет игровое поле
  removeField() {
    let fieldDiv = document.querySelector('.field');
    fieldDiv.remove();
  }

  //Отвечает за передвижение ячеек
  moveCell(event) {
    let numb = +event.target.innerText;
    let emptyInd = this.empty.index;
    let clickInd = (this.cellsArr.indexOf(this.cellsArr.find(item => item.face === numb)));
    let target = event.target.style;


    if
    (((parseInt(target.left) === parseInt(this.empty.left)) && (parseInt(target.top) === parseInt(this.empty.top) - 100)) || 
    ((parseInt(target.left) === parseInt(this.empty.left)) && (parseInt(target.top) === parseInt(this.empty.top) + 100)) || 
    ((parseInt(target.top) === parseInt(this.empty.top)) && (parseInt(target.left) === parseInt(this.empty.left) - 100)) ||
    ((parseInt(target.top) === parseInt(this.empty.top)) && (parseInt(target.left) === parseInt(this.empty.left) + 100)))
    {
      let clickedCell = this.cellsArr.splice(clickInd, 1, this.cellsArr[emptyInd])[0];
      this.cellsArr.splice(emptyInd, 1, clickedCell);

      [[clickedCell.left], [this.empty.left]] = [[this.empty.left], [clickedCell.left]];
      [[this.empty.top], [clickedCell.top]] = [[clickedCell.top], [this.empty.top]];

      this.makeIndex(this.cellsArr);
      this.removeField();
      this.makeDivs(this.cellsArr);
      this.createField();
      this.render(this.divsArr);
      this.addListeners();
      setTimeout(() => this.winCheck(), 0);

    }
  }

  //Устанавливает для ячеек на игровом поле обработчики событий
  addListeners() {
    for(let i = 0; i < this.field.children.length; i++){
      this.field.children[i].addEventListener('click', event => this.moveCell(event));
    }
  }

  //Проверка условия победы
  winCheck() {
    let currentArr = [];
    const victArr = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','']
    
    for (let i = 0; i < this.field.children.length; i++) {
      if (victArr[i] === this.field.children[i].textContent) {
        currentArr.push(this.field.children[i].textContent)
      }
    }

    if (victArr.length === currentArr.length) {
      if (confirm('Вы победили!! Хотите сыграть ещё раз?')) {
        this.removeField();
        this.start();
      } else {this.removeField();}
    }
  }
}

class Cell {
  constructor(value){
    this.value = value,
    this.face = value + 1,
    this.left = 0,
    this.top = 0
  }
}

const game = new Game();
game.start();
'use strict';

function game(){  
  
  let field = document.querySelector('.field');
    
  createField();

  function createField(){
    let fieldDiv =  document.createElement('div');
    let cont = document.querySelector('.container');
    fieldDiv.className ='field';
    cont.append(fieldDiv);
    field = fieldDiv;
  }


  const cellSide = 100;
  let cellsArr = [];
  let shuffledCells = [];
  const divsArr = [];
  const empty = {
    value: 15,
    face: '',
    left: '300px',
    top: '300px'
  };

  class Cell{
    constructor(value){
      this.value = value,
      this.face = value + 1,
      this.left = 0,
      this.top = 0
    }
  }

  for (let val = 0; val < 15; val++){
    cellsArr[val] = new Cell(val);
  }

  function shuffle(){
    let shaffledCells = [];
    while(cellsArr.length !== 0){
        let i = Math.floor(Math.random()*cellsArr.length);
        shaffledCells.push(cellsArr.splice(i, 1)[0]);
    }
    
    shuffledCells = pairSumCheck(shuffledCells);

    cellsArr = shaffledCells;
  }

  function pairSumCheck(arr){
    let count = 0
  
    for(let i = 0; i < arr.length; i++){
      for( let j = i + 1; j < arr.length; j++){
        (arr[i] > arr[j]) ? count++ : count + 0;
      }
    }

    if(count % 2){
      [arr[0], arr[1]] = [arr[1], arr[0]];
      pairSumCheck(arr);
    }else{return arr}
  }

  function makeIndex(arr){
    for(let i = 0; i < cellsArr.length; i++) {
    let obj = {index: i};
    Object.assign(cellsArr[i], obj);
  }

  }

  shuffle();

  function addEmptyCell(){
    cellsArr.push(empty);
  }
  addEmptyCell();
  makeIndex(cellsArr);

  function makeDivs(arr){
      divsArr.splice(0, divsArr.length);
      arr.forEach((elem, index) => {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.innerText = elem.face;
    
      const offsetLeft = index % 4;
      const offsetTop = (index - offsetLeft) / 4;
      elem.left = `${offsetLeft * cellSide}px`;
      elem.top = `${offsetTop * cellSide}px`;
    
      cell.style.left = elem.left;
      cell.style.top = elem.top;
      
      divsArr.push(cell);
    });
  }
  makeDivs(cellsArr);


  function render(arr){
    arr.forEach(item => field.append(item));
  }

  render(divsArr);

  function removeField(){
    let fieldDiv = document.querySelector('.field');
    fieldDiv.remove();
  }

  function moveCell(event){
    
    let numb = +event.target.innerText;
    let emptyInd = empty.index;
    let clickInd = (cellsArr.indexOf(cellsArr.find(item => item.face === numb)));
    let target = event.target.style;


    if
    (((parseInt(target.left) === parseInt(empty.left)) && (parseInt(target.top) === parseInt(empty.top) - 100)) || 
    ((parseInt(target.left) === parseInt(empty.left)) && (parseInt(target.top) === parseInt(empty.top) + 100)) || 
    ((parseInt(target.top) === parseInt(empty.top)) && (parseInt(target.left) === parseInt(empty.left) - 100)) ||
    ((parseInt(target.top) === parseInt(empty.top)) && (parseInt(target.left) === parseInt(empty.left) + 100)))
    {
      let cuttedCell = cellsArr.splice(clickInd, 1, cellsArr[emptyInd])[0];
      cellsArr.splice(emptyInd, 1, cuttedCell);

      [[cuttedCell.left], [empty.left]] = [[empty.left], [cuttedCell.left]];
      [[empty.top], [cuttedCell.top]] = [[cuttedCell.top], [empty.top]];

      makeIndex(cellsArr);
      removeField();
      
      makeDivs(cellsArr);
      createField();
      
      render(divsArr);
      addListeners();

      setTimeout(victory, 0);

    }

  }
  function addListeners(){
    for(let i = 0; i < field.children.length; i++){
      field.children[i].addEventListener('click', moveCell);
    }
  }
  addListeners();


  function victory(){
    let currentArr = [];
    const victArr = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','']
    
    for(let i = 0; i < field.children.length; i++){
      if(victArr[i] === field.children[i].textContent){
        currentArr.push(field.children[i].textContent)
      }
      
    }
    if(victArr.length === currentArr.length){
      
      if(confirm('Вы победили!! Хотите сыграть ещё раз?')){
        removeField();
        game();
      }
      else{removeField();}


    }
  }
}
game();
/**
 * Created by yangyang on 2016/11/18.
 */

const INVALID_INDEX = -1;

let stateArray = [];
let currentStateIndex = INVALID_INDEX;

let allPlayerIds = [];
let groups = [];
let winPlayerIds = new Set();

class StateManager {
  push() {

  }

  previous() {

  }

  next() {

  }
}

class DrawManager {
  init() {

  }

  draw() {
    let allPlayerIdsCopy = allPlayerIds.concat();
    let currentGroup = [];
    while(allPlayerIdsCopy.length !== 0){
      console.log('剩余长度:',allPlayerIdsCopy.length);
      let randomIndex = parseInt((Math.random()*10000000))%allPlayerIdsCopy.length;
      console.log(randomIndex);
      if(currentGroup.length === 3){
        groups.push(currentGroup.concat());
        currentGroup = [allPlayerIdsCopy[randomIndex]];
      }else{
        currentGroup.push(allPlayerIdsCopy[randomIndex]);
      }
      allPlayerIdsCopy.splice(randomIndex,1);
    }
    groups.push(currentGroup.concat());
    console.log(groups);
  }
}

class InteractiveManager {
  render() {
    if(allPlayerIds.length === 0){
      console.log('allPlayerIds为空');
    }
    for(let i = 0; i < allPlayerIds.length; i++){
      if(i%2===0){
        $('.ids-panel-up').append('<span class="badge id-panel-elem">'+allPlayerIds[i]+'</span>');
      }else{
        $('.ids-panel-down').append('<span class="badge id-panel-elem">'+allPlayerIds[i]+'</span>');
      }
    }
  }

  selected() {

  }

  unselected() {

  }
}

(() => {
  const screenHeight = $(window).height();
  $('body').height(screenHeight);

  let stateManager = new StateManager();
  let interactiveManager = new InteractiveManager();
  let drawManager = new DrawManager();

  $('#submitPlayerIdsButton').on('click', () => {
    let rangeLow = parseInt($('#input-range-low').val());
    let rangeHigh = parseInt($('#input-range-high').val());

    for (let i = rangeLow; i<=rangeHigh; i++){
      allPlayerIds.push(i);
    }
    drawManager.draw();

    $('#initModal').modal('hide');
    interactiveManager.render();
  });

  $('#initModal').modal('show');

})();
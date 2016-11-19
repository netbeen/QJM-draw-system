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
  draw() {
    let allPlayerIdsCopy = allPlayerIds.concat();
    let currentGroup = [];
    while(allPlayerIdsCopy.length !== 0){
      let randomIndex = parseInt((Math.random()*10000000))%allPlayerIdsCopy.length;
      if(currentGroup.length === 3){
        groups.push(currentGroup.concat());
        currentGroup = [allPlayerIdsCopy[randomIndex]];
      }else{
        currentGroup.push(allPlayerIdsCopy[randomIndex]);
      }
      allPlayerIdsCopy.splice(randomIndex,1);
    }
    groups.push(currentGroup.concat());
  }
}

class InteractiveManager {
  bindEvent() {
    $('.id-group-elem').on('click', (e) => {
      e.stopPropagation();
      $(e.target).toggleClass('win');
    });

    $('.group-elem').on('click', (e) => {
      e.stopPropagation();
      $('.group-elem').removeClass('ing');
      $('.group-elem').removeClass('ready');
      $(e.target).addClass('ing');
      $(e.target).find('.status').html('ING');
      let currentGroupIndex = (e.target.attributes.id.value+"").split('-')[2];
      let nextGroupIndex = currentGroupIndex + 1;
      let colIndex;
      if(nextGroupIndex <= groups.length){
        switch((nextGroupIndex-1)%3){
          case 0:
            colIndex = (nextGroupIndex-1)%3;
            $('.group-col-left').children().eq(colIndex).addClass('ready');
            break;
          case 1:
            colIndex = (nextGroupIndex-2)%3;
            $('.group-col-middle').children().eq(colIndex).addClass('ready');
            break;
          case 2:
            colIndex = (nextGroupIndex-3)%3;
            $('.group-col-right').children().eq(colIndex).addClass('ready');
            break;
          default:
            break;
        }
      }
    });
  }

  render() {
    if (allPlayerIds.length === 0) {
      console.log('allPlayerIds为空');
    }
    for (let i = 0; i < allPlayerIds.length; i++) {
      if (i % 2 === 0) {
        $('.ids-panel-up').append('<span class="badge id-panel-elem">' + allPlayerIds[i] + '</span>');
      } else {
        $('.ids-panel-down').append('<span class="badge id-panel-elem">' + allPlayerIds[i] + '</span>');
      }
    }

    if (groups.length === 0) {
      console.log('groups为空');
    }
    for (let i = 0; i < groups.length; i++) {
      let idsElem = ''
      for (let j = 0; j < groups[i].length; j++) {
        idsElem += '<div class="badge id-group-elem">' + groups[i][j] + '</div>'
      }
      let elem = '<div class="group-elem" id="group-elem-'+(i + 1)+'">第' + (i + 1) + '组<div></div><span class="status"></span>' + idsElem + '</div>';
      switch (i % 3) {
        case 0:
          $('.group-col-left').append(elem);
          break;
        case 1:
          $('.group-col-middle').append(elem);
          break;
        case 2:
          $('.group-col-right').append(elem);
          break;
        default:
          break;
      }
    }
    this.bindEvent();
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
/**
 * Created by yangyang on 2016/11/18.
 */

const INVALID_INDEX = -1;

let isLosersBracket = false;

let stateArray = [];
let currentStateIndex = INVALID_INDEX;

let allPlayerIds = [];
let groups = [];
let winPlayerIds = [];
let lastRoundWinPlayersIds = [];

class StateManager {
  push() {
    let currentState = {
      allPlayerIds: allPlayerIds.concat(),
      groups:groups.concat(),
      winPlayerIds:winPlayerIds.concat(),
      lastRoundWinPlayersIds:lastRoundWinPlayersIds.concat(),
      isLosersBracket:isLosersBracket,
    };
    stateArray.push(currentState);
  }

  previous() {
    console.log('【回退】即将回退至index',currentStateIndex);
    console.log('【回退】取出状态：',stateArray[currentStateIndex]);
    if(stateArray[currentStateIndex] === undefined){
      console.log('【错误】stateArray[currentStateIndex] === undefined');
    }
    allPlayerIds = stateArray[currentStateIndex].allPlayerIds.concat();
    groups = stateArray[currentStateIndex].groups.concat();
    winPlayerIds = stateArray[currentStateIndex].winPlayerIds.concat();
    lastRoundWinPlayersIds = stateArray[currentStateIndex].lastRoundWinPlayersIds.concat();
    isLosersBracket = stateArray[currentStateIndex].isLosersBracket;
    currentStateIndex--;
  }

  next() {
    currentStateIndex++;
    console.log('即将压入队列index',currentStateIndex);
    console.log('当前状态机队列长度',stateArray.length);
    if(stateArray.length > currentStateIndex){
      stateArray.splice(0,currentStateIndex-1);
      this.push();
    }else if(stateArray.length === currentStateIndex){
      this.push();
    }else{
      console.log('stateArray.length < currentStateIndex,程序出错。');
    }

    // 准备下一轮需要用到的数据
    // 判断当前是否为败者组
    if(isLosersBracket){
      allPlayerIds = _.union(lastRoundWinPlayersIds,winPlayerIds);
      lastRoundWinPlayersIds = [];
      winPlayerIds = [];
      groups = [];
    }else{
      lastRoundWinPlayersIds = winPlayerIds.concat();
      allPlayerIds = _.difference(allPlayerIds,winPlayerIds);
      groups = [];
      winPlayerIds = [];
    }
    isLosersBracket = !isLosersBracket;
  }
}

let stateManager = new StateManager();

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
      $(e.target).find('.status').html('ING...');
      let currentGroupIndex = parseInt((e.target.attributes.id.value+"").split('-')[2]);
      console.log('currentGroupIndex',currentGroupIndex);
      let nextGroupIndex = currentGroupIndex + 1;
      let colIndex;
      console.log('nextGroupIndex',nextGroupIndex);
      if(nextGroupIndex <= groups.length){
        switch((nextGroupIndex-1)%3){
          case 0:
            colIndex = (nextGroupIndex-1)/3;
            $('.group-col-left').children().eq(colIndex).addClass('ready');
            $('.group-col-left').children().eq(colIndex).find('.status').html('READY');

            break;
          case 1:
            colIndex = (nextGroupIndex-2)/3;
            $('.group-col-middle').children().eq(colIndex).addClass('ready');
            $('.group-col-middle').children().eq(colIndex).find('.status').html('READY');

            break;
          case 2:
            colIndex = (nextGroupIndex-3)/3;
            $('.group-col-right').children().eq(colIndex).addClass('ready');
            $('.group-col-right').children().eq(colIndex).find('.status').html('READY');

            break;
          default:
            break;
        }
        console.log('colIndex',colIndex);
      }
    });
  }

  render() {
    console.log('开始渲染页面：');
    console.log('allPlayerIds',allPlayerIds);
    console.log('groups',groups);
    console.log('winPlayerIds',winPlayerIds);
    console.log('lastRoundWinPlayersIds',lastRoundWinPlayersIds);
    console.log('是否败者组',isLosersBracket);
    if(isLosersBracket){
      $('#isLosersBracket-tip').removeClass('invisible');
    }else{
      $('#isLosersBracket-tip').addClass('invisible');
    }
    $('.ids-panel').children().remove();
    $('.group-col').children().remove();
    $('#round-count').html(currentStateIndex+2);
    if (allPlayerIds.length === 0) {
      console.log('错误：allPlayerIds为空');
    }
    for (let i = 0; i < allPlayerIds.length; i++) {
      if (i % 2 === 0) {
        $('.ids-panel-up').append('<span class="badge id-panel-elem">' + allPlayerIds[i] + '</span>');
      } else {
        $('.ids-panel-down').append('<span class="badge id-panel-elem">' + allPlayerIds[i] + '</span>');
      }
    }

    if (groups.length === 0) {
      console.log('错误：groups为空');
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
    _.each($('.id-group-elem'),(elem) => {
      if(winPlayerIds.includes(parseInt(elem.innerText))){
        $(elem).addClass('win');
      }
    });
    this.bindEvent();
  }
}

(() => {
  const screenHeight = $(window).height();
  $('body').height(screenHeight);

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

  $('#next-button').on('click',()=>{
    console.log('【交互】下一步按钮触发');
    let selectedElems = $('.id-group-elem.win');
    winPlayerIds = [];
    for(elem of selectedElems){
      winPlayerIds.push(parseInt(elem.innerText));
    }
    stateManager.next();
    drawManager.draw();
    interactiveManager.render();
  });

  $('#back-button').on('click',()=>{
    console.log('【交互】上一步按钮触发');
    stateManager.previous();
    interactiveManager.render();
  });

  $('#initModal').modal('show');

})();
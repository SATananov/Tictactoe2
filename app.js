(function(){
  /* ================= i18n ================= */
  const text = {
    en: {
      sample_board: "| 1 | 2 | 3\n| 4 | 5 | 6\n| 7 | 8 | 9\n",
      ui_lang: "Language",
      ui_name: "Name",
      ui_level: "Level",
      ui_symbol: "Symbol",
      ui_mode: "Mode",
      ui_first_move: "First move",
      ui_first_auto: "Random",
      ui_first_player: "Player",
      ui_first_machine: "Computer",
      ui_first_player1: "Player 1",
      ui_first_player2: "Player 2",
      ui_mode_pve: "Player vs Computer",
      ui_mode_pvp: "Player vs Player",
      ui_easy: "Easy",
      ui_hard: "Hard",
      ui_start: "Start Game",
      ui_new: "New Session",
      ui_replay: "Play Again",
      ui_you: "You",
      ui_machine: "Machine",
      ui_total: "Total games",
      ui_intro: "Choose settings and click Start Game. Click a cell to play.",
      ui_welcome: (u)=>`Welcome, ${u}!`,
      ui_welcome_pvp: (a,b)=>`Welcome, ${a} vs ${b}!`,
      ui_machine_turn: "Computer's turn…",
      ui_your_turn: "Your turn",
      ui_turn_of: (name)=>`Turn: ${name}`,
      ui_invalid_name: "Name must be letters/numbers only",
      ui_invalid_name2: "Player 2 name must be letters/numbers only",
      ui_thinking: "🤔 Thinking",
      ui_first: (p)=> p==='player'? 'You start first' : (p==='machine'? 'Computer starts first' : (p==='player1'? 'Player 1 starts first' : 'Player 2 starts first')),
      ui_result_line: (p,m)=>`Result You: ${p} • Opponent: ${m}`,
      ui_game_over: "Game over",
      player_wins_line: (moves)=>`You win in ${moves} turns`,
      p1_wins_line: (moves)=>`Player 1 wins in ${moves} turns`,
      p2_wins_line: (moves)=>`Player 2 wins in ${moves} turns`,
      machine_wins_line: (moves)=>`Computer wins in ${moves} turns`,
      tie_line: "It's a tie!",
      ui_p1: "Player 1",
      ui_p2: "Player 2",
    },
    bg: {
      sample_board: "| 1 | 2 | 3\n| 4 | 5 | 6\n| 7 | 8 | 9\n",
      ui_lang: "Език",
      ui_name: "Име",
      ui_level: "Ниво",
      ui_symbol: "Символ",
      ui_mode: "Режим",
      ui_first_move: "Първи ход",
      ui_first_auto: "Случаен",
      ui_first_player: "Играч",
      ui_first_machine: "Машина",
      ui_first_player1: "Играч 1",
      ui_first_player2: "Играч 2",
      ui_mode_pve: "Играч vs Машина",
      ui_mode_pvp: "Играч vs Играч",
      ui_easy: "Лесно",
      ui_hard: "Трудно",
      ui_start: "Започни игра",
      ui_new: "Нова сесия",
      ui_replay: "Играй пак",
      ui_you: "Ти",
      ui_machine: "Машина",
      ui_total: "Общо игри",
      ui_intro: "Избери настройки и натисни „Започни игра“. Кликни клетка, за да играеш.",
      ui_welcome: (u)=>`Добре дошъл, ${u}!`,
      ui_welcome_pvp: (a,b)=>`Добре дошли, ${a} срещу ${b}!`,
      ui_machine_turn: "Ред на компютъра…",
      ui_your_turn: "Твой ред",
      ui_turn_of: (name)=>`Ред: ${name}`,
      ui_invalid_name: "Името трябва да съдържа само букви/цифри",
      ui_invalid_name2: "Името на Играч 2 трябва да съдържа само букви/цифри",
      ui_thinking: "🤔 Мисля",
      ui_first: (p)=> p==='player'? 'Ти започваш пръв' : (p==='machine'? 'Компютърът започва пръв' : (p==='player1'? 'Играч 1 започва пръв' : 'Играч 2 започва пръв')),
      ui_result_line: (p,m)=>`Резултат: ${p} • ${m}`,
      ui_game_over: "Край на играта",
      player_wins_line: (moves)=>`Ти победи за ${moves} хода`,
      p1_wins_line: (moves)=>`Играч 1 победи за ${moves} хода`,
      p2_wins_line: (moves)=>`Играч 2 победи за ${moves} хода`,
      machine_wins_line: (moves)=>`Машината победи за ${moves} хода`,
      tie_line: "Равенство!",
      ui_p1: "Играч 1",
      ui_p2: "Играч 2",
    }
  };

  /* ============== State ============== */
  const state = {
    lang: 'bg',
    level: 'easy',
    mode: 'pve',          // 'pve' or 'pvp'
    player1Name: '',
    player2Name: '',
    playerSymbol: 'X',    // player1 symbol
    machineSymbol: 'O',   // opponent symbol (computer or player2)
    board: [ [' ',' ',' '], [' ',' ',' '], [' ',' ',' '] ],
    empty: {},
    firstThree: [],
    currentMove: 0,
    firstMover: 'player', // 'player' | 'machine' | 'player1' | 'player2'
    // Scores
    playerWins: 0,
    machineWins: 0,
    p1Wins: 0,
    p2Wins: 0,
    // Flow
    playing: false,
    locking: false,
    winLine: [], // array of [r,c]
  };

  const coordMap = {
    1:[0,0],2:[0,1],3:[0,2],
    4:[1,0],5:[1,1],6:[1,2],
    7:[2,0],8:[2,1],9:[2,2]
  };

  /* ============== DOM refs ============== */
  const el = (id)=>document.getElementById(id);
  const boardEl = el('board');
  const statusEl = el('status');
  const logEl = el('log');
  const youNum = el('you-num');
  const machineNum = el('machine-num');
  const totalNum = el('total-num');
  const badgeMode = el('badge-mode');
  const badgeLang = el('badge-lang');

  const lbl = {
    lang: el('label-lang'), name: el('label-name'), level: el('label-level'), symbol: el('label-symbol'),
    mode: el('label-mode'), name2: el('label-name2'), first: el('label-first'),
    easy: el('txt-easy'), hard: el('txt-hard'),
    scYou: el('sc-you'), scMachine: el('sc-machine'), scTotal: el('sc-total'),
    footer: el('footer')
  };

  const inputs = {
    lang: el('select-lang'), name: el('input-name'),
    name2: el('input-name2'), fieldName2: el('field-name2'),
    mode: el('select-mode'), first: el('select-first'),
    levelRadios: [...document.querySelectorAll('input[name="level"]')],
    symbolRadios: [...document.querySelectorAll('input[name="symbol"]')],
    btnStart: el('btn-start'), btnNew: el('btn-new'), btnReplay: el('btn-replay')
  };

  /* ============== Utils ============== */
  const fmt = (s, vars={})=> typeof s === 'string' ? s.replace(/\{(\w+)\}/g, (_,k)=> vars[k] ?? `{${k}}`) : s;
  const sleep = (ms)=> new Promise(r=>setTimeout(r, ms));
  const cloneBoard = (b)=> b.map(row=>row.slice());

  function setStatus(html){ statusEl.innerHTML = html; }
  function log(msg){
    const p = document.createElement('div');
    p.textContent = msg;
    logEl.prepend(p);
  }
  function setBadges(){
    badgeMode.textContent = state.level==='easy'? (text[state.lang].ui_easy) : (text[state.lang].ui_hard);
    badgeLang.textContent = state.lang.toUpperCase();
  }

  /* ============== Rendering ============== */
  function renderBoard(){
    boardEl.innerHTML='';
    for(let i=1;i<=9;i++){
      const cell = document.createElement('button');
      cell.className='cell';
      cell.dataset.key=String(i);
      const [r,c]=coordMap[i];
      const v = state.board[r][c];
      cell.textContent = v === ' ' ? '' : v;
      const clickable = state.playing && !state.locking && v===' ';
      if(!clickable){ cell.classList.add('disabled'); }
      if(state.winLine.some(([rr,cc])=> rr===r && cc===c)){ cell.classList.add('win'); }
      cell.addEventListener('click', onCellClick);
      boardEl.appendChild(cell);
    }
  }

  function updateScore(){
    if(state.mode==='pve'){
      youNum.textContent = state.playerWins;
      machineNum.textContent = state.machineWins;
      totalNum.textContent = state.playerWins + state.machineWins;
    }else{
      youNum.textContent = state.p1Wins;
      machineNum.textContent = state.p2Wins;
      totalNum.textContent = state.p1Wins + state.p2Wins;
    }
  }

  function applyI18n(){
    const t = text[state.lang];
    lbl.lang.textContent = state.lang==='bg'? 'Език / Language' : 'Language / Език';
    lbl.name.textContent = t.ui_name;
    lbl.name2.textContent = (state.mode==='pve') ? (state.lang==='bg' ? 'Име на Машината' : 'Computer Name') : (state.lang==='bg' ? 'Име на Играч 2' : 'Player 2 Name');
    lbl.level.textContent = t.ui_level;
    lbl.symbol.textContent = state.mode==='pvp' ? (state.lang==='bg'?'Символ на Играч 1':'Player 1 Symbol') : t.ui_symbol;
    lbl.mode.textContent = t.ui_mode;
    lbl.first.textContent = t.ui_first_move;

    inputs.mode.options[0].textContent = t.ui_mode_pve;
    inputs.mode.options[1].textContent = t.ui_mode_pvp;

    // First move options depend on mode
    if(state.mode==='pve'){
      inputs.first.options[0].textContent = t.ui_first_auto;
      inputs.first.options[1].value = 'player';
      inputs.first.options[1].textContent = t.ui_first_player;
      inputs.first.options[2].value = 'machine';
      inputs.first.options[2].textContent = t.ui_first_machine;
    } else {
      inputs.first.options[0].textContent = t.ui_first_auto;
      inputs.first.options[1].value = 'player1';
      inputs.first.options[1].textContent = t.ui_first_player1;
      inputs.first.options[2].value = 'player2';
      inputs.first.options[2].textContent = t.ui_first_player2;
    }

    // Buttons + labels
    document.getElementById('btn-start').textContent = (state.lang==='bg'? '▶️ '+t.ui_start : '▶️ '+t.ui_start);
    document.getElementById('btn-new').textContent = (state.lang==='bg'? '🧹 '+t.ui_new : '🧹 '+t.ui_new);
    document.getElementById('btn-replay').textContent = (state.lang==='bg'? '↻ '+t.ui_replay : '↻ '+t.ui_replay);
    lbl.easy.textContent = t.ui_easy;
    lbl.hard.textContent = t.ui_hard;

    // Score labels depend on mode
    if(state.mode==='pve'){
      lbl.scYou.textContent = t.ui_you;
      lbl.scMachine.textContent = t.ui_machine;
      lbl.scTotal.textContent = t.ui_total;
    }else{
      lbl.scYou.textContent = t.ui_p1;
      lbl.scMachine.textContent = t.ui_p2;
      lbl.scTotal.textContent = t.ui_total;
    }

    setBadges();
    setStatus(`<span class="muted">${t.ui_intro}</span>`);
  }

  /* ============== Game Logic ============== */
  function checkIfCellIsEmpty(mapping, matrix, desiredCell){
    const [r,c] = mapping[desiredCell];
    return matrix[r][c] === ' ';
  }

  function rowsSymbolCount(matrix, symbol, machineMode=false){
    for(let r=0;r<3;r++){
      const row = matrix[r];
      const cnt = row.filter(x=>x===symbol).length;
      if(cnt===3) return true;
      if(machineMode && cnt===2 && row.includes(' ')) return [r, row.indexOf(' ')];
    }
    return false;
  }
  function colSymbolCount(matrix, symbol, machineMode=false){
    for(let c=0;c<3;c++){
      const col=[matrix[0][c],matrix[1][c],matrix[2][c]];
      const cnt = col.filter(x=>x===symbol).length;
      if(cnt===3) return true;
      if(machineMode && cnt===2 && col.includes(' ')) return [col.indexOf(' '), c];
    }
    return false;
  }
  function countSymbolsInDiagonals(matrix, symbol, machineMode=false){
    const main=[matrix[0][0],matrix[1][1],matrix[2][2]];
    const sec=[matrix[0][2],matrix[1][1],matrix[2][0]];
    const mc=main.filter(x=>x===symbol).length;
    const sc=sec.filter(x=>x===symbol).length;
    if(mc===3||sc===3) return true;
    if(machineMode){
      if(mc===2 && main.includes(' ')){
        const i=main.indexOf(' '); return [i,i];
      }
      if(sc===2 && sec.includes(' ')){
        const i=sec.indexOf(' '); const col=2-i; return [i,col];
      }
    }
    return false;
  }
  function checkForWinner(matrix, symbol){
    return rowsSymbolCount(matrix,symbol)||colSymbolCount(matrix,symbol)||countSymbolsInDiagonals(matrix,symbol);
  }

  function randomKey(obj){ const keys=Object.keys(obj); return Number(keys[Math.floor(Math.random()*keys.length)]); }

  function machineAttackDefend(matrix, sym){
    let r = rowsSymbolCount(matrix,sym,true); if(r) return r;
    r = colSymbolCount(matrix,sym,true); if(r) return r;
    r = countSymbolsInDiagonals(matrix,sym,true); if(r) return r;
    return false;
  }

  function machineFirstThreeMovesSetup(){
    const arr = state.level==='hard' ? [1,3,7,9,5] : [1,2,3,4,5,6,7,8,9];
    const combos=[];
    for(let i=0;i<arr.length;i++) for(let j=i+1;j<arr.length;j++) for(let k=j+1;k<arr.length;k++) combos.push([arr[i],arr[j],arr[k]]);
    return combos[Math.floor(Math.random()*combos.length)].slice();
  }

  function machineMainLogic(){
    const allMoves = coordMap; const matrix = state.board; const currentEmpty = state.empty;
    const symbol = state.machineSymbol; const userSymbol = state.playerSymbol;
    let cellNumber, r, c;

    if(state.firstThree.length>0){
      cellNumber = state.firstThree.shift();
      [r,c] = allMoves[cellNumber];
    } else {
      cellNumber = randomKey(currentEmpty);
      [r,c] = currentEmpty[cellNumber];
    }

    let res = machineAttackDefend(matrix, symbol);
    if(res){ [r,c]=res; matrix[r][c]=symbol; return checkForWinner(matrix, symbol); }
    res = machineAttackDefend(matrix, userSymbol);
    if(res){ [r,c]=res; matrix[r][c]=symbol; return checkForWinner(matrix, symbol); }

    // random fallback: ensure empty
    while(!checkIfCellIsEmpty(allMoves, matrix, cellNumber)){
      cellNumber = randomKey(currentEmpty);
      [r,c] = currentEmpty[cellNumber];
    }
    matrix[r][c]=symbol;
    delete currentEmpty[cellNumber];
    return checkForWinner(matrix, symbol);
  }

  /* ============== Flow ============== */
  function clearBoard(){ state.board = [[' ',' ',' '],[' ',' ',' '],[' ',' ',' ']]; state.empty = {...coordMap}; state.winLine=[]; }

  function newSession(){
    state.playerWins=0; state.machineWins=0; state.p1Wins=0; state.p2Wins=0;
    updateScore(); log('— Session reset —');
  }

  function validateNames(){
    const t = text[state.lang];
    const re = /^\w+$/;
    if(!re.test(inputs.name.value.trim())){ setStatus(`<span class="muted">${t.ui_invalid_name}</span>`); return false; }
    if(state.mode==='pvp'){
      if(!re.test(inputs.name2.value.trim())){ setStatus(`<span class="muted">${t.ui_invalid_name2}</span>`); return false; }
    }
    return true;
  }

  async function startGame(){
    if(!validateNames()) return;
    const t = text[state.lang];
    state.player1Name = inputs.name.value.trim();
    const fallbackComp = state.lang==='bg' ? 'Машина' : 'Computer';
    state.player2Name = (state.mode==='pve') ? (inputs.name2.value.trim() || fallbackComp) : inputs.name2.value.trim();

    // symbols (player1 chooses)
    const sym = inputs.symbolRadios.find(r=>r.checked)?.value || 'X';
    state.playerSymbol = sym; state.machineSymbol = sym==='X'?'O':'X';
    // level
    const lvl = inputs.levelRadios.find(r=>r.checked)?.value || 'easy';
    state.level = lvl; setBadges();

    // init
    clearBoard();
    state.firstThree = (state.mode==='pve') ? machineFirstThreeMovesSetup() : [];
    // First mover by selection
    const sel = inputs.first.value; // 'auto'|'player'|'machine' (PvE) OR 'auto'|'player1'|'player2' (PvP)
    if(sel==='auto'){
      state.firstMover = (state.mode==='pve') ? (Math.random()<0.5? 'machine':'player') : (Math.random()<0.5? 'player1':'player2');
    } else {
      state.firstMover = sel;
    }
    // currentMove parity: even (0) -> player1/PLAYER, odd (1) -> player2/MACHINE
    state.currentMove = (state.firstMover==='machine' || state.firstMover==='player2') ? 1 : 0;

    state.playing = true; state.locking=false;

    log('— — —');
    if(state.mode==='pve'){
      log(t.ui_welcome(state.player1Name));
      const firstName = (state.firstMover==='player')? state.player1Name : (state.lang==='bg'? t.ui_machine : 'Computer');
      setStatus(`<strong>${t.ui_welcome(state.player1Name)}</strong><br>${t.ui_turn_of(firstName)}`);
      renderBoard();
      if(state.firstMover==='machine') await machineTurn();
      else setStatus(`<strong>${t.ui_your_turn}</strong>`);
    } else {
      log(t.ui_welcome_pvp(state.player1Name, state.player2Name));
      const firstNamePvP = (state.firstMover==='player1')? state.player1Name : state.player2Name;
      setStatus(`<strong>${t.ui_welcome_pvp(state.player1Name, state.player2Name)}</strong><br>${t.ui_turn_of(firstNamePvP)}`);
      renderBoard();
      updateTurnBanner();
    }
  }

  function updateTurnBanner(){
    const t = text[state.lang];
    if(!state.playing) return;
    let who='';
    if(state.mode==='pve'){
      who = (state.currentMove % 2 === 0) ? state.player1Name : (state.lang==='bg'? t.ui_machine : 'Computer');
    }else{
      who = (state.currentMove % 2 === 0) ? state.player1Name : state.player2Name;
    }
    setStatus(`<strong>${t.ui_turn_of(who)}</strong>`);
  }

  async function machineTurn(){
    const t = text[state.lang];
    state.locking = true; renderBoard();
    setStatus(`<span class="thinking">${t.ui_machine_turn} ${t.ui_thinking}...</span>`);
    await sleep(700);
    const win = machineMainLogic();
    renderBoard();

    if(win){
      endGame('machine');
    } else {
      state.currentMove += 1;
      state.locking = false; updateTurnBanner(); renderBoard();
      // tie?
      if(Object.keys(state.empty).length === 0){
        endGame('tie');
      }
    }
  }

  function getWinnerLine(symbol){
    const b = state.board;
    const lines = [
      [[0,0],[0,1],[0,2]],
      [[1,0],[1,1],[1,2]],
      [[2,0],[2,1],[2,2]],
      [[0,0],[1,0],[2,0]],
      [[0,1],[1,1],[2,1]],
      [[0,2],[1,2],[2,2]],
      [[0,0],[1,1],[2,2]],
      [[0,2],[1,1],[2,0]],
    ];
    for(const line of lines){ if(line.every(([r,c])=> b[r][c]===symbol)) return line; }
    return [];
  }

  function endGame(kind){
    const t = text[state.lang];
    state.playing=false; state.locking=true;
    let msg='';
    if(state.mode==='pve'){
      if(kind==='player'){ state.playerWins++; msg = t.player_wins_line(state.currentMove); state.winLine = getWinnerLine(state.playerSymbol); }
      else if(kind==='machine'){ state.machineWins++; msg = t.machine_wins_line(state.currentMove); state.winLine = getWinnerLine(state.machineSymbol); }
      else { msg = t.tie_line; }
      updateScore(); renderBoard();
      setStatus(`<strong>${t.ui_game_over}</strong><br>${msg}<br>${t.ui_result_line(state.playerWins,state.machineWins)}`);
    }else{
      if(kind==='player1'){ state.p1Wins++; msg = t.p1_wins_line(state.currentMove); state.winLine = getWinnerLine(state.playerSymbol); }
      else if(kind==='player2'){ state.p2Wins++; msg = t.p2_wins_line(state.currentMove); state.winLine = getWinnerLine(state.machineSymbol); }
      else { msg = t.tie_line; }
      updateScore(); renderBoard();
      const lhs = state.lang==='bg' ? 'Играч 1' : 'Player 1';
      const rhs = state.lang==='bg' ? 'Играч 2' : 'Player 2';
      setStatus(`<strong>${t.ui_game_over}</strong><br>${msg}<br>${lhs}: ${state.p1Wins} • ${rhs}: ${state.p2Wins}`);
    }
    inputs.btnReplay.disabled = false;
  }

  async function onCellClick(e){
    if(!state.playing || state.locking) return;
    const key = Number(e.currentTarget.dataset.key);

    // validate
    if(!(key>=1 && key<=9)) return;
    if(!checkIfCellIsEmpty(coordMap, state.board, key)) return;

    // whose turn: even -> player1/PLAYER, odd -> player2/MACHINE
    const isEven = state.currentMove % 2 === 0;

    // apply symbol
    const [r,c] = coordMap[key];
    const symbol = (isEven ? state.playerSymbol : state.machineSymbol);
    state.board[r][c] = symbol;
    delete state.empty[key];
    renderBoard();

    // winner?
    if(checkForWinner(state.board, symbol)){
      if(state.mode==='pve'){
        endGame(isEven ? 'player' : 'machine');
      }else{
        endGame(isEven ? 'player1' : 'player2');
      }
      return;
    }

    // tie?
    if(Object.keys(state.empty).length === 0){
      endGame('tie');
      return;
    }

    // next step
    state.currentMove += 1;

    if(state.mode==='pve'){
      if(isEven){ // after human, machine plays
        await machineTurn();
      } else {
        updateTurnBanner();
      }
    } else {
      // PvP: just toggle banner
      updateTurnBanner();
    }
  }

  function replay(){
    inputs.btnReplay.disabled = true;
    clearBoard();
    state.firstThree = (state.mode==='pve') ? machineFirstThreeMovesSetup() : [];
    const sel2 = inputs.first.value;
    if(sel2==='auto'){
      state.firstMover = (state.mode==='pve') ? (Math.random()<0.5? 'machine':'player') : (Math.random()<0.5? 'player1':'player2');
    } else {
      state.firstMover = sel2;
    }
    state.currentMove = (state.firstMover==='machine' || state.firstMover==='player2') ? 1 : 0;

    state.playing = true; state.locking=false; state.winLine=[];
    renderBoard();
    updateTurnBanner();
    if(state.mode==='pve' && state.firstMover==='machine') machineTurn();
  }

  /* ============== Bindings ============== */
  inputs.lang.addEventListener('change', ()=>{ state.lang = inputs.lang.value; applyI18n(); setBadges(); });
  inputs.mode.addEventListener('change', ()=>{
    state.mode = inputs.mode.value;
    applyI18n();
  });
  inputs.first.addEventListener('change', ()=>{ /* keep selection; i18n labels already applied */ });
  inputs.levelRadios.forEach(r=> r.addEventListener('change', ()=>{ state.level = r.value; setBadges(); }));
  inputs.symbolRadios.forEach(r=> r.addEventListener('change', ()=>{ state.playerSymbol = r.value; state.machineSymbol = r.value==='X'?'O':'X'; }));
  inputs.btnStart.addEventListener('click', startGame);
  inputs.btnNew.addEventListener('click', ()=>{ newSession(); clearBoard(); renderBoard(); applyI18n(); inputs.btnReplay.disabled=true; });
  inputs.btnReplay.addEventListener('click', replay);

  // Init defaults for BG user
  inputs.lang.value='bg'; state.lang='bg';
  inputs.mode.value='pve'; state.mode='pve';
  inputs.first.value='auto';
  inputs.levelRadios.find(r=>r.value==='easy').checked=true; state.level='easy';
  inputs.symbolRadios.find(r=>r.value==='X').checked=true; state.playerSymbol='X'; state.machineSymbol='O';
  clearBoard();
  applyI18n();
  renderBoard();
})();

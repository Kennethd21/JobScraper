// Utilities
const readLS = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } };
const writeLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

// Data
const SUBJECTS = ["DSA","DBMS","OS","JAVA","PYTHON","MATHEMATICS","WEB DEVELOPMENT"];
const defaultProfile = { name:"Alex Student", roll:"GLC2025-042", email:"alex@student.edu", phone:"+91 90000 00000", program:"B.Sc. (CS)", semester:"V" };
const defaultGrades = SUBJECTS.map(s => ({ subject:s, score: Math.floor(65 + Math.random()*25) }));
const defaultAttendance = SUBJECTS.map(s => { const total = 30 + Math.floor(Math.random()*10); const attended = Math.floor(total * (0.6 + Math.random()*0.35)); return { subject:s, attended, total }; });
const defaultAssignments = [
  { title:"Arrays & Linked Lists", subject:"DSA", progress:30, due:"2025-10-20", done:false },
  { title:"SQL Joins Mini-Project", subject:"DBMS", progress:60, due:"2025-10-22", done:false },
  { title:"CPU Scheduling Sheet", subject:"OS", progress:100, due:"2025-10-10", done:true },
  { title:"OOP Design — E-Store", subject:"JAVA", progress:10, due:"2025-10-25", done:false },
  { title:"Flask API Starter", subject:"PYTHON", progress:50, due:"2025-10-24", done:false },
  { title:"Calculus Practice Set", subject:"MATHEMATICS", progress:80, due:"2025-10-18", done:false },
  { title:"Portfolio Section UI", subject:"WEB DEVELOPMENT", progress:15, due:"2025-10-27", done:false },
];
const defaultExams = [ { title:"DSA Midterm", date:"2025-10-21", time:"10:00" }, { title:"DBMS Viva", date:"2025-10-25", time:"14:00" }, { title:"OS Quiz", date:"2025-10-28", time:"09:00" } ];
const defaultScheduleSlots = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00"];
const defaultScheduleGrid = {
  "08:00": ["DSA","DBMS","OS","JAVA","PYTHON","MATHEMATICS"],
  "09:00": ["WEB DEVELOPMENT","DSA","DBMS","OS","JAVA","PYTHON"],
  "10:00": ["MATHEMATICS","WEB DEVELOPMENT","DSA","DBMS","OS","JAVA"],
  "11:00": ["PYTHON","MATHEMATICS","WEB DEVELOPMENT","DSA","DBMS","OS"],
  "12:00": ["JAVA","PYTHON","MATHEMATICS","WEB DEVELOPMENT","DSA","DBMS"],
  "13:00": ["OS","JAVA","PYTHON","MATHEMATICS","WEB DEVELOPMENT","DSA"],
  "14:00": ["DBMS","OS","JAVA","PYTHON","MATHEMATICS","WEB DEVELOPMENT"],
  "15:00": ["DSA","","","LAB","","SEMINAR"],
  "16:00": ["SELF STUDY","SELF STUDY","SELF STUDY","SELF STUDY","SELF STUDY","SELF STUDY"]
};
const defaultResources = {
  "DSA": { youtube:[{label:"Abdul Bari — Data Structures",url:"https://www.youtube.com/results?search_query=abdul+bari+data+structures"},{label:"freeCodeCamp — DSA",url:"https://www.youtube.com/results?search_query=freecodecamp+data+structures"}], books:["Introduction to Algorithms — CLRS","Data Structures in C — Tanenbaum"] },
  "DBMS": { youtube:[{label:"Gate Smashers — DBMS",url:"https://www.youtube.com/results?search_query=gate+smashers+dbms"},{label:"Jenny’s Lectures — SQL",url:"https://www.youtube.com/results?search_query=jenny+lectures+sql"}], books:["Database System Concepts — Silberschatz","Fundamentals of Database Systems — Elmasri & Navathe"] },
  "OS": { youtube:[{label:"Neso Academy — OS",url:"https://www.youtube.com/results?search_query=neso+academy+operating+systems"},{label:"Gate Smashers — OS",url:"https://www.youtube.com/results?search_query=gate+smashers+os"}], books:["Operating System Concepts — Silberschatz","Modern Operating Systems — Tanenbaum"] },
  "JAVA": { youtube:[{label:"Telusko — Java",url:"https://www.youtube.com/results?search_query=telusko+java"},{label:"freeCodeCamp — Java OOP",url:"https://www.youtube.com/results?search_query=freecodecamp+java+oop"}], books:["Head First Java — Sierra & Bates","Effective Java — Joshua Bloch"] },
  "PYTHON": { youtube:[{label:"freeCodeCamp — Python Full Course",url:"https://www.youtube.com/results?search_query=python+full+course+freecodecamp"},{label:"Corey Schafer — Python",url:"https://www.youtube.com/results?search_query=corey+schafer+python"}], books:["Automate the Boring Stuff — Al Sweigart","Fluent Python — Luciano Ramalho"] },
  "MATHEMATICS": { youtube:[{label:"3Blue1Brown — Calculus/Linear Algebra",url:"https://www.youtube.com/results?search_query=3blue1brown"}], books:["Thomas’ Calculus — Thomas","BS Grewal — Higher Engineering Mathematics"] },
  "WEB DEVELOPMENT": { youtube:[{label:"Traversy Media — Frontend",url:"https://www.youtube.com/results?search_query=traversy+media+frontend"},{label:"Net Ninja — JS/React",url:"https://www.youtube.com/results?search_query=net+ninja+react"}], books:["Eloquent JavaScript — Marijn Haverbeke","You Don’t Know JS — Kyle Simpson"] }
};

const MOTIVATIONAL_LINES = [
  "Small steps daily become giant leaps over time.",
  "Show up. Even 20 focused minutes compounds.",
  "Clarity > Intensity — plan first, then execute.",
  "Your future self is watching. Make them proud.",
  "Momentum beats perfection — move the needle.",
  "Deep work now, freedom later.",
  "Discipline is a form of self-love.",
  "Track your rise; your graph will thank you.",
  "Study the hard parts first — win the day early.",
  "Consistency turns goals into identity."
];

// State (vanilla)
let state = {
  active: 'Home',
  menuOpen: false,
  profile: readLS('md_profile', defaultProfile),
  grades: readLS('md_grades', defaultGrades),
  attendance: readLS('md_attendance', defaultAttendance),
  scheduleGrid: readLS('md_scheduleGrid', defaultScheduleGrid),
  exams: readLS('md_exams', defaultExams),
  assignments: readLS('md_assignments', defaultAssignments),
  resources: readLS('md_resources', defaultResources),
  settings: readLS('md_settings', { theme:'delphi', showSaturday:true, enableMotivation:true, uiScale:100 }),
  notices: readLS('md_notices', [
    { title:'Welcome to RiseTrack!', detail:'Customize your theme in Settings.', ts:Date.now()-1000*60*60 },
    { title:'DSA Midterm in 2 days', detail:'Revise trees & hashing.', ts:Date.now()-1000*60*30 },
  ]),
  showNotices:false,
  quote:"",
  showPom:false,
  pom:{ mode:'work', times:{work:25, short:5, long:15}, remaining:25*60, running:false, cycles:0 },
  query:"",
};

// Persistence helpers
function persist(){
  writeLS('md_profile', state.profile);
  writeLS('md_grades', state.grades);
  writeLS('md_attendance', state.attendance);
  writeLS('md_scheduleGrid', state.scheduleGrid);
  writeLS('md_exams', state.exams);
  writeLS('md_assignments', state.assignments);
  writeLS('md_settings', state.settings);
  writeLS('md_notices', state.notices);
}

// Theme/apply
function applyTheme(){
  const root = document.documentElement;
  const palettes = {
    delphi:["#007AFF","#00C6FF","#5BE7FF"],
    aurora:["#ff7ab6","#8fd3ff","#ffe24a"],
    grove:["#9bff7a","#55ffe0","#ffd36e"],
    sunset:["#ff7a59","#ffd166","#8ec5ff"],
    oceanic:["#00e0ff","#1de9b6","#7ad7ff"],
    mono:["#cfcfea","#9aa0b7","#fff3a3"],
  };
  const pal = palettes[state.settings.theme] || palettes.delphi;
  root.style.setProperty('--acc-1', pal[0]);
  root.style.setProperty('--acc-2', pal[1]);
  root.style.setProperty('--acc-3', pal[2]);
  root.style.setProperty('font-size', `${state.settings.uiScale}%`);
}

// Calculations
function scoreToGrade(s){ return s>=90?"A+":s>=85?"A":s>=75?"B+":s>=65?"B":s>=55?"C":s>=45?"D":s>=35?"E":"F"; }
function percentColor(p){ return p>=85? 'var(--ok)': p>=70? 'var(--warn)': 'var(--danger)'; }
function gpa(){ const map={"A+":10,"A":9,"B+":8,"B":7,"C":6,"D":5,"E":4,"F":0}; return (state.grades.reduce((s,g)=>s+(map[scoreToGrade(g.score)]||0),0)/state.grades.length).toFixed(2); }
function avgAttendance(){ const p=state.attendance.map(a=>Math.round((a.attended/Math.max(1,a.total))*100)); return Math.round(p.reduce((s,x)=>s+x,0)/p.length); }
function overallProgress(){ const ps=state.assignments.map(a=>a.progress); return Math.round(ps.reduce((s,x)=>s+x,0)/Math.max(1,ps.length)); }

// Render helpers
function el(tag, attrs={}, ...children){
  const e = document.createElement(tag);
  for(const [k,v] of Object.entries(attrs||{})){
    if (k==='class') e.className=v; else if(k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v); else if(k==='html') e.innerHTML=v; else e.setAttribute(k, v);
  }
  children.flat().forEach(c=>{ if(c==null) return; if(typeof c==='string') e.appendChild(document.createTextNode(c)); else e.appendChild(c); });
  return e;
}

function render(){
  applyTheme();
  if (!state.quote && state.settings.enableMotivation){
    const idx = Math.floor(Math.random()*MOTIVATIONAL_LINES.length);
    state.quote = MOTIVATIONAL_LINES[idx];
  }

  const app = document.getElementById('app');
  app.innerHTML='';

  // Backgrounds
  app.appendChild(el('div',{class:'bg-stars'}));
  app.appendChild(el('div',{class:'bg-pastel'}));
  app.appendChild(floatingDecor());

  // Hamburger and overlay
  const hamburger = el('button',{class:'hamburger', ariaLabel:'Toggle Menu', onClick:()=>{ state.menuOpen=!state.menuOpen; render(); }});
  const overlay = el('div',{class:'overlay ' + (state.menuOpen?'show':''), onClick:()=>{ state.menuOpen=false; render(); }});
  app.appendChild(hamburger);
  app.appendChild(overlay);

  // Sidebar
  const navItems = [["Home","🏛️"],["Profile","👤"],["Schedule","🗓️"],["Assignments","📝"],["Grades","📊"],["Attendance","🎯"],["Resources","📚"],["Settings","⚙️"]];
  const searchInput = el('input',{placeholder:'Search: profile / grades / dsa / dbms …', value:state.query});
  searchInput.addEventListener('input', e=> state.query = e.target.value);
  searchInput.addEventListener('keydown', e=> { if(e.key==='Enter') doSearch(); });
  const sidebar = el('aside',{class:'sidebar ' + (state.menuOpen?'':'closed')},
    el('div',{class:'brand'},
      el('div',{class:'logo', ariaHidden:'true'}),
      el('div',{},
        el('h1',{},'RiseTrack'),
        el('div',{class:'subtitle'},'Inspire your goals; track your rise')
      )
    ),
    el('div',{class:'search'},
      searchInput,
      el('button',{onClick:doSearch},'Go')
    ),
    el('nav',{class:'nav'},
      navItems.map(([label,icon])=> el('button',{class: state.active===label?'active':'', title:label, onClick:()=>{ state.active=label; state.menuOpen=false; render(); }}, el('span',{style:'font-size:1.15rem'},icon), el('span',{},label)))
    )
  );

  // Main
  const header = el('header',{class:'header'},
    el('h2',{class:'head-title'}, state.active==='Home' ? 'Dashboard — The Rise Tracker' : state.active),
    el('div',{class:'head-right'},
      el('span',{},'GPA: ', el('strong',{}, gpa())),
      el('span',{},'Attendance: ', el('strong',{}, avgAttendance()+'%')),
      el('span',{},'Momentum: ', el('strong',{}, overallProgress()+'%')),
      noticeCenter()
    )
  );

  const main = el('main',{class:'main'}, header, renderActive());

  // Wrap sidebar + main inside .app to match CSS layout
  const wrapper = el('div',{class:'app'}, sidebar, main);

  // Pomodoro toggle + panel
  const pomFab = el('button',{class:'pomodoro-fab', title:'Pomodoro', onClick:()=>{ state.showPom=!state.showPom; render(); }}, '⏱️');
  app.append(wrapper, pomFab);
  if (state.showPom) app.appendChild(pomPanel());
}

function doSearch(){
  const q = (state.query||'').trim().toLowerCase();
  if(!q) return;
  state.menuOpen = true;
  const sections = ['home','profile','schedule','assignments','grades','attendance','resources','settings'];
  const hit = sections.find(s=> s===q);
  if (hit){ state.active = hit[0].toUpperCase()+hit.slice(1); render(); return; }
  const subHit = SUBJECTS.find(s=> s.toLowerCase().includes(q));
  state.active = subHit ? 'Resources' : 'Home';
  render();
  if (subHit){ setTimeout(()=>{
    const el = document.getElementById(`res-${subHit.replace(/\s+/g,'-')}`);
    if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
  },50); }
}

function floatingDecor(){
  const wrap = el('div',{class:'fdecor', ariaHidden:'true'});
  const color = 'rgba(255,255,255,0.16)';
  const items=[
    {type:'book', left:'8%', top:'18%', size:72, cls:'floatA'},
    {type:'trophy', left:'82%', top:'16%', size:84, cls:'floatB'},
    {type:'pencil', left:'18%', top:'72%', size:70, cls:'floatC'},
    {type:'lamp', left:'66%', top:'78%', size:64, cls:'floatA'},
  ];
  items.forEach((it,i)=>{
    let svg;
    if (it.type==='book') svg = `<g fill="${color}"><rect x="8" y="14" width="44" height="32" rx="4"/><path d="M8 14c4-6 14-8 22-8s18 2 22 8v32c-4-6-14-8-22-8s-18 2-22 8V14z" /><rect x="16" y="22" width="20" height="4" rx="2" fill="rgba(255,255,255,0.28)"/><rect x="16" y="30" width="26" height="4" rx="2" fill="rgba(255,255,255,0.22)"/></g>`;
    else if (it.type==='trophy') svg = `<g fill="${color}"><path d="M12 8h40v10c0 8-6 14-14 14H26c-8 0-14-6-14-14V8z"/><rect x="22" y="34" width="20" height="6" rx="2"/><rect x="18" y="42" width="28" height="6" rx="3"/></g>`;
    else if (it.type==='lamp') svg = `<g fill="${color}"><circle cx="28" cy="20" r="16"/><rect x="24" y="36" width="8" height="10" rx="2"/><rect x="18" y="46" width="20" height="6" rx="3"/></g>`;
    else svg = `<g><rect x="8" y="22" width="44" height="8" rx="4" fill="${color}"/><polygon points="52,22 62,26 52,30" fill="rgba(255,255,255,0.22)" /><rect x="8" y="19" width="6" height="14" rx="3" fill="rgba(255,255,255,0.28)"/></g>`;
    const node = el('svg',{class:it.cls, width:it.size, height:it.size, style:`position:absolute; left:${it.left}; top:${it.top}`});
    node.innerHTML = svg;
    wrap.appendChild(node);
  });
  return wrap;
}

function noticeCenter(){
  const wrap = el('div',{class:'notice-wrap'});
  const btn = el('button',{class:'notice-btn', ariaLabel:'Notices', onClick:()=>{ state.showNotices=!state.showNotices; render(); }}, '🔔');
  if (state.notices.length>0) btn.appendChild(el('span',{class:'notice-badge'}, String(state.notices.length)));
  const list = el('div',{class:'notices ' + (state.showNotices?'show':'')},
    el('div',{style:'display:flex; justify-content:space-between; align-items:center'},
      el('strong',{},'Notices'),
      el('button',{class:'btn', onClick:()=>{ state.notices=[]; persist(); render(); }}, 'Clear')
    ),
    ...(state.notices.length? state.notices.map(n=> el('div',{class:'notice'}, el('div',{style:'font-weight:700'}, n.title), el('small',{}, n.detail))) : [el('div',{class:'notice'}, el('small',{},'No new notices.'))])
  );
  wrap.append(btn, list);
  return wrap;
}

function renderActive(){
  switch(state.active){
    case 'Home': return renderHome();
    case 'Profile': return renderProfile();
    case 'Schedule': return renderSchedule();
    case 'Assignments': return renderAssignments();
    case 'Grades': return renderGrades();
    case 'Attendance': return renderAttendance();
    case 'Resources': return renderResources();
    case 'Settings': return renderSettings();
    default: return el('section',{}, el('div',{},'Unknown'));
  }
}

function renderHome(){
  const top3 = [...state.assignments].sort((a,b)=> a.progress-b.progress).slice(0,3);
  const hero = el('div',{class:'dash-hero'},
    el('h3',{}, `Welcome Back, ${state.profile.name.split(' ')[0]}!`),
    el('p',{}, `"${state.quote || 'The journey of learning begins with a single step.'}"`)
  );

  const nextClass = el('div',{class:'stat-card'},
    el('div',{class:'stat-title'}, 'Next Class'),
    el('div',{class:'stat-value'}, 'JAVA'),
    el('div',{style:'color:var(--muted); font-weight:600; margin-top:4px'}, '02:00 PM · Room 203')
  );
  const nextAssign = el('div',{class:'stat-card'},
    el('div',{class:'stat-title'}, 'Next Assignment'),
    el('div',{class:'stat-value'}, 'DBMS'),
    el('div',{style:'color:var(--muted); font-weight:600; margin-top:4px'}, 'Due: '+ (state.assignments[1]?.due||''))
  );
  const attPct = avgAttendance();
  const attCard = el('div',{class:'stat-card'},
    el('div',{class:'stat-title'}, 'Attendance'),
    el('div',{class:'stat-value'}, `${attPct}%`),
    el('div',{class:'kpi-bar'}, el('span',{style:`width:${attPct}%`}))
  );

  const statRow = el('div',{class:'stat-row'}, nextClass, nextAssign, attCard);

  const progressCard = el('div',{class:'card'},
    el('h3',{},'Assignment Progress'),
    el('div',{class:'momentum-list'},
      state.assignments.map(a=> el('div',{class:'momentum-row'},
        el('div',{}, el('span',{class:'title'},a.title), el('span',{class:'subject'},` • ${a.subject}`)),
        el('div',{class:'progress'}, el('span',{style:`width:${a.progress}%`})),
        el('div',{class:'percent'}, `${a.progress}% ${a.progress===100?'🏆':''}`)
      ))
    ),
    el('div',{class:'timeline'},
      el('div',{class:'t-item'}, el('div',{class:'t-title'},'Focus the low-progress tasks first'), el('div',{class:'t-sub'},`Try these next: ${top3.map(t=>t.title).join(', ')}`)),
      el('div',{class:'t-item'}, el('div',{class:'t-title'},'Review one tough concept today'), el('div',{class:'t-sub'},'Even 15 minutes creates momentum.'))
    )
  );

  const deadlinesCard = el('div',{class:'card'},
    el('h3',{},'Upcoming Deadlines'),
    el('div',{class:'list'},
      ...state.assignments.slice(0,4).map(a=> el('div',{class:'list-item'},
        el('div',{}, el('div',{style:'font-weight:800'}, a.subject), el('div',{style:'color:var(--muted)'}, a.title)),
        el('div',{}, el('span',{class:'tag'}, a.due))
      ))
    )
  );

  const left = el('div',{class:'dash-left'}, el('div',{class:'card'}, hero), el('div',{class:'card'}, statRow), progressCard);
  const right = el('div',{class:'dash-right'},
    el('div',{class:'card'}, el('h3',{}, 'College Notices'),
      el('div',{class:'list'},
        ...(state.notices.length? state.notices.map(n=> el('div',{class:'list-item'}, el('div',{}, el('div',{style:'font-weight:800'}, n.title), el('small',{style:'color:var(--muted)'}, n.detail)), el('span',{class:'tag'}, 'Info'))) : [el('div',{class:'list-item'}, el('small',{style:'color:var(--muted)'}, 'No notices'))])
      )
    ),
    deadlinesCard,
    el('div',{class:'card'}, el('h3',{}, 'Quick Stats'),
      el('div',{style:'display:flex; align-items:center; gap:16px; flex-wrap:wrap'}, donutProgress(attPct, 120, 12), el('div',{}, el('div',{style:'color:var(--muted); font-weight:700'}, 'Average Attendance'), el('div',{style:'font-size:1.3rem; font-weight:800'}, `${attPct}%`)))
    )
  );

  return el('section',{class:'grid home'}, el('div',{class:'span-12'}, el('div',{class:'dash-grid'}, left, right)));
}

function renderProfile(){
  const grid = el('div',{style:'display:grid; gap:12px; margin-top:8px'});
  const name = el('input',{class:'input', value:state.profile.name});
  const roll = el('input',{class:'input', value:state.profile.roll});
  const program = el('input',{class:'input', value:state.profile.program});
  const semester = el('input',{class:'input', value:state.profile.semester});
  const phone = el('input',{class:'input', value:state.profile.phone});
  const email = el('input',{class:'input', value:state.profile.email});
  const save = el('button',{class:'btn', onClick:()=>{ state.profile={ name:name.value, roll:roll.value, program:program.value, semester:semester.value, phone:phone.value, email:email.value }; persist(); render(); }}, 'Save');
  const cancel = el('button',{class:'btn', onClick:render}, 'Cancel');
  grid.append(
    el('div',{}, el('label',{class:'label'},'Full Name'), name),
    el('div',{style:'display:grid; grid-template-columns:1fr 1fr; gap:12px'},
      el('div',{}, el('label',{class:'label'},'Roll No.'), roll),
      el('div',{}, el('label',{class:'label'},'Program'), program)
    ),
    el('div',{style:'display:grid; grid-template-columns:1fr 1fr; gap:12px'},
      el('div',{}, el('label',{class:'label'},'Semester'), semester),
      el('div',{}, el('label',{class:'label'},'Phone'), phone)
    ),
    el('div',{}, el('label',{class:'label'},'Email'), email),
    el('div',{style:'display:flex; gap:10px'}, save, cancel)
  );
  return el('section',{class:'grid'}, el('div',{class:'card span-12'}, el('h3',{},'Student Profile'), grid));
}

function renderSchedule(){
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat"];
  return el('section',{class:'grid'},
    el('div',{class:'card span-12 timetable'},
      el('h3',{},'Weekly Timetable'),
      el('div',{class:'tgrid'},
        el('div',{class:'thdr'}, el('div',{class:'tcell timecell'},'Time'), ...days.map(d=> el('div',{class:'tcell'},d))),
        ...defaultScheduleSlots.map(time=> el('div',{class:'trow'},
          el('div',{class:'tcell timecell'}, time),
          ...Array.from({length:6}).map((_,i)=>{
            const subj = (state.scheduleGrid[time] && state.scheduleGrid[time][i]) || '';
            return el('div',{class:'tcell'}, subj? el('span',{class:'badge'}, subj) : el('span',{style:'color:var(--muted)'},'—'));
          })
        ))
      )
    ),
    el('div',{class:'card span-12 exams-box'},
      el('h3',{},'Exams & Tests'),
      el('div',{class:'exam-grid'}, ...state.exams.map(e=> el('div',{class:'exam-card'}, el('div',{class:'exam-title'}, el('strong',{}, e.title)), el('div',{class:'exam-meta'}, el('span',{}, e.date), e.time? el('span',{}, ' • '+e.time): ''))))
    )
  );
}

function renderAssignments(){
  const container = el('section',{class:'grid'});
  const card = el('div',{class:'card span-12'});
  card.appendChild(el('h3',{},'Assignments'));
  const controls = el('div',{style:'display:flex; gap:10px; margin-bottom:12px'});
  let filter = 'all';
  controls.append(
    el('button',{class:'btn', onClick:()=>{ filter='all'; table(); }}, 'All'),
    el('button',{class:'btn', onClick:()=>{ filter='open'; table(); }}, 'Incomplete'),
    el('button',{class:'btn', onClick:()=>{ filter='done'; table(); }}, 'Completed')
  );
  card.appendChild(controls);

  const tableWrap = el('div');
  card.appendChild(tableWrap);
  function table(){
    tableWrap.innerHTML='';
    const filtered = state.assignments.filter(a => filter==='done'? a.done : filter==='open'? !a.done : true);
    const table = el('table',{class:'table'});
    const thead = el('thead',{}, el('tr',{}, el('th',{},'Title'), el('th',{},'Subject'), el('th',{},'Due'), el('th',{},'Progress'), el('th',{},'Status')));
    const tbody = el('tbody');
    filtered.forEach((a,i)=>{
      const tr = el('tr');
      const input = el('input',{class:'input', type:'number', min:'0', max:'100', value:String(a.progress)});
      input.addEventListener('input', e=>{ a.progress = clamp(Number(e.target.value||0),0,100); if(a.progress===100) a.done=true; persist(); table(); render(); });
      tr.append(
        el('td',{}, el('strong',{}, a.title)),
        el('td',{}, a.subject),
        el('td',{}, a.due),
        el('td',{style:'min-width:220px'},
          el('div',{class:'progress'}, el('span',{style:`width:${a.progress}%`})),
          el('div',{style:'font-size:.85rem; color:var(--muted)'}, `${a.progress}%`),
          (!a.done? el('div',{style:'display:flex; gap:8px; margin-top:8px'}, input, el('span',{style:'color:var(--muted); align-self:center'},'%')): null)
        ),
        el('td',{}, el('button',{class:'btn', onClick:()=>{ a.done=!a.done; if(a.done) a.progress=100; persist(); table(); render(); }}, a.done? 'Completed 🏆':'Mark Done'))
      );
      tbody.appendChild(tr);
    });
    table.append(thead, tbody);
    tableWrap.appendChild(table);
    // Milestones below
    card.appendChild(el('h3',{style:'margin-top:18px'},'Progress Timeline'));
    card.appendChild(milestoneTimeline(state.assignments));
  }
  table();
  container.appendChild(card);
  return container;
}

function milestoneTimeline(items){
  const steps=[0,20,40,60,80,100];
  const wrap = el('div',{class:'mtimeline'});
  items.forEach((a, idx)=>{
    const nearest = steps.reduce((best,s)=> Math.abs(s-a.progress) < Math.abs(best-a.progress) ? s : best, 0);
    const row = el('div',{class:'mrow'},
      el('div',{class:'mtitle'}, a.title, el('span',{class:'sub'}, ` • ${a.subject}`)),
      el('div',{class:'mtrack'},
        el('span',{class:'mfill', style:`width:${nearest}%`}),
        el('div',{class:'milestones'},
          steps.map(step=> el('button',{class:'mdot '+(a.progress>=step?'active':''), title:String(step)+'%', onClick:()=>{ a.progress = step; a.done = (step===100); persist(); render(); } }))
        )
      ),
      el('div',{class:'mpercent'}, `${a.progress}% ${a.progress===100?'🏆':''}`)
    );
    wrap.appendChild(row);
  });
  return wrap;
}

function renderGrades(){
  const table = el('table',{class:'table'});
  const thead = el('thead',{}, el('tr',{}, el('th',{},'Subject'), el('th',{},'Marks'), el('th',{},'Grade')));
  const tbody = el('tbody');
  state.grades.forEach((r,i)=>{
    const input = el('input',{class:'input', type:'number', min:'0', max:'100', value:String(r.score)});
    input.addEventListener('input', e=>{ r.score = clamp(Number(e.target.value||0),0,100); persist(); render(); });
    const tr = el('tr',{}, el('td',{}, r.subject), el('td',{}, input), el('td',{}, el('strong',{}, scoreToGrade(r.score))));
    tbody.appendChild(tr);
  });
  table.append(thead, tbody);
  return el('section',{class:'grid'}, el('div',{class:'card span-12'}, el('h3',{},'Subject-wise Grades'), table, el('p',{style:'color:var(--muted); margin-top:10px'}, 'Grades are auto-calculated from marks.')));
}

function renderAttendance(){
  const grid = el('section',{class:'grid'});
  state.attendance.forEach((a,i)=>{
    const pct = Math.round((a.attended/Math.max(1,a.total))*100);
    const card = el('div',{class:'card span-3'}, el('h3',{}, a.subject));
    const svg = donutProgress(pct, 90, 10);
    const inc = el('button',{class:'btn', onClick:()=>{ a.attended=Math.min(a.attended+1,a.total); persist(); render(); }}, '+ Att');
    const dec = el('button',{class:'btn', onClick:()=>{ a.attended=Math.max(0,a.attended-1); persist(); render(); }}, '- Att');
    const needed = Math.ceil(0.75*a.total - a.attended);
    const tip = el('p',{class:'att-tip'}, needed<=0? '✅ You are above 75% attendance!' : `📘 Attend ${needed} more lecture${needed>1?'s':''} to reach 75%.`);
    const right = el('div',{style:'color:var(--muted)'},
      el('div',{class:'kpi-bar', title:String(pct)+'%'}, el('span',{style:`width:${pct}%`})),
      el('div',{style:'margin-top:8px'}, 'Attended ', el('strong',{}, String(a.attended)), ' / ', String(a.total)),
      el('div',{style:'display:flex; gap:6px; margin-top:8px; flex-wrap:wrap'}, inc, dec), tip
    );
    const row = el('div',{style:'display:flex; align-items:center; gap:14px; flex-wrap:wrap'}, svg, right);
    card.appendChild(row);
    grid.appendChild(card);
  });
  // Add overall attendance chart
  const chartCard = el('div',{class:'card span-12'});
  chartCard.appendChild(el('h3',{},'Attendance Overview'));
  const overviewRow = el('div',{class:'att-overview'});
  const maxBar = 140; // px visual range for bars
  const chartWrap = el('div',{class:'att-bars', style:`position:relative; height:${maxBar+34}px; padding:12px 12px 22px; border:1px solid rgba(255,255,255,.08); border-radius:12px; background:rgba(255,255,255,.03)`});
  // 75% threshold line
  const thrY = Math.round(maxBar*0.75);
  const thr = el('div',{style:`position:absolute; left:10px; right:10px; bottom:${thrY}px; height:2px; background:rgba(255,255,255,.18)`});
  const thrBadge = el('div',{style:`position:absolute; right:10px; bottom:${thrY+4}px; font-size:.8rem; color:var(--muted)`}, '75%');
  chartWrap.append(thr, thrBadge);

  state.attendance.forEach(a=>{
    const pct = Math.round((a.attended/Math.max(1,a.total))*100);
    const h = Math.max(8, Math.round(maxBar * pct / 100));
    const bar = el('div',{style:`flex:1; display:flex; flex-direction:column; align-items:center; gap:6px`},
      el('div',{style:'font-size:.85rem; color:var(--muted)'}, `${pct}%`),
      el('div',{title:String(pct)+'%', style:`width:26px; height:${h}px; background:linear-gradient(180deg, var(--acc-2), var(--acc-1)); border-radius:8px; box-shadow: var(--shadow);`}),
      el('small',{style:'color:var(--muted); text-align:center'}, a.subject.split(' ').map(w=>w[0]).join('').slice(0,3))
    );
    chartWrap.appendChild(bar);
  });
  // Overall circular donut on the left
  const avg = avgAttendance();
  const donutBox = el('div',{class:'att-donut'});
  donutBox.appendChild(el('div',{style:'display:grid; place-items:center; padding:10px; border:1px solid rgba(255,255,255,.08); border-radius:12px; background:rgba(255,255,255,.03)'}));
  const donutInner = donutBox.firstChild;
  donutInner.appendChild(donutProgress(avg, 140, 12));
  donutInner.appendChild(el('div',{style:'margin-top:6px; color:var(--muted); font-weight:700'}, `Average: ${avg}%`));

  overviewRow.append(donutBox, chartWrap);
  chartCard.appendChild(overviewRow);
  grid.appendChild(chartCard);
  return grid;
}

function circleProgress(pct){
  const r=38, c=2*Math.PI*r, val=c - (c*pct/100);
  const wrap = el('div',{class:'circular', title:String(pct)+'%'});
  const svg = el('svg',{width:'90', height:'90'});
  const c1 = el('circle',{cx:'45', cy:'45', r:String(r), stroke:'rgba(255,255,255,.12)', strokeWidth:'8', fill:'none'});
  const c2 = el('circle',{cx:'45', cy:'45', r:String(r), stroke:percentColor(pct), strokeWidth:'8', fill:'none'});
  c2.setAttribute('stroke-dasharray', String(c));
  c2.setAttribute('stroke-dashoffset', String(val));
  c2.setAttribute('stroke-linecap', 'round');
  svg.append(c1,c2);
  const num = el('div',{class:'num'}, String(pct)+'%');
  wrap.append(svg, num);
  return wrap;
}

// Larger donut chart for overview
function donutProgress(pct, size=140, stroke=14){
  const r = (size/2) - stroke;
  const c = 2*Math.PI*r;
  const val = c - (c*pct/100);
  const box = el('div',{style:`position:relative; width:${size}px; height:${size}px`});
  const svg = el('svg',{width:String(size), height:String(size), style:'transform:rotate(-90deg)'});
  const cx = size/2, cy = size/2;
  const base = el('circle',{cx:String(cx), cy:String(cy), r:String(r), stroke:'rgba(255,255,255,.12)', strokeWidth:String(stroke), fill:'none'});
  const prog = el('circle',{cx:String(cx), cy:String(cy), r:String(r), stroke:'url(#grad)'});
  prog.setAttribute('stroke-width', String(stroke));
  prog.setAttribute('fill','none');
  prog.setAttribute('stroke-dasharray', String(c));
  prog.setAttribute('stroke-dashoffset', String(val));
  prog.setAttribute('stroke-linecap','round');
  // simple gradient by using solid stroke from theme vars
  prog.setAttribute('stroke', 'var(--acc-2)');
  svg.append(base, prog);
  const center = el('div',{style:'position:absolute; inset:0; display:grid; place-items:center; font-weight:800; font-size:1.2rem'}, `${pct}%`);
  box.append(svg, center);
  return box;
}

function renderResources(){
  const section = el('section',{class:'grid'});
  SUBJECTS.forEach((s,idx)=>{
    const r = state.resources[s] || { youtube:[], books:[] };
    const card = el('div',{class:'card span-6', id:`res-${s.replace(/\s+/g,'-')}`},
      el('h3',{}, `${s} • Resources`),
      el('div',{class:'subject-card'}, el('div',{style:'font-weight:700'},'YouTube / Playlists'), el('div',{class:'resource-list'}, ...(r.youtube.length? r.youtube.map(y=> el('a',{href:y.url, target:'_blank', rel:'noreferrer'}, '▶ ', y.label)) : [el('em',{style:'color:var(--muted)'},'No links yet.')]))),
      el('div',{class:'subject-card', style:'margin-top:12px'}, el('div',{style:'font-weight:700'},'Reference Books'), el('ul',{style:'margin:0; padding-left:16px'}, ...(r.books.length? r.books.map(b=> el('li',{}, b)) : [el('em',{style:'color:var(--muted)'},'No books added yet.')]))),
    );
    section.appendChild(card);
  });
  return section;
}

function renderSettings(){
  const left = el('div',{class:'card span-6'},
    el('h3',{},'Appearance'),
    el('label',{class:'label'},'Theme'),
    (()=>{
      const sel = el('select',{class:'select'});
      ['delphi','aurora','grove','sunset','oceanic','mono'].forEach(v=> sel.appendChild(el('option',{value:v, selected: state.settings.theme===v? 'selected': null}, v.charAt(0).toUpperCase()+v.slice(1))));
      sel.addEventListener('change', e=>{ state.settings.theme=e.target.value; persist(); render(); });
      return sel;
    })(),
    el('label',{class:'label', style:'margin-top:12px'},'UI Scale'),
    (()=>{ const inp=el('input',{class:'input', type:'number', min:'80', max:'120', value:String(state.settings.uiScale)}); inp.addEventListener('input', e=>{ state.settings.uiScale = clamp(Number(e.target.value||100),80,120); persist(); render(); }); return inp; })()
  );

  const right = el('div',{class:'card span-6'},
    el('h3',{},'Behavior'),
    (()=>{ const lab=el('label',{}); const inp=el('input',{type:'checkbox'}); inp.checked = !!state.settings.enableMotivation; inp.addEventListener('change', e=>{ state.settings.enableMotivation = e.target.checked; if(!e.target.checked) state.quote=''; persist(); render(); }); lab.append(inp, ' Show motivational line on load'); return lab; })(),
    (()=>{ const lab=el('label',{}); const inp=el('input',{type:'checkbox'}); inp.checked = !!state.settings.showSaturday; inp.addEventListener('change', e=>{ state.settings.showSaturday = e.target.checked; persist(); render(); }); lab.append(inp, ' Include Saturday in schedule (UI only)'); return lab; })(),
    el('div',{style:'margin-top:12px'}, el('button',{class:'btn', onClick:()=>{ writeLS('md_profile', defaultProfile); writeLS('md_grades', defaultGrades); writeLS('md_attendance', defaultAttendance); writeLS('md_scheduleGrid', defaultScheduleGrid); writeLS('md_exams', defaultExams); writeLS('md_assignments', defaultAssignments); writeLS('md_resources', defaultResources); location.reload(); }}, 'Reset to Demo Data'))
  );

  const about = el('div',{class:'card span-12'}, el('h3',{},'About'), el('p',{style:'color:var(--muted)'}, 'RiseTrack is a frontend-only companion. Use the search to jump to sections or subjects, toggle themes, and track your rise daily.'));

  return el('section',{class:'grid'}, left, right, about);
}

function pomPanel(){
  const p = state.pom;
  const panel = el('div',{class:'pomodoro-panel'});
  const top = el('div',{style:'display:flex; justify-content:space-between; align-items:center'}, el('strong',{},'Pomodoro'), el('div',{style:'display:flex; gap:6px'}, el('button',{class:'btn', onClick:()=> setMode('work')}, 'Work'), el('button',{class:'btn', onClick:()=> setMode('short')}, 'Short'), el('button',{class:'btn', onClick:()=> setMode('long')}, 'Long')));
  const time = el('div',{class:'pom-time'}, fmt(p.remaining));
  const controls = el('div',{class:'pom-controls'}, el('button',{class:'btn', onClick:()=>{ p.running=!p.running; tick(); render(); }}, p.running? 'Pause':'Start'), el('button',{class:'btn', onClick:()=>{ p.remaining=durForMode(p.mode); p.running=false; render(); }}, 'Reset'));
  const row = el('div',{class:'pom-row'},
    numInput('Work (min)', p.times.work, 10, 60, v=>{ p.times.work=v; if(p.mode==='work' && !p.running) p.remaining=durForMode('work'); persist(); render(); }),
    numInput('Short (min)', p.times.short, 3, 20, v=>{ p.times.short=v; if(p.mode==='short' && !p.running) p.remaining=durForMode('short'); persist(); render(); }),
    numInput('Long (min)', p.times.long, 10, 40, v=>{ p.times.long=v; if(p.mode==='long' && !p.running) p.remaining=durForMode('long'); persist(); render(); })
  );
  const cycles = el('p',{style:'color:var(--muted); margin-top:8px'}, 'Completed work cycles: ', el('strong',{}, String(p.cycles)));
  panel.append(top, time, controls, row, cycles);
  return panel;
}

function numInput(label, val, min, max, onChange){
  const wrap = el('div',{style:'flex:1'});
  wrap.append(el('label',{class:'label'}, label));
  const inp = el('input',{class:'input', type:'number', min:String(min), max:String(max), value:String(val)});
  inp.addEventListener('input', e=> onChange(clamp(Number(e.target.value||val),min,max)) );
  wrap.append(inp); return wrap;
}

let intervalId;
function tick(){
  clearInterval(intervalId);
  if (!state.pom.running) return;
  intervalId = setInterval(()=>{
    if (state.pom.remaining<=1){
      if (state.pom.mode==='work'){
        state.pom.cycles += 1;
        const nextMode = (state.pom.cycles % 4 === 0) ? 'long' : 'short';
        setMode(nextMode);
        state.pom.remaining = durForMode(nextMode);
      } else {
        setMode('work');
        state.pom.remaining = durForMode('work');
      }
      persist();
    } else {
      state.pom.remaining -= 1;
    }
    const tEl = document.querySelector('.pom-time');
    if (tEl) tEl.textContent = fmt(state.pom.remaining);
  }, 1000);
}
function durForMode(m){ const t=state.pom.times; return (m==='work'? t.work : m==='short'? t.short : t.long)*60; }
function setMode(m){ state.pom.mode=m; if(!state.pom.running) state.pom.remaining = durForMode(m); }
function fmt(s){ const m=Math.floor(s/60).toString().padStart(2,'0'); const ss=Math.floor(s%60).toString().padStart(2,'0'); return `${m}:${ss}`; }

// Kickoff
document.addEventListener('DOMContentLoaded', ()=>{
  render();
});



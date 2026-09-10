/* ---------- loader ---------- */
window.addEventListener('load', ()=>{
  setTimeout(()=>{ document.getElementById('loader').classList.add('hide'); }, 900);
});

/* ---------- theme toggle ---------- */
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', ()=>{
  document.documentElement.classList.toggle('light');
  themeToggle.textContent = document.documentElement.classList.contains('light') ? '◑' : '◐';
});

/* ---------- scroll progress + back to top + nav bg ---------- */
const progress = document.getElementById('progress');
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', ()=>{
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  progress.style.width = scrolled + '%';
  if(h.scrollTop > 500){ toTop.classList.add('show'); } else { toTop.classList.remove('show'); }
});
toTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

/* ---------- cursor glow + magnetic buttons ---------- */
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e)=>{
  glow.style.opacity = '1';
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});
document.addEventListener('mouseleave', ()=> glow.style.opacity = '0');

document.querySelectorAll('.magnetic').forEach(btn=>{
  btn.addEventListener('mousemove', (e)=>{
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top - r.height/2;
    btn.style.transform = `translate(${x*0.18}px, ${y*0.3}px)`;
  });
  btn.addEventListener('mouseleave', ()=>{ btn.style.transform=''; });
});

/* ---------- floating particles ---------- */
const particlesEl = document.getElementById('particles');
for(let i=0;i<28;i++){
  const p = document.createElement('div');
  p.className='particle';
  p.style.left = Math.random()*100+'vw';
  p.style.bottom = '-10px';
  p.style.animationDuration = (10+Math.random()*14)+'s';
  p.style.animationDelay = (Math.random()*10)+'s';
  const colors=['#3B82F6','#10B981','#8B5CF6'];
  p.style.background = colors[i%3];
  particlesEl.appendChild(p);
}

/* ---------- reveal on scroll ---------- */
const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
const io = new IntersectionObserver((entries)=>{
  entries.forEach((entry, i)=>{
    if(entry.isIntersecting){
      setTimeout(()=> entry.target.classList.add('in'), i*40);
      io.unobserve(entry.target);
    }
  });
}, {threshold:0.15});
revealEls.forEach(el=> io.observe(el));



/* ---------- terminal typing effect ---------- */
const termBody = document.getElementById('termBody');
const termScript = [
  {type:'cmd', text:'whoami'},
  {type:'out', text:'peeyush'},
  {type:'cmd', text:'skills'},
  {type:'out', text:'C / C++\nJava\nPython\nLinux & Cybersecurity\nData Structures'},
  {type:'cmd', text:'status'},
  {type:'out', text:'Building secure software & problem-solving...'},
];
async function typeLine(text, className){
  const line = document.createElement('div');
  line.className = 'term-line ' + className;
  termBody.appendChild(line);
  for(let i=0;i<text.length;i++){
    line.textContent += text[i];
    await new Promise(r=>setTimeout(r, className==='term-prompt' ? 45 : 8));
  }
  return line;
}
async function runTerminal(){
  for(const step of termScript){
    if(step.type==='cmd'){
      const line = document.createElement('div');
      line.className='term-line';
      termBody.appendChild(line);
      let prompt = '<span class="term-prompt">peeyush@devbox</span><span style="color:var(--text-dim);">:~$ </span>';
      line.innerHTML = prompt;
      let content='';
      for(let i=0;i<step.text.length;i++){
        content += step.text[i];
        line.innerHTML = prompt + content + '<span class="cursor-blink"></span>';
        await new Promise(r=>setTimeout(r,55));
      }
      line.innerHTML = prompt + content;
      await new Promise(r=>setTimeout(r,250));
    } else {
      const out = document.createElement('div');
      out.className='term-line term-out';
      termBody.appendChild(out);
      out.textContent = step.text;
      await new Promise(r=>setTimeout(r,400));
    }
  }
  await new Promise(r=>setTimeout(r,1200));
  termBody.innerHTML='';
  runTerminal();
}
runTerminal();

/* ---------- counters ---------- */
const counters = document.querySelectorAll('.counter');
const counterIO = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    
    if(entry.isIntersecting){
      const el = entry.target;
      const target = parseInt(el.dataset.target,10);
      if(isNaN(target)) return;   // data-target not set yet — skip, will re-observe after fetch
      let cur=0; const step = Math.max(1, Math.floor(target/50));
      const t = setInterval(()=>{
        cur += step;
        if(cur>=target){ cur=target; clearInterval(t); }
        el.textContent = cur;
      }, 25);
      counterIO.unobserve(el);
    }
  });
},{threshold:0.4});
counters.forEach(c => counterIO.observe(c));





/* --------- GitHub ---------*/

function setRepo(repo, card) {

    document.getElementById(`repo${card}-title`).textContent =
        `📌 ${repo.name}`;

    document.getElementById(`repo${card}-description`).textContent =
        repo.description || "No description";

    document.getElementById(`repo${card}-language`).textContent =
        repo.primaryLanguage?.name || "Unknown";

    document.getElementById(`repo${card}-stars`).textContent =
        `★ ${repo.stargazerCount}`;

    document.getElementById(`repo${card}-forks`).textContent =
        `⑂ ${repo.forkCount}`;

    document.getElementById(`repo${card}-dot`).style.background =
        repo.primaryLanguage?.color || "#888";
}


fetch("data/gitResponse.json")
    .then(response => response.json())
    .then(data => {
        // Pinned / Top Repositories
        const repos = data.data.user.topRepositories.nodes || [];
        [1, 2, 3, 4].forEach(index => {
            const repo = repos[index - 1];
            const titleEl = document.getElementById(`repo${index}-title`);
            const cardEl = titleEl ? titleEl.closest('.repo-card') : null;

            if (repo && repo.name) {
                setRepo(repo, index);
                if (cardEl) {
                    cardEl.style.display = '';
                    cardEl.style.cursor = 'pointer';
                    cardEl.onclick = () => window.open(repo.url, '_blank', 'noopener');
                }
            } else if (cardEl) {
                cardEl.style.display = 'none';
            }
        });

        // GitHub Stat Counts
        const totalRepoCount = data.data.user.repoCount.totalCount;
        const Contributions = data.data.user.contributionsCollection.contributionCalendar.totalContributions;
        const TotalPr = data.data.mergedPRs.issueCount;
        const followerCount = data.data.user.followers.totalCount;

        // Language Breakdown
        const languages = data.data.user.languageBreakdown || [];
        const languageBar = document.getElementById("language-bar");
        const languageLegend = document.getElementById("language-legend");

        if (languageBar && languageLegend) {
            languageBar.innerHTML = "";
            languageLegend.innerHTML = "";
            languages.forEach(lang => {
                const segment = document.createElement("div");
                segment.style.width = `${lang.percentage}%`;
                segment.style.background = lang.color;
                languageBar.appendChild(segment);

                const item = document.createElement("span");
                item.innerHTML = `
                    <span class="lang-dot" style="background:${lang.color};"></span>
                    ${lang.name} ${lang.percentage}%
                `;
                languageLegend.appendChild(item);
            });
        }

        const RepoCount = document.getElementById("repoCount");
        const TotalCont = document.getElementById("contributionCount");
        const TotalPR = document.getElementById("prCount");
        const TotalFollowers = document.getElementById("followerCount");

        if (RepoCount) RepoCount.dataset.target = totalRepoCount;
        if (TotalCont) TotalCont.dataset.target = Contributions;
        if (TotalPR) TotalPR.dataset.target = TotalPr;
        if (TotalFollowers) TotalFollowers.dataset.target = followerCount;

        // Animate counters directly now that data-target is set
        [RepoCount, TotalCont, TotalPR, TotalFollowers].filter(Boolean).forEach(el => {
            counterIO.unobserve(el);
            const target = parseInt(el.dataset.target, 10);
            if (isNaN(target) || target === 0) { el.textContent = '0'; return; }
            let cur = 0; const step = Math.max(1, Math.floor(target / 50));
            const t = setInterval(() => {
                cur += step;
                if (cur >= target) { cur = target; clearInterval(t); }
                el.textContent = cur;
            }, 25);
        });
    })
    .catch(err => {
        console.error('[GitHub stats] Failed to load data/gitResponse.json:', err);
        const statsSection = document.getElementById('github');
        if (statsSection) {
            const notice = statsSection.querySelector('.github-stats-notice');
            if (!notice) {
                const el = document.createElement('p');
                el.className = 'github-stats-notice';
                el.style.cssText = 'text-align:center;color:var(--text-dim);padding:1rem;';
                el.textContent = 'GitHub stats unavailable.';
                statsSection.prepend(el);
            }
        }
    });





/* ---------- project modal data ---------- */
const projectDetails = {
  proj1:{
    title:'Cybersecurity Job Simulations',
    badge:'Cybersecurity',
    desc:'Simulated security assessments involving threat modeling, vulnerability identification, and basic risk analysis conducted for Deloitte Australia and Tata Group simulations.',
    features:['Simulated security & risk assessments','Threat modeling & vulnerability identification','Incident scenario & attack surface analysis','Mitigation technique & defense evaluation'],
    tech:['Threat Modeling','Vulnerability Assessment','Risk Analysis','Incident Analysis'],
    link:'https://github.com/Peeyush3587'
  },
  proj2:{
    title:'Linux System & Security Practice',
    badge:'Linux & Security',
    desc:'Hands-on administration and security practice working with Linux file systems, permissions, processes, user management, and Kali Linux system hardening.',
    features:['Linux file system & permission management','Process & user privilege administration','Access control implementation','System hardening in Kali Linux'],
    tech:['Linux','Kali Linux','CLI','Access Control'],
    link:'https://github.com/Peeyush3587'
  },
  proj3:{
    title:'Academic Programming Projects',
    badge:'Software Development',
    desc:'Core academic software projects focusing on algorithmic problem solving, memory management, and OOP architecture across C, C++, and Java, plus HTML/CSS.',
    features:['Memory management & control structures in C/C++','Algorithmic problem-solving','Object-oriented Java applications (classes, inheritance, encapsulation)','Static web interface structure with HTML & CSS'],
    tech:['C','C++','Java','OOP','HTML/CSS'],
    link:'https://github.com/Peeyush3587'
  }
};
const modalOverlay = document.getElementById('modalOverlay');
const modalBox = document.getElementById('modalBox');
document.querySelectorAll('[data-modal]').forEach(card=>{
  card.addEventListener('click', ()=>{
    const d = projectDetails[card.dataset.modal];
    modalBox.innerHTML = `
      <div class="icon-btn modal-close" id="modalClose">✕</div>
      <span class="pcard-badge ${d.badge==='Educational Use Only' ? 'badge-warn':'badge-live'} mono">${d.badge}</span>
      <h2 style="margin:16px 0 12px; font-size:24px;">${d.title}</h2>
      <p style="color:var(--text-dim); line-height:1.7; font-size:14.5px; margin-bottom:20px;">${d.desc}</p>
      <div class="eyebrow">FEATURES</div>
      <ul style="color:var(--text-dim); font-size:14px; line-height:2; padding-left:20px; margin-bottom:20px;">
        ${d.features.map(f=>`<li>${f}</li>`).join('')}
      </ul>
      <div class="tech-row" style="padding:0 0 22px;">${d.tech.map(t=>`<span class="tech-chip">${t}</span>`).join('')}</div>
      <a href="${d.link}" target="_blank" rel="noopener" class="btn btn-primary magnetic">View on GitHub →</a>
    `;
    modalOverlay.classList.add('active');
    document.getElementById('modalClose').addEventListener('click', ()=> modalOverlay.classList.remove('active'));
  });
});
modalOverlay.addEventListener('click', (e)=>{ if(e.target===modalOverlay) modalOverlay.classList.remove('active'); });

/* ---------- command palette ---------- */
const cmdkOverlay = document.getElementById('cmdkOverlay');
const cmdkInput = document.getElementById('cmdkInput');
const cmdkList = document.getElementById('cmdkList');
const commands = [
  {label:'Go to Home', action:()=>scrollToId('home')},
  {label:'Go to About', action:()=>scrollToId('about')},
  {label:'Go to Projects', action:()=>scrollToId('projects')},
  {label:'Go to Skills', action:()=>scrollToId('skills')},
  {label:'Go to GitHub Activity', action:()=>scrollToId('github')},
  {label:'Go to Contact', action:()=>scrollToId('contact')},
  {label:'Toggle Theme', action:()=>themeToggle.click()},
  {label:'Copy Email Address', action:()=>{navigator.clipboard.writeText('peeyushkrsingh1@gmail.com');}},
];
function scrollToId(id){ document.getElementById(id).scrollIntoView({behavior:'smooth'}); closeCmdk(); }
function renderCmdk(filter=''){
  cmdkList.innerHTML='';
  commands.filter(c=>c.label.toLowerCase().includes(filter.toLowerCase())).forEach((c,i)=>{
    const item = document.createElement('div');
    item.className='cmdk-item'+(i===0?' active':'');
    item.innerHTML = `<span>${c.label}</span><span class="k">↵</span>`;
    item.addEventListener('click', c.action);
    cmdkList.appendChild(item);
  });
}
function openCmdk(){ cmdkOverlay.classList.add('active'); cmdkInput.value=''; renderCmdk(); cmdkInput.focus(); }
function closeCmdk(){ cmdkOverlay.classList.remove('active'); }
document.getElementById('cmdkBtn').addEventListener('click', openCmdk);
cmdkInput?.addEventListener('input', ()=> renderCmdk(cmdkInput.value));
cmdkOverlay.addEventListener('click', (e)=>{ if(e.target===cmdkOverlay) closeCmdk(); });
document.addEventListener('keydown', (e)=>{
  if((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); cmdkOverlay.classList.contains('active') ? closeCmdk() : openCmdk(); }
  if(e.key==='Escape'){ closeCmdk(); modalOverlay.classList.remove('active'); }
});





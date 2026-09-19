
/* ============================================================
   새:공간 「공간취향」 참가자 웹앱
   - CONFIG / 데이터 저장(localStorage) / 관리자 / CSV / 결과 로직: 원본 유지
   - 참가자 화면 마크업만 부스 비주얼로 재구성(이모지 제거·손그림 톤)
   ============================================================ */

const CONFIG={
spaces:[
{id:"R01",name:"카페 칸식스",type:"REAL",image:"assets/spaces/R01.webp",tags:["저녁 시간 이용","기존 집기 유지","카페 영업과 공존"]},
{id:"R02",name:"오늘책협동조합",type:"REAL",image:"assets/spaces/R02.webp",tags:["운영시간 협의","기존 집기 유지","책방과 공간 공유"]},
{id:"R03",name:"코스믹 커스텀",type:"REAL",image:"assets/spaces/R03.webp",tags:["이용시간 협의","기존 집기 유지","작업공간과 공존"]},
{id:"R04",name:"원종중앙시장 중정",type:"REAL",image:"assets/spaces/R04.webp",tags:["시장 운영과 공존","공용공간","날씨 영향"]},
{id:"R05",name:"시끌벅적 원종마을",type:"REAL",image:"assets/spaces/R05.webp",tags:["이용시간 협의","기존 공간 유지","공동 이용"]},
{id:"F01",name:"영업이 끝난 책방",type:"IMAGINE",image:"assets/spaces/F01.webp",tags:["영업 종료 후","기존 집기 유지","책방과 공간 공유"]},
{id:"F02",name:"쉬는 날의 주방",type:"IMAGINE",image:"assets/spaces/F02.webp",tags:["휴무일 이용","기존 설비 유지","청소·정리 필요"]},
{id:"F03",name:"골목 안 빈 점포",type:"IMAGINE",image:"assets/spaces/F03.webp",tags:["기본 상태 그대로","간단한 세팅","골목 접근"]},
{id:"F04",name:"퇴근 후 사무공간",type:"IMAGINE",image:"assets/spaces/F04.webp",tags:["저녁 이용","사무 집기 유지","원상복구"]},
{id:"F05",name:"작업이 없는 작업장",type:"IMAGINE",image:"assets/spaces/F05.webp",tags:["비작업 시간","기존 장비 유지","안전수칙 준수"]},
{id:"F06",name:"비어 있는 상가 한 층",type:"IMAGINE",image:"assets/spaces/F06.webp",tags:["기본 시설 중심","간단한 세팅","이용시간 협의"]},
{id:"F07",name:"한산한 시간의 가게",type:"IMAGINE",image:"assets/spaces/F07.webp",tags:["한산한 시간 이용","기존 영업과 공존","기존 집기 유지"]}
],
activities:[
["sell","🛍️","무언가 팔아보고 싶어요","하루쯤 내 가게가 되는 공간","작은 시작도 진짜 공간에서 해보고 싶어요.","팝업 · 판매 · 작은 마켓"],
["share","🎨","내가 아는 걸 나눠보고 싶어요","내 것을 나누는 작은 작업실","좋아하는 것과 잘하는 것을 공간에서 나눠보고 싶어요.","클래스 · 워크숍 · 체험"],
["gather","👥","사람들을 모아보고 싶어요","사람을 모으는 작은 아지트","좋아하는 사람들과 취향을 나눌 자리를 만들고 싶어요.","모임 · 커뮤니티 · 네트워킹"],
["show","🎤","무언가 보여주고 싶어요","동네 한켠의 작은 무대","내가 만든 것과 하고 싶은 이야기를 사람들에게 보여주고 싶어요.","공연 · 전시 · 콘텐츠"],
["make","🍳","함께 만들고 즐기고 싶어요","같이 만들고 나누는 공간","혼자보다 함께 만들고 즐길 때 공간이 더 재미있어요.","음식 · 취미 · 공동활동"],
["focus","🧘","조용히 머물거나 집중하고 싶어요","잠시 나에게 집중하는 공간","바쁜 일상 사이, 머물며 집중할 작은 공간이 필요해요.","작업 · 독서 · 웰니스"],
["other","✨","다른 걸 해보고 싶어요","나만의 방식으로 채우는 공간","정해진 답보다 내가 하고 싶은 것으로 공간을 채우고 싶어요.","직접 적어보기"]
],
factors:["가격","위치 · 접근성","공간 분위기","이용 가능한 시간","필요한 시설 · 집기","홍보 · 사람 유입","예약 편리함","운영 지원"],
wtp:[
["0","0원 · 무료라면 이용해볼래요"],["10000_30000","1~3만원"],["30000_50000","3~5만원"],
["50000_70000","5~7만원"],["70000_100000","7~10만원"],["100000_plus","10만원 이상"]
]
};
let state={step:0,nickname:"",important_factors:[],started_at:new Date().toISOString()};
const app=document.querySelector("#app");
const steps=10;

/* 새:공간 로고 마크(하우스 + 새싹) — 이모지 대체 */
const LOGO='<svg viewBox="0 0 64 62" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+
'<path d="M32 22V12.5" stroke="#123D2E" stroke-width="3" stroke-linecap="round"/>'+
'<path d="M32 15.5c-1-4-5.2-6-9.3-5 1.2 3.4 4.4 5.4 9.3 5z" fill="#CBEE7C"/>'+
'<path d="M32 13.5c1-4.2 5.2-7 10.3-5.8-1.2 4-5 6-10.3 5.8z" fill="#CBEE7C"/>'+
'<path d="M14.5 33.5 32 20.5l17.5 13" stroke="#123D2E" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>'+
'<path d="M18.5 31v20.5A1.5 1.5 0 0 0 20 53h24a1.5 1.5 0 0 0 1.5-1.5V31" stroke="#123D2E" stroke-width="3.2" stroke-linejoin="round"/>'+
'<rect x="28" y="41" width="8" height="12" rx="1.6" fill="#123D2E"/>'+
'</svg>';

/* 진행표시: 집 아이콘 8개(문항 수 노출 없이 채워짐) */
function houses(p){return Array.from({length:8},(_,i)=>`<i class="house ${i<p?'on':''}"></i>`).join("")}

/* ---------- 저장(원본 유지) ---------- */
function saveLocal(){
 const rows=JSON.parse(localStorage.getItem("spaceTasteResponses")||"[]");
 const idx=rows.findIndex(r=>r.response_id===state.response_id);
 if(idx>=0) rows[idx]=state; else rows.push(state);
 localStorage.setItem("spaceTasteResponses",JSON.stringify(rows));
}

/* ---------- 셸 ---------- */
function shell(content,back=true,p=0){
 const nav=back
   ? '<button class="back" onclick="prev()"><span class="arw">←</span> 이전</button>'
   : `<span class="brand-tag">${LOGO} 새:공간</span>`;
 return `<main class="shell"><div class="topbar">${nav}<div class="progress" aria-hidden="true">${houses(p)}</div></div><section class="stage">${content}</section></main>`;
}

/* ---------- 이동/선택(원본 로직 유지) ---------- */
function next(n){state.step=n;render()}
function prev(){if(state.step>0){state.step--;render()}}
function selectSpace(id){state.space_id=id;const s=CONFIG.spaces.find(x=>x.id===id);state.space_name=s.name;state.space_type=s.type;state.constraint_tags=s.tags;setTimeout(()=>next(3),250)}
function activity(id){let a=CONFIG.activities.find(x=>x[0]===id);state.desired_activity=id;state.desired_activity_label=a[2];state.desired_activity_detail=a[5];state.result_type=id;state.result_title=a[3];state.result_description=a[4]; if(id==="other"){render()} else setTimeout(()=>next(5),250)}
function factor(x){let a=state.important_factors;if(a.includes(x))a.splice(a.indexOf(x),1);else if(a.length<3)a.push(x);render()}
function choose(k,v,n){state[k]=v;setTimeout(()=>next(n),250)}

/* ---------- 화면들(비주얼 재구성) ---------- */
function typeLabel(t){return t==="REAL"?"REAL · 원종동 실제공간":"IMAGINE · 이런 공간이라면?"}

function intro(){return shell(`<div class="intro">
  <div class="loc-pill"><span class="pin"></span> 부천 원종동</div>
  <h1 class="hero">오늘, 당신의<br><span class="mark">공간취향</span>은?</h1>
  <p class="subtitle">끌리는 공간을 뽑고, 나만의 공간취향을 발견해보세요!</p>
  <div class="intro-note"><b>공간카드를 뽑으셨나요?</b><span>이제 태블릿에서 하나씩 찾아볼게요.</span></div>
  <button class="cta" onclick="next(1)">내 공간취향 찾기 →</button>
  <p class="small">약 1분이면 충분해요 · 정답은 없어요</p>
</div>`,false,0)}

function nickname(){return shell(`<div class="q-block">
  <h2 class="question">오늘 뭐라고<br><strong>불러드릴까요?</strong></h2>
  <p class="subtitle">마지막에 나만의 공간취향 카드를 만들어드려요.</p>
  <input class="input" maxlength="10" placeholder="새공간이" value="${state.nickname||""}" oninput="state.nickname=this.value">
  <button class="cta" onclick="if(state.nickname.trim())next(2)">시작하기 →</button>
</div>`,true,0)}

function spaces(){
 let groups=["REAL","IMAGINE"].map(t=>`<div class="space-section">
   <div class="section-label ${t}"><b>${t}</b> ${t==="REAL"?"원종동 실제공간":"이런 공간이라면?"}</div>
   <div class="space-grid">${CONFIG.spaces.filter(s=>s.type===t).map(s=>`<button class="space-card ${s.type}" onclick="selectSpace('${s.id}')">
     <div class="sc-photo"><img src="${s.image}" alt="${s.name}"><span class="sc-code">${s.id}</span></div>
     <div class="sc-name">${s.name}</div>
     <div class="sc-badge">${s.type==="REAL"?"실제공간":"이런 공간이라면"}</div>
   </button>`).join("")}</div>
 </div>`).join("");
 return shell(`<div class="q-head"><h2 class="question sm">어떤 공간을 <strong>뽑으셨나요?</strong></h2><p class="subtitle">카드에 적힌 <b>R / F 번호</b>를 찾아보세요.</p></div>${groups}`,true,1)
}

function discovery(){
 let s=CONFIG.spaces.find(x=>x.id===state.space_id);
 let image=s&&s.image?`<img src="${s.image}" alt="${s.name}">`:`공간 사진 · ${s.id}`;
 return shell(`<div class="discovery">
   <p class="kicker">${state.nickname}님이 뽑은 공간은</p>
   <h2 class="question">${s.name}<strong>예요.</strong></h2>
   <div class="disc-photo">${image}</div>
   <div class="badge-line"><span class="type-badge ${s.type}">${typeLabel(s.type)}</span></div>
   <p class="lead-sub">이 공간은 이렇게 이용할 수 있어요.</p>
   <div class="tags">${s.tags.map(x=>`<span class="tag">${x}</span>`).join("")}</div>
   <button class="cta" onclick="next(4)">이 공간에서 뭘 해볼까요? →</button>
 </div>`,true,2)
}

function activities(){return shell(`<div class="q-head">
   <p class="kicker">좋아요. 그럼 진짜 상상해볼까요?</p>
   <h2 class="question">이 공간, 나라면<br><strong>어떻게 써볼까요?</strong></h2>
   <p class="subtitle">가장 가까운 모습을 하나 골라주세요.</p>
 </div>
 <div class="use-grid">${CONFIG.activities.map(a=>`<button class="use-card ${state.desired_activity===a[0]?'selected':''}" onclick="activity('${a[0]}')">
   <b>${a[2]}</b><span class="use-tag">${a[5]}</span>
 </button>`).join("")}</div>
 ${state.desired_activity==="other"?`<input class="input" style="font-size:22px" placeholder="어떻게 써보고 싶은지 짧게 적어주세요" oninput="state.desired_activity_other=this.value"><button class="cta" onclick="next(5)">선택했어요 →</button>`:""}`,true,3)}

function factors(){return shell(`<div class="q-head"><h2 class="question">공간을 이용한다면,<br><strong>무엇이 중요할까요?</strong></h2><p class="subtitle">중요한 것 3개까지 골라주세요.</p></div>
 <div class="chip-grid">${CONFIG.factors.map(x=>`<button class="chip ${state.important_factors.includes(x)?'selected':''}" onclick="factor('${x}')">${x}</button>`).join("")}</div>
 <div class="counter"><b>${state.important_factors.length}</b> / 3 선택</div>
 <button class="cta" ${state.important_factors.length?"":"disabled"} onclick="next(55)">선택했어요 →</button>`,true,4)}

function transition(){setTimeout(()=>{if(state.step===55)next(6)},900);return shell(`<div class="transition">
   <span class="tr-mark"></span>
   <h2 class="question">마음에 드는 활동을 찾았어요!</h2>
   <p class="subtitle">그럼, <strong>진짜 이 공간을 이용한다면?</strong></p>
 </div>`,false,5)}

function constraint(){return shell(`<div class="constraint-head"><span class="cs-badge">잠깐!</span><div><small>${state.space_name}</small><b>이 공간엔, 이런 조건이 있어요.</b></div></div>
 <div class="constraint-board">${state.constraint_tags.map((x,i)=>`<div class="cs-chip"><span class="cs-num">0${i+1}</span><b>${x}</b></div>`).join("")}</div>
 <h2 class="question constraint-q">이 조건이어도<br><strong>이용해보고 싶나요?</strong></h2>
 <div class="answer-grid">${[["yes","네, 이용해보고 싶어요"],["depends","조건에 따라 이용할 것 같아요"],["unsure","아직 잘 모르겠어요"],["no","이용하지 않을 것 같아요"]].map(x=>`<button class="answer-card" onclick="choose('constraint_acceptance','${x[0]}',7)">${x[1]}</button>`).join("")}</div>`,true,5)}

function wtp(){return shell(`<div class="q-head"><p class="kicker">${state.nickname}님이 여기서</p><h2 class="question">‘${state.desired_activity_label}’<br><strong>하루 공간을 써본다면?</strong></h2><p class="subtitle">공간 이용료로 얼마까지 괜찮을까요?</p><p class="kicker sm">하루 이용 · 팝업/행사 1회 기준</p></div>
 <div class="answer-grid wtp-grid">${CONFIG.wtp.map(x=>`<button class="answer-card" onclick="choose('willingness_to_pay','${x[0]}',8)">${x[1]}</button>`).join("")}</div>`,true,6)}

function behavior(){return shell(`<div class="q-head"><h2 class="question">이 공간을 실제로<br><strong>이용할 기회가 생긴다면?</strong></h2></div>
 <div class="answer-grid behavior-grid">${[["use","직접 이용해보고 싶어요"],["host","여기서 내 프로그램을 열어보고 싶어요"],["consider","조금 더 알아보고 결정하고 싶어요"],["no_intent","아직 이용할 생각은 없어요"]].map(x=>`<button class="answer-card wide" onclick="choose('behavioral_intent','${x[0]}',9)">${x[1]}</button>`).join("")}</div>`,true,7)}

function age(){return shell(`<div class="q-head"><h2 class="question">결과 보기 전,<br><strong>마지막 하나!</strong></h2><p class="subtitle">오늘의 연령대를 선택해주세요.</p></div>
 <div class="answer-grid age-grid">${["10대","20~22세","23~25세","26~29세","30대","40대","50대 이상"].map(x=>`<button class="answer-card" onclick="finishAge('${x}')">${x}</button>`).join("")}</div>`,true,8)}

function finishAge(x){state.age_group=x;state.response_id=state.response_id||((globalThis.crypto&&crypto.randomUUID)?crypto.randomUUID():"resp_"+Date.now()+"_"+Math.random().toString(36).slice(2));state.completed_at=new Date().toISOString();saveLocal();next(10)}

function result(){
  let lead=["use","host"].includes(state.behavioral_intent);
  let s=CONFIG.spaces.find(x=>x.id===state.space_id);
  let image=s&&s.image ? `<img src="${s.image}" alt="${state.space_name}">` : `<div class="result-photo-fallback"><span>${state.space_id}</span><b>${state.space_name}</b></div>`;
  return shell(`
  <div class="taste-card">
    <header class="tc-top">
      <span class="tc-eyebrow">오늘의 공간취향</span>
      <span class="tc-stamp">SPACE TASTE · 원종동</span>
      <span class="tc-brand">${LOGO} 새:공간</span>
    </header>

    <div class="tc-body">
      <section class="tc-copy">
        <p class="tc-owner">${state.nickname}님의 공간취향은</p>
        <h2 class="tc-title"><span class="hl">${state.result_title}</span></h2>
        <p class="tc-quote">${state.result_description}</p>

        <div class="tc-use">
          <small>나라면 이 공간을</small>
          <strong>${state.desired_activity_label}</strong>
          <span>${state.desired_activity_detail||""}</span>
        </div>

        <p class="tc-message">상상해본 공간이,<br><b>진짜 시작이 될지도 몰라요.</b></p>
      </section>

      <section class="tc-photo-wrap">
        <span class="washi"></span>
        <div class="tc-photo">${image}</div>
        <div class="tc-caption">
          <div><small>${typeLabel(state.space_type)}</small><b>${state.space_name}</b></div>
          <strong class="tc-code">${state.space_id}</strong>
        </div>
      </section>
    </div>

    <footer class="tc-bottom">
      <div class="tc-logo">${LOGO}<div><b>새:공간</b><span>비어있는 공간을, 시작하는 공간으로.</span></div></div>
      <div class="tc-handle">@new.gonggan</div>
    </footer>
  </div>

  <div class="result-actions">
    <div class="capture-note"><span class="cam"></span><b>이 카드를 사진으로 남겨보세요.</b> 오늘의 공간취향 완성!</div>
    <div class="reward-ticket"><b>@new.gonggan</b> 태그해 스토리 공유 시 <b>집 모양 공간참</b> 증정 <span>· 39개 한정</span></div>
    <div class="result-btns">
      ${lead?`<button class="cta" onclick="conversion()">실제 공간 이용 기회 받아보기 →</button>`:""}
      <button class="cta ${lead?'secondary':''}" onclick="resetAll()">다음 사람의 공간취향 찾기 →</button>
    </div>
  </div>`,false,8)
}
function conversion(){state.conversion_lead=true;saveLocal();document.body.insertAdjacentHTML("beforeend",`<div class="modal" id="m"><div class="modal-box"><h2>이 공간, 진짜 한번 써보고 싶나요?</h2><p>원종동에서 실제로 이용할 수 있는 공간이 생기면 먼저 알려드릴게요.</p><p class="small">연락처 수집은 실제 운영 시 개인정보 수집·이용 동의 문구와 함께 연결하세요.</p><button class="cta" onclick="document.querySelector('#m').remove()">확인</button></div></div>`)}
function resetAll(){state={step:0,nickname:"",important_factors:[],started_at:new Date().toISOString()};render()}

/* ============================================================
   관리자 / CSV / 집계 — 원본 로직 그대로 유지
   ============================================================ */
const LABELS={
 constraint_acceptance:{yes:"네, 이용해보고 싶어요",depends:"조건에 따라 이용",unsure:"아직 잘 모르겠어요",no:"이용하지 않을 것 같아요"},
 behavioral_intent:{use:"직접 이용",host:"내 프로그램 운영",consider:"더 알아보고 결정",no_intent:"아직 이용 생각 없음"},
 willingness_to_pay:Object.fromEntries(CONFIG.wtp.map(x=>x))
};
function getResponses(){try{return JSON.parse(localStorage.getItem("spaceTasteResponses")||"[]")}catch(e){return []}}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function countBy(rows,key){
 const m={}; rows.forEach(r=>{let v=r[key]||"미응답";m[v]=(m[v]||0)+1}); return Object.entries(m).sort((a,b)=>b[1]-a[1])
}
function statBars(rows,key,labels={}){
 let data=countBy(rows,key),max=Math.max(1,...data.map(x=>x[1]));
 return `<div class="admin-bars">${data.map(([k,n])=>`<div class="admin-bar-row"><span>${esc(labels[k]||k)}</span><div><i style="width:${Math.max(5,n/max*100)}%"></i></div><b>${n}</b></div>`).join("")||'<p class="admin-empty">아직 응답이 없어요.</p>'}</div>`
}
function csvCell(v){let s=Array.isArray(v)?v.join(" | "):String(v??"");return '"'+s.replaceAll('"','""')+'"'}
function downloadCSV(){
 const rows=getResponses();
 if(!rows.length){alert("아직 저장된 응답이 없어요.");return}
 const cols=["response_id","started_at","completed_at","nickname","age_group","space_id","space_name","space_type","desired_activity","desired_activity_label","desired_activity_other","important_factors","constraint_acceptance","willingness_to_pay","behavioral_intent","result_type","result_title","conversion_lead"];
 const header=["응답ID","시작시간","완료시간","닉네임","연령대","공간코드","공간명","공간유형","이용목적코드","이용목적","기타이용목적","중요조건","제약수용","하루지불의향","행동의향","결과유형","결과제목","후속이용버튼"];
 const lines=[header.map(csvCell).join(","),...rows.map(r=>cols.map(c=>{
   if(c==="constraint_acceptance") return csvCell(LABELS.constraint_acceptance[r[c]]||r[c]);
   if(c==="willingness_to_pay") return csvCell(LABELS.willingness_to_pay[r[c]]||r[c]);
   if(c==="behavioral_intent") return csvCell(LABELS.behavioral_intent[r[c]]||r[c]);
   return csvCell(r[c]);
 }).join(","))];
 const blob=new Blob(["\ufeff"+lines.join("\r\n")],{type:"text/csv;charset=utf-8"});
 const a=document.createElement("a");a.href=URL.createObjectURL(blob);
 const d=new Date(), pad=n=>String(n).padStart(2,"0");
 a.download=`새공간_공간취향_${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}.csv`;
 a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
function deleteAllData(){
 const phrase=prompt("전체 응답을 삭제하려면 아래에 '새공간삭제'를 입력해주세요.\\n이 작업은 되돌릴 수 없습니다.");
 if(phrase==="새공간삭제"){localStorage.removeItem("spaceTasteResponses");alert("전체 응답이 삭제되었습니다.");renderAdmin()}
}
function renderAdmin(){
 const rows=getResponses().filter(r=>r.completed_at);
 const strong=rows.filter(r=>["use","host"].includes(r.behavioral_intent)).length;
 const host=rows.filter(r=>r.behavioral_intent==="host").length;
 const accept=rows.filter(r=>r.constraint_acceptance==="yes").length;
 const latest=[...rows].sort((a,b)=>String(b.completed_at).localeCompare(String(a.completed_at))).slice(0,12);
 app.innerHTML=`<main class="admin-shell">
 <header class="admin-header"><div><small>새:공간 · 운영자 전용</small><h1>공간취향 현장 데이터</h1><p>이 태블릿에 저장된 완료 응답을 보여줍니다.</p></div><div class="admin-actions"><button onclick="downloadCSV()">전체 응답 CSV 다운로드</button><a href="index.html">참가자 화면으로</a></div></header>
 <section class="admin-kpis">
  <div><small>총 완료</small><b>${rows.length}</b><span>명</span></div>
  <div><small>실제 이용·운영 의향</small><b>${strong}</b><span>명</span></div>
  <div><small>프로그램 운영 의향</small><b>${host}</b><span>명</span></div>
  <div><small>제약 있어도 이용</small><b>${accept}</b><span>명</span></div>
 </section>
 <section class="admin-grid">
  <article><h2>공간 선택</h2>${statBars(rows,"space_name")}</article>
  <article><h2>공간 이용목적</h2>${statBars(rows,"desired_activity_label")}</article>
  <article><h2>제약 수용도</h2>${statBars(rows,"constraint_acceptance",LABELS.constraint_acceptance)}</article>
  <article><h2>하루 지불의향</h2>${statBars(rows,"willingness_to_pay",LABELS.willingness_to_pay)}</article>
  <article><h2>행동의향</h2>${statBars(rows,"behavioral_intent",LABELS.behavioral_intent)}</article>
  <article><h2>연령대</h2>${statBars(rows,"age_group")}</article>
 </section>
 <section class="admin-table-card"><div class="admin-table-title"><h2>최근 응답</h2><span>최근 12건</span></div>
 <div class="admin-table-wrap"><table><thead><tr><th>시간</th><th>닉네임</th><th>연령대</th><th>공간</th><th>이용목적</th><th>지불의향</th><th>행동의향</th></tr></thead><tbody>
 ${latest.map(r=>`<tr><td>${esc((r.completed_at||"").slice(11,16))}</td><td>${esc(r.nickname)}</td><td>${esc(r.age_group)}</td><td><b>${esc(r.space_id)}</b> ${esc(r.space_name)}</td><td>${esc(r.desired_activity_label)}</td><td>${esc(LABELS.willingness_to_pay[r.willingness_to_pay]||r.willingness_to_pay)}</td><td>${esc(LABELS.behavioral_intent[r.behavioral_intent]||r.behavioral_intent)}</td></tr>`).join("")||'<tr><td colspan="7">아직 완료된 응답이 없습니다.</td></tr>'}
 </tbody></table></div></section>
 <footer class="admin-footer"><button class="danger-link" onclick="deleteAllData()">전체 데이터 초기화</button><span>행사 중간과 종료 직후 CSV를 한 번씩 내려받아 백업해주세요.</span></footer>
 </main>`;
}

function render(){window.scrollTo(0,0);if(new URLSearchParams(location.search).get("admin")==="1"){renderAdmin();return}app.innerHTML= state.step===0?intro():state.step===1?nickname():state.step===2?spaces():state.step===3?discovery():state.step===4?activities():state.step===5?factors():state.step===55?transition():state.step===6?constraint():state.step===7?wtp():state.step===8?behavior():state.step===9?age():result()}
render();

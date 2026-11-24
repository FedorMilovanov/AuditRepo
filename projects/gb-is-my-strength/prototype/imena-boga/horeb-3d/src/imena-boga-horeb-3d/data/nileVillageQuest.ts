/** W15 · Сцена рождения Моисея. Только Исх. 1:22; 2:1–10.
 * Coordinates and interlocutors are hypothetical staging, NOT identified sites
 * or reported dialogue. No violence enacted or inventing new Scripture events. */
export type NileVillageStep=Readonly<{
 id:string;title:string;x:number;z:number;reach:number;
 action:string;source:string;description:string;qualification:string
}>;
export const NILE_VILLAGE_START=Object.freeze({x:4,z:18,yaw:0,pitch:-.14});
// Blockout staging, not identified historical locations. Both rendering and
// pedestrian clearance consume the same table/NPC footprint.
export const NILE_VILLAGE_PEOPLE=Object.freeze([
 {x:3,z:11,radius:.86,color:0x9e785a},
 {x:7,z:8,radius:.86,color:0xb7a187},
 {x:7.65,z:4.1,radius:.86,color:0x94816b},
 {x:-4.15,z:-12.5,radius:.78,color:0xb39c80}
]);
export const NILE_VILLAGE_TABLE=Object.freeze({x:6,z:4,halfX:.8,halfZ:.8});
export const NILE_VILLAGE_STEPS:readonly NileVillageStep[]=Object.freeze([
 {id:'decree',title:'Известие об указе',x:3,z:11,reach:2.4,
  action:'Узнать об указе',source:'Исх. 1:15–22',
  description:'Фараон велел своему народу бросать новорождённых еврейских мальчиков в реку. Прежде он требовал убийства мальчиков от повивальных бабок.',
  qualification:'Улица и условный вестник — художественная реконструкция; Библия не описывает способ оглашения приказа.'},
 {id:'mother',title:'У семейного дома',x:7,z:8,reach:2.35,
  action:'Поговорить с матерью',source:'Исх. 2:1–2',
  description:'Мать скрывала сына три месяца. Дальше скрывать его она не могла. Игра предлагает помочь подготовить корзину.',
  qualification:'Реплик матери и плана дома в библейском повествовании нет.'},
 {id:'seal',title:'Подготовить корзину',x:NILE_VILLAGE_TABLE.x,z:NILE_VILLAGE_TABLE.z,reach:2.35,
  action:'Обмазать корзину для защиты от воды',source:'Исх. 2:3',
  description:'Корзина из папируса была обмазана асфальтом и смолой: это важная деталь самого текста.',
  qualification:'Порядок работы и мастерская — игровые средства, не отдельное библейское свидетельство.'},
 {id:'wrap',title:'Осторожно уложить ребёнка',x:NILE_VILLAGE_TABLE.x,z:NILE_VILLAGE_TABLE.z,reach:2.35,
  action:'Уложить младенца в корзину',source:'Исх. 2:3',
  description:'Мать положила ребёнка в подготовленную корзину. В игре игрок помогает ей совершить это действие.',
  qualification:'Непосредственное участие посетителя — художественный приём.'},
 {id:'reeds',title:'Укрыть корзину в камышах',x:-5.45,z:-16.1,reach:2.5,
  action:'Установить корзину у берега',source:'Исх. 2:3',
  description:'Корзину помещают среди тростника У БЕРЕГА реки — не запускают по открытому течению.',
  qualification:'Береговая тропа, точные расстояния и расположение зарослей реконструированы.'},
 {id:'sister',title:'Сестра наблюдает',x:-4.15,z:-12.5,reach:2.75,
  action:'Узнать, что произойдёт дальше',source:'Исх. 2:4–10',
  description:'Сестра остаётся на расстоянии и наблюдает. Далее дочь фараона замечает корзину, а сестра предлагает найти кормилицу.',
  qualification:'Местоположение наблюдения, внешность сестры и любая мизансцена приблизительны.'}
]);
// Safe approach marker rather than a marker embedded in an NPC or table.
export const NILE_VILLAGE_APPROACHES=Object.freeze([
 {x:3,z:12.6},{x:7,z:9.7},{x:6,z:5.65},{x:6,z:5.65},
 {x:-5.45,z:-16.1},{x:-4.15,z:-14.0}
]);
export function nileVillageGoalBearing(x:number,z:number,yaw:number,target:{x:number;z:number}):number{
 if(![x,z,yaw,target.x,target.z].every(Number.isFinite))return 0;
 if(Math.hypot(target.x-x,target.z-z)<.05)return 0;
 const relative=Math.atan2(x-target.x,z-target.z)-yaw;
 return Math.atan2(Math.sin(relative),Math.cos(relative));
}
export function nileVillageCanWalk(x:number,z:number):boolean{
 if(!Number.isFinite(x)||!Number.isFinite(z)||x< -7.25||x>17.8||z< -23||z>20)return false;
 for(const h of NILE_VILLAGE_HOUSES)
   if(Math.abs(x-h.x)<h.w/2+.38 && Math.abs(z-h.z)<h.d/2+.38)return false;
 for(const person of NILE_VILLAGE_PEOPLE)
   if(Math.hypot(x-person.x,z-person.z)<person.radius)return false;
 const table=NILE_VILLAGE_TABLE;
 if(Math.abs(x-table.x)<table.halfX+.38&&Math.abs(z-table.z)<table.halfZ+.38)return false;
 return true;
}
export const NILE_VILLAGE_HOUSES:readonly Readonly<{x:number;z:number;w:number;d:number;h:number}>[]=Object.freeze([
 {x:-2.5,z:16,w:3.6,d:3.5,h:3.3},
 {x:10.8,z:16.3,w:4.1,d:3.5,h:3.5},
 {x:-3.9,z:6.7,w:3.4,d:4.0,h:3.1},
 {x:12.3,z:6.3,w:3.8,d:4.3,h:3.5},
 {x:11,z:-3.9,w:4.6,d:4.0,h:3.7},
 {x:-2.1,z:-5.2,w:3.3,d:3.8,h:3.0},
]);
export const nileVillageDistance=(x:number,z:number,step:NileVillageStep)=>
 Math.hypot(x-step.x,z-step.z);
export function nileVillageMayInteract(x:number,z:number,step:number):boolean{
 const s=NILE_VILLAGE_STEPS[step];
 return !!s&&nileVillageCanWalk(x,z)&&nileVillageDistance(x,z,s)<=s.reach;
}

/** W25: a scene-owned transaction. Repeated/stale input never advances
 * another objective. Only a completed scene-clock action commits progress. */
export type NileVillageAction=Readonly<{step:number;elapsed:number;duration:number}>;
export type NileVillageQuest=Readonly<{step:number;revision:number;pending:NileVillageAction|null}>;
export const initialNileVillageQuest=():NileVillageQuest=>({step:0,revision:0,pending:null});
export function beginNileVillageAction(q:NileVillageQuest,revision:number,step:number,x:number,z:number,reduced=false):NileVillageQuest{
 if(q.pending||revision!==q.revision||step!==q.step||!nileVillageMayInteract(x,z,step))return q;
 const duration=reduced ? .12 : step===3||step===4 ? 1.2 : step===2 ? .9 : .45;
 return {step:q.step,revision:q.revision+1,pending:{step,elapsed:0,duration}};
}
export function advanceNileVillageAction(q:NileVillageQuest,seconds:number):NileVillageQuest{
 if(!q.pending||!Number.isFinite(seconds)||seconds<=0)return q;
 const elapsed=Math.min(q.pending.duration,q.pending.elapsed+Math.min(seconds,.25));
 return elapsed>=q.pending.duration
  ?{step:q.step+1,revision:q.revision+1,pending:null}
  :{...q,pending:{...q.pending,elapsed}};
}
export const cancelNileVillageAction=(q:NileVillageQuest):NileVillageQuest=>
 q.pending?{step:q.step,revision:q.revision+1,pending:null}:q;
export const restartNileVillageQuest=(q:NileVillageQuest):NileVillageQuest=>
 ({step:0,revision:q.revision+1,pending:null});

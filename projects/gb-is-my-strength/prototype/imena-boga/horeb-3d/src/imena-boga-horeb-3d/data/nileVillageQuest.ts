/** W15 · Сцена рождения Моисея. Только Исх. 1:22; 2:1–10.
 * Coordinates and interlocutors are hypothetical staging, NOT identified sites
 * or reported dialogue. No violence enacted or inventing new Scripture events. */
export type NileVillageStep=Readonly<{
 id:string;title:string;x:number;z:number;reach:number;
 action:string;source:string;description:string;qualification:string
}>;
export const NILE_VILLAGE_START=Object.freeze({x:4,z:18,yaw:0,pitch:-.14});
export const NILE_VILLAGE_STEPS:readonly NileVillageStep[]=Object.freeze([
 {id:'decree',title:'Известие об указе',x:3,z:11,reach:2.4,
  action:'Узнать об указе',source:'Исх. 1:15–22',
  description:'Фараон велел своему народу бросать новорождённых еврейских мальчиков в реку. Прежде он требовал убийства мальчиков от повивальных бабок.',
  qualification:'Улица и условный вестник — художественная реконструкция; Библия не описывает способ оглашения приказа.'},
 {id:'mother',title:'У семейного дома',x:7,z:8,reach:2.35,
  action:'Поговорить с матерью',source:'Исх. 2:1–2',
  description:'Мать скрывала сына три месяца. Дальше скрывать его она не могла. Игра предлагает помочь подготовить корзину.',
  qualification:'Реплик матери и плана дома в библейском повествовании нет.'},
 {id:'seal',title:'Подготовить корзину',x:6,z:3,reach:2.35,
  action:'Обмазать корзину для защиты от воды',source:'Исх. 2:3',
  description:'Корзина из папируса была обмазана асфальтом и смолой: это важная деталь самого текста.',
  qualification:'Порядок работы и мастерская — игровые средства, не отдельное библейское свидетельство.'},
 {id:'wrap',title:'Осторожно уложить ребёнка',x:6,z:3,reach:2.35,
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
export function nileVillageCanWalk(x:number,z:number):boolean{
 if(!Number.isFinite(x)||!Number.isFinite(z)||x< -7.25||x>17.8||z< -23||z>20)return false;
 for(const h of NILE_VILLAGE_HOUSES)
   if(Math.abs(x-h.x)<h.w/2+.38 && Math.abs(z-h.z)<h.d/2+.38)return false;
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

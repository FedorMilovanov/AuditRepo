/** Curated learning from actual Exodus references. 3D forms are illustrative. */
export type FieldWorld='well'|'homestead';
export type FieldId='midian-well'|'midian-homestead';
export type Choice='a'|'b'|'c';
export interface FieldNote{
  id:FieldId;world:FieldWorld;title:string;source:string;
  x:number;z:number;reach:number;question:string;
  options:readonly {id:Choice;text:string}[];
  answer:Choice;hint:string;explanation:string;
}
/** Approach anchors are walkable viewpoints OUTSIDE the objects, not the
 * solid well centre or the household centre. Neither world may start inside
 * an observation radius; a visit requires real movement through the world. */
export const FIELD_NOTES:Readonly<Record<FieldWorld,FieldNote>>={
  well:{
    id:'midian-well',world:'well',title:'Колодец и водопой',
    source:'Исх. 2:16–17',x:0,z:2.5,reach:2.8,
    question:'Что можно подтвердить библейским текстом, а не только 3D-картиной?',
    options:[
      {id:'a',text:'Дочери пришли за водой для стада, а Моисей помог им.'},
      {id:'b',text:'Известны размеры и точный тип каменной кладки колодца.'},
      {id:'c',text:'Моисей построил именно этот колодец.'},
    ],answer:'a',
    hint:'Прочитайте действия людей; размеры сооружения не приводятся.',
    explanation:'Исход 2:16–17 сообщает о воде, стаде и помощи Моисея. Кладка, сосуды и точное расположение в 3D — художественная интерпретация.',
  },
  homestead:{
    id:'midian-homestead',world:'homestead',title:'Семья в Мадиаме',
    source:'Исх. 2:18–21',x:0,z:4.8,reach:1.9,
    question:'Какую деталь мы не можем выдавать за исторически установленную?',
    options:[
      {id:'a',text:'Точный вид навеса и устройство семейной стоянки.'},
      {id:'b',text:'Моисей остался жить в этой семье.'},
      {id:'c',text:'Моисей женился на Сепфоре.'},
    ],answer:'a',
    hint:'Стихи говорят о семье и событиях, но не о плане жилища.',
    explanation:'Исход 2:18–21 повествует о семье и женитьбе Моисея, но не содержит описания навеса, ткани или мебели.',
  },
};
export const FIELD_STORAGE_KEY='imena-horeb.field-observations.v1';
const IDS:readonly FieldId[]=['midian-well','midian-homestead'];
export interface FieldJournal{
  observed:FieldId[];understood:FieldId[];
  mistakes:Partial<Record<FieldId,number>>;
}
export function normalizeFieldJournal(raw:unknown):FieldJournal{
  const obj=raw&&typeof raw==='object'?raw as Record<string,unknown>:{};
  const valid=(input:unknown)=>Array.isArray(input)?IDS.filter(id=>input.includes(id)):[];
  const observed=valid(obj.observed);
  const understood=valid(obj.understood).filter(id=>observed.includes(id));
  const src=obj.mistakes&&typeof obj.mistakes==='object'?
    obj.mistakes as Record<string,unknown>:{};
  const mistakes:Partial<Record<FieldId,number>>={};
  for(const id of IDS)if(Number.isInteger(src[id])&&(src[id] as number)>=0)
    mistakes[id]=Math.min(9,src[id] as number);
  return {observed,understood,mistakes};
}
export function nearField(note:FieldNote,x:number,z:number):boolean{
  return Number.isFinite(x)&&Number.isFinite(z)&&
    Math.hypot(x-note.x,z-note.z)<=note.reach;
}
export function observeField(journal:FieldJournal,id:FieldId):FieldJournal{
  if(!IDS.includes(id))return normalizeFieldJournal(journal);
  return normalizeFieldJournal({observed:[...journal.observed,id],
    understood:journal.understood,mistakes:journal.mistakes});
}
export function answerField(journal:FieldJournal,id:FieldId,choice:Choice):FieldJournal{
  const j=normalizeFieldJournal(journal);
  const note=Object.values(FIELD_NOTES).find(n=>n.id===id);
  if(!note||!j.observed.includes(id))return j;
  if(choice===note.answer)return normalizeFieldJournal({observed:j.observed,
    understood:[...j.understood,id],mistakes:j.mistakes});
  if(!note.options.some(o=>o.id===choice))return j;
  return normalizeFieldJournal({observed:j.observed,understood:j.understood,
    mistakes:{...j.mistakes,[id]:Math.min(9,(j.mistakes[id]??0)+1)}});
}

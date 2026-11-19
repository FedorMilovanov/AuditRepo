import { EMPTY_VAULT, exportVault, parseVault, type VaultState } from './engine';
/** Only for the isolated laboratory. Product GBReaderLibrary keys are never opened. */
const DB_NAME = 'gb-premium-library-lab-vault-v1';
const STORE = 'snapshots';
const KEY = 'my-library';
function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') { reject(new Error('IndexedDB недоступен')); return; }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => { if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE); };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('Не удалось открыть хранилище'));
    req.onblocked = () => reject(new Error('Хранилище занято другой вкладкой'));
  });
}
/** Finish only on transaction COMMIT, not after a single IDBRequest success. */
export async function loadVault(): Promise<VaultState> {
  const db = await openDb();
  try {
    const raw = await new Promise<string | undefined>((resolve,reject)=>{
      const tx=db.transaction(STORE,'readonly');
      const req=tx.objectStore(STORE).get(KEY);
      let value: string | undefined;
      req.onsuccess=()=>{value=req.result as string | undefined};
      tx.oncomplete=()=>resolve(value);
      tx.onerror=()=>reject(tx.error ?? new Error('Ошибка чтения IndexedDB'));
      tx.onabort=()=>reject(tx.error ?? new Error('Чтение прервано'));
    });
    if (raw === undefined) return structuredClone(EMPTY_VAULT);
    const parsed = parseVault(raw);
    if (!parsed.ok) throw new Error('Сохранённые данные не прошли проверку: ' + parsed.reason + '. Оригинал не перезаписан.');
    return parsed.state;
  } finally {db.close()}
}
/**
 * Atomic compare-and-write avoids last-tab-wins data loss. Pass `expected` for
 * ordinary edits; omit it only for a confirmed user-initiated full import.
 */
export async function saveVault(next: VaultState, expected?: VaultState): Promise<void> {
  const raw = exportVault(next);
  const valid = parseVault(raw);
  if (!valid.ok) throw new Error(valid.reason);
  const db = await openDb();
  try {
    await new Promise<void>((resolve,reject)=>{
      const tx=db.transaction(STORE,'readwrite');
      const store=tx.objectStore(STORE);
      const get=store.get(KEY);
      let intentionalAbort: Error | null=null;
      get.onsuccess=()=>{
        const current=get.result as string | undefined;
        const parsed=current===undefined ? {ok:true as const,state:structuredClone(EMPTY_VAULT)} : parseVault(current);
        if(!parsed.ok){intentionalAbort=new Error('Текущая база повреждена; запись запрещена');tx.abort();return}
        if(expected && JSON.stringify(parsed.state)!==JSON.stringify(expected)) {
          intentionalAbort=new Error('Конфликт между вкладками: новые данные уже сохранены в другой вкладке. Перезагрузите кабинет; ваши изменения не записаны.');
          tx.abort();return;
        }
        store.put(raw,KEY);
      };
      tx.oncomplete=()=>resolve();
      tx.onabort=()=>reject(intentionalAbort ?? tx.error ?? new Error('Запись отменена'));
      tx.onerror=()=>reject(tx.error ?? new Error('Ошибка записи IndexedDB'));
    });
  } finally {db.close()}
}
export async function clearVault(): Promise<void> {
  const db=await openDb();
  try { await new Promise<void>((resolve,reject)=>{
    const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(KEY);
    tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error ?? new Error('Ошибка удаления'));
    tx.onabort=()=>reject(tx.error ?? new Error('Удаление прервано'));
  });} finally {db.close()}
}

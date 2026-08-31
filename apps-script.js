// Apps Script for AB Omar - حطه في Extensions > Apps Script في شيت AB Omar - V15 fixed
function doPost(e){
  try{
    let data = JSON.parse(e.postData.contents);
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if(data.daily){
      let sh = ss.getSheetByName('اليومية') || ss.insertSheet('اليومية');
      sh.clear();
      sh.appendRow(['id','type','item','person','amount','date','wallet','note','direction','status','excludeFromBalance']);
      data.daily.forEach(t=>{
        sh.appendRow([t.id, t.type, t.item, t.person||'', t.amount, t.date, t.wallet||'', t.note||'', t.direction||'', t.status||'', t.excludeFromBalance||'']);
      });
    }
    if(data.attendance){
      let sh = ss.getSheetByName('الحضور') || ss.insertSheet('الحضور');
      sh.clear();
      sh.appendRow(['key','in','out','isHoliday']);
      for(let k in data.attendance){
        sh.appendRow([k, data.attendance[k].in, data.attendance[k].out, '']);
      }
    }
    if(data.attendance_log){
      let sh = ss.getSheetByName('سجل_الحضور') || ss.insertSheet('سجل_الحضور');
      sh.clear();
      sh.appendRow(['data']);
      sh.appendRow([JSON.stringify(data.attendance_log)]);
    }
    if(data.tasks){
      let sh = ss.getSheetByName('المهام') || ss.insertSheet('المهام');
      sh.clear();
      sh.appendRow(['id','text','cat','done','date']);
      data.tasks.forEach(t=>{
        sh.appendRow([t.id, t.text, t.cat, t.done, '']);
      });
    }
    if(data.important){
      let sh = ss.getSheetByName('المهم') || ss.insertSheet('المهم');
      sh.clear();
      sh.appendRow(['data']);
      sh.appendRow([JSON.stringify(data.important)]);
    }
    if(data.debts){
      let sh = ss.getSheetByName('الديون') || ss.insertSheet('الديون');
      sh.clear();
      sh.appendRow(['data']);
      sh.appendRow([JSON.stringify(data.debts)]);
    }
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  }catch(err){
    return ContentService.createTextOutput(JSON.stringify({error: err.message})).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e){
  try{
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let result = {};
    
    let shDaily = ss.getSheetByName('اليومية');
    if(shDaily){
      let rows = shDaily.getDataRange().getValues();
      let daily = [];
      for(let i=1;i<rows.length;i++){
        daily.push({id:rows[i][0], type:rows[i][1], item:rows[i][2], person:rows[i][3], amount:rows[i][4], date:rows[i][5], wallet:rows[i][6], note:rows[i][7], direction:rows[i][8], status:rows[i][9], excludeFromBalance:rows[i][10]});
      }
      result.daily = daily;
    }
    
    let shAtt = ss.getSheetByName('الحضور');
    if(shAtt){
      let rows = shAtt.getDataRange().getValues();
      let att = {};
      for(let i=1;i<rows.length;i++){
        att[rows[i][0]] = {in:rows[i][1], out:rows[i][2]};
      }
      result.attendance = att;
    }
    
    let shTasks = ss.getSheetByName('المهام');
    if(shTasks){
      let rows = shTasks.getDataRange().getValues();
      let tasks = [];
      for(let i=1;i<rows.length;i++){
        tasks.push({id:rows[i][0], text:rows[i][1], cat:rows[i][2], done:rows[i][3]});
      }
      result.tasks = tasks;
    }
    
    let shLog = ss.getSheetByName('سجل_الحضور');
    if(shLog && shLog.getLastRow()>=2) result.attendance_log = JSON.parse(shLog.getRange(2,1).getValue()||'[]');
    
    let shImp = ss.getSheetByName('المهم');
    if(shImp && shImp.getLastRow()>=2) result.important = JSON.parse(shImp.getRange(2,1).getValue()||'[]');
    
    let shDebts = ss.getSheetByName('الديون');
    if(shDebts && shDebts.getLastRow()>=2) result.debts = JSON.parse(shDebts.getRange(2,1).getValue()||'[]');
    
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  }catch(err){
    return ContentService.createTextOutput(JSON.stringify({error: err.message})).setMimeType(ContentService.MimeType.JSON);
  }
}

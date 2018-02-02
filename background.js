// browser.browserAction.onClicked.addListener(()=>{
//   pluginLogic.onClick();
// });
//
// browser.runtime.onMessage.addListener((request, sender, sendResponse)=>{
//   pluginLogic.doAction(request.action,request.data);
//   sendResponse({done:true});
// });
// web-ext --keep-profile-changes -p="C:\Users\Dep\AppData\Roaming\Mozilla\Firefox\Profiles\hg9ksw2o.dev" run

browser.downloads.download({
url  : "https://stage-2-docs.advance-docs.ru/ReplicationFile/Download/308" ,
filename : "qweqweqweqw\\DTREA_RU.АА22.А.00171_20171204_232453.xlsx"
})

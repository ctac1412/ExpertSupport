browser.runtime.onMessage.addListener(listener)

function listener(request) {
  switch (request.action) {
    case "geloisLoad":
      geloisLoad()
      break;
    default:
  }
}

function geloisLoad() {
  let temdoc = {}
  browser.storage.local.get("tempDoc").then((obj) => {
    temdoc = obj.tempDoc
    console.log(temdoc);
  }).then(() => {
    // Заявитель наименование
    ChangeValue("TBzkfullname", temdoc.ApplicantTitle)
    // Адрес заявителя
    ChangeValue("TBzkaddress", temdoc.ApplicantInfo)
    // Изготовитель наименование
    ChangeValue("TBproizvproduct", temdoc.ManufacturerTitle)
    // Адрес изготовителя
    ChangeValue("TBproizvadres", temdoc.ManufacturerInfo)
    // Продукция
    ChangeValue("TBnameproduct", temdoc.ProductInfo)
    // Описание типового образца
    ChangeValue("TBproducttypename", temdoc.ProductIdentification)
    // Количество образцов ProductIdentification
    ChangeValue("TBactkol", "3")
    // ТР ТС, ГОСТ и т.п.
    ChangeValue("TBnormativy", temdoc.ReglamentsText)
    // Дата протокола испытаний
    // ChangeValue("TBdatezay", new Date())


    let name = temdoc.AutName.split(" ")
    if (name.length >= 2) {
      ChangeValue("TBfiozay", name[1][0] + ". " + name[0][0]+ ".")
    } else {
      ChangeValue("TBfiozay", "К.С.")
    }

    switch (temdoc.typeDocument) {
      case  "ДС ТР ЕАЭС":
      case  "ДС ГОСТ Р":
        document.querySelectorAll('#TBdecl option')[1].selected = true
        document.querySelector("#TBdecl_chzn span").innerHTML = "Декларации"
      break;
      case  "СС ТР ЕАЭС":
      case  "СС ГОСТ Р":
      document.querySelectorAll('#TBdecl option')[2].selected = true
      document.querySelector("#TBdecl_chzn span").innerHTML = "Сертификата"
      break;
      default:
    }
    TBtechSet()

    function TBtechSet() {
      if (!window.TBtech) {
        window.TBtech = []
        document.querySelectorAll('#TBtech option').forEach(item => {
          TBtech.push({
            id: item.value,
            text: item.innerHTML
          })
        })
      }
      var res = temdoc.ReglamentsText.match(/[0-9]{3}\/[0-9]{4}/gi)

      if (res && res.length>0) {
      if (res.toString().includes("005")) {
        document.querySelectorAll('#TBtech option')[3].selected = true
      } else   if (res.toString().includes("007")) {
        document.querySelectorAll('#TBtech option')[4].selected = true
      } else   if (res.toString().includes("008")) {
        document.querySelectorAll('#TBtech option')[5].selected = true
      } else   if (res.toString().includes("017")) {
        document.querySelectorAll('#TBtech option')[6].selected = true
      } else {
        document.querySelectorAll('#TBtech option')[2].selected = true
      }
      } else {
          switch (temdoc.typeDocument) {
              case  "ДС ГОСТ Р":
              case  "СС ГОСТ Р":
              document.querySelectorAll('#TBtech option')[1].selected = true
              break;
              default:
document.querySelectorAll('#TBtech option')[2].selected = true
            }

      }

      SelTR()



      function SelTR() {
        if (document.getElementById('TBtech').selectedIndex == 0) {
          document.getElementById('TBtechlong').value = '';
        } else {
          document.getElementById('TBtechlong').value = document.getElementById('TBtech').options[document.getElementById('TBtech').selectedIndex].text;
        }
      }
      document.querySelector("#TBtech_chzn span").innerHTML = document.querySelector('#TBtech').selectedOptions[0].innerHTML
    }

  });

  function ChangeValue(id, str) {
    document.querySelector('#' + id).value = str;
  }
}

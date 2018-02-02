browser.runtime.onMessage.addListener(listener)
var DomenUrl = location.hostname.replace(".advance-docs.ru", "")

function runtimeMessageSend(obj) {
  browser.runtime.sendMessage(obj)
}
StartObserver()
StartObserverLabs()
function get_labs(){
  var i = document.querySelector('#AcceptanceReason')

  console.log(  i && !document.querySelector('.custom_labs'));

  if (i && !document.querySelector('.custom_labs')) {
    console.log(document.querySelector('.custom_labs'));
    var parent = i.parentNode
    var clone = parent.querySelector(".row").cloneNode(true);
    var a = clone.querySelector(".text-link")
    function test() {
      var cstp=''
      LoadTemp().then(()=>{
        return browser.storage.local.get("cstp")
      }).then((i)=>{
        cstp=i.cstp
        return  browser.storage.local.get("tempDoc")
      }).then(data=>{
      var tempDoc= data.tempDoc
      console.log(data);
      let lab_id = document.querySelector('#lab_select').value
      let prod_nd_id = document.querySelector('#nd_select').value
      let partner_type = (tempDoc.Applicant.SubjectType == 'LegalEntity')?'partner':'partner_ip'

      if (tempDoc.Applicant.EnterpreneurType=="Enterpreneur"){
        tempDoc.Applicant.Title= 'Индивидуальный предприниматель ' + tempDoc.Applicant.Title
      } else if (tempDoc.Applicant.EnterpreneurType=="Private") {
        tempDoc.Applicant.Title= 'Частный предприниматель ' + tempDoc.Applicant.Title
      } else if (tempDoc.Applicant.EnterpreneurType=="Farm") {
        tempDoc.Applicant.Title= 'Глава крестьянского (фермерского) хозяйства ' + tempDoc.Applicant.Title
      }
      console.log(cstp);
      d = {
        'key': cstp , // sequrity key

        'lab_id': lab_id,
        'prod_nd_id': prod_nd_id,
        'partner_type': partner_type, // yur lico
        // ApplicantType
        // Variants for partner type
        // partner
        // partner_cert_organ
        // partner_individual
        // partner_ip
        // partner_foreign
        // partner_cert_organ
        // partner_provider


        'req_partner_name': tempDoc.Applicant.Title,

        'req_ogrn': (tempDoc.Applicant['OGRN'])?tempDoc.Applicant['OGRN']:tempDoc.Applicant['OGRNIP'],
        'req_fio_head': tempDoc.Applicant.DirectorName,
        'req_fio_head_rod_pad': tempDoc.Applicant.DirectorNameGenitive,
        'req_fio_head_dat_pad': tempDoc.Applicant.DirectorNameDative,
        // 'req_head_doc': false,

        //ip
        // 'req_inn':
        // 'req_nomer_documenta_o_reg':
        //
        // // Individual
        // 'req_passport_seria':
        // 'req_passport_num':
        // 'req_vidano':
        // 'req_data_vidachi':
        // 'req_kod_podrazdeleniya':
        //
        // // cert block
        // 'req_cert_reg_number':
        // 'req_cert_reg_date':

        'req_address': tempDoc.Applicant.Address,
        'req_country': tempDoc.Applicant.CountryIDInfo,
        'req_region':  tempDoc.Applicant.RegionIDInfo,
        'req_phone': tempDoc.Applicant.Phone,
        'req_email': tempDoc.Applicant.Email,
        'req_faxnum': tempDoc.Applicant.Fax,


        // 'doc_execution': false,
        // 'doc_exec_decl': false,
        // 'doc_exec_cert': false,
        // 'doc_exec_other': false,
        // 'doc_exec_notes':  '',
        //
        // 'provesti_otbor_obrazcov': false,
        // 'provesti_lab_research': false,
        // 'vidat_expert_conclusion': false,
        //
        // 'do_different': false,
        // 'different_descr':  '',
        // 'addres_otbor':  '',

        'product_type': (tempDoc.Manufacturer.CountryInfo=="RU")?'local':'import', // 'import' , 'local'
        'product_name': tempDoc.ProductInfo,
        'product_info': tempDoc.ProductIdentification,

        // 'tnved_ids': [],
        // 'example_counts': '',
        // 'expert_results': '',


        'izgotovitel_name': tempDoc.Manufacturer.Title,
        'izgotovitel_address': tempDoc.Manufacturer.Address,
        'izgotovitel_phone': tempDoc.Manufacturer.Phone,
        'izgotovitel_email': tempDoc.Manufacturer.Email,



        'v_sootvetstvii_s': tempDoc.Accordingly,
        'perechen_documentov': '',
      };

        fetch("http://172.16.20.14:5002/requests",{
          method : 'POST',
          credentials : 'include',
          body : JSON.stringify(d),
          headers: new Headers({
          'Content-Type': 'application/json'
      })
      }).then((response)=>{
        console.log('done');
        console.log(response);
        return response.json()
      }).then(obj=>{
        if (obj.request.protocol_num){
          document.querySelector('#AcceptanceReason').value = obj.request.protocol_num
        }

      })

    })
    }
    function add_option(select) {
     fetch("http://172.16.20.14:5002/labs", {
        method: 'GET',
        credentials: 'include'
      }).then((response) => {
        return response.json()
      }).then(obj => {
          if (obj.labs){ obj.labs.forEach(item=>{
          let option = document.createElement("option");
          option.text = item.name
          option.value = item.id
          select.add(option, select[0])
        })
        }
      }).catch((e)=>{
        console.log(e);
      })
    }

    a.removeAttribute('data-updateprotocols')
    a.innerText = 'Взять протокол'
    a.onclick = test

    // parent.insertBefore(clone, parent.children[1]);
    add_div_nd()
    add_div_labs()
    function labs_change(){
      let nd_element = document.querySelector('#nd_select')
      if (nd_element){
        nd_element.innerHTML=''
        fetch("http://172.16.20.14:5002/labs", {
           method: 'GET',
           credentials: 'include'
         }).then((response) => {
           return response.json()
         }).then(obj => {
            let lab = obj.labs.find(function(item) {
              if (item.id == document.querySelector('#lab_select').value){
                return true
              }
            })
            if (lab){
              if (lab.prod_nd){ lab.prod_nd.forEach(item=>{
              let option = document.createElement("option");
              option.text = item.name
              option.value = item.id
              nd_element.add(option, nd_element[0])
            })
          }}
         }).catch((e)=>{
           console.log(e);
         })
      }
    }
    function add_div_labs() {
      let n_div = document.createElement("div");
      n_div.className = "row custom_labs";
      let sub_div = document.createElement("div");
      sub_div.className = "col-xs-8";
      sub_div.innerHTML = '<label><strong>Лаборатория испытаний:</strong></label>'
      let sub_sel = document.createElement("select");
      sub_sel.onchange = labs_change
      sub_sel.id = 'lab_select';
      sub_sel.className = "col-xs-12 b-space-xs";

      add_option(sub_sel)
      n_div.appendChild(sub_div);
      n_div.appendChild(sub_sel);
      parent.insertBefore(n_div, parent.children[1]);
      labs_change()
    }

    function add_div_nd() {
      let n_div = document.createElement("div");
      n_div.className = "row";
      let sub_div = document.createElement("div");
      sub_div.className = "col-xs-8";
      sub_div.innerHTML = '<label><strong>Выбор НД:</strong></label>'
      let sub_sel = document.createElement("select");
      sub_sel.id = 'nd_select';
      sub_sel.className = "col-xs-12 b-space-xs";

      n_div.appendChild(sub_div);
      n_div.appendChild(sub_sel);
      n_div.innerHTML += `<div class="col-xs-4 pull-right">
      <a id="custom_take_lab" class="text-link" href="javascript:void(0)">Взять протокол</a>
      </div>`
      parent.insertBefore(n_div, parent.children[1]);

      document.querySelector('#custom_take_lab').onclick=test
    }

  }

}

function CheckBtn() {
  if (document.querySelector('#btnSave')) {
    runtimeMessageSend({
      sidebar: true,
      action: "SaveOn"
    })
  } else {
    runtimeMessageSend({
      sidebar: true,
      action: "SaveOff"
    })
  }


}
function StartObserver() {
  var target = document.querySelector('.wrapper');

  // create an observer instance
  var observer = new MutationObserver((mutations) => {
    CheckBtn()

  });
  // configuration of the observer:
  var config = {
    childList: true,
    subtree: true
  }
  // pass in the target node, as well as the observer options

  if (target) {
    console.log('Start observer');
    observer.observe(target, config);
  }

}
function StartObserverLabs() {
  var target = document.querySelector('.wrapper');
  // create an observer instance
  var observer = new MutationObserver((mutations) => {
    get_labs()

  });
  // configuration of the observer:
  var config = {
    childList: true,
    subtree: true
  }
  // pass in the target node, as well as the observer options

  if (target) {
    console.log('Start observer');
    observer.observe(target, config);
  }

}




function listener(request) {

  switch (request.action) {
    case "STARTPOST":
      return Promise.resolve().then(() => {
        return PostForm(request.fullObj)
      }).then(() => {
        var allmsg = []
        allmsg.push({message: "загрузка прошла успешно", class: "success"})
        allmsg.push({message: "ТН ВЭД не были выгруженны.", class: "warning"})
        allmsg.push({message: "Филиалы не были выгруженны", class: "warning"})
        return Promise.resolve(allmsg);
      }).catch(err => {
        var allmsg = []
        allmsg.push({message: err.message, class: "danger"})
        return Promise.resolve(allmsg);
      })
    case "FocusUp":
      document.querySelector(".wrapper").scrollTop = 0
      break;
    case "CheckBtn":
      CheckBtn()
      break;
    case "Save":
      document.querySelector('#btnSave').click()
      break;
    case "LoadTemp":
      return LoadTemp()

    default:
  }
}

function InfoRegion() {}

function InfoCountry(CountryIDInfo) {
  d = new FormData();
  d.append('SearchRequest', CountryIDInfo);
  d.append('GridLayout', "False");
  d.append('OnlyActive', "False");
  d.append('DoSearch', "True");
  d.append('SortKey', "Id");
  d.append('ActionName', "Index");
  d.append('ControllerName', "Home");
  d.append('SortAscending', "True");
  d.append('Page', "1");
  d.append('RecordsPerPage', "10");
  d.append('TotalRecords', "175");
  d.append('StatusAvailable', "True");
  d.append('Readonly', "False");
  return fetch("https://" + DomenUrl + ".advance-docs.ru/Country", {
    method: 'POST',
    credentials: 'include',
    body: d
  }).then((response) => {
    return response.text()
  }).then((text) => {
    var parser = new DOMParser()
    var doc = parser.parseFromString(text, "text/html");
    return doc.querySelector('.date').innerHTML
  })
}

function LoadTemp() {
  function getFormData(url, formselector) {
    console.log(url);
    return fetch(url, {
      method: 'GET',
      credentials: 'include'
    }).then((response) => {
      return response.text()
    }).then((text) => {
      var parser = new DOMParser()
      var doc = parser.parseFromString(text, "text/html");
      var form = doc.querySelector('#' + formselector);
      var frmd = new FormData(form);
      var eArr = frmd.entries();
      var resarr = {}
      frmd.forEach(() => {
        var item = eArr.next().value
        resarr[item[0]] = item[1]
      })
      resarr.CountryIDInfo = doc.querySelector("#CountryID").selectedOptions[0].innerHTML
      var i = doc.querySelector("#RegionID")
      if (i !== null && i.value !== "") {
        return fetch("https://" + DomenUrl + ".advance-docs.ru/Region/Show?id=" + i.value, {
          method: 'GET',
          credentials: 'include'
        }).then((response) => {
          return response.json()
        }).then((resp) => {
          resarr.RegionIDInfo = resp.text
          return resarr
        })
      } else {
        return resarr
      }
    })
  }
  var form = document.querySelector('#document_form');
  var frmd = new FormData(form);
  var eArr = frmd.entries();
  var resarr = {}
  frmd.forEach(() => {
    var item = eArr.next().value
    resarr[item[0]] = item[1]
  })
  resarr.typeDocument = document.querySelector('.col-xs-14 input.form-control').value
  resarr.nameOrgan = document.querySelector('.col-xs-19 input.form-control').value

  return fetch("https://" + DomenUrl + ".advance-docs.ru/Agency", {
    method: 'GET',
    credentials: 'include'
  }).then((response) => {
    return response.text()
  }).then((text) => {
    var parser = new DOMParser()
    var agen = parser.parseFromString(text, "text/html");
    var i = agen.querySelectorAll("a.edit.edit-title")
    var res = ""
    i.forEach(item => {
      if (item.firstChild.data == resarr.nameOrgan) {
        res = item.getAttribute("data-id")
      }
    })
    return res
  }).then((id) => {
    return fetch("https://" + DomenUrl + ".advance-docs.ru/Agency/Edit/" + id, {
      method: 'GET',
      credentials: 'include'
    })
  }).then((response) => {
    return response.text()
  }).then((text) => {
    var parser = new DOMParser()
    var agen = parser.parseFromString(text, "text/html");

    var agenforma = agen.querySelector('#agency_form');
    var agenfrmd = new FormData(agenforma);
    var ageneArr = agenfrmd.entries();
    var agenresarr = {}
    agenfrmd.forEach(() => {
      var item = ageneArr.next().value
      agenresarr[item[0]] = item[1]
    })
    resarr.fullinfoOrgan = agenresarr
    return
  }).then(() => {
    return getFormData("https://" + DomenUrl + ".advance-docs.ru/Contractor/Edit/" + resarr.ApplicantID, "frmContractor")
  }).then((obj) => {
    resarr.Applicant = obj
    return InfoCountry(resarr.Applicant.CountryIDInfo).then((value) => {
      resarr.Applicant.CountryInfo = value
    }).then(() => {
      return getFormData("https://" + DomenUrl + ".advance-docs.ru/Contractor/Edit/" + resarr.ManufacturerID, "frmContractor")
    });
  }).then((obj) => {
    resarr.Manufacturer = obj
    return InfoCountry(resarr.Manufacturer.CountryIDInfo).then((value) => {
      resarr.Manufacturer.CountryInfo = value
    })

  }).then(() => {
    resarr.AutName = document.querySelector('.admin-menu a').innerHTML
    return browser.storage.local.set({tempDoc: resarr})
  }).then(() => {
    var allmsg = [
      {
        message: "Данные : " + document.querySelector('#Id').value + " документа загружены в память",
        class: "success"
      }
    ]
    return allmsg
  })
}

function PostForm(data) {

  var form = document.querySelector('#document_form');
  var frmd = new FormData(form);
  var data = data

  var eArr = frmd.entries();
  frmd.forEach((e) => {
    var item = eArr.next().value
    switch (item[0]) {
      case "Id":
      case "ClaimId":
      case "DocumentId":
      case "DocumentTemplateId":
      case "ParentLinkId":
      case "StatementView":
      case "ApplicantAgrees":
      case "SchemaNotPublish":
      case "X-Requested-With":
        break;
      default:
        frmd.set(item[0], "")
    }
  })

  return PrepareData(data).then(() => {
    var eArr = frmd.entries();
    var resarr = {}
    frmd.forEach(() => {
      var item = eArr.next().value
      resarr[item[0]] = item[1]
    })
    return fetch(form.action, {
      method: 'POST',
      credentials: 'include',
      body: frmd
    })
  }).then((responce) => {
    return responce.text()
  }).then((text) => {
    var parser = new DOMParser()
    var doc = parser.parseFromString(text, "text/html");
    $("#document_container").html(text);
    $("#footer_spinner").hide();
    $("#footer_content").hide();
  })

  function PrepareData(data) {
    return Promise.resolve().then(() => {
      return SetApplicant(data.Applicant)
    }).then(() => {
      return SetManufacturer(data.Manufacture)
    }).then(() => {
      return SetOther(data)
    })
  }

  function SetApplicant(data) {
    var obj = data

    obj.PhisicalAddressTheSame = WordToBoolen(obj.PhisicalAddressTheSame)
    return LegalFormID(obj.LegalFormID).then((id) => {
      obj.LegalFormID = id
    }).then(() => {
      obj._location = _locationDetected(obj.CountryID)
      return CountriID(obj.CountryID).then((id) => {
        obj.CountryID = id
      })
    }).then(() => {
      return RegionID(obj.RegionID).then((id) => {
        obj.RegionID = id
      })
    }).then(() => {
      return CountriID(obj.SecondCountryID).then((id) => {
        obj.SecondCountryID = id
      })
    }).then(() => {
      return RegionID(obj.SecondRegionID).then((id) => {
        obj.SecondRegionID = id
      })
    }).then(() => {
      return SetContractor(obj)
    }).then((ret) => {
      frmd.set("ApplicantInitials", [ret.Initials])
      frmd.set("ApplicantTitle", ret.Title)
      frmd.set("ApplicantInfo", ret.Info)
      frmd.set("ApplicantAuthorizedPerson", ret.DirectorPost + " " + ret.DirectorName)
      frmd.set("ApplicantID", ret.id)
    });
  }

  function SetManufacturer(data) {
    var obj = data

    obj.PhisicalAddressTheSame = WordToBoolen(obj.PhisicalAddressTheSame)
    return LegalFormID(obj.LegalFormID).then((id) => {
      obj.LegalFormID = id
    }).then(() => {
      obj._location = _locationDetected(obj.CountryID)

      return CountriID(obj.CountryID).then((id) => {
        obj.CountryID = id
      })
    }).then(() => {

      return RegionID(obj.RegionID).then((id) => {
        obj.RegionID = id
      })
    }).then(() => {
      return CountriID(obj.SecondCountryID).then((id) => {
        obj.SecondCountryID = id
      })
    }).then(() => {
      return RegionID(obj.SecondRegionID).then((id) => {
        obj.SecondRegionID = id
      })
    }).then(() => {
      return SetContractor(obj)
    }).then((ret) => {

      frmd.set("ManufacturerTitle", ret.Title)
      frmd.set("ManufacturerInfo", ret.Info)
      frmd.set("CountryId", ret.CountryId)
      frmd.set("ManufacturerID", ret.id)

    });
  }

  function WordToBoolen(str) {
    var result
    switch (str.toLowerCase()) {
      case "да":
        result = true
        break;
      case "нет":
        result = false
        break;
    }

    return result
  }

  function ProductType(str) {
    var result = ""
    switch (str) {
      case "expression":
        result = "Part"
        break;
      case "Серийный выпуск":
        result = "Serial"
        break;
      case "Единичное изделие":
        result = "Single"
        break;
      default:
        result = ""
    }
    return result
  }

  function schemaid(str) {
    var str = str.match(/(^[0-9]{1})/gi)[0]
    if (!window.schemaid || window.schemaid.length == 0) {
      window.schemaid = []
      document.querySelectorAll('#SchemaID option').forEach(item => {
        window.schemaid.push({
          id: item.value,
          text: item.innerHTML.replace(/([^0-9]{1})/gi, '')
        })
      })
    }
    var i = window.schemaid.filter(item => {
      if (item.text.includes(str)) {
        return item
      }
    })
    if (i) {
      return i[0].id
    } else {
      return ""
    }
  }

  function ApplicantType(str) {
    var str = str.toLowerCase()
    if (!window.ApplicantType || window.ApplicantType.length == 0) {
      window.ApplicantType = []
      document.querySelectorAll('#ApplicantType option').forEach(item => {
        window.ApplicantType.push({id: item.value, text: item.innerHTML.toLowerCase()})
      })
    }

    var i = window.ApplicantType.filter(item => {
      if (item.text.includes(str)) {
        return item
      }
    })
    if (i) {
      return i[0].id
    } else {
      return ""
    }
  }

  function Reglaments(str) {
    var str = str.match(/[\d\/]{8}/gi)
    if (!window.Reglaments || window.Reglaments.length == 0) {
      window.Reglaments = []
      document.querySelectorAll('#ReglamentIdsContainer option').forEach(item => {
        window.Reglaments.push({id: item.value, text: item.innerHTML})
      })
    }

    var i = window.Reglaments.filter(item => {
      var res = item.text.match(/[\d\/]{8}/gi)

      if (res && res[0].includes(str)) {
        return item
      }
    })

    if (i.length >= 1) {
      return i
    } else {

      return ""
    }
  }

  function SetOther(data) {
    data.Other.SchemaID = schemaid(data.Other.SchemaID)
    data.Other.ApplicantType = ApplicantType(data.Other.ApplicantType)
    if (data.Other.ApplicantType == "AuthorizedPerson") {
      data.Other.ApplicantAuthorizedPersonTitle = "-уполномоченное изготовителем лицо на основании"
    }

    data.Other.ProductType = ProductType(data.Other.ProductType)

    var ReglamentsText = ""

    data.Reglaments.forEach((item, index) => {
      if (item !== "нет") {

        var res = Reglaments(item)[0]
        if (res !== undefined) {
          frmd.append("ReglamentIdsContainer", parseInt(res.id, 10))
          if (index == data.Reglaments.length - 1) {
            ReglamentsText += res.innerHTML
          } else {
            ReglamentsText += res.text + ", "
          }
        }
      }
    })
    ReglamentsText = ReglamentsText.replace(/(\, )$/, "")
    frmd.set("ReglamentsText", ReglamentsText)

    return Promise.resolve().then((obj) => {
      for (var key in data.Other) {
        frmd.set(key, data.Other[key])
      }
    })

  }

  function SetContractor(obj) {
    var _id
    if (!obj) {
      console.log("Передаете пустой объект");
      throw new error("Передаете пустой объект")
    }

    return GetContractor(obj).then((id) => {

      _id = id
      return fetch("https://" + DomenUrl + ".advance-docs.ru/Contractor/GetDescription?id=" + id + "&ogrnAtStart=false&splitReg=false&fullInitials=true&version=EA&manufacturer=false", {
        method: 'GET',
        credentials: 'include'
      }).then((response, id) => {
        return response.json()
      });
    }).then((ret) => {

      ret.id = _id
      return ret
    })
  }

  function RegionID(str) {
    var str = str
    if (str == "") {
      return Promise.resolve("")
    }
    return fetch("https://" + DomenUrl + ".advance-docs.ru/Region/Search?q=" + str + "&CountryID=1", {
      method: 'GET',
      credentials: 'include'
    }).then((response) => {
      return response.json()
    }).then((data) => {
      if (data.length == 0) {
        console.log("RegionID ничего не нашел по запросу:", str);
        return ""
      } else {
        return data[0].id
      }

    });
  }

  function CountriID(str) {
    var str = str
    if (str == "") {
      return Promise.resolve("")
    }
    console.log("https://" + DomenUrl + ".advance-docs.ru/Contractor/CountriesList?location=Foreign");
    return fetch("https://" + DomenUrl + ".advance-docs.ru/Contractor/CountriesList?location=Foreign", {
      method: 'GET',
      credentials: 'include'
    }).then((response) => {
      return response.json()
    }).then((data) => {
      var i = data.filter(item => {
        if (item.text.toLowerCase() == str.toLowerCase()) {
          return item
        }
      })
      if (i.length == 0) {
        console.log("CountriID ничего не нашел по запросу:", str);
        return ""
      } else {
        return i[0].id
      }
    });
  }

  function _locationDetected(str) {
    var result = ""
    var str = str
    switch (str.toLowerCase()) {
      case "российская федерация":
      case "казахстан":
      case "республика беларусь":
      case "армения":
      case "киргизия":
        result = "Local"
        break;
      default:
        result = "Foreign"
    }
    return result
  }

  function AddContractor(obj) {

    return Promise.resolve().then(() => {
      var d = new FormData();
      switch (obj._location) {
        case "Foreign":
          d.append("Active", true);
          d.append("Id", 0);
          d.append('CreatedAt', '01.01.0001+0:00:00')
          d.append('SubjectType', 'LegalEntity')
          d.append('Location', 'Foreign')
          d.append('CopyParentIdContainer', 0)

          d.append('Title', obj.Title)
          d.append('CountryID', obj.CountryID)
          d.append('Address', obj.Address)
          d.append('PhisicalAddress', obj.PhisicalAddress)
          break;
        case "Local":
          d.append("Active", true);
          d.append("Id", 0);
          d.append('CreatedAt', '01.01.0001+0:00:00')
          d.append('SubjectType', 'LegalEntity')
          d.append('Location', 'Local')
          d.append('CopyParentIdContainer', 0)

          d.append('Title', obj.Title)
          d.append('LegalFormID', obj.LegalFormID)
          d.append('Address', obj.Address)
          d.append('CountryID', obj.CountryID)
          d.append('RegionID', obj.RegionID)
          d.append('Phone', obj.Phone)
          d.append('Email', obj.Email)
          // d.append('Fax', obj.Fax)
          d.append('OGRN', obj.ogrn)

          d.append('PhisicalAddressTheSame', obj.PhisicalAddressTheSame)
          d.append('PhisicalAddress', obj.PhisicalAddress)
          d.append('SecondCountryID', obj.SecondCountryID)
          d.append('SecondRegionID', obj.SecondRegionID)

          d.append('DirectorNameGenitive', obj.DirectorNameGenitive)
          d.append('DirectorName', obj.DirectorName)
          d.append('DirectorNameDative', '')
          d.append('DirectorPost', obj.DirectorPost)
          d.append('DirectorReglament', "")

          d.append('RegistrationInfo', '')
          d.append('AccreditationRecNumber', '')
          d.append('RegistrationIssuer', '')
          d.append('RegistrationIssuedDateContainer', '')
          d.append('INN', '')
          d.append('OKPO', '')
          break;
        default:
      }

      return fetch("https://" + DomenUrl + ".advance-docs.ru/Contractor/Update", {
        method: 'POST',
        credentials: 'include',
        body: d
      }).then((response) => {
        return response.text()
      }).then(text => {
        parser = new DOMParser();
        doc = parser.parseFromString(text, "text/html");
        if (doc.querySelector('.alert.alert-danger')) {
          throw new Error(doc.querySelector('.alert.alert-danger').innerHTML);
        } else {
          return doc.querySelector('#Id').value
        }
      })
    })
  }

  function GetContractor(obj) {
    var url = ""
    var str = ""
    var obj = obj
    switch (obj._location) {
      case "Local":
        str = obj.ogrn
        break;
      case "Foreign":
        str = obj.Title
        break;
      default:
    }
    if (!str) {
      throw new crateFormException("Нет данных по компании")
    }
    url = "https://" + DomenUrl + ".advance-docs.ru/Contractor/Search?q=" + str;
    console.log(url);
    return fetch(url, {
      method: 'GET',
      credentials: 'include'
    }).then((response) => {
      return response.json()
    }).then((data) => {
      if (data.length > 0) {
        return data[0].id;
      } else {
        return AddContractor(obj).then((id) => {
          return id
        })
      }
    })
  }
}

function crateFormException(message, value) {
  this.value = value;
  this.message = message;
  this.toString = function() {
    return this.message + " : " + this.value;
  };
};

function LegalFormID(str) {
  if (!str) {
    return Promise.resolve("")
  }
  if (!window.legarray) {
    window.legarray = []
    window.legarray.push({name: "Общество с ограниченной ответственностью", id: "1"})
    window.legarray.push({name: "Общество с дополнительной ответственностью", id: "2"})
    window.legarray.push({name: "Открытое акционерное общество", id: "3"})
    window.legarray.push({name: "Закрытое акционерное общество", id: "4"})
    window.legarray.push({name: "Акционерное общество", id: "5"})
    window.legarray.push({name: "Учреждение", id: "6"})
    window.legarray.push({name: "Государственная корпорация", id: "7"})
    window.legarray.push({name: "Государственная компания", id: "8"})
    window.legarray.push({name: "Прочая некоммерческая организация", id: "9"})
    window.legarray.push({name: "Объединение юридических лиц (ассоциация или союз)", id: "10"})
    window.legarray.push({name: "Некоммерческое партнерство", id: "11"})
    window.legarray.push({name: "Автономная некоммерческая организация", id: "12"})
    window.legarray.push({name: "Представительство или филиал", id: "13"})
    window.legarray.push({name: "Индивидуальный предприниматель", id: "14"})
    window.legarray.push({name: "Автономное учреждение", id: "15"})
    window.legarray.push({name: "Бюджетное учреждение", id: "16"})
    window.legarray.push({name: "Унитарное предприятие", id: "17"})
    window.legarray.push({name: "Производственный кооператив", id: "18"})
    window.legarray.push({name: "Унитарное предприятие, основанное на праве оперативного управления", id: "19"})
    window.legarray.push({name: "Унитарное предприятие, основанное на праве хозяйственного ведения", id: "20"})
    window.legarray.push({name: "Хозяйственное товарищество или общество", id: "21"})
    window.legarray.push({name: "Полное товарищество", id: "22"})
    window.legarray.push({name: "Крестьянское (фермерское) хозяйство", id: "23"})
    window.legarray.push({name: "Товарищество на вере", id: "24"})
    window.legarray.push({name: "Частное учреждение", id: "25"})
    window.legarray.push({name: "Садоводческое, огородническое или дачное некоммерческое товарищество", id: "26"})
    window.legarray.push({name: "Объединение крестьянских (фермерских) хозяйств", id: "27"})
    window.legarray.push({name: "Орган общественной самодеятельности", id: "28"})
    window.legarray.push({name: "Территориальное общественное самоуправление", id: "29"})
    window.legarray.push({name: "Общественная или религиозная организация (объединение)", id: "30"})
    window.legarray.push({name: "Общественное движение", id: "31"})
    window.legarray.push({name: "Потребительский кооператив", id: "32"})
    window.legarray.push({name: "Простое товарищество", id: "33"})
    window.legarray.push({name: "Фонд", id: "34"})
    window.legarray.push({name: "Паевой инвестиционный фонд", id: "35"})
    window.legarray.push({name: "Товарищество собственников жилья", id: "36"})
    window.legarray.push({name: "Иное неюридическое лицо", id: "38"})
  }
  var i = window.legarray.filter(item => {
    if (item.name.toLowerCase() == str.toLowerCase()) {
      return item
    }
  })
  if (i.length >= 1) {
    return Promise.resolve(i[0].id)
  } else {
    return Promise.resolve("1")
  }

}

//  выбираем целевой элемент
// var target = document.body;
//
//  создаём экземпляр MutationObserver
// var observer = new MutationObserver(function(mutations) {
//   mutations.forEach(function(mutation) {
//
//     if (mutation.target.className == "modal-open") {
//
//     console.log(mutation);
//           var a = document.createElement('a');
//           a.href  = "javascript:void(0);"
//           a.clasName = "text-link add-table-row add-link"
//           a.innerHTML = '<span class="item-text">Сгенирировать код API</span>'
//           a.onclick  = generate
//           a.style.marginleft = "1px"
//           if (document.querySelector('#Keyword')) {
//               document.querySelector('#Keyword').parentElement.appendChild(a)
//           }
//     }
//   });
// });
//
//  конфигурация нашего observer:
// var config = { attributes: true };
//  передаём в качестве аргументов целевой элемент и его конфигурацию
// observer.observe(target, config);
//
//  позже можно остановить наблюдение
//
// function generate()
// {
//     var len = 10
//     var ints =[0,1,2,3,4,5,6,7,8,9];
//     var chars=['a','b','c','d','e','f','g','h','j','k','l','m','n','o','p','r','s','t','u','v','w','x','y','z'];
//     var out='';
//
//       for(var i=0;i<len;i++){
//           var ch=Math.random(1,2);
//           if(ch<0.5){
//              var ch2=Math.ceil(Math.random(1,ints.length)*10);
//              out+=ints[ch2];
//           }else{
//              var ch2=Math.ceil(Math.random(1,chars.length)*10);
//              out+=chars[ch2];
//           }
//       }
//       document.querySelector('#Keyword').value = out
// }

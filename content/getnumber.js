let temdoc = {}


function Reglaments(str) {
  var str = str.match(/[\d\/]{8}/gi)
  if (!window.Reglaments || window.Reglaments.length == 0) {
    window.Reglaments = []
    document.querySelectorAll('#ReglamentIdsContainer option').forEach(item => {
      window.Reglaments.push({
        id: item.value,
        text: item.innerHTML
      })
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




function testget() {
  function ApplicantCountryIdContainer(str) {
    var str = str
    if (!window.ApplicantCountryIdContainer || window.ApplicantCountryIdContainer.length == 0) {
      window.ApplicantCountryIdContainer = []
      document.querySelectorAll('#ApplicantCountryIdContainer option').forEach(item => {
        if (item.innerHTML.match(/[A-Z]{2}/gi) !== null) {
          window.ApplicantCountryIdContainer.push({
            id: item.value,
            text: item.innerHTML.match(/[A-Z]{2}/gi)[0]
          })
        }
      })
    }

    var i = window.ApplicantCountryIdContainer.filter(item => {
      if (item.text.includes(str)) {
        return item
      }
    })

    if (i.length >= 1) {
      return i[0].id
    } else {
      return ""
    }
  }

  function loadelement(id, value) {
    var i = document.querySelector('#' + id)

    if (i) {
      console.log(i.type);
      if (value == undefined) {
        value = ""
      }
      switch (i.type) {
        case "select-one":
          console.log(value);
          i.value = value
          break;
        default:
          i.value = value
          i.innerHTML = value
      }


    }
  }

  function getRegionID(text) {
    var url = "http://getnumber.me/Region/Search?q=" + text + "&CountryID=170&_=1506677995045"
    console.log(url);
    return fetch(url, {
      method: 'GET',
      credentials: 'include'
    }).then((response) => {
      return response.json()
    }).then((text) => {
      return text[0].id
    });
  }

  browser.storage.local.get("tempDoc").then((obj) => {
    temdoc = obj.tempDoc
    console.log(temdoc);
  }).then(() => {
    var form = document.querySelector('#form0');
    return FormtoObject(form)
  }).then((obj) => {
    loadelement("RequestLab", true)
    document.querySelector('#RequestLab').parentElement.click()


    loadelement("ManufacturerAddress", temdoc.Manufacturer.Address)
    loadelement("ManufacturerTitle", temdoc.Manufacturer.Title)
    loadelement("ProductInfo", temdoc.ProductInfo)
    loadelement("ManufacturerCountryIdContainer", ApplicantCountryIdContainer(temdoc.Manufacturer.CountryInfo))
    loadelement("RequestLabIndicators", "по определяющим показателям")

    var it = temdoc.ReglamentsText.match(/([0-9]{3}\/[0-9]{4})/ig)
    SetReg(it)

    function SetReg(arr) {
      var result = ""
      var status = false
      var dc = document.querySelectorAll('#ReglamentIdsContainer option')
      for (var i = 0; i < arr.length; i++) {
        status == false


        dc.forEach((item, index) => {
          var txt = item.innerHTML.match(/([0-9]{3}\/[0-9]{4})/ig)
          if (txt.length > 0) {
            if (txt[0] == arr[i]) {
              dc[index].selected = "selected"
              status = true
            }
          }
        })

        if (status == false) {
          result += "Данный регламент не был найден: " + arr[i] + "\n\r"

        }
      }
      if (result != "") {
        alert(result)
      }
    }

    switch (temdoc.Manufacturer.CountryInfo) {
      case "RU":
      case "KZ":
      case "BY":
        loadelement("Location", "Foreign")
        break;
      default:
        loadelement("Location", "Local")
    }


    obj.ApplicantOGRN = temdoc.Applicant["OGRN"]
    obj.ApplicantOGRNIP = temdoc.Applicant["OGRNIP"]
    obj.ApplicantTitle = temdoc.Applicant.Title
    obj.ApplicantPhone = temdoc.Applicant.Phone
    obj.ApplicantEmail = temdoc.Applicant.Email
    obj.ApplicantAddress = temdoc.Applicant.Address

    obj.ApplicantCountryIdContainer = ApplicantCountryIdContainer(temdoc.Applicant.CountryInfo)
    obj.ManufacturerAddress = temdoc.Manufacturer.Address
    obj.ManufacturerTitle = temdoc.Manufacturer.Title
    obj.ProductIdentification = temdoc.ProductIdentification
    obj.ProductInfo = temdoc.ProductInfo
    obj.ManufacturerCountryIdContainer = ApplicantCountryIdContainer(temdoc.Manufacturer.CountryInfo)

    obj.RequestLab = true
    obj.RequestLabIndicators = "по определяющим показателям"

    var region = ""
    switch (temdoc.typeDocument) {
      case "СС ТР ЕАЭС":
        var e = document.querySelector('#Customer');
        if (e !== null && e.options[e.selectedIndex].innerHTML !== "Орган по сертификации") {
          alert("Тип документа сертификат, а заказчик испытаний не 'Орган по сертификации'. В заявителя будет будет выгружены данные органа")
        }
        obj.DocType = "Certificate"
        document.querySelectorAll('.b-tab-content-inner .styled-radio.styledRadio')[1].click()
        loadelement("DocType", "Certificate")
        loadelement("AgencyRegNumber", temdoc.fullinfoOrgan.RegNumber)
        loadelement("ProductIdentification", temdoc.ProductIdentification)
        loadelement("ApplicantOGRN", temdoc.fullinfoOrgan["OGRN"])
        loadelement("ApplicantTitle", temdoc.fullinfoOrgan.TitleFull)
        loadelement("ApplicantPhone", temdoc.fullinfoOrgan.Phone)
        loadelement("ApplicantEmail", temdoc.fullinfoOrgan.Email)
        loadelement("ApplicantAddress", temdoc.fullinfoOrgan.LegalAddress)
        loadelement("ApplicantCountryIdContainer", ApplicantCountryIdContainer("RU"))
        region = "Москва"
        break;
      case "ДС ТР ЕАЭС":
        obj.DocType = "Declaration"
        document.querySelectorAll('.b-tab-content-inner .styled-radio.styledRadio')[0].click()
        loadelement("DocType", "Declaration")

        // console.log(temdoc.ProductIdentification);
        if (temdoc.ProductIdentification == "") {
          temdoc.ProductIdentification = "*"
        }
        loadelement("ProductIdentification", temdoc.ProductIdentification)

        loadelement("ApplicantOGRNIP", temdoc.Applicant["OGRNIP"])
        loadelement("ApplicantOGRN", temdoc.Applicant["OGRN"])
        loadelement("ApplicantTitle", temdoc.Applicant.Title)
        loadelement("ApplicantPhone", temdoc.Applicant.Phone)
        loadelement("ApplicantEmail", temdoc.Applicant.Email)
        loadelement("ApplicantAddress", temdoc.Applicant.Address)
        loadelement("ApplicantCountryIdContainer", ApplicantCountryIdContainer(temdoc.Applicant.CountryInfo))
        region = temdoc.Applicant.RegionIDInfo
        break;
      default:

    }

    return getRegionID(region).then((id) => {
      loadelement("ApplicantRegionIdContainer", id)
      obj.ApplicantRegionIdContainer = id
    }).then(() => {
      location.reload();
      return (obj);
    })
  }).then((obj) => {
    var form = document.querySelector('#form0');
    d = new FormData(form);
    for (var key in obj) {
      // console.log(key, obj[key]);
      d.set(key, obj[key]);
    }
  });
}
browser.runtime.onMessage.addListener(listener)

function listener(request) {
  switch (request.action) {
    case "testget":
      testget()
      break;
    default:
  }
}

function FormtoObject(formelement) {
  var frmd = new FormData(formelement);
  var eArr = frmd.entries();
  var resarr = {}
  frmd.forEach(() => {
    var item = eArr.next().value
    resarr[item[0]] = item[1]
  })
  return resarr
}

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
    var ApplicantID = {}
    var form = doc.querySelector('#' + formselector);
    return FormtoObject(form)
  })
}

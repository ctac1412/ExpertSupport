(function(obj) {

  var requestFileSystem = obj.webkitRequestFileSystem || obj.mozRequestFileSystem || obj.requestFileSystem;

  function onerror(message) {
    console.log(message);
    alert(message);
  }

  function createTempFile(callback) {
    var tmpFilename = "tmp.dat";
    requestFileSystem(TEMPORARY, 4 * 1024 * 1024 * 1024, function(filesystem) {
      function create() {
        filesystem.root.getFile(tmpFilename, {
          create: true
        }, function(zipFile) {
          callback(zipFile);
        });
      }

      filesystem.root.getFile(tmpFilename, null, function(entry) {
        entry.remove(create, create);
      }, create);
    });
  }

  var model = (function() {
    var URL = obj.webkitURL || obj.mozURL || obj.URL;

    return {
      getEntries: function(file, onend) {
        var tmp = new zip.BlobReader(file);
        zip.createReader(tmp, function(zipReader) {
          zipReader.getEntries(onend);
        }, function(error) {
          onerror(error)
        });

      },
      getEntryFile: function(entry, creationMethod, onend, onprogress) {
        var writer, zipFileEntry;

        function getData() {
          entry.getData(writer, function(blob) {
            var blobURL = creationMethod == "Blob" ? URL.createObjectURL(blob) : zipFileEntry.toURL();

            onend(blobURL);
          }, onprogress);
        }

        if (creationMethod == "Blob") {
          writer = new zip.BlobWriter();
          getData();
        } else {
          createTempFile(function(fileEntry) {
            zipFileEntry = fileEntry;
            writer = new zip.FileWriter(zipFileEntry);
            getData();
          });
        }
      }
    };
  })();

  (function() {
    var fileInput = document.getElementById("file-input");
    var btnStart = document.querySelector('#start_load');

    // var unzipProgress = document.createElement("progress");
    // var fileList = document.getElementById("file-list");
    // var creationMethodInput = document.getElementById("creation-method-input");


    //NOTE: LISTINER CHANG
    document.querySelector('#LoadTemp').addEventListener("click", (e) => {
      return browser.tabs.query({
        currentWindow: true,
        active: true
      }).then((tabs) => {
        return browser.tabs.sendMessage(
          tabs[0].id,
          Object.assign({}, {
            action: "LoadTemp"
          })
        )
      }).then(allmsg => {
        if (allmsg) {
          AddMessage(allmsg)
        }
      }).catch((err) => {
        console.log(err.message);
        if (err.message == "Argument 1 of FormData.constructor is not an object.") {
          AddMessage([{
            message: "Проверьте авторизацию адванса!",
            class: "danger"
          }])
        }
      })
    })

    document.querySelector('#testget').addEventListener("click", (e) => {
      return browser.tabs.query({
        currentWindow: true,
        active: true
      }).then((tabs) => {
        return browser.tabs.sendMessage(
          tabs[0].id,
          Object.assign({}, {
            action: "testget"
          })
        )
      })
    })

    document.querySelector('#geloisLoad').addEventListener("click", (e) => {
      return browser.tabs.query({
        currentWindow: true,
        active: true
      }).then((tabs) => {
        return browser.tabs.sendMessage(
          tabs[0].id,
          Object.assign({}, {
            action: "geloisLoad"
          })
        )
      })
    })

    document.querySelector('#FocusUp').addEventListener("click", (e) => {
      return browser.tabs.query({
        currentWindow: true,
        active: true
      }).then((tabs) => {
        return browser.tabs.sendMessage(
          tabs[0].id,
          Object.assign({}, {
            action: "FocusUp"
          })
        )
      })
    })

    document.querySelector('#Save').addEventListener("click", (e) => {
      return browser.tabs.query({
        currentWindow: true,
        active: true
      }).then((tabs) => {
        return browser.tabs.sendMessage(
          tabs[0].id,
          Object.assign({}, {
            action: "Save"
          })
        )
      })
    })

    fileInput.addEventListener('change', function() {
      getFileParam()
      document.querySelector('#message-container').innerHTML = ""
    })

    btnStart.addEventListener('click', function() {
      var arrpromise = []
      if (fileInput.files.length == 0) {
        alert("Не выбран ни один файл")
        return
      }
      model.getEntries(fileInput.files[0], function(entries) {
        entries.forEach(function(entry) {

          if (entry.filename == "xl/worksheets/sheet1.xml" || entry.filename == "xl/sharedStrings.xml" || entry.filename == "xl/workbook.xml") {
            arrpromise.push(readfile(entry))
          }
        });
        Promise.all(arrpromise).then(() => {
          starting()
        });
      });

    }, false);

    function readfile(entry) {
      return new Promise(function(resolve, reject) {
        var writer = new zip.BlobWriter();
        entry.getData(writer, function(blob) {

          var reader = new FileReader();
          reader.onload = function(event) {
            switch (entry.filename) {
              case "xl/worksheets/sheet1.xml":
                Sheet1.text = event.target.result
                break;
              case "xl/sharedStrings.xml":
                sharestring.text = event.target.result
                break;
              case "xl/workbook.xml":
                workbook.text = event.target.result
                break;
            }
            resolve()
          }
          reader.readAsText(blob)
        })
      });


    }

  })();

})(this);

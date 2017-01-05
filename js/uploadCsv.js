

///----------------------------------------------------------------------------
///         Code for verifying if  the CSV uploaded is corect or not
///----------------------------------------------------------------------------

document.getElementById("fileUpload").onchange = function () {
    document.getElementById("uploadFile").value = this.value;
};
function Upload() {
    var fileUpload = document.getElementById("fileUpload");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                var table = document.createElement("table");
                var rows = e.target.result.split("\n");
                for (var i = 0; i < rows.length; i++) {
                    var row = table.insertRow(-1);
                    var cells = rows[i].split(",");
                    for (var j = 0; j < cells.length; j++) {
                       var cell = row.insertCell(-1);
                       cell.innerHTML = cells[j];
                    }
                }
                var dvCSV = document.getElementById("dvCSV");
                dvCSV.innerHTML = "";
                dvCSV.appendChild(table);
            }
            reader.readAsText(fileUpload.files[0]);
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid CSV file.");
    }
}


/* this code snippet ends here */




///----------------------------------------------------------------------------
///         Parser for getting the names from the CSV
///----------------------------------------------------------------------------


$(function () {
  
    $("#upload").bind("click", function () {
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
        if (regex.test($("#fileUpload").val().toLowerCase())) {
            if (typeof (FileReader) != "undefined") {

                var arrayOfStudents = [];

                var reader = new FileReader();
                reader.onload = function (e) {
                    var table = $("<table />");
                      table.append("List of Students");
                    var rows = e.target.result.split("\n");
                    for (var i = 0; i < rows.length; i++) {
                      if(i == 0)
                      {

                      }
                      else
                      {
                        var row = $("<tr />");

                        var cells = rows[i].split(",");
                        for (var j = 0; j < 1; j++) {
                            var cell = $("<td />");
                            arrayOfStudents.push(cells[j]);
                            cell.html(cells[j]);
                            row.append(cell);
                        }
                        table.append(row);

                    }
                    $("#dvCSV").html('');
                    $("#dvCSV").append(table);
                    $("#numberOfEntries").text(arrayOfStudents.length);
                    $("#showNameEntries").show();
                    
                    
                  }
                  console.log(arrayOfStudents);
                  localStorage.setItem("arrayOfStudents", JSON.stringify(arrayOfStudents));
                 
                }
                reader.readAsText($("#fileUpload")[0].files[0]);
            } else {
                alert("This browser does not support HTML5.");
            }
        } else {
            alert("Please upload a valid CSV file.");
        }
    });
});

/* this code snippet ends here */




///---------------------------------------------------------------------------------------
///         Identifying the selection whether group by no.of groups or no of members.
///---------------------------------------------------------------------------------------
    

function foo()
{
var names = JSON.parse(localStorage.getItem("arrayOfStudents"));
//var names = window.arrayOfStudents;

d3.select("svg").remove();



console.log("the data in the array is New console by Varun");
console.log(names);
  
  if ($("#chkYes").is(":checked")) {
    var groupCount = $('#txtgroup').val();
    console.log("Here is the Value for Number of groups");
    console.log(groupCount);
    var groupSize = Math.ceil(names.length / groupCount);
    randomGenerator(groupSize, groupCount, names);
  }
  else if ($("#chkNo").is(":checked")) {
    var groupSize = $('#txtmembers').val();
    console.log("Here is the value for number of members");
    console.log(groupSize);
    var groupCount = Math.ceil(names.length / groupSize);
    randomGenerator(groupSize, groupCount, names);
  }
  else
    {
      alert("Select any one Option");
      return true;
    }
  
}  

  
$(function () {
        $("input[name='chooseOption']").click(function () {
            if ($("#chkYes").is(":checked")) {
                $("#noOfGroups").show();
               $("#noOfMembers").hide();
            } 
          else  if ($("#chkNo").is(":checked")) {
            $("#noOfGroups").hide();
                $("#noOfMembers").show();
            } 
          
          else{
                $("#noOfGroups").hide();
             $("#noOfMembers").hide();
            }
          
         
        });
    });


/* this code snippet ends here */



///----------------------------------------------------------------------------
///         Generation of randon group
///----------------------------------------------------------------------------


function randomGenerator(groupSize, groupCount, names) {
 //   var names = ["11","22","33","43","35","36","37","38","93","130","131","132"]
    
//    var groupSize = document.getElementById("groupNumber").value;
//    
    if (groupCount > names.length || groupSize > names.length){
        alert("Please enter Value less than student count");
        return;
    }
    
    console.log(names);
    console.log(groupSize);
    console.log(groupCount);
    var groups = [];
    
    for (var i = 0; i < groupCount; i++) {
        var group = [];
        for (var j = 0; j < groupSize; j++) {
            var random = Math.floor(Math.random() * names.length);
            var name = names[random];
            if (name != undefined) {
                group.push(name);
                names.splice(names.indexOf(name), 1);
            }
        }
        group.sort();
        groups.push(group);
    }
    console.log("groups are");
    console.log(groups);
    var jsonObj = printGroups(groups);
    console.log("JSON OBject is ");
    console.log(jsonObj);
    var jsonStr = JSON.stringify(jsonObj);
    console.log(jsonStr);
    // addTable(groups);

    $("#resultsTab").show();
    renderViz(jsonStr);

}


function printGroups(group) {
  
    var grupArr = []; 
    for (var i = 0; i < group.length; i++) {
        var currentGroup = "";
        var arr = [];
        for (var j = 0; j < group[i].length; j++) {
            currentGroup = group[i].join(",");

            arr.push(group[i][j]);
        }
        grupArr.push(arr);
    //    output.value += currentGroup + "\r";
    }
    var jsonObj = genJson(grupArr);

    return jsonObj;
}

function genJson(grupArr) {
  var jsonObj = {};
  var childRoot = [];
  for(var i in grupArr){
    var child = {};
    var children = [];
    for(var j in grupArr[i]){
      var student = {};
      student.name = grupArr[i][j];
      student.size = 100;
      student.colour = "#FFCC99";
      children.push(student);
    }
    if(children.length > 0){
            child.name = "Group "+i;
    child.children = children;
    child.colour = "#006600";
    childRoot.push(child);
    }

    
   
  }
  jsonObj.children = childRoot;
  jsonObj.colour = "#ecf0f5";
  return jsonObj;
}


/* this code snippet ends here */


///----------------------------------------------------------------------------
///         GENERATE A TABULAR FORMAT GROUPS.
///----------------------------------------------------------------------------

/*function addTable(array)
{
    var myTableDiv = document.getElementById("metric_results")
    var table = document.createElement('TABLE')
    var tableBody = document.createElement('TBODY')

    table.border = '1'
    table.appendChild(tableBody);

    var stock = array;
    
   
    //TABLE COLUMNS
    var tr = document.createElement('TR');
    
    tableBody.appendChild(tr);
    

    //TABLE ROWS
    for (i = 0; i < stock.length; i++) {
        var tr = document.createElement('TR');
        for (j = 0; j < stock[i].length; j++) {
            var td = document.createElement('TD')
            td.appendChild(document.createTextNode(stock[i][j]));

            tr.appendChild(td)
            tr.className = "varun";

        }
        tableBody.appendChild(tr);
    }  
    myTableDiv.appendChild(table)
}*/

/* this code snippet ends here */

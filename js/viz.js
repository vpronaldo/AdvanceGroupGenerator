var margin = 10, diameter = 550; 
var color = d3.scale.linear()
    .domain([-1, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

var pack = d3.layout.pack()
    .padding(2)
    .size([diameter - margin, diameter - margin])
    .value(function(d) { return d.size; });



function renderViz(jsonObj) {
  var svg = d3.select("#circlepack").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
  .append("g")
    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

  

  var root = JSON.parse(jsonObj);
  var focus = root,
      nodes = pack.nodes(root),
      view;

  var circle = svg.selectAll("circle")
      .data(nodes)
    .enter().append("circle")
      .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";})
      .style("fill", function(d) { console.log("here");  return d.colour ? d.colour : color(d.depth)})//null; })
//      .style("fill", function(d) { console.log("here");  return d.children ? color(d.depth) : d.colour})//null; })
      .on("click", function(d) { 
        if(d.children == null){
          if(focus == d.parent){
       //   alert(d.name);
          $("#keywordClicked").text("Selected Student : "+d.name);
          $("#keywordClicked").show();
          d3.event.stopPropagation();
          }
          else{
             $("#keywordClicked").hide();
             console.log("first");

            zoom(d.parent), d3.event.stopPropagation();

          }
        }

        else{
          $("#keywordClicked").hide();
          $("#selectedGroupname").hide();
          $("#selectedGroupMembers").hide();
          $("#showNameOfMembers").hide();
          
          console.log("second");
          if (focus !== d) {
            zoom(d), d3.event.stopPropagation();
            if(d.parent !== undefined){


              var grupMembers = "";
              for(var i in d.children){
                grupMembers += d.children[i].name + " ";
              }
              console.log(grupMembers);
              $("#selectedGroupname").text("Selected Group : "+d.name);
              for(i=0; i<grupMembers.length; i++)
              {
                if(i == grupMembers.length-1)
                {
                  $("#selectedGroupMembers").text("Group Members : "+grupMembers);
                }
                else
                {
              $("#selectedGroupMembers").text("Group Members : "+grupMembers+",");
            }

            }
              $("#selectedGroupname").show();
              $("#selectedGroupMembers").show();
              $("#showNameOfMembers").show();

          }
          else{

            $("#selectedGroupname").hide();
            $("#selectedGroupMembers").hide();
            $("#showNameOfMembers").hide();
            
            
    

          }
          }
        }
      });

      value = 1;
  var text = svg.selectAll("text")
      .data(nodes)
      .enter().append("text")
      .attr("class", "label")
      .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
      .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
      .text(function(d) { return d.name; });


  var node = svg.selectAll("circle,text");

  //d3.select("body")
  d3.select("#circlepack")
     // .style("background", color(-1))
      .on("click", function() { zoom(root); });

  zoomTo([root.x, root.y, root.r * 2 + margin]);

  function zoom(d) {
  
    $("#summaryH").text(d.name);

    

    var focus0 = focus; focus = d;

    var transition = d3.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", function(d) {
          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
          return function(t) { zoomTo(i(t)); };
        });

    transition.selectAll("text")
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; 
           var value = 0;
           if(d.parent === focus){
             value = 1;
           }
          if(d.class === "node--leaf"){
          }
          // else{
          //   value = 1;
          // }

          // return value;
        })
        .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
        //  if(d.hasOwnProperty("children")) this.style.display = "inline"; });
console.log(this);
    console.log(focus);
    console.log(d.parent);
    
    
    //invoke();
  
     if(d.hasOwnProperty("children")){
      console.log(d);
     }
  }

  function zoomTo(v) {
    var k = diameter / v[2]; view = v;
    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    circle.attr("r", function(d) { return d.r * k; });
  }
}



d3.select(self.frameElement).style("height", diameter + "px");



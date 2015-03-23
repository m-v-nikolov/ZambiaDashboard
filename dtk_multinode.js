var months,
    monthFormat = d3.time.format("%Y-%m-%d");

var margin_maps   = { top: 20, right: 10, bottom: 20, left: 50 };
var margin_charts = { top: 50, right: 30, bottom: 20, left: 60 };

// Radius scale for map populations
var radiusPop = d3.scale.sqrt()
    .domain([0, 1e3])
    .range([0, 8]);

// Colormap for prevalence points
var colorScale = d3.scale.quantize()
            .domain([0, 0.7])
            .range(colorbrewer.OrRd[9]);

// Month, year formatting of date axes
var customTimeFormat = d3.time.format.multi([
  ["%b", function (d) { return d.getMonth(); }],
  ["%Y", function () { return true; }]
]);

function load_data() {
    load_chart("New_Diagnostic_Prevalence.tsv", "RDT Positive Rate", yaxis={nticks:5, style:'%'});
    load_map("snapshot.json", "Simulation")
    load_map("surveillance.json", "Surveillance")
    load_histogram()
    //load_map_hh("hhs.json", "Clusters/HHs")
    
    //load_map_hh_hfcas("hhs.json", "HFCAs")
}

function update_RDT_array_idx(idx) {
    d3.selectAll(".bubble circle")
    .attr("fill", function (d) {
        var c = 'darkgray'; // for N/A
        if(idx < this.__data__.RDT.length) {
            var rdt = this.__data__.RDT[idx];
            if (rdt >= 0) { c = colorScale(rdt); }
        }
        return c;
    })
}

function load_histogram()
{
	var margin = {top: 20, right: 20, bottom: 80, left: 40},
	    width = 250 - margin.left - margin.right,
	    height = 200 - margin.top - margin.bottom;
	
	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);
	
	var y = d3.scale.linear()
	    .range([height, 0]);
	
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom")
	    .ticks(10);
	
	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(10, "%");
	
	var svg = d3.select(".resourcecontainer.maps").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.attr("id", "alt");
	
	svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(90)")
    .attr("id", "alt_y")
    .style("text-anchor", "start");
	  
	  /*svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);
	      */
	
	svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
		  .attr("id", "alt_y");
	      /*.text("Frequency");*/	
	
	var svg1 = d3.select(".resourcecontainer.maps").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	.attr("id", "veg");
	
	svg1.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis)
	.selectAll("text")
	.attr("y", 0)
	.attr("x", 9)
	.attr("dy", ".35em")
	.attr("transform", "rotate(90)")
	.attr("id", "veg_x")
	.style("text-anchor", "start");
	  
	  /*svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);
	      */
	
	svg1.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
		  .attr("id", "veg_y");
	      /*.text("Frequency");*/
}

function draw_histogram(cluster_id)
{
	var margin = {top: 20, right: 20, bottom: 80, left: 40},
    width = 250 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;
	
	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);
	
	var y = d3.scale.linear()
	    .range([height, 0]);	
	
	var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(10, "%");
		
	var svg = d3.select(".resourcecontainer.maps").selectAll("#alt")
	//d3.select(".resourcecontainer.maps").selectAll(".bar").remove()
	d3.select(".resourcecontainer.maps").selectAll("#alt").selectAll(".bar").remove()
		
	d3.tsv("hists/altitude_"+cluster_id+".tsv", type, function(error, data) {
		  x.domain(data.map(function(d) { return d.altitude; }));
		  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);
		  svg.selectAll(".bar")
	      .data(data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(d.altitude); })
	      .attr("width", x.rangeBand())
	      .attr("y", function(d) { return y(d.frequency); })
	      .attr("height", function(d) { return height - y(d.frequency); });
	
	   
	   svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis)
	  .selectAll("text")
	    .attr("y", 0)
	    .attr("x", 9)
	    .attr("dy", ".35em")
	    .attr("transform", "rotate(90)")
	    .style("text-anchor", "start");
	});
	   
	var margin = {top: 20, right: 20, bottom: 80, left: 40},
    width = 250 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;
	
	var x1 = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);
	
	var y1 = d3.scale.linear()
	    .range([height, 0]);	
	
	var xAxis1 = d3.svg.axis()
    .scale(x1)
    .orient("bottom");

	var yAxis1 = d3.svg.axis()
	    .scale(y1)
	    .orient("left")
	    .ticks(10, "%");
	   
	   var svg1 = d3.select(".resourcecontainer.maps").selectAll("#veg")
		d3.select(".resourcecontainer.maps").selectAll("#veg").selectAll(".bar_veg").remove()
			
		d3.tsv("hists/vegetation_"+cluster_id+".tsv", type, function(error, data) {
			  x1.domain(data.map(function(d) { return d.vegetation; }));
			  y1.domain([0, d3.max(data, function(d) { return d.frequency; })]);
			  svg1.selectAll(".bar_veg")
		      .data(data)
		    .enter().append("rect")
		      .attr("class", "bar_veg")
		      .attr("x", function(d) { return x1(d.vegetation); })
		      .attr("width", x1.rangeBand())
		      .attr("y", function(d) { return y1(d.frequency); })
		      .attr("height", function(d) { return height - y1(d.frequency); })
			  .attr("background-color","green");
		
		   
		   svg1.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + height + ")")
		    .call(xAxis1)
		  .selectAll("text")
		    .attr("y", 0)
		    .attr("x", 9)
		    .attr("dy", ".35em")
		    .attr("transform", "rotate(90)")
		    .style("text-anchor", "start");
	});
	
	function type(d) {
		  d.frequency = +d.frequency;
		  return d;
		}
}

function load_map_hh(json_input, map_title)
{
    var margin = margin_maps;
    var width  = 480 - margin.left - margin.right,
        height = 300 - margin.top  - margin.bottom;

    // World Map Projection
    // Zoomed on Zambia surveillance area
    xy = d3.geo.mercator()
        .center([27.85, -16.7])
        .scale(22000)
        .translate([width / 2, height / 2]);
    path = d3.geo.path().projection(xy);

    var svg_maps = d3.select(".resourcecontainer.maps").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // TODO: lat/lon axes (clip to margins)
    // TODO: topology raster 
    // TODO: switch to underlying map like Google/Bing/OpenLayers to avoid site-specific topojson?
    // TODO: map scale legend

    d3.json("topolakes.json", function (error, topo) {
        svg_maps.selectAll(".lake")
            .data(topojson.feature(topo, topo.objects.lakes).features)
          .enter().append("path")
            .attr("class", "lake")
            .attr("d", path);
    });

    d3.json(json_input, function (collection) {

        var focus = svg_maps.append("g")
            .attr("transform", "translate(-100,-100)")
            .attr("class", "focus");

        focus.append("text")
            .attr("y", -10);

        svg_maps.append("g")
            .attr("class", "bubble")
          .selectAll("circle")
            .data(collection)
          .enter().append("circle")
            .attr("transform", function (d) {
                return "translate(" + xy([d.Longitude, d.Latitude]) + ")";
            })
            .attr("opacity", 0.7)
            .attr("fill", function (d) {
                var c = 'darkgray'
                return c;
            })
            .attr("r", function (d) { return 1; });   // TODO: bubble legend?
    });

    svg_maps.append("g")
      .append("text")
        .attr("class", "chart_title")
        .attr("transform", "translate(" + (width-margin.left) + "," + height + ")")
        .style("font-weight", "bold")
        .text(map_title);
    
    d3.json("clusters_hulls.json", function (error, clusters) {
        svg_maps.selectAll(".cluster")
            .data(clusters.features)
          .enter().append("path")
            .attr("class", "cluster")
            .attr("d", path);
    });
    
    d3.json("hfcas.json", function (error, hfcas) {
        svg_maps.selectAll(".hfcas")
            .data(hfcas.features)
          .enter().append("path")
            .attr("class", "hfcas")
            .attr("d", path)
        	.attr("fill-opacity", 0)
            //.style("fill", function (d,i) { color(i) });
        	.style("fill", "white")
        	.attr("stroke", "#222")
        	.attr("z-index",-1);
    });
    
    /*d3.json("hfcas.json", function (error, hfcas) {
        svg_maps.selectAll(".hfcas")
            .data(hfcas.features)
          .enter().append("path")
            .attr("class", "hfcas");
            //.attr("d", path);
    }); */

}

function load_map_hh_hfcas(json_input, map_title)
{
    var margin = margin_maps;
    var width  = 480 - margin.left - margin.right,
        height = 300 - margin.top  - margin.bottom;

    // World Map Projection
    // Zoomed on Zambia surveillance area
    xy = d3.geo.mercator()
        .center([27.85, -16.7])
        .scale(22000)
        .translate([width / 2, height / 2]);
    path = d3.geo.path().projection(xy);

    var svg_maps = d3.select(".resourcecontainer.maps").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // TODO: lat/lon axes (clip to margins)
    // TODO: topology raster 
    // TODO: switch to underlying map like Google/Bing/OpenLayers to avoid site-specific topojson?
    // TODO: map scale legend

    d3.json("topolakes.json", function (error, topo) {
        svg_maps.selectAll(".lake")
            .data(topojson.feature(topo, topo.objects.lakes).features)
          .enter().append("path")
            .attr("class", "lake")
            .attr("d", path);
    });

    /*d3.json(json_input, function (collection) {

        var focus = svg_maps.append("g")
            .attr("transform", "translate(-100,-100)")
            .attr("class", "focus");

        focus.append("text")
            .attr("y", -10);

        svg_maps.append("g")
            .attr("class", "bubble")
          .selectAll("circle")
            .data(collection)
          .enter().append("circle")
            .attr("transform", function (d) {
                return "translate(" + xy([d.Longitude, d.Latitude]) + ")";
            })
            .attr("opacity", 0.7)
            .attr("fill", function (d) {
                var c = 'darkgray'
                return c;
            })
            .attr("r", function (d) { return 1; });   // TODO: bubble legend?
    }); */

    svg_maps.append("g")
      .append("text")
        .attr("class", "chart_title")
        .attr("transform", "translate(" + (width-margin.left) + "," + height + ")")
        .style("font-weight", "bold")
        .text(map_title);
    
    var color = d3.scale.category10()
    
    d3.json("hfcas.json", function (error, hfcas) {
        svg_maps.selectAll(".hfcas")
            .data(hfcas.features)
          .enter().append("path")
            .attr("class", "hfcas")
            .attr("d", path)
        	.attr("fill-opacity", 0)
            //.style("fill", function (d,i) { color(i) });
        	.style("fill", "white")
        	.attr("stroke", "#222")
    });
    
    /*d3.json("hfcas.json", function (error, hfcas) {
        svg_maps.selectAll(".hfcas")
            .data(hfcas.features)
          .enter().append("path")
            .attr("class", "hfcas");
            //.attr("d", path);
    }); */

}

function load_map(json_input, map_title) {

    var margin = margin_maps;
    var width  = 480 - margin.left - margin.right,
        height = 300 - margin.top  - margin.bottom;

    // World Map Projection
    // Zoomed on Zambia surveillance area
    xy = d3.geo.mercator()
        .center([27.85, -16.7])
        .scale(22000)
        .translate([width / 2, height / 2]);
    path = d3.geo.path().projection(xy);

    var svg_maps = d3.select(".resourcecontainer.maps").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // TODO: lat/lon axes (clip to margins)
    // TODO: topology raster 
    // TODO: switch to underlying map like Google/Bing/OpenLayers to avoid site-specific topojson?
    // TODO: map scale legend

    d3.json("topolakes.json", function (error, topo) {
        svg_maps.selectAll(".lake")
            .data(topojson.feature(topo, topo.objects.lakes).features)
          .enter().append("path")
            .attr("class", "lake")
            .attr("d", path);
    });

    d3.json("hfcas.json", function (error, hfcas) {
        svg_maps.selectAll(".hfcas")
            .data(hfcas.features)
          .enter().append("path")
            .attr("class", "hfcas")
            .attr("d", path)
        	.attr("fill-opacity", 0)
            //.style("fill", function (d,i) { color(i) });
        	.style("fill", "white")
        	.attr("stroke", "#222")
        	.attr("z-index", -1)
    });
    
    d3.json(json_input, function (collection) {

        // Let's give the little bubbles a chance to be moused over when they overlap big ones
        collection.sort(function (a, b) { return b.Population - a.Population; });

        var focus = svg_maps.append("g")
            .attr("transform", "translate(-100,-100)")
            .attr("class", "focus");

        focus.append("text")
            .attr("y", -10);

        svg_maps.append("g")
            .attr("class", "bubble")
          .selectAll("circle")
            .data(collection)
          .enter().append("circle")
            .attr("class", function(d) { return 'f_' + d.FacilityName; })
            .attr("transform", function (d) {
                return "translate(" + xy([d.Longitude, d.Latitude]) + ")";
            })
            .attr("opacity", 0.7)
            .attr("fill", function (d) {
                var c = 'darkgray'
                var rdt = d.RDT[0]
                if (rdt >= 0) { c = colorScale(rdt); } // TODO: color legend?
                return c;
            })
            .attr("r", function (d) { return radiusPop(d.Population); })   // TODO: bubble legend?

            // TODO: provide persistent on(mousedown) focus/unfocus behavior?
            .on("mouseover", function () {
                var facilityID = this.__data__.FacilityName;
                draw_histogram(facilityID);
                d3.selectAll("circle.f_" + facilityID)
                    .classed("bubble--hover", true)
                    .each(display_bubble_text);
                d3.selectAll("path.f_" + facilityID)
                    .classed("city--hover", true)
                    .each(bring_to_front);
                
            })
            .on("mouseout", function () {
                var facilityID = this.__data__.FacilityName;
                d3.selectAll("circle.f_" + facilityID)
                    .classed("bubble--hover", false)
                    .each(hide_bubble_text);
                d3.selectAll("path.f_" + facilityID)
                    .classed("city--hover", false);
            });
    });
        


    svg_maps.append("g")
      .append("text")
        .attr("class", "chart_title")
        .attr("transform", "translate(" + (width-margin.left) + "," + height + ")")
        .style("font-weight", "bold")
        .text(map_title);

}

// TODO: would this be better to do top-down, i.e. selectAll(svg.resourcecontainer.maps) and work down for each?
function display_bubble_text(d) {
    var facilityID = this.__data__.FacilityName;
    var rdt = this.__data__.RDT[0];
    if (rdt < 0) { rdt = 'N/A'; }
    else { rdt = d3.format('%')(rdt); }
    var svg_maps = this.parentNode.parentNode;
    var focus = d3.select(svg_maps).select('.focus');
    focus.select("text").text(facilityID + " : " + rdt); // TODO: more verbose info with <tspan>?
    focus.attr("transform", "translate(" + margin_maps.left + "," + margin_maps.top + ")");
}

function hide_bubble_text(d) {
    var svg_maps = this.parentNode.parentNode;
    var focus = d3.select(svg_maps).select('.focus');
    focus.select("text").text(null);
    focus.attr("transform", "translate(-100,-100)");
}

function bring_to_front(d) {
    this.parentNode.appendChild(this);
}



function load_chart(tsv_input, chart_title, yaxis, yfunc) {
    var margin = margin_charts;
    var width  = 960 - margin.left - margin.right,
        height = 330 - margin.top - margin.bottom;

    var svg_charts = d3.select(".resourcecontainer.charts").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var voronoi = d3.geom.voronoi()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.value); })
        .clipExtent([[-margin.left, -margin.top],
                     [width + margin.right, height + margin.bottom]]);

    var line = d3.svg.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.value); });

    d3.tsv(tsv_input, type, function (error, cities) {
        x.domain(d3.extent(months));
        y.domain([0, d3.max(cities, function (c) {
            var m = d3.max(c.values, function (d) {
                return d.value;
            });
            //console.log(m);
            return m;
        })]).nice(yaxis.nticks);

        svg_charts.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.svg.axis()
              .scale(x)
              .orient("bottom")
              .ticks(d3.time.months, 6)
              .tickFormat(customTimeFormat)
              );

        svg_charts.append("g")
            .attr("class", "axis axis--y")
            .call(d3.svg.axis()
              .scale(y)
              .orient("left")
              .ticks(yaxis.nticks, yaxis.style))
          .append("text")
            .attr("class", "chart_title")
            .attr("x", 4)
            .attr("dy", ".32em")
            .style("font-weight", "bold")
            .text(chart_title);

        svg_charts.append("g")
            .attr("class", "cities")
          .selectAll("path")
            .data(cities)
          .enter().append("path")
            .attr("d", function (d) { d.line = this; return line(d.values); })
            .attr("class", function (d) { return 'f_' + d.name; });

        var focus = svg_charts.append("g")
            .attr("transform", "translate(-100,-100)")
            .attr("class", "focus");

        focus.append("circle")
            .attr("r", 3.5);

        focus.append("text")
            .attr("y", -10);

        var voronoiGroup = svg_charts.append("g")
            .attr("class", "voronoi");

        voronoiGroup.selectAll("path")
            .data(voronoi(d3.nest()
                .key(function (d) { return x(d.date) + "," + y(d.value); })
                .rollup(function (v) { return v[0]; })
                .entries(d3.merge(cities.map(function (d) { return d.values; })))
                .map(function (d) { return d.values; })))
          .enter().append("path")
            .attr("d", function (d) { return "M" + d.join("L") + "Z"; })
            .datum(function (d) { return d.point; })
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);

        d3.select("#show-voronoi")
            .property("disabled", false)
            .on("change", function () { voronoiGroup.classed("voronoi--show", this.checked); });

        function mouseover(d) {
            var facilityID = d.city.name;
            d3.selectAll("circle.f_" + facilityID)
                .classed("bubble--hover", true)
                .each(display_bubble_text);
            d3.selectAll("path.f_" + facilityID)
                .classed("city--hover", true)
                .each(bring_to_front);
            focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
            focus.select("text").text(facilityID);
        }

        function mouseout(d) {
            var facilityID = d.city.name;
            d3.selectAll("circle.f_" + facilityID)
                .classed("bubble--hover", false)
                .each(hide_bubble_text);
            d3.selectAll("path.f_" + facilityID)
                .classed("city--hover", false)
            focus.attr("transform", "translate(-100,-100)");
        }
    });
}

function type(d, i) {
    if (!i) months = Object.keys(d).map(monthFormat.parse).filter(Number);
    var city = {
        name: d.name.replace(/ (msa|necta div|met necta|met div)$/i, ""),
        values: null
    };
    city.values = months.map(function (m) {
        return {
            city: city,
            date: m,
            value: d[monthFormat(m)]
        };
    });
    return city;
}
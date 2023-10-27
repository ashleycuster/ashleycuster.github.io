import {STATE_COORDINATES} from "./constants.js";

const markerHTML = `<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" viewBox="0 -256 1792 1792" id="svg3025" version="1.1" inkscape:version="0.48.3.1 r9886" width="100%" height="100%" sodipodi:docname="map_marker_font_awesome.svg">
<metadata id="metadata3035">
  <rdf:RDF>
    <cc:Work rdf:about="">
      <dc:format>image/svg+xml</dc:format>
      <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/>
    </cc:Work>
  </rdf:RDF>
</metadata>
<defs id="defs3033"/>
<sodipodi:namedview pagecolor="#ffffff" bordercolor="#666666" borderopacity="1" objecttolerance="10" gridtolerance="10" guidetolerance="10" inkscape:pageopacity="0" inkscape:pageshadow="2" inkscape:window-width="640" inkscape:window-height="480" id="namedview3031" showgrid="false" inkscape:zoom="0.13169643" inkscape:cx="896" inkscape:cy="896" inkscape:window-x="0" inkscape:window-y="25" inkscape:window-maximized="0" inkscape:current-layer="svg3025"/>
<g transform="matrix(1,0,0,-1,364.47458,1270.2373)" id="g3027">
  <path d="m 768,896 q 0,106 -75,181 -75,75 -181,75 -106,0 -181,-75 -75,-75 -75,-181 0,-106 75,-181 75,-75 181,-75 106,0 181,75 75,75 75,181 z m 256,0 q 0,-109 -33,-179 L 627,-57 q -16,-33 -47.5,-52 -31.5,-19 -67.5,-19 -36,0 -67.5,19 Q 413,-90 398,-57 L 33,717 Q 0,787 0,896 q 0,212 150,362 150,150 362,150 212,0 362,-150 150,-150 150,-362 z" id="path3029" inkscape:connector-curvature="0" style="fill:currentColor"/>
</g>
</svg>`;

const markerPath = `<path d="m 768,896 q 0,106 -75,181 -75,75 -181,75 -106,0 -181,-75 -75,-75 -75,-181 0,-106 75,-181 75,-75 181,-75 106,0 181,75 75,75 75,181 z m 256,0 q 0,-109 -33,-179 L 627,-57 q -16,-33 -47.5,-52 -31.5,-19 -67.5,-19 -36,0 -67.5,19 Q 413,-90 398,-57 L 33,717 Q 0,787 0,896 q 0,212 150,362 150,150 362,150 212,0 362,-150 150,-150 150,-362 z" id="path3029" inkscape:connector-curvature="0" style="fill:currentColor"/>`;

const renderMap = async () => {
    // let world = await fetch("land-110m.json");
    let countries = await fetch("https://unpkg.com/world-atlas@1.1.4/world/110m.json");
    countries = await countries.json();

    // let us = await fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json");
    // us = await us.json();
    // const statemap = new Map(topojson.feature(us, us.objects.states).features.map(d => [d.id, d]));
    // console.log(statemap);
    // Create the cartographic background layers.
    // svg2.append("path")
    //     .datum(topojson.feature(world, world.objects.land))
    //     .attr("fill", "#ddd")
    //     .attr("d", path);


    const { select, geoPath, geoNaturalEarth1 } = d3;
    const svg = select('svg');
    const projection = geoNaturalEarth1()
        .center([-105,39.5])
        .scale(750);
    const pathGenerator = geoPath().projection(projection);
    svg.append('path')
        .attr('class', 'sphere')
        .attr('d', pathGenerator({type: 'Sphere'}));
    
    const countriesData = topojson.feature(countries, countries.objects.countries);
    svg.selectAll('path').data(countriesData.features)
        .enter().append('path')
        .attr('class', 'country')
        .attr('d', pathGenerator);

    // // Join the geographic shapes and the population data.
    // const data = [
    //     {
    //         population: 100,
    //         state: statemap.get(13),
    //     },
    //     {
    //         population: 2400,
    //         state: statemap.get(20),
    //     },
    // ];
    // console.log('data');
    // console.log(data);

    const donationData = {
        "type": "FeatureCollection",
        "features": [
          {
              "type": "Feature",
              "geometry": {
                  "type": "Point",
                  "coordinates": [-111.6782379150,39.32373809814]
              }
          },
          {
              "type": "Feature",
              "geometry": {
                  "type": "Point",
                  "coordinates": [-74.00714111328,40.71455001831]
              }
          }]};

    const charityData = [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [-77.0369,38.9072]
            }
        }
    ];

    // const donationData2 = [
    //     {
    //         lat: 39.32373809814,
    //         lon: -111.6782379150,
    //         state: "California",
    //         population: 5
    //     },
    //     {
    //         lat: 40.71455001831,
    //         lon: -74.00714111328,
    //         state: "New York",
    //         population: 2
    //     },
    // ];

    // // Construct the radius scale.
    // const radius = d3.scaleSqrt([0, d3.max(data, d => d.population)], [0, 40]);

    // const centroid = (feature) => {
    //     const path = d3.geoPath();
    //     return feature => path.centroid(feature);
    // }
    // // Add a circle for each county, with a title (tooltip).
    // // const format = d3.format(",.0f");
    // svg.append("g")
    //     .attr("fill", "brown")
    //     .attr("fill-opacity", 0.5)
    //     .attr("stroke", "#fff")
    //     .attr("stroke-width", 0.5)
    //     .selectAll()
    //     .data(data)
    //     .join("circle")
    //         .attr("transform", d => `translate(${centroid(d.state)})`)
    //         .attr("r", d => radius(d.population))
    //     .append("title")
    //         .text(d => "State Name, State Population");

    // svg.selectAll('.donations')
    //     .data(donationData.features)
    //     .enter()
    //     .append('path')
    //     .attr('d', pathGenerator)
    //     .attr('class', 'donations');

    // svg.selectAll('.charity')
    //     .data(charityData)
    //     .enter()
    //     .append('path')
    //     .attr('d', pathGenerator)
    //     .attr('class', 'charity');

    svg.selectAll('.charity')
        .data(charityData)
        .enter()
        .append('image')
        .attr('xlink:href', "marker.svg")
        .attr('d', pathGenerator)
        // .style("left", projection([-77.0369,38.9072])[0])
        // .style("top", projection([-77.0369,38.9072])[1])
        .attr("x", projection([-77.0369,38.9072])[0] - 12)
        .attr("y", projection([-77.0369,38.9072])[1] - 12)
        .attr("width", 24)
        .attr("height", 24)
        .attr('class', 'charity');

    // svg.append("g")
    //     .attr("html", markerPath)
    //     .attr("width", 100)
    //     .attr("height", 100)
    //     .attr('d', pathGenerator)
    //     .attr("cx", d=>projection([-77.0369,38.9072])[0])
    //     .attr("cy", d=>projection([-77.0369,38.9072])[1])
    //     .attr('class', 'charity');

    const stateCensusResponse = await fetch("https://api.census.gov/data/2019/pep/charagegroups?get=NAME,POP&for=state:*");
    const stateCensusData = await stateCensusResponse.json();
    console.log(stateCensusData);

    const getStateLatitude = stateName => {
        if (!STATE_COORDINATES.hasOwnProperty(stateName)) {
            return null;
        }
        return STATE_COORDINATES[stateName].lat;
    }

    const getStateLongitude = stateName => {
        if (!STATE_COORDINATES.hasOwnProperty(stateName)) {
            return null;
        }
        return STATE_COORDINATES[stateName].lon;
    }

    let minimumPopulation = 9000000000;
    let maximumPopulation = 0;
    const donationData2 = [];

    stateCensusData.forEach((state, index) => {
        // first item defines structure of data
        // states start at index 1
        if (index === 0) {
            return;
        }
        let [name, population, ] = state;
        population = parseInt(population);
        if (population > maximumPopulation) {
            maximumPopulation = population;
        }
        if (population < minimumPopulation) {
            minimumPopulation = population;
        }
        donationData2.push({
            stateName: name,
            population,
            lat: getStateLatitude(name),
            lon: getStateLongitude(name),
        });
        return;
    });

    const radius = d3.scaleSqrt()
        .domain([minimumPopulation, maximumPopulation])
        .range([2,26]);
    
    console.log(radius(donationData2[0].population));

    svg.selectAll("circle")
        .data(donationData2)
        .enter()
        .append("circle")
        .attr("cx", d=>projection([d.lon,d.lat])[0])
        .attr("cy", d=>projection([d.lon,d.lat])[1])
        .attr("r", d=> radius(d.population))
        .attr("class", "donation-circles");
  }

  renderMap();
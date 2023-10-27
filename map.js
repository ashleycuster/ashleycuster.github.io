import {STATE_COORDINATES} from "./constants.js";

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

    svg.selectAll('.charity')
        .data(charityData)
        .enter()
        .append('path')
        .attr('d', pathGenerator)
        .attr('class', 'charity');

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

    const radius = d3.scaleSqrt([minimumPopulation, maximumPopulation], [2, 8]);

    svg.selectAll("circle")
        .data(donationData2)
        .enter()
        .append("circle")
        .attr("cx", d=>projection([d.lon,d.lat])[0])
        .attr("cy", d=>projection([d.lon,d.lat])[1])
        .attr("r", d=> 3);
  }

  renderMap();
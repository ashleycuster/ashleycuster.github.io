const renderMap = async () => {
    // let world = await fetch("land-110m.json");
    let countries = await fetch("https://unpkg.com/world-atlas@1.1.4/world/110m.json");
    countries = await countries.json();
  
    // Create the cartographic background layers.
    // svg2.append("path")
    //     .datum(topojson.feature(world, world.objects.land))
    //     .attr("fill", "#ddd")
    //     .attr("d", path);


    const { select, geoPath, geoNaturalEarth1 } = d3;
    const svg = select('svg');
    const projection = geoNaturalEarth1();
    const pathGenerator = geoPath().projection(projection);
    svg.append('path')
        .attr('class', 'sphere')
        .attr('d', pathGenerator({type: 'Sphere'}));
    
    const countriesData = topojson.feature(countries, countries.objects.countries);
    svg.selectAll('path').data(countriesData.features)
        .enter().append('path')
        .attr('class', 'country')
        .attr('d', pathGenerator);
  }

  renderMap();
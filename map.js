import {
    addDonateButtonClickEvent,
    getStateData,
    hideLoadingElement,
    onDonationDotMouseover,
    onDonationDotMouseout
} from "./helpers.js";

const CHARITY_LAT_LON = [-121.4944,38.5816];
const CHARITY_MARKER_HEIGHT = 48;
const CHARITY_MARKER_WIDTH = 48;
const DONATION_CIRCLE_RADIUS_MIN = 2;
const DONATION_CIRCLE_RADIUS_MAX = 26;
const MAP_CENTER_LAT_LON = [-105,39.5];
const MAP_SCALE = 750;

const renderMap = async (svg, pathGenerator) => {
    let countries = await fetch("https://unpkg.com/world-atlas@1.1.4/world/110m.json");
    countries = await countries.json();
    const countriesData = topojson.feature(countries, countries.objects.countries);

    svg.append('path')
        .attr('class', 'sphere')
        .attr('d', pathGenerator({type: 'Sphere'}));
    
    svg.selectAll('path').data(countriesData.features)
        .enter().append('path')
        .attr('class', 'country')
        .attr('d', pathGenerator);
}

const renderCharityMarker = (svg, pathGenerator, projection) => {
    const charityMarkerXOffset = CHARITY_MARKER_WIDTH / 2;
    const charityMarkerYOffset = CHARITY_MARKER_HEIGHT / 2;

    svg.append('image')
        .attr('xlink:href', "marker.svg")
        .attr('d', pathGenerator)
        .attr("x", projection(CHARITY_LAT_LON)[0] - charityMarkerXOffset)
        .attr("y", projection(CHARITY_LAT_LON)[1] - charityMarkerYOffset)
        .attr("width", CHARITY_MARKER_WIDTH)
        .attr("height", CHARITY_MARKER_HEIGHT)
        .attr('class', 'charity');
}

const renderDonationDots = async (svg, projection) => {
    const stateCensusResponse = await fetch("https://api.census.gov/data/2019/pep/charagegroups?get=NAME,POP&for=state:*");
    const stateCensusData = await stateCensusResponse.json();
    const {minimumPopulation, maximumPopulation, donationData} = getStateData(stateCensusData);

    const radius = d3.scaleSqrt()
        .domain([minimumPopulation, maximumPopulation])
        .range([DONATION_CIRCLE_RADIUS_MIN,DONATION_CIRCLE_RADIUS_MAX]);
    
    svg.selectAll("circle")
        .data(donationData)
        .enter()
        .append("circle")
        .attr("cx", d => projection([d.lon,d.lat])[0])
        .attr("cy", d => projection([d.lon,d.lat])[1])
        .attr("r", d => radius(d.population))
        .attr("class", "donation-circles")
        .attr("id", d => `donation-circle-${d.stateName}`)
        .on("mouseover", onDonationDotMouseover)
        .on("mouseout", onDonationDotMouseout);
    // TODO: add touch event handlers to show tooltips on mobile
}

const renderMapWithData = async () => {
    const svg = d3.select('svg.map');
    const projection = d3.geoNaturalEarth1()
        .center(MAP_CENTER_LAT_LON)
        .scale(MAP_SCALE);
    const pathGenerator = d3.geoPath().projection(projection);

    await renderMap(svg, pathGenerator);
    renderCharityMarker(svg, pathGenerator, projection);
    await renderDonationDots(svg, projection);
    addDonateButtonClickEvent();
    hideLoadingElement();    
  }

  renderMapWithData();
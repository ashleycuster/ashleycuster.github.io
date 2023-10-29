import {STATE_COORDINATES} from "./constants.js";

// TODO: 
// CLEAN UP CODE
// tweak map centering if there is time
// UPDATE MAP TOOLTIPS TO SHOW ON TAP AS WELL AS HOVER (FOR MOBILE)

const numberFormatter = new Intl.NumberFormat('en-US'); 

const addDonateButtonClickEvent = () => {
    document.getElementById("donate-button")
        .addEventListener("click", () => {
            const donationCircle = document.getElementById("donation-circle-Washington");
            donationCircle.classList.add("pulse");
            setTimeout(() => {
                donationCircle.classList.remove("pulse");
            }, 3000);
        });
}

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

const getStateData = (stateCensusData) => {
    let minimumPopulation = 9000000000;
    let maximumPopulation = 0;
    const donationData = [];

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
        donationData.push({
            stateName: name,
            population,
            lat: getStateLatitude(name),
            lon: getStateLongitude(name),
        });
        return;
    });

    return {minimumPopulation, maximumPopulation, donationData};
}

function onDonationDotMouseover(d) {
    const tooltip = document.getElementById("tooltip-donation-dot");
    const tooltipStateName = document.getElementById("tooltip-state-name");
    const tooltipDonationValue = document.getElementById("tooltip-donation-amount-value");
    const { left, top } = this.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const leftOffset = left > windowWidth/2 ? -160 : 12;

    tooltipStateName.textContent = d.stateName;
    tooltipDonationValue.textContent = numberFormatter.format(d.population);
    tooltip.style.left = left + leftOffset;
    tooltip.style.top = top + 24;
    tooltip.classList.add("show");
}

const onDonationDotMouseout = (d) => {
    const tooltip = document.getElementById("tooltip-donation-dot");
            
    tooltip.classList.remove("show");
}

const renderMap = async () => {
    addDonateButtonClickEvent();
    // let world = await fetch("land-110m.json");
    let countries = await fetch("https://unpkg.com/world-atlas@1.1.4/world/110m.json");
    countries = await countries.json();

    const { select, geoPath, geoNaturalEarth1 } = d3;
    const svg = select('svg.map');
    const projection = geoNaturalEarth1()
        .center([-105,39.5])
        .scale(750);
    const pathGenerator = geoPath().projection(projection);
    const countriesData = topojson.feature(countries, countries.objects.countries);

    svg.append('path')
        .attr('class', 'sphere')
        .attr('d', pathGenerator({type: 'Sphere'}));
    
    svg.selectAll('path').data(countriesData.features)
        .enter().append('path')
        .attr('class', 'country')
        .attr('d', pathGenerator);

    svg.append('image')
        .attr('xlink:href', "marker.svg")
        .attr('d', pathGenerator)
        .attr("x", projection([-121.4944,38.5816])[0] - 24)
        .attr("y", projection([-121.4944,38.5816])[1] - 24)
        .attr("width", 48)
        .attr("height", 48)
        .attr('class', 'charity');

    const stateCensusResponse = await fetch("https://api.census.gov/data/2019/pep/charagegroups?get=NAME,POP&for=state:*");
    const stateCensusData = await stateCensusResponse.json();
    const {minimumPopulation, maximumPopulation, donationData} = getStateData(stateCensusData);

    const radius = d3.scaleSqrt()
        .domain([minimumPopulation, maximumPopulation])
        .range([2,26]);
    
    svg.selectAll("circle")
        .data(donationData)
        .enter()
        .append("circle")
        .attr("cx", d=>projection([d.lon,d.lat])[0])
        .attr("cy", d=>projection([d.lon,d.lat])[1])
        .attr("r", d=> radius(d.population))
        .attr("class", "donation-circles")
        .attr("id", d => `donation-circle-${d.stateName}`)
        .on("mouseover", onDonationDotMouseover)
        .on("mouseout", onDonationDotMouseout);

    document.getElementById("loading-donations")
        .classList.add("hide");
  }

  renderMap();
import {STATE_COORDINATES} from "./constants.js";

const numberFormatter = new Intl.NumberFormat('en-US'); 

export const addDonateButtonClickEvent = () => {
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

export const getStateData = (stateCensusData) => {
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

export function onDonationDotMouseover(d) {
    const tooltipOffsetLeft = -160;
    const tooltipOffsetRight = 12;
    const tooltipOffsetTop = 24;
    const tooltip = document.getElementById("tooltip-donation-dot");
    const tooltipStateName = document.getElementById("tooltip-state-name");
    const tooltipDonationValue = document.getElementById("tooltip-donation-amount-value");
    const { left, top } = this.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const leftOffset = left > windowWidth/2 ? tooltipOffsetLeft : tooltipOffsetRight; 
    // display tooltip on right of left screen dots, left of right screen dots
    // to ensure there is space 

    tooltipStateName.textContent = d.stateName;
    tooltipDonationValue.textContent = numberFormatter.format(d.population);
    tooltip.style.left = left + leftOffset;
    tooltip.style.top = top + tooltipOffsetTop;
    tooltip.classList.add("show");
}

export const onDonationDotMouseout = (d) => {
    const tooltip = document.getElementById("tooltip-donation-dot");
            
    tooltip.classList.remove("show");
}

export const hideLoadingElement = () => {
    document.getElementById("loading-donations")
        .classList.add("hide");
}
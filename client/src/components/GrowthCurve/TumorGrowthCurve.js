/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable func-names */
/* eslint-disable no-extend-native */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import DownloadButton from '../DownloadButton/DownloadButton';
import colors from '../../styles/colors';

// this will initialize a tooltip.
const initializeToolTop = () => d3.select('.growth-curve')
    .append('div')
    .style('position', 'absolute')
    .style('visibility', 'hidden')
    .style('border', 'solid')
    .style('border-width', '1px')
    .style('border-radius', '5px')
    .style('padding', '5px')
    .style('max-width', '250px')
    .style('max-height', '180px')
    .attr('top', 10)
    .attr('left', 20);

// this function will append the data to the tooltip.
const createToolTip = (d, type, tooltip) => {
    // tooltip on mousever setting the div to visible.
    tooltip
        .style('visibility', 'visible');

    // tooltip grabbing event.pageX and event.pageY
    // and set color according to the ordinal scale.
    const tooltipDiv = tooltip
        .style('left', `${d3.event.pageX + 10}px`)
        .style('top', `${d3.event.pageY + 10}px`)
        .style('color', '#000000')
        .style('background-color', '#ffffff');

    // tooltip data.
    let tooltipData = [];
    if (type === 'line') {
        tooltipData = [
            `Model: ${d.model}`, `Drug: ${d.drug}`, `Type: ${d.exp_type}`, `Batch: ${d.batch}`,
        ];
    } else if (type === 'dot') {
        tooltipData = [
            `Time: ${d.time} days`, `Volume: ${d.volume} mm³`,
        ];
    }
    // append the data.
    tooltipDiv.selectAll('textDiv')
        .data(tooltipData)
        .enter()
        .append('div')
        .attr('id', 'tooltiptext')
        .html((d) => {
            const data = d.split(':');
            return `<b>${data[0]}</b>: ${data[1]}`;
        })
        .attr('x', `${d3.event.pageX + 10}px`)
        .attr('y', (d, i) => (`${d3.event.pageY + 10 + i * 10}px`));
};

// calculating the min max volume and time.
const calculateMinMax = (data) => {
    // calculating max time, min/max volumes of all data
    const maxTimeArray = [];
    const minTimeArray = [];
    const minVolArray = [];
    const maxVolArray = [];
    const maxVolNormArray = [];
    const minVolNormArray = [];

    // looping through data to get max and min array.
    for (let i = 0; i < data.length; i++) {
        maxTimeArray.push(d3.max(data[i].pdx_points[0].times));
        minTimeArray.push(d3.min(data[i].pdx_points[0].times));
        minVolArray.push(d3.min(data[i].pdx_points[0].volumes));
        maxVolArray.push(d3.max(data[i].pdx_points[0].volumes));
        maxVolNormArray.push(d3.max(data[i].pdx_points[0].volume_normals));
        minVolNormArray.push(d3.min(data[i].pdx_points[0].volume_normals));
    }

    // max and min value.
    const minTime = Math.max.apply(null, minTimeArray);
    const maxTime = Math.max.apply(null, maxTimeArray);
    const minVolume = Math.min.apply(null, minVolArray);
    const maxVolume = Math.max.apply(null, maxVolArray);
    const maxVolNorm = Math.max.apply(null, maxVolNormArray);
    const minVolNorm = Math.min.apply(null, minVolNormArray);

    return {
        minTime, maxTime, minVolume, maxVolume, maxVolNorm, minVolNorm,
    };
};

// this function will return all the unqiue time points for control and treatment.
const getUnionOfTimepoints = (data) => {
    let control = [];
    let treatment = [];

    for (let i = 0; i < data.length; i++) {
        if (data[i].exp_type.match(/control/i)) {
            const time = data[i].pdx_points[0].times;
            control = [...control, ...time];
        } else if (data[i].exp_type.match(/treatment/i)) {
            const time = data[i].pdx_points[0].times;
            treatment = [...treatment, ...time];
        }
    }

    // unique sorted list of time points.
    const uniqueControl = [...new Set(control)].sort((a, b) => a - b);
    const uniqueTreatment = [...new Set(treatment)].sort((a, b) => a - b);

    // return the list.
    return [uniqueControl, uniqueTreatment];
};

// to calculate new mean volume object.
const volumeObject = (i, oldVolume, oldTime, volume, timeUnionData) => {
    const newVolume = volume;
    let z = i;
    timeUnionData.forEach((time) => {
        if ((time === oldTime[z]) && !newVolume[time]) {
            newVolume[time] = {};
            newVolume[time].totalVolume = oldVolume[z];
            newVolume[time].number = 1;
            newVolume[time].minVol = oldVolume[z];
            newVolume[time].maxVol = oldVolume[z];
            newVolume[time].volume = [];
            newVolume[time].volume.push(oldVolume[z]);
            z++;
        } else if ((time === oldTime[z]) && newVolume[time]) {
            newVolume[time].totalVolume += oldVolume[z];
            newVolume[time].number += 1;
            newVolume[time].minVol = newVolume[time].minVol > oldVolume[z] ? oldVolume[z] : newVolume[time].minVol;
            newVolume[time].maxVol = newVolume[time].maxVol < oldVolume[z] ? oldVolume[z] : newVolume[time].maxVol;
            newVolume[time].volume.push(oldVolume[z]);
            z++;
        } else if (oldTime[z]) {
            const current = oldVolume[z - 1] + ((oldVolume[z] - oldVolume[z - 1]) / (oldTime[z] - oldTime[z - 1])) * (time - oldTime[z - 1]);
            if (!newVolume[time]) {
                newVolume[time] = {};
                newVolume[time].totalVolume = 0;
                newVolume[time].minVol = 10000;
                newVolume[time].maxVol = 0;
                newVolume[time].volume = [];
            }
            newVolume[time].totalVolume += current;
            newVolume[time].number = newVolume[time].number ? newVolume[time].number + 1 : 1;
            newVolume[time].minVol = newVolume[time].minVol > current ? current : newVolume[time].minVol;
            newVolume[time].maxVol = newVolume[time].maxVol < current ? current : newVolume[time].maxVol;
            newVolume[time].volume.push(current);
        }
    });
};

// to calculate mean volume, standard error.
const meanVolumeError = (newVolume, isErrorBar, exptype, data) => {
    // calculating the number of controls/treatments.
    let control = 0;
    let treatment = 0;
    data.forEach((val) => {
        if (val.exp_type.match(/control/i)) {
            control += 1;
        } else {
            treatment += 1;
        }
    });
    const typeNumber = exptype.match(/control/i) ? control : treatment;

    // median volume.
    // meanVolume = Object.keys(newVolume).map((element) => (d3.deviation(newVolume[element].volume) / (newVolume[element].volume.length)));
    const meanVolume = [];
    const yStandardError = [];
    const times = [];
    let isvolumePointsMoreThanTwo = false;
    Object.keys(newVolume).forEach((element) => {
        isvolumePointsMoreThanTwo = newVolume[element].volume.length > 1;
        if (isvolumePointsMoreThanTwo || (isErrorBar && typeNumber === 1)) {
            // volume.
            meanVolume.push(d3.mean(newVolume[element].volume));
            // standard error.
            const deviation = d3.deviation(newVolume[element].volume);
            const error = Math.sqrt(newVolume[element].volume.length - 1);
            yStandardError.push(deviation / error);
            // time.
            times.push(element);
        }
    });

    return [
        meanVolume,
        yStandardError,
        times,
        typeNumber,
    ];
};

// plotting the error bars.
const plotErrorBars = (exp, times, newVolume, meanVolume, svg, xrange, yrange, yStandardError) => {
    const errorBars = svg.append('g')
        .attr('id', 'errorBars');

    const errorMidBar = errorBars.selectAll('line.error')
        .data(times);

    errorMidBar.enter()
        .append('line')
        .attr('class', 'error')
        .attr('stroke', () => {
            if (exp.match(/control/i)) {
                return `${colors.tussock}`;
            }
            return `${colors.main}`;
        })
        .attr('stroke-width', 2)
        .attr('x1', (d) => xrange(d))
        .attr('x2', (d) => xrange(d))
        .attr('y1', (d, i) => yrange(meanVolume[i] + yStandardError[i]))
        .attr('y2', (d, i) => yrange(meanVolume[i] - yStandardError[i]));

    const errorTopBar = errorBars.selectAll('line.errorTop')
        .data(times);

    errorTopBar.enter()
        .append('line')
        .attr('class', 'errorTop')
        .attr('stroke', () => {
            if (exp.match(/control/i)) {
                return `${colors.tussock}`;
            }
            return `${colors.main}`;
        })
        .attr('stroke-width', 2)
        .attr('x1', (d) => xrange(d) - 4)
        .attr('x2', (d) => xrange(d) + 4)
        .attr('y1', (d, i) => yrange(meanVolume[i] + yStandardError[i]))
        .attr('y2', (d, i) => yrange(meanVolume[i] + yStandardError[i]));

    const errorBotBar = errorBars.selectAll('line.errorBot')
        .data(times);

    errorBotBar.enter()
        .append('line')
        .attr('class', 'errorBot')
        .attr('stroke', () => {
            if (exp.match(/control/i)) {
                return `${colors.tussock}`;
            }
            return `${colors.main}`;
        })
        .attr('stroke-width', 2)
        .attr('x1', (d) => xrange(d) - 4)
        .attr('x2', (d) => xrange(d) + 4)
        .attr('y1', (d, i) => yrange(meanVolume[i] - yStandardError[i]))
        .attr('y2', (d, i) => yrange(meanVolume[i] - yStandardError[i]));
};

// setting up the svg and axis.
const tumorCurve = (data, plotId, minmax) => {
    // expression types.
    const expTypes = ['control', 'treatment'];

    // positioning variables
    const margin = {
        top: 30,
        right: 110,
        bottom: 50,
        left: 80,
    };
    const width = 520;
    const height = 550;

    // make the svg element
    const svg = d3.select('#svg-curve')
        .append('svg')
        .attr('id', `pdx${plotId}`)
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // legend
    const legend = svg.selectAll('.legend')
        .data(expTypes)
        .enter();

    legend.append('circle')
        .attr('id', (d, i) => `legend-dot-${expTypes[i]}`)
        .attr('class', 'legend')
        .attr('r', 5)
        .attr('fill', (d, i) => {
            if (expTypes[i].match(/control/i)) {
                return `${colors.tussock}`;
            }
            return `${colors.main}`;
        })
        .attr('cx', width + 30)
        .attr('cy', (d, i) => height / 2 - 50 + (i * 50));

    legend.append('text')
        .attr('id', (d, i) => `legend-text-${expTypes[i]}`)
        .attr('class', 'legend')
        .attr('fill', 'black')
        .style('font-size', '14px')
        .attr('x', width + 40)
        .attr('y', (d, i) => height / 2 - 45 + (i * 50))
        .text((d, i) => expTypes[i]);

    // set domain and range scaling
    const xrange = d3.scaleLinear()
        .domain([minmax.minTime, minmax.maxTime])
        .range([0, width]);

    const yrange = d3.scaleLinear()
        .domain([0, minmax.maxVolume])
        .range([height, 0])
        .nice();

    // set axes for graph
    const xAxis = d3.axisBottom()
        .scale(xrange)
        .tickPadding(2);

    const yAxis = d3.axisLeft()
        .scale(yrange)
        .tickPadding(2);

    // Add the X Axis
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${yrange(0)})`)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .call(xAxis);

    // X axis label
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .attr('transform', `translate(${width / 2},${height + 40})`)
        .attr('font-size', '14px')
        .text('Time (days)');

    // Add the Y Axis
    const yAxisAdd = svg.append('g')
        .attr('class', 'y axis')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .call(yAxis);

    // Y axis label
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .attr('id', 'volume-text')
        .attr('transform', `translate(${-60},${height / 2})rotate(-90)`)
        .attr('font-size', '14px')
        .text('Volume (mm³)');

    // remove strokes for all ticks
    svg.selectAll('.tick').select('text')
        .attr('fill', 'black')
        .attr('stroke', 'none')
        .attr('font-size', '14px');

    const graph = svg.append('g')
        .attr('id', 'curves');

    return {
        graph, xrange, yrange, width, height, svg,
    };
};

// plot the mean of each experiment type (control, treatment)
const plotMeans = (data, svg, xrange, yrange, isNormal, isErrorBar, isPlotMean) => {
    // calling getUnionOfTimepoints to get all the timepoints.
    const timeUnion = getUnionOfTimepoints(data);
    let expTypes = [];
    const { batch } = data[0]; // there are no batches.

    // if there is no control
    if (timeUnion[0].length === 0) {
        expTypes = ['treatment'];
        timeUnion.shift();
    } else if (timeUnion[1].length === 0) { // no treatment
        expTypes = ['control'];
        timeUnion.pop();
    } else {
        expTypes = ['control', 'treatment'];
    }

    // object of the volume with number of occurences(control/treatment).
    const newVolumeControl = {};
    const newVolumeTreatment = {};

    data.forEach((val) => {
        const z = 0;
        const oldVolume = isNormal ? val.pdx_points[0].volume_normals : val.pdx_points[0].volumes;
        const oldTime = val.pdx_points[0].times;
        const newVolume = val.exp_type.match(/control/i) ? newVolumeControl : newVolumeTreatment;
        const timeUnionData = val.exp_type.match(/control/i) ? timeUnion[0] : timeUnion[1];
        // calling function to create a new volume object.
        volumeObject(z, oldVolume, oldTime, newVolume, timeUnionData);
    });

    for (let n = 0; n < expTypes.length; n++) {
        const exp = expTypes[n];
        // assigining the volume based on the control or treatment.
        const newVolume = expTypes[n].match(/control/i) ? newVolumeControl : newVolumeTreatment;

        // calulating mean volume, standard error and times.
        const [meanVolume, yStandardError, times, number] = meanVolumeError(newVolume, isErrorBar, expTypes[n], data);

        // plot mean charts.
        if (isPlotMean) {
            // mean svg
            const meanSvg = svg.append('g')
                .attr('id', `mean_${expTypes[n]}`);

            const meanDots = meanSvg.selectAll('.mean-dot')
                .data(meanVolume)
                .enter();

            meanDots.append('circle')
                .attr('id', `mean-dot-${expTypes[n]}-${batch}`)
                .attr('class', `mean-dot ${batch}`)
                .attr('r', 4)
                .attr('fill', () => {
                    if (expTypes[n].match(/control/i)) {
                        return `${colors.tussock}`;
                    }
                    return `${colors.main}`;
                })
                .attr('cx', (d, i) => xrange(times[i]))
                .attr('cy', (d, i) => yrange(meanVolume[i]));

            const meanPath = meanSvg.selectAll('.mean-path')
                .data(meanVolume)
                .enter();

            const linepath = d3.line()
                .x((d, i) => xrange(timeUnion[n][i]))
                .y((d, i) => yrange(meanVolume[i]));

            meanPath.append('path')
                .attr('id', `mean-path-${expTypes[n]}-${batch}`)
                .attr('class', `mean-path ${batch}`)
                .attr('d', linepath(meanVolume))
                .attr('fill', 'none')
                .style('opacity', 0.2)
                .attr('stroke', () => {
                    if (expTypes[n].match(/control/i)) {
                        return `${colors.tussock}`;
                    }
                    return `${colors.main}`;
                })
                .attr('stroke-width', 2);
        }

        // plot error bars
        if (isErrorBar && number > 1) {
            plotErrorBars(exp, times, newVolume, meanVolume, svg, xrange, yrange, yStandardError);
        }
    }
};

const plotBatch = (data, graph, xrange, yrange, tooltip, norm) => {
    // to replace all the periods with dashes because dots interfere with classes
    const models = graph.selectAll('g.model')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'model');

    const paths = graph.selectAll('.model-path')
        .data(() => data)
        .enter();

    // line function, to join dots
    const linepath = d3.line()
        .x((d) => xrange(d.time))
        .y((d) => {
            if (norm) {
                return yrange(d.volume_normal);
            }
            return yrange(d.volume);
        });

    // creating line.
    const createLine = (stroke, opacity, color = `${colors.tussock}`) => (
        paths.append('path')
            .attr('id', (d) => `path-${d.model.replace(/\./g, ' ').replace(/\s/g, '-')}`)
            .attr('class', (d) => `model-path_${d.exp_type}`)
            .attr('d', (d) => linepath(d.pdx_json))
            .attr('fill', 'none')
            .style('opacity', opacity)
            .attr('stroke', (d) => {
                if (color === 'white') {
                    return color;
                }
                if (d.exp_type.match(/control/i)) {
                    return `${colors.tussock}`;
                }
                return `${colors.main}`;
            })
            .attr('stroke-width', stroke)
    );

    // selecting and unselecting the table data.
    const updatePathStyle = (d, stroke, opacity, color = 'black') => {
        d3.select(`#path-${d.model.replace(/\./g, ' ').replace(/\s/g, '-')}`)
            .attr('stroke-width', stroke)
            .style('opacity', opacity)
        // .style('stroke', color);
    };

    // add line
    createLine(3, 0.7)
        .attr('stroke-dasharray', ('3', '3'));

    // create a white line to let user hover over with opacity 0 and event listeners.
    createLine(4, 0, 'white')
        .on('mouseover', (d) => {
            console.log('datatatatatatata', d);
            // changing attributes of the line on mouseover.
            updatePathStyle(d, 5, 1.0);
        })
        .on('mouseout', (d) => {
            // changing attributes back to normal of the line on mouseout.
            if (!(d3.select(`#path-${d.model.replace(/\./g, ' ').replace(/\s/g, '-')}`).classed('selected'))) {
                updatePathStyle(d, 3, 0.7);
            }
        })

    // plotting the dots
    const dots = models.selectAll('.model-dot')
        .data((d) => d.pdx_json)
        .enter();

    // appends dots.
    dots.append('circle')
        .attr('id', (d, i) => `dot-${d.model.replace(/\./g, ' ').replace(/\s/g, '-')}-${d.exp_type}${i}`)
        .attr('class', (d) => `model-dot_${d.exp_type}`)
        .attr('r', 4)
        .attr('fill', (d) => {
            if (d.exp_type.match(/control/i)) {
                return `${colors.tussock}`;
            }
            return `${colors.main}`;
        })
        .style('opacity', 1.0)
        .attr('cx', (d) => xrange(d.time))
        .attr('cy', (d) => {
            if (norm) {
                return yrange(d.volume_normal);
            }
            return yrange(d.volume);
        })
        .on('mouseover', (d) => {
            // create tooltip.
            createToolTip(d, 'dot', tooltip);
        })
        .on('mouseout', () => {
            // remove all the divs with id tooltiptext.
            d3.selectAll('#tooltiptext').remove();
            // tooltip on mousever setting the div to hidden.
            tooltip
                .style('visibility', 'hidden');
        });

    // calling plotMeans to plot the mean function.
    plotMeans(data, graph, xrange, yrange, norm, false, true);
};

// toggle to show each model
const volumeToggle = (data, svg, xrange, width, height, maxVolume, maxVolNorm, minVolNorm, tooltip) => {
    const toggleValues = ['allCurves', 'allCurvesText', 'errorBar', 'errorBarText', 'volRaw', 'volNorm', 'volRawText', 'volNormText'];
    let isNormalized = false;
    let isErrorBar = false;

    // to create the rectangle and
    function createReactangle(additionalHeight, color, id, val, text, extraWidth, extraHeight) {
        let rect = '';
        switch (val) {
            case 'volRaw':
            case 'volNorm':
            case 'errorBar':
            case 'allCurves':
                rect = svg.append('rect')
                    .attr('x', width + 25)
                    .attr('y', height / 2 + additionalHeight)
                    .attr('width', 70)
                    .attr('height', 20)
                    .attr('fill', color)
                    .style('opacity', 0.8)
                    .attr('id', id);
                break;
            case 'volRawText':
            case 'volNormText':
            case 'errorBarText':
            case 'allCurvesText':
                rect = svg.append('text')
                    .attr('fill', 'black')
                    .style('font-size', '12px')
                    .attr('text-anchor', val === 'volRawText' ? 'middle' : 'null')
                    .attr('id', id)
                    .attr('x', width + extraWidth)
                    .attr('y', height / 2 + extraHeight)
                    .text(text);
                break;
            default:
                console.log('It\'s not available');
        }
        return rect;
    }

    function calcMinMax(isNormalized, minVolNorm, maxVolNorm, maxVolume) {
        let minimum = 0;
        let maximum = 0;

        if (isNormalized) {
            minimum = minVolNorm - 1;
            maximum = maxVolNorm + 1;
        } else {
            minimum = 0;
            maximum = maxVolume;
        }

        return [minimum, maximum];
    }

    function checkIfNormalized(val) {
        let isNormalized = false;
        // checks if it's normalized data or not.
        if (val.match(/(volNorm|volNormText)/g)) {
            isNormalized = true;
        }
        return isNormalized;
    }

    function calculateNormalizedRange(isNormalized, minVolNorm, maxVolNorm, maxVolume) {
        // min and max value for thee scale.
        const [minimum, maximum] = calcMinMax(isNormalized, minVolNorm, maxVolNorm, maxVolume);
        // scale for y-axis.
        const yrange = d3.scaleLinear()
            .domain([minimum, maximum])
            .range([height, 0])
            .nice();

        return yrange;
    }

    toggleValues.forEach((val) => {
        // setting the initial variables.
        let additionalHeight = 50;
        let color = `${colors.tussock}`;
        let id = '';
        let rawToggle = `${colors.main}`;
        let normToggle = 'lightgray';
        let allToggle = `${colors.tussock}`;
        let errorToggle = 'lightgray';
        let minimum = 0;
        let maximum = maxVolume;
        let text = '';
        let extraWidth = 29;
        let extraHeight = 84;
        let rect = '';

        // switching based on the toggle value.
        switch (val) {
            case 'errorBar':
            case 'errorBarText':
                additionalHeight = 70;
                color = 'lightgray';
                id = val === 'errorBar' ? 'errorBar' : 'errorBarText';
                text = val === 'errorBarText' ? 'ErrorBars' : '';
                extraWidth = 34;
                allToggle = 'lightgray';
                errorToggle = `${colors.tussock}`;
                break;

            case 'allCurves':
                id = 'allCurves';
                break;

            case 'allCurvesText':
                id = 'allCurvesText';
                text = 'All Curves';
                extraWidth = 32;
                extraHeight = 64;
                break;

            case 'volRaw':
                additionalHeight = 120;
                id = 'volRawToggle';
                color = `${colors.main}`;
                break;

            case 'volRawText':
                id = 'volRawText';
                text = 'Raw';
                extraWidth = 60;
                extraHeight = 134;
                break;

            case 'volNorm':
                additionalHeight = 141;
                id = 'volNormToggle';
                color = 'lightgray';
                minimum = minVolNorm - 1;
                maximum = maxVolNorm + 1;
                rawToggle = 'lightgray';
                normToggle = `${colors.main}`;
                break;

            case 'volNormText':
                id = 'volNormText';
                text = 'Normalized';
                extraWidth = 28;
                extraHeight = 155;
                minimum = minVolNorm - 1;
                maximum = maxVolNorm + 1;
                rawToggle = 'lightgray';
                normToggle = `${colors.main}`;
                break;

            default:
                id = 'Looking for what??';
        }

        // create rectangles/toggle bars.
        rect = createReactangle(additionalHeight, color, id, val, text, extraWidth, extraHeight);

        // on click handler.
        rect.on('click', () => {
            console.log(val);
            // changing the text on y axis.
            if (val.match(/(volNorm|volNormText)/)) {
                d3.select('#volume-text')
                    .text('Normalized volume (mm³)');
            } else if (val.match(/(volRaw|volRawText)/)) {
                d3.select('#volume-text')
                    .text('Volume (mm³)');
            }
            // y range variable.
            let yrange = calculateNormalizedRange(isNormalized, minVolNorm, maxVolNorm, maxVolume);
            // conditioning.
            if (val.match(/(allCurves|allCurvesText|errorBar|errorBarText)/g)) {
                // if error bar selection the set the variable.
                if (val.match(/(errorBar|errorBarText)/g)) {
                    isErrorBar = true;
                } else {
                    isErrorBar = false;
                }
                // unselect the data from the table.
                d3.selectAll('tr').nodes().forEach((val) => {
                    if (val.className) {
                        d3.select(`.${val.className}`)
                            .selectAll('td')
                            .style('color', `${colors.tussock}`)
                            .style('background', 'white');
                        d3.select(`.${val.className}`)
                            .selectAll('a')
                            .style('color', `${colors.main}`)
                            .style('background', 'white');
                    }
                });
                // changing toggle color.
                d3.select('#errorBar').attr('fill', errorToggle);
                d3.select('#allCurves').attr('fill', allToggle);
            } else {
                // normlized or not.
                isNormalized = checkIfNormalized(val);
                // y range.
                yrange = calculateNormalizedRange(isNormalized, minVolNorm, maxVolNorm, maxVolume);
                // create axis/modify the axis.
                const yAxis = d3.axisLeft()
                    .scale(yrange)
                    .tickPadding(2);
                // calling to make the axis.
                d3.selectAll('g.y.axis').call(yAxis);
                // setting ticks.
                svg.selectAll('.tick').select('text')
                    .attr('fill', 'black')
                    .attr('stroke', 'none')
                    .attr('font-size', '14px');
                // changing toggle color.
                d3.select('#volRawToggle').attr('fill', rawToggle);
                d3.select('#volNormToggle').attr('fill', normToggle);
            }
            // removing the other curve.
            d3.select('#curves').remove();
            // creeating new svg for the curve/graph.
            const graph = svg.append('g')
                .attr('id', 'curves');
            // plot the toggle curve.
            if (isErrorBar) {
                plotMeans(data, graph, xrange, yrange, isNormalized, true, true);
            } else {
                plotBatch(data, graph, xrange, yrange, tooltip, isNormalized);
            }
        });
    });
};

// main function to plot the growth curve.
const TumorGrowthCurve = (props) => {
    const { data } = props;
    const plotId = 'plot';
    const componentRef = useRef();

    // removing the already created plot.
    d3.select('#pdxplot').remove();

    // function will be triggered once the component is mounted/updated.
    useEffect(() => {
        if (data.length !== 0) {
            const tooltip = initializeToolTop();
            // calling function to grab the min max values.
            const minmax = calculateMinMax(data);
            // calling tumorCurve function passing the data, PlotID and node reference.
            const curve = tumorCurve(data, plotId, minmax);
            // plot each model
            plotBatch(data, curve.graph, curve.xrange, curve.yrange, tooltip, false);
            // toggle legend buttons.
            volumeToggle(data, curve.svg, curve.xrange, curve.width, curve.height, minmax.maxVolume, minmax.maxVolNorm, minmax.minVolNorm, tooltip);
        }
    });

    return (
        <div className='growth-curve'>
            <DownloadButton componentRef={componentRef} />
            <div id="svg-curve" ref={componentRef} style={{ float: 'none !important' }} />
        </div>
    );
};

TumorGrowthCurve.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TumorGrowthCurve;

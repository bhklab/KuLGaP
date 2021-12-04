/* eslint-disable no-shadow */
import React, {
    useState, useRef, useContext, useEffect,
} from 'react';
import { CSVReader, readRemoteFile } from 'react-papaparse';
import { CSVLink } from 'react-csv';
import axios from 'axios';
import styled from 'styled-components';
import colors from '../../styles/colors';
import AnalysisContext from '../Context/AnalysisContext';
import exampleSummary1 from '../../data/api-test.json';
import exampleSummary2 from '../../data/api-test-2.json';

const StyledForm = styled.div`
    background-color: ${colors.gray_bg};
    border-radius: 25px;
    width: 75%;
    min-width: 300px;
    height: 100%;
    margin: 50px 0px 100px 0px;
    padding: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .error {
        color: ${colors.red_main};
        font-weight: 700;
        font-size: calc(0.45vw + 1.0em);
    }
    .main-submit {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: calc(0.5vw + 0.5em);
        
    .input {
        display:none;
    }
    button {
        background: ${colors.main};
        color: white;
        border: none;
        cursor: pointer;
        padding: 10px;
        border-radius: 10px;
        font-weight: 600;
        outline: none;
        transition: all ease-out 0.25s;
        margin: 0 5px;
        min-height: 40px;
        font-size: calc(0.25vw + 1.0em);
        &:hover {
            color: ${colors.main};
            background: white;
        };
        &.disabled {
            cursor: default;
            background: #778899;
            color: white;
        }
    }
}
`;

const StyledReader = styled.div`
    background: ${colors.main};
    color: white;
    border-radius: 20px;
    font-weight: 600;
    font-size: 1.2em;
    width: 250px;
    &:hover {
        background: white;
        color: ${colors.main};
    }
    div {
        border-width: 0px !important;
    }
    div div {
        span {
            background-color: transparent !important;
            color: ${colors.tussock};
        }
    }
    div:nth-child(3) {
        span {
            background-color: ${colors.main} !important;
        }
    }
    padding: 1px;
    margin-right: 20px;
`;

const StyleLink = styled.div`
    a:link {
        text-decoration: none;
        color: ${colors.tussock};
        font-size: .9em;
        &:hover {
            color: ${colors.main}
        }
    }
    margin-right: 10px;
`;

// function to calculate the normal volume.
const normalVolume = (vol_array, value, i) => (value - vol_array[i]) / (vol_array[i]);

// onverts parsed csv data from paparse library to proper format
const growthCurveData = (data, isDrop) => {
    const output = [];
    let times = '';

    Object.values(data).forEach((row, i) => {
        if (i === 0) {
            times = row.value;
        } else {
            // calculate the pdx_json.
            const pdxJson = [];
            row.value.forEach((el, i) => {
                pdxJson.push({
                    batch: 'unknown',
                    exp_type: row.id,
                    model: 'unknown',
                    time: Number(times[i]),
                    volume: Number(el),
                    volume_normal: Number(el),
                })
            })

            // calculate pdx points.
            const pdxPoints = [];
            const pdxTimes = row.value.map((el, i) => Number(times[i]));
            pdxPoints.push({
                times: pdxTimes,
                volumes: row.value.map(el => Number(el)),
                volume_normals: row.value.map(el => Number(el)),
            })

            // final data.
            output.push({
                batch: 'unknown',
                drug: row.id === 'Control' ? 'WATER' : 'unknown',
                exp_type: row.id,
                model: 'unknown',
                pdx_json: pdxJson,
                pdx_points: pdxPoints
            });
        }
    })

    return output;
};

/**
 * 
 * @param {Array} input - array of data
 * @returns {Object} - object of the transformed data
 */
const transformData = (input) => {
    const inputData = input;
    const data = {};

    inputData.forEach((row, i) => {
        row.forEach((el, j) => {
            if (i === 0 && el !== '') {
                data[j] = {
                    id: el,
                    value: [],
                }
            } else if (data[j] && el !== '') {
                data[j].value.push(el);
            }
        })
    });

    return data;
}

const UploadForm = () => {
    const [csvFile, setCsvFile] = useState(null);
    const fileRef = useRef(null);
    const { analysisState, setAnalysisState } = useContext(AnalysisContext);
    const { error, summary } = analysisState;
    const [exampleFile, setExampleFile] = useState([]);

    // to set the example file on the initial render.
    useEffect(() => {
        readRemoteFile('example.csv', {
            download: true,
            complete: (results) => {
                setExampleFile(results.data);
            },
        });
    }, []);

    // uploads csv file for analysis
    const onSubmit = (e) => {
        e.preventDefault();
        if (csvFile) {
            setAnalysisState({
                ...analysisState, loading: true, summary: null, error: null,
            });
            const data = new FormData();
            data.append('file', csvFile);
            axios.post('/api/upload', data, {})
                .then((res) => {
                    // updates summaru section of the context state, parsed csvData stays the same
                    setAnalysisState({
                        ...analysisState, summary: res.data[0], loading: false,
                    });
                })
                .catch((err) => {
                    // displays error message if request is unsuccessful
                    if (err.response.status >= 400) {
                        const { message } = err.response.data;
                        setAnalysisState({
                            ...analysisState, loading: false, error: message,
                        });
                    } else {
                        setAnalysisState({
                            ...analysisState, loading: false, error: 'Something went wrong',
                        });
                    }
                });
        }
    };

    const handleOnDrop = (data, file, summary, isDrop) => {
        // updates csvFile variable if 'file' arg is passed
        if (file !== undefined) {
            setCsvFile(file);
        }

        // transform data
        const transformedData = isDrop
            ? transformData(data.map(el => el.data))
            : transformData(data);

        const curveData = growthCurveData(transformedData, isDrop);

        setAnalysisState({
            ...analysisState,
            summary,
            data: curveData,
        });
    };

    const handleOnError = (err) => {
        console.log(err);
        setCsvFile(null);
    };

    const handleOnRemoveFile = () => {
        setCsvFile(null);
    };

    // retrieves example data from the backend
    const getExampleData = (file, example) => {
        readRemoteFile(file, {
            download: true,
            complete: (results) => {
                // runs handleOnDrop function with parsed csv data and example summary from json
                // no actual file is being passed this way
                handleOnDrop(results.data, null, example, false);
            },
        });
    };

    return (
        <StyledForm>
            <form className="main-submit" onSubmit={onSubmit}>
                <StyledReader>
                    <CSVReader
                        ref={fileRef}
                        // actual file drop, summary data is set to null
                        // (summary will be updated later when API returns data)
                        onDrop={(data, file) => handleOnDrop(data, file, null, true)}
                        onError={handleOnError}
                        addRemoveButton
                        onRemoveFile={handleOnRemoveFile}
                        style={{ borderWidth: '0px !important' }}
                    >
                        <span> Upload CSV File </span>
                    </CSVReader>
                </StyledReader>
                <StyleLink>
                    <CSVLink
                        data={exampleFile}
                        filename="example.csv"
                    >
                        (Download Example File)
                    </CSVLink>
                </StyleLink>
                <button type="submit" onSubmit={onSubmit} disabled={!csvFile} className={!csvFile ? 'disabled' : null}>Analyze</button>
                <button type="button" onClick={() => getExampleData('example.csv', exampleSummary1)}>Test1</button>
                <button type="button" onClick={() => getExampleData('example_test_2.csv', exampleSummary2)}>Test2</button>
            </form>
            {error ? <p className="error">{error}</p> : null}
        </StyledForm>
    );
};

export default UploadForm;

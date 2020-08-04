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
import exampleSummary from '../../data/api-test.json';

const StyledForm = styled.div`
    background-color: ${colors.gray_bg};
    border-radius: 25px;
    width: 60%;
    min-width: 300px;
    height: 100%;
    margin: 50px 0px 30px 0px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .error {
        color: ${colors.red_error};
        font-weight: 700;
    }
    .main-submit {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: 'Open Sans', sans-serif;
        font-size: calc(0.5vw + 0.5em);
        
    .input {
        display:none;
    }
    button {
        background: ${colors.main};
        color: white;
        border: none;
        cursor: pointer;
        padding: 8px 10px;
        border-radius:10px;
        font-weight: 600;
        outline: none;
        transition: all ease-out 0.25s;
        margin: 0 5px;
        min-height: 40px;
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
    font-size: 14px;
    &:hover {
        background: white;
        color: ${colors.main};
    }
    div {
        border-width: 0px !important;
    }
`;

const StyleLink = styled.div`
    a:link {
        text-decoration: none;
        color: ${colors.main};
        font-size: 12px;
        &:hover {
            color: ${colors.tussock}
        }
    }
`;

// onverts parsed csv data from paparse library to proper format
const processData = (data, isDrop) => {
    const output = [];
    data.forEach((row, i) => {
        if (!i) {
            const row_data = isDrop ? row.data : row;
            row_data.forEach((value, j) => {
                if (value.match(/(Control|Treatment)/g)) {
                    output.push({
                        batch: 'unknown',
                        drug: value === 'Control' ? 'WATER' : 'unknown',
                        exp_type: value.toLowerCase(),
                        model: `unknown${j}`,
                        pdx_json: [],
                        pdx_points: [{
                            times: [],
                            volumes: [],
                            volume_normals: [],
                        }],
                    });
                }
            });
        } else {
            let time = 0;
            let count = 0;
            const row_data = isDrop ? row.data : row;
            row_data.forEach((value, i) => {
                if (!i) {
                    time = Number(value);
                } else if (value !== '') {
                    output[count].pdx_json.push({
                        batch: 'unknown',
                        time: Number(time),
                        volume: Number(value),
                        volume_normal: 0,
                        model: output[count].model,
                        exp_type: output[count].exp_type,
                    });
                    output[count].pdx_points[0].times.push(Number(time));
                    output[count].pdx_points[0].volumes.push(Number(value));
                    output[count].pdx_points[0].volume_normals.push(0);
                    count++;
                }
            });
        }
    });
    return output
}

const UploadForm = () => {
    const [ csvFile, setCsvFile ] = useState(null);
    const fileRef = useRef(null);
    const { analysisState, setAnalysisState } = useContext(AnalysisContext);
    const { error, summary } = analysisState;
    const [ exampleFile, setExampleFile ] = useState([]);

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
                    console.log(err.response);
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

    const handleOnDrop = (data, file, summary, isDrop ) => {
        // updates csvFile variable if 'file' arg is passed
        if (file !== undefined) {
            setCsvFile(file);
        }

        const modifiedData = processData(data, isDrop);

        setAnalysisState({
            ...analysisState,
            summary,
            data: modifiedData,
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
    const getExampleData = () => {
        readRemoteFile('example.csv', {
            download: true,
            complete: (results) => {
                // runs handleOnDrop function with parsed csv data and example summary from json
                // no actual file is being passed this way
                handleOnDrop(results.data, null, exampleSummary, false);
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
                        onDrop={(data, file) => handleOnDrop(data, file, null, true )}
                        onError={handleOnError}
                        addRemoveButton
                        onRemoveFile={handleOnRemoveFile}
                        style={{ 'borderWidth': '0px !important' }}
                    >
                        <span>Upload CSV File</span>
                    </CSVReader>
                </StyledReader>
                <StyleLink>
                    <CSVLink
                     data={exampleFile}
                      filename="example.csv">
                        (Download Example File)
                    </CSVLink>
                </StyleLink>
                <button type="submit" onSubmit={onSubmit} disabled={!csvFile} className={!csvFile ? 'disabled' : null}>Analyze</button>
                <button type="button" onClick={getExampleData}>Test</button>
            </form>
            {error ? <p className="error">{error}</p> : null}
        </StyledForm>
    );
};

export default UploadForm;

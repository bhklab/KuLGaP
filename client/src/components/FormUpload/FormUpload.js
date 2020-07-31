import React, { useState, useRef, useContext, useEffect } from 'react';
import { CSVReader, readRemoteFile } from 'react-papaparse'
import { CSVLink } from "react-csv";
import axios from 'axios';
import styled from 'styled-components';
import colors from '../../styles/colors';
import AnalysisContext from '../Context/AnalysisContext';


const StyledForm = styled.div`
    background-color: ${colors.gray_bg};
    border-radius: 25px;
    width: 60%;
    min-width: 300px;
    height: 100%;
    margin: 50px 0px 80px 0px;
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
    &:hover {
        background: white;
        color: ${colors.main};
        font-size: 14px;
    }
    div {
        border-width: 0px !important;
    }
`

const StyleLink = styled.div`
    a:link {
        text-decoration: none;
        color: ${colors.main};
        font-size: 12px;
        &:hover {
            color: ${colors.tussock}
        }
    }
`

const UploadForm = () => {
    // const [uploadResult, setUploadResult] = useState({ data: null, loading: false, error: null });
    const [file, setFile] = useState(null);
    const fileRef = useRef(null);
    const { analysisState, setAnalysisState } = useContext(AnalysisContext);
    const { loading, error, data, summary } = analysisState;
    const [ exampleFile, setExampleFile ] = useState([]);

    // to set the example file on the initial render.
    useEffect(() => {
            readRemoteFile('example.csv', {
                download: true,
                complete: (results) => {
                    setExampleFile(results.data);
                }
            })
    }, [])

    // uploads csv file for analysis
    const onSubmit = (e) => {
        e.preventDefault();
        if (file) {
            setAnalysisState({ ...analysisState, showResults: false, loading: true, summary: null, error: null });
            const data = new FormData();
            data.append('file', file);
            axios.post('/api/upload', data, {})
                .then((res) => {
                    console.log(res.data[0]);
                    setAnalysisState({ ...analysisState, showResults: true, summary: res.data[0], loading: false });
                })
                .catch((err) => {
                    console.log(err.response);
                    if (err.response.status >= 400) {
                        const { message } = err.response.data;
                        setAnalysisState({ ...analysisState, summary: null, loading: false, error: message });
                    } else {
                        setAnalysisState({ ...analysisState, summary: null, loading: false, error: 'Something went wrong' });
                    }
                });
        }
    };


    // for styling the file input
    const openFileOption = () => {
        fileRef.current.click();
    };


    const handleOnDrop = (data, isDrop, file) => {
        const csvFile = file;
        // cancelled
        if (csvFile !== undefined) {
            setFile(csvFile);
        }

        let modifiedData = [];
        data.forEach((row, i) => {
            if(!i) {
                const row_data = isDrop ? row.data : row
                row_data.forEach((value, j) => {
                    let count = 0;
                    if(value.match(/(Control|Treatment)/g)) {
                        modifiedData.push({
                            batch: 'unknown',
                            drug: value === 'Control' ? 'WATER': 'unknown',
                            exp_type: value.toLowerCase(),
                            model: `unknown${j}`,
                            pdx_json : [],
                            pdx_points: [{
                                times: [],
                                volumes: [],
                                volume_normals: []
                            }]
                        })
                    }
                })
            } else {
                let time = 0;
                let count = 0;
                const row_data = isDrop ? row.data : row
                row_data.forEach((value, i)=> {
                    if(!i) {
                        time = Number(value);
                    }
                    else if(value !== '') {
                        modifiedData[count]['pdx_json'].push({
                            batch: 'unknown',
                            time: Number(time),
                            volume: Number(value),
                            volume_normal: 0,
                            model: modifiedData[count]['model'],
                            exp_type: modifiedData[count]['exp_type']
                        })
                        modifiedData[count]['pdx_points'][0]['times'].push(Number(time));
                        modifiedData[count]['pdx_points'][0]['volumes'].push(Number(value));
                        modifiedData[count]['pdx_points'][0]['volume_normals'].push(0);
                        count ++;
                    }
                })
            }
        })
        setAnalysisState({ 
            ...analysisState,
            // decides whether to wait for API summary or display existing data
            showResults: !isDrop,
            data: modifiedData });
    }
    
    const handleOnError = (err, file, inputElem, reason) => {
        console.log(err)
        setFile(null);
    }
    
    const handleOnRemoveFile = (data) => {
        setFile(null);
    }

    // retrieves example data from the backend
    const getExampleData = () => {
        readRemoteFile('example.csv', {
            download: true,
            complete: (results) => {
                handleOnDrop(results.data, false)
            }
        })

        axios.get('/api/example')
            .then((res) => {
                const response = JSON.parse(res.data)
                console.log(response);
                // setAnalysisState({ data: response, loading: false });
            });
    };

    return (
        <StyledForm>
            <form className="main-submit" onSubmit={onSubmit}>
                <StyledReader>
                    <CSVReader
                        ref={fileRef}
                        onDrop={(data, file) => handleOnDrop(data, true, file)}
                        onError={handleOnError}
                        addRemoveButton
                        onRemoveFile={handleOnRemoveFile}
                        style={{'border-width': '0px !important'}}
                    >
                        <span>Upload CSV File</span>
                    </CSVReader>
                </StyledReader>
                <StyleLink>
                    <CSVLink data={exampleFile} filename={"example.csv"}>
                        (Download Example File)
                    </CSVLink>
                </StyleLink>
                <button type="submit" onSubmit={onSubmit} disabled={!file} className={!file ? 'disabled' : null}>Analyze</button>
                <button type="button" onClick={getExampleData}>Test</button>
            </form>
            {error ? <p className="error">{error}</p> : null}
        </StyledForm>

    );
}

export default UploadForm;

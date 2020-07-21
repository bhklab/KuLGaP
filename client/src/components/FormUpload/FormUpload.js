import React, { useState, useRef, useContext } from 'react';
import { CSVReader } from 'react-papaparse'
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
        CSV
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

function UploadForm() {
    const [uploadResult, setUploadResult] = useState({ data: null, loading: false, error: null });
    const [file, setFile] = useState(null);
    const fileRef = useRef(null);
    const { analysisState, setAnalysisState } = useContext(AnalysisContext);
    const { loading } = analysisState;
    const [tumorData, parsedTumorData] = useState([]);

    const getExampleData = () => {
        setAnalysisState({ data: null, loading: true });
        axios.get('/api')
            .then((res) => {
                setAnalysisState({ data: res.data, loading: false });
            });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (file) {
            setAnalysisState({ data: null, loading: true });
            const data = new FormData();
            data.append('file', file);
            axios.post('/api/upload', data, {})
            // axios.get('/api/upload')
                .then((res) => {
                    setFile(null);
                    setAnalysisState({ data: res.data, loading: false });
                    // setUploadResult({ data: null, loading: false, error: null });
                })
                .catch((err) => {
                    console.log(err.response);
                    setFile(null);
                    if (err.response.status >= 400) {
                        const { message } = err.response.data;
                        // setUploadResult({ data: null, loading: false, error: message });
                        setAnalysisState({ data: null, loading: false, error: message });
                    } else {
                        // setUploadResult({ data: null, loading: false, error: 'Something went wrong' });
                        setAnalysisState({ data: null, loading: false, error: 'Something went wrong' });
                    }
                });
        }
    };

    // when input changes
    const onChange = (e) => {
        const csvFile = e.target.files[0];

        // cancelled
        if (csvFile !== undefined) {
            setFile(csvFile);
        }
    };

    // for styling the file input
    const openFileOption = () => {
        fileRef.current.click();
    };

    const handleOnDrop = (data) => {
        let modifiedData = [];
        data.forEach((row, i) => {
            if(!i) {
                row.data.forEach(value => {
                    let count = 0;
                    if(value.match(/(Control|Treatment)/g)) {
                        console.log(value)
                        modifiedData.push({
                            batch: 'unknown',
                            drug: 'unknown',
                            exp_type: value.toLowerCase(),
                            model: 'unknown',
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
                row.data.forEach((value, i)=> {
                    if(!i) {
                        time = Number(value);
                    }
                    else if(value !== '') {
                        modifiedData[count]['pdx_json'].push({
                            time: Number(time),
                            volumne: Number(value),
                            volumne_normal: 0
                        })
                        modifiedData[count]['pdx_points'][0]['times'].push(time);
                        modifiedData[count]['pdx_points'][0]['volumes'].push(value);
                        modifiedData[count]['pdx_points'][0]['volume_normals'].push(0);
                        count ++;
                    }
                })
            }
        })
        parsedTumorData(modifiedData);
        setAnalysisState({ data: modifiedData, loading: false });
    }
    
    const handleOnError = (err, file, inputElem, reason) => {
        console.log(err)
    }
    
    const handleOnRemoveFile = (data) => {
        console.log(data, tumorData)
    }

    return (
        <StyledForm>
            <form className="main-submit" onSubmit={onSubmit}>
                <input
                    type="file"
                    ref={fileRef}
                    className="input"
                    onChange={onChange}
                    name={file}
                />
                <StyledReader>
                    <CSVReader
                        onDrop={handleOnDrop}
                        onError={handleOnError}
                        addRemoveButton
                        onRemoveFile={handleOnRemoveFile}
                        style={{'border-width': '0px !important'}}
                    >
                        <span>Upload CSV File!</span>
                    </CSVReader>
                </StyledReader>
                <button type="submit" onSubmit={onSubmit} disabled={!file} className={!file ? 'disabled' : null}>Analyze</button>
                <button type="button" onClick={getExampleData}>Test</button>
            </form>
            {uploadResult.error ? <p className="error">{uploadResult.error}</p> : null}
        </StyledForm>

    );
}

export default UploadForm;

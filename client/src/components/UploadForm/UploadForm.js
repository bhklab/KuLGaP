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
    &:hover {
        background: white;
        color: ${colors.main};
        font-size: 14px;
    }
`

function UploadForm() {
    const [uploadResult, setUploadResult] = useState({ data: null, loading: false, error: null });
    const [file, setFile] = useState(null);
    const fileRef = useRef(null);
    const { analysisState, setAnalysisState } = useContext(AnalysisContext);
    const { loading } = analysisState;

    // retrieves example data from the backend
    const getExampleData = () => {
        setAnalysisState({ data: null, loading: true });
        axios.get('/api/example')
            .then((res) => {
                setAnalysisState({ data: res.data, loading: false });
            });
    };

    // uploads csv file for analysis
    const onSubmit = (e) => {
        e.preventDefault();
        if (file) {
            setAnalysisState({ data: null, loading: true });
            const data = new FormData();
            data.append('file', file);
            axios.post('/api/upload', data, {})
                .then((res) => {
                    setFile(null);
                    setAnalysisState({ data: res.data, loading: false });
                })
                .catch((err) => {
                    console.log(err.response);
                    setFile(null);
                    if (err.response.status >= 400) {
                        const { message } = err.response.data;
                        setAnalysisState({ data: null, loading: false, error: message });
                    } else {
                        setAnalysisState({ data: null, loading: false, error: 'Something went wrong' });
                    }
                });
        }
    };

    // for styling the file input
    const openFileOption = () => {
        fileRef.current.click();
    };

    const handleOnDrop = (data, file) => {
        const csvFile = file;
        console.log("csvFile", csvFile);
        // cancelled
        if (csvFile !== undefined) {
            setFile(csvFile);
        }

        console.log('---------------------------')
        console.log(data)
        console.log('---------------------------')

    }
    
    const handleOnError = (err, file, inputElem, reason) => {
        console.log(err)
    }
    
    const handleOnRemoveFile = (data) => {
        console.log('---------------------------')
        console.log(data)
        console.log('---------------------------')
    }

    return (
        <StyledForm>
            <form className="main-submit" onSubmit={onSubmit}>
                <StyledReader>
                    <CSVReader
                        ref={fileRef}
                        onDrop={(data, file) => handleOnDrop(data, file)}
                        onError={handleOnError}
                        addRemoveButton
                        onRemoveFile={handleOnRemoveFile}
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

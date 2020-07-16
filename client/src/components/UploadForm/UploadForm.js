import React, { useState, useRef, useContext } from 'react';
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

function UploadForm() {
    const [uploadResult, setUploadResult] = useState({ data: null, loading: false, error: null });
    const [file, setFile] = useState(null);
    const fileRef = useRef(null);
    const { analysisState, setAnalysisState } = useContext(AnalysisContext);
    const { loading } = analysisState;

    const getExampleData = () => {
        setAnalysisState({ data: null, loading: true });
        axios.get('/api')
            .then((res) => {
                // setUploadResult({ data: res.data, loading: false, error: null });
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
        const vcfFile = e.target.files[0];

        // cancelled
        if (vcfFile !== undefined) {
            setFile(vcfFile);
        }
    };

    // for styling the file input
    const openFileOption = () => {
        fileRef.current.click();
    };

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
                <button type="button" className="choose-file" onClick={openFileOption}>Choose a File</button>

                <div className="file-uploaded">
                    {file === null || file === undefined ? 'No file chosen' : file.name}
                </div>
                <button type="submit" onSubmit={onSubmit} disabled={!file} className={!file ? 'disabled' : null}>Analyze</button>
                <button type="button" onClick={getExampleData}>Test</button>
            </form>
            {uploadResult.error ? <p className="error">{uploadResult.error}</p> : null}
        </StyledForm>

    );
}

export default UploadForm;

/* eslint-disable no-nested-ternary */
import React from 'react';
import AnalysisTable from './AnalysisTable';
import FixedPoint from '../utils/FixedPoint';

const columns = [
    {
        Header: 'Name',
        accessor: 'name'
    },
    {
        Header: 'Estimate',
        accessor: 'estimate'
    },
    {
        Header: 'p-value',
        accessor: 'p-value'
    },
    {
        Header: 'Responder',
        accessor: 'responder'
    }
];

const values = [
    {
        key: 'kl',
        value: 'KuLGaP'
    },
    {
        key: 'tgi',
        value: 'TGI'
    },
    {
        key: 'average_angle',
        value: 'Angle'
    },
    {
        key: 'mRECIST',
        value: 'mRECIST'
    },
    {
        key: 'auc',
        value: 'AUC'
    }
];

/**
 *
 * @param {Array} data
 * @returns {String}
 */
const calcResponse = data => {
    const count = {
        SD: 0,
        PR: 0,
        PD: 0,
        CR: 0
    };
    let max = 0;
    let max_array = [];
    Object.entries(data.mRECIST).forEach(val => {
        count[val[1].replace('m', '')] += 1;
    });
    Object.entries(count).forEach(val => {
        if (val[1] > max) {
            max_array = [];
            max_array.push(val[0]);
            max = val[1];
        } else if (val[1] === max) {
            max_array.push(val[0]);
        }
    });
    return max_array.join('/');
};

/**
 *
 * @param {Object} object
 * @param {Array} data
 */
const calculateEstimate = (object, data) => {
    if (object.value === 'mRECIST') {
        return calcResponse(data);
    }
    if (object.value === 'AUC') {
        return FixedPoint(data.auc_gp - data.auc_gp_control);
    }
    return FixedPoint(data[object.key]);
};

/**
 *
 * @param {String} key
 * @param {Object} data
 * @returns {String} - if a responder then 'Yes' else 'No'
 */
const calculateResponder = (key, data) => {
    if (key === 'kl') {
        return data.kl_p_value < 0.05 ? 'Yes' : 'No';
    } else if (key === 'auc') {
        return data.responder_from_AUC === true ? 'Yes' : 'No';
    } else if (key === 'average_angle') {
        return data.responder_from_response_angle === true ? 'Yes' : 'No';
    } else if (key === 'tgi') {
        return data.tgi > 0.6 ? 'Yes' : 'No';
    } else if (key === 'mRECIST') {
        const countPD = 0;
        const dataMid = Object.keys(data.mRECIST_control).length / 2;
        Object.values(data.mRECIST_control).forEach(res => {
            if (res === 'PD') {
                countPD += 1;
            }
        });
        return countPD < dataMid ? 'Yes' : 'No';
    }
};

const parseData = data =>
    values.map(object => {
        return {
            name: object.value,
            estimate: calculateEstimate(object, data),
            'p-value':
                object.key === 'kl' ? data.kl_p_value.toExponential(1) : '',
            responder: calculateResponder(object.key, data)
        };
    });

const BatchStatsTable = ({ data }) => (
    <AnalysisTable data={parseData(data)} columns={columns} type="batch" />
);

export default BatchStatsTable;

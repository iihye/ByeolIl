import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { reportModalState } from 'components/atom';
import { useSetRecoilState } from 'recoil';
import Modal from '../reusable/Modal';

/**
 *
 * reportInfo : ReportListResponseDto
 * @returns
 */
function ReportDetail(reportInfo) {
    console.log('리포트인포', reportInfo);
    return (
        <Modal
            type={'report'}
            reportInfo={reportInfo}
            starIndex={reportInfo.boardIndex}
        />
    );
}

export default ReportDetail;

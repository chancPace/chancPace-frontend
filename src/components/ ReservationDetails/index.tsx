import { ReservationDetailsStyled } from './styled';
import { Button, Descriptions } from 'antd';
import type { DescriptionsProps, RadioChangeEvent } from 'antd';
import { useState } from 'react';
const borderedItems: DescriptionsProps['items'] = [
    {
        key: '1',
        label: '공간명',
        children: 'test',
    },
    {
        key: '2',
        label: '예약자 이름',
        children: 'test',
    },
    {
        key: '3',
        label: '예약자 연락처',
        children: 'test',
    },
    {
        key: '4',
        label: '예약일',
        children: 'test',
    },
    {
        key: '5',
        label: '예약시간',
        children: 'test',
    },
    {
        key: '6',
        label: '예약인원',
        children: 'test',
    },
    {
        key: '7',
        label: '요청사항',
        children: (
            <>
                test
                <br />
                test
                <br />
                test
                <br />
                test
                <br />
                test
                <br />
                test
                <br />
            </>
        ),
    },
];

const reservationdetails = () => {

    return (
        <ReservationDetailsStyled>
            <p>예약 상세조회</p>
            <br />
            <br />
            <Descriptions bordered items={borderedItems} />
            <br />
            <br />
            <div className="btn-box">
                <Button>승인</Button>
                <Button>취소</Button>
            </div>
        </ReservationDetailsStyled>
    );
};
export default reservationdetails;

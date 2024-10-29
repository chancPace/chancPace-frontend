import { QaStyled } from './styled';
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';
import { useState } from 'react';

const items: CollapseProps['items'] = [
    {
        key: '1',
        label: '문의1',
        children: <p>첫 번째 문의</p>,
    },
    {
        key: '2',
        label: '문의2',
        children: <p>두 번째 문의</p>,
    },
    {
        key: '3',
        label: '문의3',
        children: <p>세 번재 문의</p>,
    },
];

const Qa = () => {
    return (
        <QaStyled>
            <Collapse items={items} />
        </QaStyled>
    );
};
export default Qa;

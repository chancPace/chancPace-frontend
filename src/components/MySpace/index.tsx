// import { getSpaces } from '@/pages/api/spaceApi';
import { Button, Card, List, message } from 'antd';
import { useEffect, useState } from 'react';
import { MySpaceStyled } from './styled';
import { space } from '@/utill/data';
import { FaRegTrashAlt } from 'react-icons/fa';

const MySpace = () => {
    // const [spaces, setSpaces] = useState([]);
    // const fetchSpaces = async () => {
    //     try {
    //         const spacesData = await getSpaces();
    //         setSpaces(spacesData.data);
    //     } catch (error) {
    //         message.error('공간 목록을 불러오는 데 실패했습니다.');
    //     }
    // };

    // useEffect(() => {
    //     fetchSpaces();
    // }, []);
    return (
        <MySpaceStyled>
            <p>공간조회</p>
            <List
                grid={{ gutter: 16, column: 2 }}
                dataSource={space}
                renderItem={(x) => {
                    // console.log(x,'data')
                    return (
                        <List.Item>
                            <Card title={x.spaceName}>
                                <img src={x.spaceImg[0].src}></img>
                                <div className="button-box">
                                    <Button>수정하기</Button>
                                    <div className="trash">
                                        <FaRegTrashAlt />
                                    </div>
                                </div>
                            </Card>
                        </List.Item>
                    );
                }}
            />
        </MySpaceStyled>
    );
};
export default MySpace;

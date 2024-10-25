import { RegistrationStyled } from './styled';
import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Category } from '../../pages/types';
import {
    Form,
    Input,
    Button,
    Select,
    InputNumber,
    Switch,
    Upload,
    UploadFile,
    message,
    TimePicker,
} from 'antd';
import { addNewSpace } from '@/pages/api/spaceApi';
const { TextArea } = Input;
import { Space } from '../../pages/types';
import Cookies from 'js-cookie';
import { getCategories } from '@/pages/api/categoryApi';
import dayjs from 'dayjs';
import { AxiosError } from 'axios';

const Registration = () => {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState<Category[]>([]);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await getCategories();
                setCategories(categoriesData.data);
            } catch (error) {
                message.error('카테고리 목록을 불러오는 데 실패했습니다');
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (values: Space) => {
        const formData = new FormData();

        // 각각의 시작 시간과 종료 시간을 'HH:mm' 형식으로 변환하여 추가
        const businessStartTime = values.businessStartTime
            ? dayjs(values.businessStartTime).format('HH:mm')
            : '';
        const businessEndTime = values.businessEndTime
            ? dayjs(values.businessEndTime).format('HH:mm')
            : '';

        formData.append('businessStartTime', businessStartTime);
        formData.append('businessEndTime', businessEndTime);

        Object.keys(values).forEach((key) => {
            if (key !== 'businessStartTime' && key !== 'businessEndTime') {
                formData.append(key, values[key as keyof Space].toString());
            }
        });

        fileList.forEach((file) => {
            formData.append('image', file.originFileObj as Blob);
        });

        const token = Cookies.get('token');
        if (!token) {
            message.error('로그인이 필요합니다.');
            return;
        }
        formData.append('userInfo', JSON.stringify({ token }));

        try {
            await addNewSpace(formData);
            message.success('공간 등록 성공');
        } catch (error) {
            const axiosError = error as AxiosError;
            // 오류가 발생했을 때 상태 코드에 따라 오류 메시지 설정
            if (axiosError.response && axiosError.response.status) {
                const status = axiosError.response.status;

                if (status === 422) {
                    // 예시: 최소 인원이 1명보다 작은 경우
                    form.setFields([
                        {
                            name: 'minGuests',
                            errors: ['최소 인원은 1명 이상이어야 합니다.'],
                        },
                    ]);
                } else {
                    // 기타 상태 코드 처리
                    message.error('서버 오류가 발생했습니다.');
                }
            } else {
                message.error('서버와 연결할 수 없습니다.');
            }
        }
    };

    return (
        <RegistrationStyled>
            <p>공간정보를 입력해주세요</p>
            <Form
                className="form"
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                onFinish={handleSubmit}
                initialValues={{
                    spaceName: 'test',
                    spaceLocation: 'test',
                    description: 'test',
                    spacePrice: 10000,
                    discount: 1000,
                    amenities: 'test',
                    spaceStatus: 'AVAILABLE',
                    isOpen: true,
                    caution: 'test',
                    minGuests: 1,
                    maxGuests: 1,
                    cleanTime: 30,
                    businessStartTime: '',
                    businessEndTime: '',
                }}
            >
                <Form.Item
                    label="제목"
                    name="spaceName"
                    rules={[
                        {
                            required: true,
                            message: '제목을 입력해주세요.',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="위치"
                    name="spaceLocation"
                    rules={[
                        {
                            required: true,
                            message: '위치를 입력해주세요.',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="공간 소개"
                    name="description"
                    rules={[
                        {
                            required: true,
                            message: '공간 소개를 입력해주세요',
                        },
                    ]}
                >
                    <TextArea rows={4} className="custom-textarea" />
                </Form.Item>
                <Form.Item
                    label="가격"
                    name="spacePrice"
                    rules={[
                        {
                            required: true,
                            message: '가격을 입력해주세요',
                        },
                    ]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item label="할인금액" name="discount">
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="시설 안내"
                    name="amenities"
                    rules={[
                        {
                            required: true,
                            message: '시설 안내를 입력해주세요',
                        },
                    ]}
                >
                    <TextArea
                        rows={2}
                        name="amenities"
                        className="custom-textarea"
                    />
                </Form.Item>
                <Form.Item
                    label="예약시 주의사항"
                    name="caution"
                    rules={[
                        {
                            required: true,
                            message: '주의사항을 입력해주세요',
                        },
                    ]}
                >
                    <TextArea
                        rows={2}
                        name="caution"
                        className="custom-textarea"
                    />
                </Form.Item>
                <Form.Item
                    label="청소시간"
                    name="cleanTime"
                    rules={[
                        {
                            required: true,
                            message: '청소 시간을 입력해주세요',
                        },
                    ]}
                >
                    <Select>
                        <Select.Option value="30">30</Select.Option>
                        <Select.Option value="60">60</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="공개여부"
                    valuePropName="checked"
                    name="isOpen"
                >
                    <Switch />
                </Form.Item>
                <Form.Item
                    label="최소 인원"
                    name="minGuests"
                    rules={[
                        {
                            required: true,
                            message: '인원수를 입력해주세요',
                        },
                    ]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="최대 인원"
                    name="maxGuests"
                    rules={[
                        {
                            required: true,
                            message: '최대 인원을 입력해주세요.',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const minGuests = getFieldValue('minGuests');
                                if (
                                    minGuests === undefined ||
                                    value >= minGuests
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error(
                                        '최대 인원은 최소 인원보다 크거나 같아야 합니다.'
                                    )
                                );
                            },
                        }),
                    ]}
                >
                    <InputNumber />
                </Form.Item>

                {/* 시작 시간 */}
                <Form.Item
                    label="영업 시작 시간"
                    name="businessStartTime"
                    rules={[
                        {
                            required: true,
                            message: '영업시간을 선택해주세요',
                        },
                    ]}
                >
                    <TimePicker use12Hours format="HH:mm" />
                </Form.Item>

                {/* 종료 시간 */}
                <Form.Item
                    label="영업 종료 시간"
                    name="businessEndTime"
                    rules={[
                        {
                            required: true,
                            message: '영업 종료 시간을 선택해주세요.',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const startTime =
                                    getFieldValue('businessStartTime');
                                if (
                                    !startTime ||
                                    !value ||
                                    value.isAfter(startTime)
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error(
                                        '종료 시간은 시작 시간보다 이후여야 합니다.'
                                    )
                                );
                            },
                        }),
                    ]}
                >
                    <TimePicker use12Hours format="HH:mm" />
                </Form.Item>

                <Form.Item label="공간 상태" name="spaceStatus">
                    <Select>
                        <Select.Option value="AVAILABLE">
                            사용 가능
                        </Select.Option>
                        <Select.Option value="UNAVAILABLE">
                            사용 불가
                        </Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Upload"
                    valuePropName="fileList"
                    rules={[
                        {
                            required: true,
                            message: '이미지를 업로드해주세요',
                        },
                    ]}
                >
                    <Upload
                        action="/uploads"
                        listType="picture-card"
                        fileList={fileList}
                        onChange={({ fileList }) => setFileList(fileList)}
                        beforeUpload={(file) => {
                            const isImage = file.type.startsWith('image/');
                            if (!isImage) {
                                message.error(
                                    '이미지 파일만 업로드 가능합니다.'
                                );
                                return Upload.LIST_IGNORE;
                            }
                            return isImage;
                        }}
                        showUploadList={{
                            showPreviewIcon: false,
                            showRemoveIcon: true,
                        }}
                        itemRender={(originNode, file) => {
                            return React.cloneElement(originNode, {
                                title: null,
                            });
                        }}
                    >
                        {fileList.length >= 8 ? null : (
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        )}
                    </Upload>
                </Form.Item>
                <Form.Item className='btn-box'>
                    <Button type="primary" htmlType="submit" className="btn">
                        등록하기
                    </Button>
                </Form.Item>
            </Form>
        </RegistrationStyled>
    );
};

export default Registration;

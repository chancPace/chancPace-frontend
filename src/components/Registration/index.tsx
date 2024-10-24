import { RegistrationStyled } from './styled';
import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Category } from '../../pages/types';
import {
    Form,
    Input,
    Button,
    Select,
    DatePicker,
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

const Registration = () => {
    //폼 인스턴스 생성: 폼의 초기값 설정, 제출 후 초기화 기능을 위해
    const [form] = Form.useForm();
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState<Space>({
        spaceName: 'test',
        spaceLocation: 'test',
        description: 'test',
        spacePrice: 10000,
        discount: 1000,
        amenities: 'test',
        spaceStatus: 'AVAILABLE',
        isOpen: true,
        caution: 'test',
        category: 'test',
        minGuests: 1,
        maxGuests: 1,
        spaceImg: [],
        cleanTime: 30,
        businessStartTime: '',
        businessEndTime: '',
    });

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

    const handleCategoryChange = (value: any) => {
        setFormData({
            ...formData,
            category: value,
        });
    };

    const handleBusinessHoursChange = (
        time: any,
        timeString: [string, string]
    ) => {
        setFormData({
            ...formData,
            businessStartTime: timeString[0],
            businessEndTime: timeString[1],
        });
    };

    const handleChange = ({ fileList }: { fileList: UploadFile[] }) => {
        setFileList(fileList);
    };

    //폼 필드 변경 처리 함수
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleNumberChange = (value: number | null, name: keyof Space) => {
        setFormData({
            ...formData,
            [name]: value ?? 0, 
        });
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData({
            ...formData,
            isOpen: checked,
        });
    };


    //FormData로 서버로 데이터 보내기
    const handleSubmit = async () => {
        const form = new FormData();

        Object.keys(formData).forEach((key) => {
            const value = formData[key as keyof Space];
            if (key === 'spaceImg') {
                (value as { src: string }[]).forEach((img, index) => {
                    form.append(`spaceImg[${index}]`, img.src);
                });
            } else {
                form.append(key, String(value));
            }
        });

        fileList.forEach((file) => {
            form.append('image', file.originFileObj as Blob);
        });
        const token = Cookies.get('token');
        if (!token) {
            message.error('로그인이 필요합니다.');
            return;
        }
        form.append(
            'userInfo',
            JSON.stringify({ token: Cookies.get('token') })
        );

        try {
            await addNewSpace(form);
            message.success('공간 등록 성공');
        } catch (error) {
            message.error('공간등록 실패');
        }
    };

    return (
        <RegistrationStyled>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                onFinish={handleSubmit}
            >
                <Form.Item label="제목">
                    <Input
                        name="spaceName"
                        value={formData.spaceName}
                        onChange={handleInputChange}
                    />
                </Form.Item>
                <Form.Item label="위치">
                    <Input
                        name="spaceLocation"
                        value={formData.spaceLocation}
                        onChange={handleInputChange}
                    />
                </Form.Item>
                <Form.Item label="공간 소개">
                    <TextArea
                        rows={4}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="custom-textarea"
                    />
                </Form.Item>
                <Form.Item label="카테고리">
                    <Select
                        value={formData.category}
                        onChange={handleCategoryChange}
                        placeholder="카테고리를 선택해주세요"
                    >
                        {categories.map((category) => (
                            <Select.Option
                                key={category.id}
                                value={category.categoryName}
                            >
                                {category.categoryName}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="가격">
                    <InputNumber
                        value={formData.spacePrice}
                        onChange={(value) =>
                            handleNumberChange(value, 'spacePrice')
                        }
                    />
                </Form.Item>

                <Form.Item label="할인금액">
                    <InputNumber
                        value={formData.discount}
                        onChange={(value) =>
                            handleNumberChange(value, 'discount')
                        }
                    />
                </Form.Item>
                <Form.Item label="시설 안내">
                    <TextArea
                        rows={2}
                        name="amenities"
                        value={formData.amenities}
                        onChange={handleInputChange}
                        className="custom-textarea"
                    />
                </Form.Item>
                <Form.Item label="예약시 주의사항">
                    <TextArea
                        rows={2}
                        name="caution"
                        value={formData.caution}
                        onChange={handleInputChange}
                    />
                </Form.Item>
                <Form.Item label="청소시간">
                    <Select
                        value={formData.cleanTime}
                        onChange={(value) =>
                            handleNumberChange(value, 'cleanTime')
                        }
                    >
                        <Select.Option value="30">30</Select.Option>
                        <Select.Option value="60">60</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="공개여부" valuePropName="checked">
                    <Switch
                        onChange={handleSwitchChange}
                        checked={formData.isOpen}
                    />
                </Form.Item>
                <Form.Item label="최소 인원">
                    <InputNumber
                        value={formData.minGuests}
                        onChange={(value) =>
                            handleNumberChange(value, 'minGuests')
                        }
                    />
                </Form.Item>
                <Form.Item label="최대 인원">
                    <InputNumber
                        value={formData.maxGuests}
                        onChange={(value) =>
                            handleNumberChange(value, 'maxGuests')
                        }
                    />
                </Form.Item>
                <Form.Item label="영업시간">
                    <TimePicker.RangePicker
                        use12Hours
                        format="HH"
                        value={
                            formData.businessStartTime &&
                            formData.businessEndTime
                                ? [
                                      dayjs(
                                          formData.businessStartTime,
                                          'HH:mm'
                                      ),
                                      dayjs(formData.businessEndTime, 'HH:mm'),
                                  ]
                                : null
                        }
                        onChange={handleBusinessHoursChange}
                    />
                </Form.Item>
                <Form.Item label="Upload" valuePropName="fileList">
                    <Upload
                        action="/uploads"
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleChange}
                        beforeUpload={(file) => {
                            const isImage = file.type.startsWith('image/');
                            if (!isImage) {
                                message.error(
                                    '이미지 파일만 업로드 가능합니다.'
                                );
                            }
                            return isImage;
                        }}
                        showUploadList={{
                            showPreviewIcon: false, // 미리보기 아이콘 완전히 비활성화
                            showRemoveIcon: true, // 삭제 아이콘만 활성화
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
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        등록하기
                    </Button>
                </Form.Item>
            </Form>
        </RegistrationStyled>
    );
};
export default Registration;

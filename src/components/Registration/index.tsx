import { RegistrationStyled } from './styled';
import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Category } from '../../types';
import { Form, Input, Button, Select, InputNumber, Switch, Upload, UploadFile, message } from 'antd';
import { addNewSpace, getOneSpace, updateSpace } from '@/pages/api/spaceApi';
const { TextArea } = Input;
import { getCategories } from '@/pages/api/categoryApi';
import { useRouter } from 'next/router';

const Registration = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { spaceId } = router.query;
  const [categories, setCategories] = useState<Category[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [startHour, setStartHour] = useState<number | null>(null);

  const isEditMode = !!spaceId;

  //00부터 24까지의 시간 생성(영업시간)
  const timeOption = Array.from({ length: 25 }, (_, i) => ({
    label: i.toString().padStart(2, '0') + ':00',
    value: i,
  }));

  //카테고리 목록 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData.data);
      } catch (error) {
        message.error('카테고리 목록을 불러오는 데 실패했습니다.');
      }
    };
    fetchCategories();
  }, []);

  //select -> option 카테고리 대분류,소분류 분류하여 나타내기
  const categoryOptions = categories
    .filter((category) => category.pId === null)
    .map((parentCategory) => ({
      label: `--- ${parentCategory.categoryName} ---`, // 대분류 이름
      options: categories
        .filter((subCategory) => Number(subCategory.pId) === parentCategory.id)
        .map((subCategory) => ({
          label: subCategory.categoryName, // 소분류 이름
          value: subCategory.id,
        })),
    }));

  //데이터 전송
  const handleSubmit = async (values: any) => {
    const formData = new FormData();

    // 일반 데이터 추가
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    // 파일 데이터 추가
    fileList.forEach((file) => {
      formData.append('image', file.originFileObj as Blob);
    });

    if (isEditMode) {
      formData.append('spaceId', spaceId as string);
    }

    try {
      if (isEditMode) {
        formData.append('spaceId', String(spaceId));
        await updateSpace(formData, String(spaceId));
        message.success('공간 수정 성공');
      } else {
        await addNewSpace(formData);
        message.success('공간 등록 성공');
      }
      form.resetFields();
      setFileList([]);
      router.push('/myspace');
    } catch (error) {
      message.error(isEditMode ? '공간 수정 실패' : '공간 등록 실패');
    }
  };

  //수정 해당 공간의 데이터 불러오기
  useEffect(() => {
    // 수정할 공간의 데이터 불러오기
    const fetchSpaceData = async () => {
      if (spaceId) {
        try {
          const id = Array.isArray(spaceId) ? spaceId[0] : spaceId; // spaceId가 배열일 경우 첫 번째 요소를 사용
          const response = await getOneSpace(id);
          const spaceData = response.data;
          form.setFieldsValue({
            ...form.getFieldsValue(), // 기존 폼의 값들
            ...spaceData, // 서버에서 가져온 데이터로 덮어쓰기
          });
        } catch (error) {
          message.error('공간 정보를 불러오는 데 실패했습니다.');
        }
      }
    };
    fetchSpaceData();
  }, [spaceId, form]);

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
          spaceName: '공간 타이틀',
          spaceLocation: '서울시 마포구',
          description: '설명입니다',
          spacePrice: 30000,
          discount: 2000,
          amenities: '편의시설입니다',
          spaceStatus: 'AVAILABLE',
          isOpen: true,
          guidelines: '주의사항입니다',
          minGuests: 1,
          maxGuests: 3,
          cleanTime: 0,
          businessStartTime: '',
          businessEndTime: '',
          categoryId: '',
          addPrice: 2000,
          spaceAdminName: '호스트이름',
          spaceAdminPhoneNumber: '010-0000-0000',
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
        <Form.Item label="카테고리" name="categoryId" rules={[{ required: true, message: '카테고리를 선택해주세요' }]}>
          <Select placeholder="카테고리를 선택해주세요" options={categoryOptions} />
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
        <Form.Item label="인당 추가요금" name="addPrice">
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
          <TextArea rows={2} name="amenities" className="custom-textarea" />
        </Form.Item>
        <Form.Item
          label="예약시 주의사항"
          name="guidelines"
          rules={[
            {
              required: true,
              message: '주의사항을 입력해주세요',
            },
          ]}
        >
          <TextArea rows={2} name="caution" className="custom-textarea" />
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
            <Select.Option value="1">1</Select.Option>
            <Select.Option value="2">2</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="공개여부" valuePropName="checked" name="isOpen">
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
                if (minGuests === undefined || value >= minGuests) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('최대 인원은 최소 인원보다 크거나 같아야 합니다.'));
              },
            }),
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="영업 시작 시간"
          name="businessStartTime"
          rules={[{ required: true, message: '영업 시작 시간을 선택해주세요' }]}
        >
          <Select
            options={timeOption}
            placeholder="시작 시간을 선택하세요"
            onChange={(value) => {
              setStartHour(value); // 선택된 시작 시간 상태로 저장
              form.setFieldsValue({ businessEndTime: null }); // 종료 시간 초기화
            }}
          />
        </Form.Item>
        <Form.Item
          label="영업 종료 시간"
          name="businessEndTime"
          rules={[
            { required: true, message: '영업 종료 시간을 선택해주세요' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const startValue = getFieldValue('businessStartTime');
                if (value !== null && startValue !== null && value > startValue) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('종료 시간은 시작 시간보다 이후여야 합니다.'));
              },
            }),
          ]}
        >
          <Select
            options={timeOption.filter((opt) => opt.value > (startHour ?? -1))}
            placeholder="종료 시간을 선택하세요"
            disabled={startHour === null} // 시작 시간이 선택되지 않았을 때 비활성화
          />
        </Form.Item>

        <Form.Item label="공간 상태" name="spaceStatus">
          <Select>
            <Select.Option value="AVAILABLE">사용 가능</Select.Option>
            <Select.Option value="UNAVAILABLE">사용 불가</Select.Option>
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
                message.error('이미지 파일만 업로드 가능합니다.');
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
        <Form.Item
          label="호스트이름"
          name="spaceAdminName"
          rules={[
            {
              required: true,
              message: '호스트 이름을 입력해주세요',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="호스트 전화번호"
          name="spaceAdminPhoneNumber"
          rules={[
            {
              required: true,
              message: '전화번호를 입력해주세요(-포함)',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item className="btn-box">
          <Button type="primary" htmlType="submit">
            {isEditMode ? '수정하기' : '등록하기'} {/* 버튼 텍스트 변경 */}
          </Button>
        </Form.Item>
      </Form>
    </RegistrationStyled>
  );
};

export default Registration;

import { ReviewStyled } from './styled';
import { Avatar, List, message, Modal, Rate } from 'antd';
import { useEffect, useState } from 'react';
import { getMySpace } from '@/pages/api/spaceApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/utill/redux/store';
import { SpaceType } from '@/types';
import { updateReview } from '@/pages/api/reviewApi';
const { confirm } = Modal;

const Review = () => {
  const userId = useSelector((state: RootState) => state.user.id); // 리덕스에서 userId 가져옴
  const [reviews, setReviews] = useState<SpaceType[]>([]); // 리뷰 데이터를 저장할 상태
  console.log(reviews, '필터데이터터터');
  useEffect(() => {
    const fetchReview = async () => {
      if (userId) {
        try {
          const response = await getMySpace(userId);
          const filteredData = response.data
            .map((space: SpaceType) => ({
              ...space,
              Reviews: space.Reviews?.filter(
                (review) => review.reviewStatus === 'AVAILABLE'
              ),
            }))
            .filter(
              (space: SpaceType) => space.Reviews && space.Reviews.length > 0
            ); // Reviews의 갯수가 0 이상인 것만 남김

          setReviews(filteredData);
        } catch (error) {
          console.error('리뷰 불러오기 실패', error);
        }
      }
    };
    fetchReview();
  }, [userId]);

  const handleDeleteClick = async (reviewId: number) => {
    const reviewData = {
      reviewComment: '',
      reviewRating: null,
      reviewStatus: 'UNAVAILABLE',
    };
    try {
      const result = await updateReview(reviewId, reviewData);
      if (result) {
        message.success('리뷰가 성공적으로 삭제되었습니다.');
      }
    } catch (error) {
      message.error('리뷰 삭제에 실패했습니다.');
    }
  };

  const showDeleteConfirm = (reviewId: number) => {
    confirm({
      title: '리뷰를 삭제하시겠습니까?',
      content: '한 번 삭제된 리뷰는 되돌릴 수 없습니다.',
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk() {
        handleDeleteClick(reviewId); // 확인 버튼 클릭 시 삭제 로직 실행
      },
      onCancel() {
        console.log('삭제 취소');
      },
    });
  };

  return (
    <ReviewStyled>
      {reviews.map((space) => (
        <div className="review-list" key={space.id}>
          <div className="top">
            <p>{space.spaceName}</p>
          </div>
          {space.Reviews?.map((review) => (
            <div key={review.id}>
              <div className="rating">
                <Rate disabled defaultValue={review.reviewRating} />
              </div>
              <div className="bottom">
                <p>
                  작성자: {review.User ? review.User.userName : '알 수 없음'}
                </p>
                <p>리뷰: {review.reviewComment}</p>
                <p>
                  작성일자: {new Date(review.updatedAt).toLocaleDateString()}
                </p>
                <p
                  className="delete"
                  onClick={() => showDeleteConfirm(review.id)}
                >
                  삭제하기
                </p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </ReviewStyled>
  );
};
export default Review;

import { ReviewStyled } from './styled';
import { Avatar, List } from 'antd';
import img1 from '../../assets/image/s1-1.jpg';

const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];

const Review = () => {
  return (
    <ReviewStyled>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                />
              }
              title={item.title}
              description={
                <div>
                  <p>후기내용</p>
                  <div className="review-img-box">
                    <img src={img1.src}></img>
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </ReviewStyled>
  );
};
export default Review;

import { Menu, MenuProps } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '@/utill/redux/store';

export const createSidebarMenus = (
  menus: MenuProps['items']
): MenuProps['items'] => {
  if (!menus) return menus;

  return menus.map((menu) => {
    if (!menu || !('label' in menu)) return menu;
    if ('children' in menu) {
      return {
        ...menu,
        children: createSidebarMenus(menu.children) || [],
      };
    }

    return {
      ...menu,
      label: <Link href={menu.key as string}>{menu.label}</Link>,
    };
  });
};

const SideBar = () => {
  const router = useRouter();
  const role = useSelector((state: RootState) => state.user.role); // role을 가져옴

  const sidebarMenus = createSidebarMenus([
    {
      key: '/',
      label: `대쉬보드`,
    },
    {
      key: '/space',
      label: '공간 관리',
      children: [
        {
          key: '/registration',
          label: '공간 등록',
        },
        {
          key: '/myspace',
          label: '공간 조회',
        },
      ],
    },
    {
      key: '/reservation',
      label: '예약조회',
    },
    {
      key: '/qa',
      label: '문의',
    },
    {
      key: '/review',
      label: '리뷰조회',
    },
    {
      key: '/sales',
      label: '매출조회',
    },
  ]);

  return (
    <Menu
      mode="inline"
      items={sidebarMenus}
      selectedKeys={[router.pathname]}
      defaultOpenKeys={router.pathname.split('/').slice(1, -1)}
      style={{ height: '100%', borderRight: 0 }}
    />
  );
};

export default SideBar;

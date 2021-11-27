import React from 'react';

export const users = {
  mockDb: [
    {
      user_id: 1,
      username: 'chuanxin',
      real_name: 'Lee Chuan Xin',
      organisation_id: 1,
      role: 'worker',
      type: 'shiftA',
      wage: 1000,
    },
    {
      user_id: 2,
      real_name: 'Wong Shen Nan',
      username: 'shennan',
      organisation_id: 1,
      role: 'worker',
      type: 'shiftA',
      wage: 1000,
    },
    {
      user_id: 3,
      real_name: 'Chiew Jia En',
      username: 'jiaen',
      organisation_id: 1,
      role: 'worker',
      type: 'shiftA',
      wage: 1000,
    },
    {
      user_id: 4,
      real_name: 'Justin Wong',
      username: 'justinwong',
      organisation_id: 1,
      role: 'worker',
      type: 'shiftA',
      wage: 1000,
    },
    {
      user_id: 5,
      real_name: 'Akira Wong',
      username: 'akirawong',
      organisation_id: 1,
      role: 'worker',
      type: 'shiftA',
      wage: 1000,
    },
    {
      user_id: 6,
      real_name: 'Kai',
      username: 'kai',
      organisation_id: 1,
      role: 'admin',
      type: 'shiftA',
      wage: 1000,
    },
  ],
  empty: [],
};
export const UsersContext = React.createContext(users.mockDb);

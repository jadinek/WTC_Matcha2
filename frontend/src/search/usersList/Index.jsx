import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { accountService, alertService } from '@/_services';

// https://www.smashingmagazine.com/2020/03/sortable-tables-react/
// const useSortableData = (items, config = null) => {
//   const [sortConfig, setSortConfig] = useState(config);

//   const sortedItems = useMemo(() => {
//     let sortableItems = [...items];
//     if (sortConfig !== null) {
//       sortableItems.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key]) {
//           return sortConfig.direction === 'ascending' ? -1 : 1;
//         }
//         if (a[sortConfig.key] > b[sortConfig.key]) {
//           return sortConfig.direction === 'ascending' ? 1 : -1;
//         }
//         return 0;
//       });
//     }
//     return sortableItems;
//   }, [items, sortConfig]);

//   const requestSort = (key) => {
//     let direction = 'ascending';
//     if (
//       sortConfig &&
//       sortConfig.key === key &&
//       sortConfig.direction === 'ascending'
//     ) {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
//   };

//   return { items: sortedItems, requestSort };
// };

function UsersList({ match }) {
  const { path } = match;
  //backend data
  const [users, setUsers] = useState(null);

  //sorting
  // const [items, requestSort] = useSortableData(null);
  const [sortedField, setSortedField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  useEffect(() => {
    accountService
      .getAll()
      .then((data) => {
        let compiledData = data.map((obj) => {
          let newObj = {};
          newObj['id'] = obj.id;
          newObj['firstName'] = obj.firstName;
          newObj['lastName'] = obj.lastName;
          newObj['location'] = obj.location;
          newObj['fame'] = obj.fame;
          newObj['age'] = obj.age;
          newObj['smoking'] = obj.smoking;
          newObj['drinking'] = obj.drinking;
          newObj['religion'] = obj.religion;
          newObj['pets'] = obj.pets;
          newObj['children'] = obj.children;

          return newObj;
        });
        setUsers(compiledData);
      })
      .catch((error) => {
        alertService.error(error);
      });
  }, []);
  //numArray.sort((a, b) => a - b)
  //homes.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

  function requestSort(key) {
    let sortedUsers = users;

    sortedUsers.sort((a, b) => {
      if (a[key] < b[key]) {
        return -1;
      }
      if (a[key] > b[key]) {
        return 1;
      }
      return 0;
    });
    setUsers(sortedUsers);
    setSortedField(key);
  }

  return (
    <div>
      <h1>Search</h1>
      <p>Sexy Singles in Your AREA!</p>
      <table className='table table-striped table-condensed table-responsive'>
        <thead>
          <tr>
            <th style={{ width: '10%' }}>
              <button type='button' onClick={() => requestSort('firstName')}>
                Name
              </button>
            </th>
            <th style={{ width: '10%' }}>
              <button type='button' onClick={() => requestSort('location')}>
                Location
              </button>
            </th>
            <th style={{ width: '10%' }}>
              <button type='button' onClick={() => requestSort('fame')}>
                Fame
              </button>
            </th>
            <th style={{ width: '10%' }}>
              <button type='button' onClick={() => requestSort('age')}>
                Age
              </button>
            </th>
            <th style={{ width: '10%' }}>
              <button type='button' onClick={() => requestSort('smoking')}>
                Smoking
              </button>
            </th>
            <th style={{ width: '10%' }}>
              <button type='button' onClick={() => requestSort('drinking')}>
                Drinking
              </button>
            </th>
            <th style={{ width: '10%' }}>
              <button type='button' onClick={() => requestSort('religion')}>
                Religion
              </button>
            </th>
            <th style={{ width: '10%' }}>
              <button type='button' onClick={() => requestSort('pets')}>
                Pets
              </button>
            </th>
            <th style={{ width: '10%' }}>
              <button type='button' onClick={() => requestSort('children')}>
                Children
              </button>
            </th>
            <th style={{ width: 'auto' }}></th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.location}</td>
                <td>{user.fame}</td>
                <td>{user.age}</td>
                <td>{user.smoking}</td>
                <td>{user.drinking}</td>
                <td>{user.religion}</td>
                <td>{user.pets}</td>
                <td>{user.children}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <Link
                    to={`${path}/view/${user.id}`}
                    className='btn btn-sm btn-primary mr-1'
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          {!users && (
            <tr>
              <td colSpan='4' className='text-center'>
                <span className='spinner-border spinner-border-lg align-center'></span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export { UsersList };

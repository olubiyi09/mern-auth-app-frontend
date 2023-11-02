import React, { useEffect, useState } from 'react'
import "./UserList.scss"
import PageMenu from '../../components/pageMenu/PageMenu'
import UserStats from '../../components/userStats/UserStats'
import { FaTrashAlt } from 'react-icons/fa'
import Search from '../../components/search/Search'
import ChangeRole from '../../components/changeRole/ChangeRole'
import useRedirectLoggedOutUser from '../../customHook/useRedirectLoggedOutUser'
import { useDispatch, useSelector } from 'react-redux'
import { deleteUser, getUsers } from '../../redux/features/auth/authSlice'
import { shortenText } from '../profile/Profile'
import { SpinnerImg } from '../../components/loader/Loader'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { FILTER_USERS, selectUser } from '../../redux/features/auth/filterSlice'
import ReactPaginate from 'react-paginate';

const UserList = () => {
    useRedirectLoggedOutUser("/login")
    const dispatch = useDispatch();
    const [search, setSearch] = useState("")

    const { users, isLoading, isLoggedIn, isSuccess, message } = useSelector((state) => state.auth)
    const filteredUsers = useSelector(selectUser)
    useEffect(() => {
        dispatch(getUsers())
    }, [dispatch])

    const removeUser = async (id) => {
        await dispatch(deleteUser(id))
        dispatch(getUsers())
    }

    const confirmDelete = (id) => {
        confirmAlert({
            title: 'Delete This User',
            message: 'Are you sure you want to delete this user.',
            buttons: [
                {
                    label: 'Delete',
                    onClick: () => removeUser(id)
                },
                {
                    label: 'Cancel',
                    // onClick: () => alert('Click No')
                }
            ]
        });
    };

    useEffect(() => {
        dispatch(FILTER_USERS({ users, search }))
    }, [dispatch, users, search])

    //   Begin Pagination
    const itemsPerPage = 3;
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);

    useEffect(() => {
        const endOffset = itemOffset + itemsPerPage;

        setCurrentItems(filteredUsers.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(filteredUsers.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, filteredUsers]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % filteredUsers.length;
        setItemOffset(newOffset);
    };
    //   End Pagination




    return (
        <section>
            <div className="container">
                <PageMenu />
                <UserStats />

                <div className="user-list">

                    {isLoading && <SpinnerImg />}
                    <div className="table">
                        <div className="--flex-between">
                            <span>
                                <h3>All Users</h3>
                            </span>
                            <span>
                                <Search value={search} onChange={(e) => setSearch(e.target.value)} />
                            </span>
                        </div>

                        {/* Table */}
                        {!isLoading && users.length === 0 ? (<p>No user Found</p>) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>s/n</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>ChangeRole</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {currentItems.map((user, index) => {
                                        const { _id, name, email, role } = user

                                        return (
                                            <tr key={_id}>
                                                <td>{index + 1}</td>
                                                <td>{shortenText(name, 12)}</td>
                                                <td>{email}</td>
                                                <td>{role}</td>
                                                <td><ChangeRole id={_id} email={email} /></td>
                                                <td>
                                                    <span style={{ cursor: 'pointer' }}>
                                                        <FaTrashAlt size={20} color='red' onClick={() => confirmDelete(_id)} />
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })}

                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="paginate-wrapper">

                        <ReactPaginate
                            breakLabel="..."
                            nextLabel="Next"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={6}
                            pageCount={pageCount}
                            previousLabel="Prev"
                            renderOnZeroPageCount={null}
                            containerClassName="pagination"
                            pageLinkClassName="page-num"
                            previousLinkClassName="page-num"
                            nextLinkClassName="page-num"
                            activeLinkClassName="activePage"
                        />
                    </div>
                </div>

            </div>
        </section>
    )
}

export default UserList
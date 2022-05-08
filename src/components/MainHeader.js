import axios from 'axios'
import { useEffect, useState } from 'react'
import { Nav, NavDropdown, Container } from 'react-bootstrap'
import Navbar from 'react-bootstrap/Navbar'
import {signOut} from "firebase/auth";
import {auth} from '../firebase'

const MainHeader = ({user: curUser}) => {

    const handleLogOut= () => {
        signOut(auth).catch((error)=>{
            console.log(error);
        })
    }

    const getClasses = async(userId) => {
        try{
            const userResponse = await axios.get(`http://localhost:5001/common-trust/us-central1/default/user/${userId}`);
            console.log(userResponse);
            if(userResponse.data.data.classes !== classesList) {
                setClassesList(userResponse.data.data.classes);
            }
        } catch(err){   console.log(err);}    
    }

    const getClassesName = async() => {
        setClassesNameList([]);
        classesList.map(async (classId) => {
            try{
                const nameResponse = await axios.get(`http://localhost:5001/common-trust/us-central1/default/class/${classId}`);
                setClassesNameList((prevName)=> [...prevName, {id: classId, name : nameResponse.data.data.courseFullTitle}]);
            } catch(err){
                console.log(err);
            }
        })  
    }

    const [user, setUser] = useState(null);
    const [classesList, setClassesList] = useState([]);
    const [classesNameList, setClassesNameList] = useState([]);

    useEffect(() => {
        setUser(curUser.user);
        if(curUser.user !== null)
        {
            getClasses(curUser.user.uid).catch(err => console.log(err));
        }
    }, [curUser.user])

    useEffect(() => {
        getClassesName().catch(err => console.log(err));
    }, [classesList])

    useEffect(() => {
        if(user !== null)
        {
            console.log(user)
            const classSnapshot = getClasses(user.id);
            if(classSnapshot !== classesList)
            {
                setClassesList(classSnapshot);
            }
        }
    } , [])


    return (
        <>
            <Navbar bg="dark" variant="dark" sticky="top" expand="lg">
                <Container>
                <Navbar.Brand href="/">
                    Common Trust
                </Navbar.Brand>
                    <Navbar.Collapse>
                        <Nav className="me-auto">
                            <NavDropdown title="Classes">
                                {classesNameList.map(classObj => {
                                    return (
                                        <NavDropdown.Item key={classObj.id} href={`/class/${classObj.id}`}>{classObj.name}</NavDropdown.Item>
                                    )
                                })}
                            </NavDropdown>
                        </Nav>
                        <Nav>
                            <Nav.Link href="/user">User Details</Nav.Link>
                            <Nav.Link onClick={handleLogOut}>Log Out</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default MainHeader;
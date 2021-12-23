import React from "react";
import Moment from 'react-moment';
import { Link } from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { confirm } from "react-confirm-box";
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useEffect , useState } from "react";
import UpdateProduct from "./UpdateProduct";



function ProductList() {
  let [list, setList]= useState(null);

  useEffect(() => {
    getList();
    
  },[]);

  const getList= ()=>{
    axios.get('http://localhost:8000/api/admin/productlist')
      .then(res => {
        if(res.data){
          console.log(res.data)
          setList(list=res.data)
          console.log(list);
        }
      })
      .catch(err => console.log(err))
    
  }
  const delCal = (id)=>{
    list.map((element,index)=>{
      if(element._id===id){
        list.splice(index,1)
      }
    })
    console.log(list)
  }
  // useEffect(()=>{
  //   if(list)
  //   {
  //     console.log(list)
  //     list.forEach((listItem) => {
  //       rows.push(<TableRow listItem={listItem}/>)
  //       console.log(listItem)
  //       console.log(rows)
  //     });
  //   }
  // },[list])
  
  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="card-plain table-plain-bg">
              <Card.Header className="d-flex justify-content-between">
                <Card.Title as="h4">Products</Card.Title>
                <Link to="addproduct"><Button>Add Product</Button></Link>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover">
                  <thead>
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">Image</th>
                      <th className="border-0">Name</th>
                      <th className="border-0">Description</th>
                      <th className="border-0">Created At</th>
                      <th className="border-0">Status</th>
                      <th className="border-0">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list && list.reverse().map((listitem,index)=>{
                    return <TableRow key ={index} listItem={listitem} delCat={delCal}/>;
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

const TableRow=(props)=>{
  let history= useHistory();

  // useEffect(() => {
    
  // },[props.listItem]);
  
  const handleClick=()=>{
    console.log('hello from onclick handler');
    return(
      <UpdateProduct/>
    )
  }
  const handleDelete=async()=>{
    const result = await confirm("Are you sure?");
   if (result) {
    props.delCat(props.listItem._id)
    axios.delete(`http://localhost:8000/api/admin/productlist/${props.listItem._id}`)
        .then(() => {
          alert('deletion successful!')
        })
        .catch(err => console.log(err))
    
    
  history.push('/admin/productlist');
  return;
  }
   console.log("You click No!");
    
  }
  const date= props.listItem.updated_on;
  return(
    <>
      <tr>
        <td></td>
        <td>{props.listItem.img && <img src={`http://localhost:8000/${props.listItem.img}`} style={{width:"100px"}} alt="" />}</td>
        <td>{props.listItem.name}</td>
        <td dangerouslySetInnerHTML={{__html: props.listItem.description}}/>
        <td>
          <Moment format="DD MM YYYY">
            {date}
          </Moment>
        </td>
        <td>{props.listItem.status ? 'On':'Off'}</td>
        <td>
          <Link to= {`/admin/updateproduct/${props.listItem._id}`}>  <Button onClick={()=>handleClick()}>Edit </Button></Link>
          <Button onClick={()=>handleDelete()}>Delete </Button>
        </td>
      </tr>
    </>
  )
};


export default ProductList;

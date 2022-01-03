import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Switch from "../components/Switch/Switch";
import axios from 'axios';
import Select from 'react-select'
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Form,
  Navbar,
  Nav,
  Container,
  Row,
  Col,
} from "react-bootstrap";


function AddProduct() {
    let [status, setStatus] = useState(true);
    let [sendFile,setSendFile] = useState(null);
    let [previewImg, setPreviewImg]= useState(null);
    let [name, setName]= useState("")
    let [description,setDescription] = useState("")
    let [price,setPrice] = useState("")
    let [selectOptions,setOptions]= useState([])
    let [catName, setCatname] = useState('')
    let [catId, setCatid]= useState('')
     
    useEffect(() => {
      getOptions();
    }, [])

    let history= useHistory();
    const onChangeHandler = event => {
      setSendFile(event.target.files[0])
      setPreviewImg(URL.createObjectURL(event.target.files[0]))
    }
    const onChangeNameHandler = event => {
      setName(event.target.value)
    }
    const onChangePriceHandler = event => {
      setPrice(event.target.value)
    }
    const onChangeSelectHandler = event =>{
      setCatname(catName=event.label)
      setCatid(catId=event.value)
    }
    const onClickHandler = (e) => {     
        e.preventDefault()
        const formdata= new FormData();
        formdata.append('name', name);
        formdata.append('description', description);
        formdata.append('img', sendFile);
        formdata.append('status', status);
        formdata.append('price', price);
        formdata.append('catName', catName);
        formdata.append('catId', catId);

        console.log(formdata)
        axios({
          method: 'post',
          url: 'http://localhost:8000/api/admin/addproduct',
          data: formdata
        })      
        .then(res => { // then print response status
         console.log(res.statusText)
        })
        .catch(err => console.log("Try to tell the error name "+err) )
    
    history.push('/admin/productlist')
    }
    const getOptions=async()=>{
      const res = await axios.get('http://localhost:8000/api/admin/categorylist')
      const catList = res.data
      const options = catList.map(cat=>({
        "value": cat._id,
        "label": cat.name
      }))
      setOptions(options)
      console.log(options)
    }

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="8">
            <Card>
              <Card.Header>
                <Card.Title as="h4" className="text-center">Add Product</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form >
                  <Row>
                    <Col  md={{ span: 7, offset: 2 }} >
                      <Form.Group>
                        <label>Name <span>*</span></label>
                        <Form.Control
                          defaultValue=""
                          placeholder="Product Title"
                          name = 'name'
                          type="text"
                          onChange={(e) => onChangeNameHandler(e) }
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={{ span: 7, offset: 2 }}>
                      <Form.Group>
                        <label>Description</label>
                        <CKEditor
                            editor={ ClassicEditor }
                            // data="<p>Hello from CKEditor 5!</p>"
                            onReady={ editor => {
                                // You can store the "editor" and use when it is needed.
                                console.log( 'Editor is ready to use!', editor );
                            } }
                            onChange={ ( event, editor ) => {
                                const dataCkeditor = editor.getData();
                                setDescription(dataCkeditor)
                                console.log( { event, editor, dataCkeditor } );
                            } }
                            onBlur={ ( event, editor ) => {
                                console.log( 'Blur.', editor );
                            } }
                            onFocus={ ( event, editor ) => {
                                console.log( 'Focus.', editor );
                            } }
                        />
                      </Form.Group> 
                    </Col>
                  </Row>
                  <Row>
                    <Col md={{ span: 7, offset: 2 }}>
                      <Form.Group>
                        <label>Price <span>*</span></label>
                        <Form.Control
                          defaultValue=""
                          placeholder="price"
                          name = 'price'
                          type="number"
                          onChange={(e) => onChangePriceHandler(e) }
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={{ span: 7, offset: 2 }}>
                      <Form.Group>
                        <label>Category <span>*</span></label>
                        <Select options={selectOptions} onChange={(event)=>onChangeSelectHandler(event)}/>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={{ span: 10, offset: 2 }}>
                      <div>
                        {previewImg && <img src={previewImg} alt="" />}
                      </div>
                      <input type="file" name="file" encType="multipart/form-data" onChange={(event) => onChangeHandler(event)}/>
                    </Col>
                    <Col md={{ span: 3, offset: 2 }}>  
                        <label>Status</label>
                        <Switch
                            isOn={status}
                            handleToggle={() =>{setStatus(!status)}}
                        />             
                    </Col>
                  </Row>
                  <Row>
                      <Col md={{ span: 3, offset: 2 }}>
                          <Button variant="outline-danger" >
                          <Link to="/admin/productlist">Close</Link> 
                          </Button>
                      </Col>
                      <Col md={{ span: 3, offset: 2 }}>        
                        <Button variant="outline-success" onClick={(e) => onClickHandler(e)}>
                            Save
                        </Button>
                      </Col>
                  </Row>
                  <div className="clearfix"></div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
            {/*()*/}
        </Row>
      </Container>
    </>
  );
}

export default AddProduct;

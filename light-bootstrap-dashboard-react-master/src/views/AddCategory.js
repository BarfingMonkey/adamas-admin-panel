import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Switch from "../components/Switch/Switch";
import axios from 'axios';
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


function AddCategory() {
    let [status, setStatus] = useState(true);
    let [previewImg, setPreviewImg]= useState(null);
    let [sendFile,setSendFile] = useState(null);
    let [name, setName]= useState("")
    let [description,setDescription] = useState('')
    

    let history= useHistory();
    const onChangeHandler = event => {
      setSendFile(event.target.files[0])
      setPreviewImg(URL.createObjectURL(event.target.files[0]))
    }
    const onChangeNameHandler = event => {
      setName(name = event.target.value)
      
    }
    const onClickHandler = (e) => {     
        e.preventDefault()
        const formdata= new FormData();
        formdata.append('name', name);
        formdata.append('description', description);
        formdata.append('img', sendFile)
        formdata.append('status', status)
        console.log(status)
        console.log(sendFile)
        axios({
          method: 'post',
          url: 'http://localhost:8000/api/admin/addcategory',
          data: formdata
        })      
        .then(res => { // then print response status
         console.log(res.statusText)
        })
        .catch(err => console.log("Try to tell the error name "+err) )
    
    history.push('/admin/categorylist')
    }
  return (
    <>
      <Container fluid>
        <Row>
          <Col md="8">
            <Card>
              <Card.Header>
                <Card.Title as="h4" className="text-center">Add Category</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form >
                  <Row>
                    <Col  md={{ span: 7, offset: 2 }} >
                      <Form.Group>
                        <label>Name <span>*</span></label>
                        <Form.Control
                          defaultValue=""
                          placeholder="Category Title"
                          name = 'Name'
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
                            <Link to="/admin/categorylist">Close</Link> 
                          </Button>{' '}
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

export default AddCategory;

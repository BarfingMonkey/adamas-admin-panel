import React, { useState, useEffect } from "react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Switch from "../components/Switch/Switch";
import axios from 'axios';
import { useParams, useHistory, Link } from "react-router-dom";
import Select from 'react-select'
// react-bootstrap components
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";


function UpdateProduct(props) {
    const [status, setStatus] = useState(true);
    let [sendFile,setSendFile] = useState(null);
    let [name, setName]= useState("");
    let [previewImg, setPreviewImg]= useState(null);
    let [desc,setDescription] = useState(null);
    let [price,setPrice] = useState("")
    let [selectOptions,setOptions]= useState([])
    let [catName, setCatname] = useState('')
    let [catId, setCatid]= useState('')
    let history=useHistory();
    let {id}= useParams();
    

    useEffect(() => {
      getObject();
      getOptions();
    },[]);
    
    useEffect(()=>{
      console.log(status)
    },[status])

    const onChangeHandler = event => {
      setSendFile(event.target.files[0])
      setPreviewImg(URL.createObjectURL(event.target.files[0]))
    }
    const onChangeNameHandler = event => {
      setName(name = event.target.value)
    }
    const onChangePriceHandler = event => {
      setPrice(event.target.value)
    }
    const onChangeSelectHandler = event =>{
      setCatname(catName=event.label)
      setCatid(catId=event.value)
    }
    const getObject =()=>{
      axios.get(`http://localhost:8000/api/admin/updateproduct/${id}`)
        .then(res => {
          if(res.data){
            console.log(res.data)
            setName(res.data.name)
            setDescription(res.data.description)
            setStatus(res.data.status)
            setSendFile(res.data.img)
            setPrice(res.data.price)
            setCatname(res.data.catName)
            setCatid(res.data.catId)
          }
        })
        .catch(err => console.log(err))
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
    const onClickHandler = (e) => {     
        e.preventDefault()
        const form= new FormData();
        form.append('_id', id)
        form.append('name', name);
        form.append('description', desc);
        form.append('img', sendFile);
        form.append('status', status);
        form.append('price', price);
        form.append('catName', catName);
        form.append('catId', catId);
        console.log(form)
        axios({
          method: 'put',
          url: `http://localhost:8000/api/admin/updateproduct/${id}`,
          data: form
        })      
        .then(res => { // then print response status
         console.log(res.statusText)
        })
        .catch(err => console.log("Try to tell the error name "+err) )
      history.push('/admin/productlist');
    }
  return (
    <>
      <Container fluid>
        <Row>
          <Col md="8">
            <Card>
              <Card.Header>
                <Card.Title as="h4" className="text-center">Update Category</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form >
                  <Row>
                    <Col  md={{ span: 7, offset: 2 }} >
                      <Form.Group>
                        <label>Name <span>*</span></label>
                        <Form.Control
                          defaultValue={name}
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
                            data={desc}
                            onReady={ editor => {
                                // You can store the "editor" and use when it is needed.
                                console.log( 'Editor is ready to use!', editor );
                            } }
                            onChange={ ( event, editor ) => {
                                const dataCkeditor = editor.getData();
                                setDescription( dataCkeditor)
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
                          defaultValue={price}
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
                        <Select options={selectOptions} onChange={(event)=>onChangeSelectHandler(event) } value={{"label": catName, "value": catId}}/>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={{ span: 10, offset: 2 }}>
                      <div>
                        {previewImg ? <img src={previewImg} style={{width:"96px"}}/> : sendFile && <img  src={`http://localhost:8000/${sendFile}`} alt="img-name" style={{width:"96px"}}/>}
                      </div>
                      <input type="file" name="file" id="img" encType="multipart/form-data" onChange={(event) => onChangeHandler(event)}/>
                    </Col>
                    <Col md={{ span: 3, offset: 2 }}>  
                        <label>Status</label>
                        <Switch
                            isOn={status}
                            handleToggle={() => {
                              setStatus(!status)
                              console.log(status)
                            }}
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
        </Row>
      </Container>
    </>
  );
}

export default UpdateProduct;
